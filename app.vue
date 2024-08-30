<script setup>
import { data } from "@/assets/data.ts";
const cookies = {
  theme: useCookie("theme").value,
};
const theme = cookies["theme"] == null ? "sunset" : cookies["theme"];
</script>
<template>
  <main :data-theme="theme">
    <NuxtLoadingIndicator
      :color="data['themes'][theme].primary"
      :errorcolor="data['themes'][theme].error"
      :duration="5000"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.5, 1);
  pointer-events: none;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
