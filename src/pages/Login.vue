<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const login = () => {
  authStore.login(email.value, password.value);
};
</script>

<template>
<h1>mohamed</h1>
</template>
