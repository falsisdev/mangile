<script setup lang="ts">
interface RecommendationItem {
  id: number;
  title: string;
  cover: string;
  type: string;
}

const props = withDefaults(
  defineProps<{
    items: RecommendationItem[];
  }>(),
  {
    items: () => [],
  },
);

const isSidebarOpen = useSidebar();

const swiperBreakpoints = computed(() => {
  const baseBreakpoints = {
    250: { slidesPerView: 1, spaceBetween: 20 },
    320: { slidesPerView: 1, spaceBetween: 20 },
    420: { slidesPerView: 2, spaceBetween: 20 },
    520: { slidesPerView: 2, spaceBetween: 20 },
    640: { slidesPerView: 3, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 30 },
  };

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 5, spaceBetween: 30 },
      1280: { slidesPerView: 6, spaceBetween: 30 },
      1700: { slidesPerView: 6, spaceBetween: 30 },
    };
  }

  return {
    ...baseBreakpoints,
    1024: { slidesPerView: 5, spaceBetween: 30 },
    1280: { slidesPerView: 6, spaceBetween: 30 },
    1700: { slidesPerView: 6, spaceBetween: 30 },
  };
});
</script>

<template>
  <swiper-container
    :key="String(isSidebarOpen)"
    :loop="false"
    :slides-per-view="8"
    :breakpoints="swiperBreakpoints"
    :mousewheel="true"
    :free-mode="true"
  >
    <swiper-slide v-for="item in items" :key="item.id">
      <NuxtLink
        :to="`/title/${item.id}`"
        class="relative group w-48 max-h-84 min-h-72 h-full rounded-xl overflow-hidden bg-zinc-900 cursor-pointer block shadow-[0px_0px_10px_0px_var(--color-neutral-900)]"
      >
        <img
          :src="item.cover"
          :alt="item.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div
          class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent"
        />

        <div class="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3">
          <h3
            class="text-white font-semibold text-base line-clamp-2 leading-snug tracking-wide"
          >
            {{ item.title }}
          </h3>
          <div class="self-start">
            <UBadge color="neutral" variant="soft">
              {{ item.type }}
            </UBadge>
          </div>
        </div>
      </NuxtLink>
    </swiper-slide>
  </swiper-container>
</template>
