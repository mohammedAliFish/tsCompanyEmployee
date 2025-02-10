<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../store/auth";


const name = ref("");
const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const register = () => {
  authStore.register(name.value, email.value, password.value);
};
</script>

<template>
  <v-container>
    <v-card class="pa-5 mx-auto" max-width="400">
      <v-card-title>إنشاء حساب جديد</v-card-title>
      <v-card-text>
        <v-text-field label="الاسم" v-model="name"></v-text-field>
        <v-text-field label="البريد الإلكتروني" v-model="email"></v-text-field>
        <v-text-field label="كلمة المرور" v-model="password" type="password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" block @click="register">تسجيل</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
</script>
