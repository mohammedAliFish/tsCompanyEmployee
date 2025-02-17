<template>
  <v-toolbar>
    <v-btn @click="logout">{{ t('logout') }}</v-btn>

    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>

    <v-btn @click="toggleLanguage">
      {{ currentLanguage === 'ar' ? 'العربية' : 'English' }}
    </v-btn>

    <v-spacer />

    <v-toolbar-items>
      <v-btn
        v-for="(item, index) in navItems"
        :key="index"
        @click="navigateTo(item.path)"
      >
        {{ t(item.label) }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

const navItems = [
  { path: '/employees', label: 'employees' },
  { path: '/companies', label: 'companies' },
  { path: '/home', label: 'home' },
];

const navigateTo = (path: string) => router.push(path);

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'myCustomDarkTheme');

function toggleTheme() {
  const newTheme = isDark.value ? 'myCustomLightTheme' : 'myCustomDarkTheme';
  theme.global.name.value = newTheme;
  localStorage.setItem('theme', newTheme);
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});

const currentLanguage = ref(locale.value);

function toggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'ar' ? 'en' : 'ar';
  locale.value = currentLanguage.value;
}

function logout() {
  localStorage.removeItem('token');
  router.push('/');
}
</script>

<style>
* {
  font-family: 'Tajawal', sans-serif;
}
</style>
