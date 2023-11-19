<script setup>
import SettingsPage from "../components/SettingsPage.vue";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
</script>
<template>
  <main v-if="cookies.get('isLogged')">
    <SettingsPage />
  </main>
</template>
