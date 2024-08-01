<script setup>
import { RouterLink } from "vue-router";
//////////////////////////////////////////////////////////
import tags from "../assets/data/tags.json";
//////////////////////////////////////////////////////////
const props = defineProps({
  tags: String,
});
//////////////////////////////////////////////////////////
</script>

<template>
  <div class="flex flex-row flex-wrap">
    <span v-if="props.ismanual">
      <span
        v-for="item of JSON.parse(props.tags)"
        :key="item"
        :data-tip="item.tr"
        class="tooltip tooltip-accent"
      >
        <RouterLink
          :to="'/tags/' + item.id"
          class="badge badge-neutral m-1 no-underline"
          >{{ item.tr }}</RouterLink
        >
      </span>
    </span>
    <span v-else>
      <span
        v-for="item of JSON.parse(props.tags)"
        :key="item"
        :data-tip="`${
          tags[item.id] ? tags[item.id].tr : item.attributes.name.en
        }`"
        class="tooltip tooltip-accent"
      >
        <RouterLink
          :to="'/tags/' + item.id"
          class="badge badge-neutral m-1 no-underline"
          >{{
            tags[item.id] ? tags[`${item.id}`].tr : item.attributes.name.en
          }}</RouterLink
        >
      </span>
    </span>
  </div>
</template>
