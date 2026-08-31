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
    250: { slidesPerView: 1, spaceBetween: 20 },
    320: { slidesPerView: 1, spaceBetween: 20 },
    420: { slidesPerView: 2, spaceBetween: 20 },
    520: { slidesPerView: 2, spaceBetween: 20 },
    640: { slidesPerView: 3, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 30 }
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 5, spaceBetween: 30 },
      1280: { slidesPerView: 6, spaceBetween: 30 },
      1700: { slidesPerView: 6, spaceBetween: 30 }
    }
  }

  return {
    ...baseBreakpoints,
    1024: { slidesPerView: 5, spaceBetween: 30 },
    1280: { slidesPerView: 6, spaceBetween: 30 },
    1700: { slidesPerView: 6, spaceBetween: 30 }
  }
})
</script>

<template>
  <swiper-container
    :key="String(isSidebarOpen)"
    :loop="false"
    :slides-per-view="8"
    :breakpoints="swiperBreakpoints"
    :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
    :mousewheel-force-to-axis="true"
    :mousewheel-release-on-edges="true"
    :free-mode="true"
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
