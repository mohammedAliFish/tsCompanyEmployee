import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";


interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}


export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const router = useRouter();


  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }


  async function login(email: string, password: string) {
    try {
      const response = await axios.post("https://localhost:7001/api/authentication/login", {
        email,
        password,
      });

      token.value = response.data.token;
      user.value = response.data.user;

      localStorage.setItem("token", token.value);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

      router.push("/");
    } catch (error) {
      console.error("خطأ في تسجيل الدخول", error);
    }
  }


  async function register(name: string, email: string, password: string) {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });


      router.push("/login");
    } catch (error) {
      console.error("خطأ في تسجيل الحساب", error);
    }
  }


  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login"); 
  }


  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me");
      user.value = response.data;
    } catch (error) {
      console.error("خطأ في جلب بيانات المستخدم", error);
      logout();
    }
  }

  return { user, token, login, register, logout, fetchUser };
});
