<script setup>
import { Icon } from '@iconify/vue';

const { isMobile, isTablet } = useDevice();
let layout = ref("default");
if (isMobile) {
  layout.value = "mobile";
} else if (isTablet) {
  layout.value = "tablet";
} else {
  layout.value = "default";
}

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | Mangile`
      : "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.";
  },
});

const isLoading = ref(true);

const nuxtApp = useNuxtApp();

nuxtApp.hook('page:start', () => {
  isLoading.value = true;
});

nuxtApp.hook('page:finish', () => {
  isLoading.value = false;
});

nuxtApp.hook('app:error', () => {
  isLoading.value = false;
});
</script>

<template>
  <main style="overflow-y: auto">
    <NuxtLoadingIndicator color="#1d293d" errorcolor="#7f1d1d" :duration="5000" />

    <div v-if="isLoading" class="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
      <Loading type="app" />
    </div>

    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>