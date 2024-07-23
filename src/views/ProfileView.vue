<script setup>
import ProfilePage from "../components/Profile/ProfilePage.vue";
import ProfileEdit from "../components/Profile/ProfileEdit.vue";
import Library from "../components/Profile/Library.vue";

import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <main v-if="route.params.action == 'view'">
    <ProfilePage />
  </main>
  <main v-else-if="route.params.action == 'edit'">
    <ProfileEdit />
  </main>
  <main v-else-if="route.params.action == 'library'">
    <Library />
  </main>
</template>
