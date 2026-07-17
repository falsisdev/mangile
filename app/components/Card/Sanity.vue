<script setup lang="ts">
interface Title {
  title: string,
  cover: string,
  id: number,
  dateStamp: string,
}

const props = withDefaults(
  defineProps<{
    items: Title[],
    variant: string,
  }>(),
  {
    items: () => []
  }
)

const isSidebarOpen = useSidebar()

const swiperBreakpoints = computed(() => {
  const baseBreakpoints = {
    '250': { slidesPerView: 1, spaceBetween: 20 },
    '320': { slidesPerView: 1.5, spaceBetween: 20 },
    '420': { slidesPerView: 2, spaceBetween: 20 },
    '520': { slidesPerView: 2.5, spaceBetween: 20 },
    '640': { slidesPerView: 3, spaceBetween: 20 },
    '768': { slidesPerView: 3.75, spaceBetween: 30 },
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      '1024': { slidesPerView: 3.75, spaceBetween: 30 },
      '1280': { slidesPerView: 5, spaceBetween: 30 },
      '1700': { slidesPerView: 7, spaceBetween: 30 },
    }
  } else {
    return {
      ...baseBreakpoints,
      '1024': { slidesPerView: 4.75, spaceBetween: 30 },
      '1280': { slidesPerView: 6, spaceBetween: 30 },
      '1700': { slidesPerView: 8, spaceBetween: 30 },
    }
  }
})

const timeAgo = (dateString: string) => {
  if (!dateString) return "bilinmiyor";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((Number(now) - Number(date)) / 1000);

  const intervals = {
    yıl: 31536000,
    ay: 2592000,
    hafta: 604800,
    gün: 86400,
    saat: 3600,
    dakika: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit} önce`;
    }
  }
  return "az önce";
}
</script>

<template>
  <swiper-container :key="String(isSidebarOpen)" :loop="false" :slides-per-view="8" :breakpoints="swiperBreakpoints">
    <swiper-slide v-for="item of items" :key="item.id">
      <div
        class="relative group w-48 max-h-84 min-h-72 h-full rounded-xl overflow-hidden shadow-lg bg-zinc-900 cursor-pointer">
        <NuxtLink :to="`/title/${item.id}`">
          <img :src="item.cover" alt="Manga Cover"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent" />

          <div class="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3">
            <h3 class="text-white font-semibold text-base line-clamp-2 leading-snug tracking-wide">
              {{ item.title }}
            </h3>

            <div class="self-start">
              <UBadge color="neutral" variant="soft">
                {{ timeAgo(item.dateStamp) }}
              </UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>
    </swiper-slide>
  </swiper-container>
</template>