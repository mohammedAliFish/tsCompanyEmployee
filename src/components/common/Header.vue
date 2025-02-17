<template>
  <v-toolbar>

    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>

    <v-spacer />


    <v-toolbar-items>
      <v-btn v-for="(item, index) in navItems" :key="index" @click="navigateTo(item.path)">
        {{ item.label }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { computed } from 'vue';


const router = useRouter();
const navItems = [
  { path: '/employees', label: 'الموظفين' },
  { path: '/companies', label: 'الشركات' },
  { path: '/home', label: 'الصفحة الرئيسية' },
];
const navigateTo = (path: string) => router.push(path);


const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'myCustomDarkTheme');

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'myCustomLightTheme' : 'myCustomDarkTheme';
}
</script>

<style>
* {
  font-family: 'Tajawal', sans-serif !important;
}
</style>
