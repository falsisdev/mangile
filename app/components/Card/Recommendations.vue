<script setup lang="ts">
interface RecommendationItem {
  id: number
  title: string
  cover: string
  type: string
}

withDefaults(
  defineProps<{
    items?: RecommendationItem[]
  }>(),
  {
    items: () => []
  }
)

const isSidebarOpen = useSidebar()

const swiperBreakpoints = computed(() => {
  const baseBreakpoints = {
    0: { slidesPerView: 2.6, spaceBetween: 10 },
    360: { slidesPerView: 2.8, spaceBetween: 10 },
    420: { slidesPerView: 3.2, spaceBetween: 12 },
    520: { slidesPerView: 3.8, spaceBetween: 12 },
    640: { slidesPerView: 4.4, spaceBetween: 14 },
    768: { slidesPerView: 5.2, spaceBetween: 16 }
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 5.2, spaceBetween: 16 },
      1280: { slidesPerView: 6.2, spaceBetween: 18 },
      1536: { slidesPerView: 7.2, spaceBetween: 20 },
      1920: { slidesPerView: 8.5, spaceBetween: 20 }
    }
  }

  return {
    ...baseBreakpoints,
    1024: { slidesPerView: 6.2, spaceBetween: 16 },
    1280: { slidesPerView: 7.2, spaceBetween: 18 },
    1536: { slidesPerView: 8.5, spaceBetween: 20 },
    1920: { slidesPerView: 10, spaceBetween: 20 }
  }
})
</script>

<template>
  <swiper-container
    :key="String(isSidebarOpen)"
    :loop="false"
    :slides-per-view="2.6"
    :space-between="10"
    :breakpoints="swiperBreakpoints"
    :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
    :mousewheel-force-to-axis="true"
    :mousewheel-release-on-edges="true"
    :free-mode="true"
    :grab-cursor="true"
  >
    <swiper-slide
      v-for="item in items"
      :key="item.id"
    >
      <CardCover
        :to="`/title/${item.id}`"
        :cover="item.cover"
        :title="item.title"
        :badge="item.type"
      />
    </swiper-slide>
  </swiper-container>
</template>
