<script setup>
import { data } from "@/assets/data.ts";
const props = defineProps({
  error: Object,
});
const statusMessage = data["statusMessages"][props.error.statusCode];
</script>
<template>
  <div class="diff aspect-[16/9]">
    <div class="diff-item-1">
      <div
        class="bg-primary text-primary-content font-black flex-col grid place-content-center"
      >
        <span class="grid place-content-center text-9xl">{{
          error.statusCode
        }}</span>
        <span class="grid place-content-center text-2xl">
          {{ statusMessage }}
        </span>
      </div>
    </div>
    <div class="diff-item-2">
      <div class="bg-base-100 font-black flex-col grid place-content-center">
        <span class="grid place-content-center text-9xl">{{
          error.statusCode
        }}</span>
        <span class="grid place-content-center text-2xl">
          {{ statusMessage }}
        </span>
      </div>
    </div>
    <div class="diff-resizer"></div>
  </div>
</template>
