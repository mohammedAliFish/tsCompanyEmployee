<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="/account-svgrepo-com.svg"
      alt="User Icon"
    ></v-img>

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="username"
        density="compact"
        placeholder="Username"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
        <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer">
          Forgot login password?
        </a>
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-alert v-if="errorMessage" type="error" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
        Log In
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const visible = ref(false);
const errorMessage = ref("");

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  try {
    await authStore.login(username.value, password.value);
    router.push("/"); 
  } catch (error) {
    errorMessage.value = "Invalid username or password";
    console.error("Login error:", error);
  }
};
</script>
