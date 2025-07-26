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

const infos = [
  "Mangile geliştirilmeye 2022'nin üçüncü çeyreğinde başlanmıştır.",
  "Mangile geliştirilmeye başlandığında tek geliştirici Falsis henüz 15 yaşında bir 9. sınıf öğrencisiydi.",
  "Mangile'ın adı Manga ve İngilizce timsah anlamına gelen crocodile'ın birleşmesiyle oluşmuştur.",
  "Mangile'ın geliştirilmesine ilham veren web sitesi MangaDex'tir.",
  "Falsis, Mangile'ı geliştirmeden önce Ani+ adında bir anime sitesi denemesi yapıp vazgeçmişti.",
  "Mangile geliştirilmeye başlandığında, Nuxt 3. sürümü henüz erken erişimde bile değildi.",
  "Mangile geliştirilmeye başlandığında 2022 Dünya Kupası başlamamıştı.",
  "Mangile geliştirilmeye başlandığında 1 Dolar 18 Liraydı.",
  "Mangile'ın planlanan stabil sürüm yayınlanma tarihi, geliştirilmeye başlandığı tarihten daha uzak.",
  "Mangile geliştirilmeye başlandığında 2023 genel seçimlerine 8.5 ay vardı.",
  "Mangile geliştirme sürecinde 4 kere büyük yazılım değişikliğine gitmiştir.",
  "Mangile geliştirilmeye başlandığında Galatasaray'ın 22 şampiyonluğu vardı.",
  "Mangile geliştirilmeye başlandığında Attack On Titan animesi henüz final vermemişti.",
  "Mangile geliştirilmeye başlandığında Chainsaw Man animesi yayınlanmaya yeni başlamıştı."
]
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
      <div class="flex flex-col items-center p-6">
        <Icon icon="mingcute:loading-line" class="animate-spin text-6xl text-primary" />
        <p class="mt-4 text-lg text-primary font-semibold">Bunu Biliyor Muydunuz?</p>
        <p class="text-md text-primary"> {{ infos[Math.floor(Math.random() * infos.length)] }}</p>
      </div>
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