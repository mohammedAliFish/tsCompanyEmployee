import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const router = useRouter();


  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  async function login(userName: string, password: string) {
    try {
      const response = await axios.post("https://localhost:7001/api/authentication/login", {
        userName,
        password,
      });

      const token = response.data.accessToken;

      setToken(token);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }


  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }

  function logout() {
    token.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  }

  return { token, login, logout };
});
 