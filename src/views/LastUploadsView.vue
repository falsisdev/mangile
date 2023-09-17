<script setup>
import Episodes from "../components/Last/Episode.vue";
import Serie from "../components/Last/Serie.vue";

import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <main v-if="route.params.type == 'episodes'">
    <Episodes />
  </main>
  <main v-else-if="route.params.type == 'manga'">
    <Serie />
  </main>
</template>
