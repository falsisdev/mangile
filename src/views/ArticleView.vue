<script setup>
import About from "../components/Article/About.vue";
import UI from "../components/Article/UI.vue";
import Contact from "../components/Article/Contact.vue";
import Rules from "../components/Article/Rules.vue";
import Genres from "../components/Article/Genres.vue";
import Privacy from "../components/Article/Privacy.vue";

import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <main v-if="route.params.type == 'about'">
    <About />
  </main>
  <main v-else-if="route.params.type == 'ui'">
    <UI />
  </main>
  <main v-else-if="route.params.type == 'contact'">
    <Contact />
  </main>
  <main v-else-if="route.params.type == 'rules'">
    <Rules />
  </main>
  <main v-else-if="route.params.type == 'genres'">
    <Genres />
  </main>
  <main v-else-if="route.params.type == 'privacy'">
    <Privacy />
  </main>
</template>
