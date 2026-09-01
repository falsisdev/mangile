<script setup lang="ts">
interface SanityCardItem {
  title: string
  cover?: string
  id: number | string
  dateStamp?: string
  type?: 'title' | 'chapter' | 'tagTitle'
  titleType?: string
}

const props = withDefaults(
  defineProps<{
    items?: SanityCardItem[]
    variant?: 'title' | 'chapter'
  }>(),
  {
    items: () => [],
    variant: 'title'
  }
)

const isSidebarOpen = useSidebar()

const coverBreakpoints = computed(() => {
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
  } else {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 6.2, spaceBetween: 16 },
      1280: { slidesPerView: 7.2, spaceBetween: 18 },
      1536: { slidesPerView: 8.5, spaceBetween: 20 },
      1920: { slidesPerView: 10, spaceBetween: 20 }
    }
  }
})

const chapterBreakpoints = computed(() => {
  const baseBreakpoints = {
    0: { slidesPerView: 1.15, spaceBetween: 10 },
    360: { slidesPerView: 1.25, spaceBetween: 10 },
    420: { slidesPerView: 1.4, spaceBetween: 12 },
    520: { slidesPerView: 1.7, spaceBetween: 12 },
    640: { slidesPerView: 2.2, spaceBetween: 14 },
    768: { slidesPerView: 2.6, spaceBetween: 16 }
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 2.8, spaceBetween: 16 },
      1280: { slidesPerView: 3.5, spaceBetween: 16 },
      1536: { slidesPerView: 4.5, spaceBetween: 18 },
      1920: { slidesPerView: 5.2, spaceBetween: 18 }
    }
  } else {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 3.4, spaceBetween: 16 },
      1280: { slidesPerView: 4.2, spaceBetween: 16 },
      1536: { slidesPerView: 5.2, spaceBetween: 18 },
      1920: { slidesPerView: 6, spaceBetween: 18 }
    }
  }
})

const swiperBreakpoints = computed(() =>
  props.variant === 'chapter' ? chapterBreakpoints.value : coverBreakpoints.value
)
</script>

<template>
  <swiper-container
    :key="`${variant}-${String(isSidebarOpen)}`"
    :loop="false"
    :slides-per-view="variant === 'chapter' ? 1.15 : 2.6"
    :space-between="10"
    :breakpoints="swiperBreakpoints"
    :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
    :mousewheel-force-to-axis="true"
    :mousewheel-release-on-edges="true"
    :free-mode="true"
    :grab-cursor="true"
  >
    <swiper-slide
      v-for="item of items"
      :key="item.id"
    >
      <CardChapter
        v-if="variant === 'chapter'"
        :to="`/chapter/${item.id}/${item.titleType ?? 'manga'}`"
        :cover="item.cover"
        :title="item.title"
        :date-stamp="item.dateStamp"
        :kind="item.titleType"
      />
      <CardCover
        v-else
        :to="`/title/${item.id}`"
        :cover="item.cover"
        :title="item.title"
        :badge="item.type == 'title' ? formatTimeAgo(item.dateStamp) : ''"
        badge-icon="i-lucide-clock"
        accent-badge
      />
    </swiper-slide>
  </swiper-container>
</template>
