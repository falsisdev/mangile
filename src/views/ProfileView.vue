<script setup>
import ProfilePage from "../components/Profile/ProfilePage.vue";

import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <main v-if="route.params.action == 'view'">
    <ProfilePage />
  </main>
</template>
