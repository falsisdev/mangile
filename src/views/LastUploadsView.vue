<script setup>
import Chapters from "../components/Last/Chapter.vue";
import Serie from "../components/Last/Serie.vue";

import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <main v-if="route.params.type == 'chapters'">
    <Chapters />
  </main>
  <main v-else-if="route.params.type == 'manga'">
    <Serie />
  </main>
</template>
