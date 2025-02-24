<script setup>
import { data } from "@/assets/data.ts";
import { useRouter } from 'vue-router';
const props = defineProps({
  error: Object,
});
const statusMessage = data["statusMessages"][props.error.statusCode];
const router = useRouter();
setTimeout(() => {
  router.push('/').then(() => {
    window.location.reload();
  });
}, 3000);
</script>
<template>
  <div class="diff aspect-[2/1]">
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
