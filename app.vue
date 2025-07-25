<script setup>
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
</script>
<template>
  <main style="overflow-y: auto">
    <NuxtLoadingIndicator color="#1e293b" errorcolor="#7f1d1d" :duration="5000" />
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