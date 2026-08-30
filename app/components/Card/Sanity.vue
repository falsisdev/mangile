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
    250: { slidesPerView: 1, spaceBetween: 20 },
    320: { slidesPerView: 1.5, spaceBetween: 20 },
    420: { slidesPerView: 2, spaceBetween: 20 },
    520: { slidesPerView: 2.5, spaceBetween: 20 },
    640: { slidesPerView: 3, spaceBetween: 20 },
    768: { slidesPerView: 3.75, spaceBetween: 30 }
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 3.75, spaceBetween: 30 },
      1280: { slidesPerView: 5, spaceBetween: 30 },
      1700: { slidesPerView: 7, spaceBetween: 30 }
    }
  } else {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 4.75, spaceBetween: 30 },
      1280: { slidesPerView: 6, spaceBetween: 30 },
      1700: { slidesPerView: 8, spaceBetween: 30 }
    }
  }
})

const chapterBreakpoints = computed(() => {
  const baseBreakpoints = {
    250: { slidesPerView: 1.05, spaceBetween: 12 },
    320: { slidesPerView: 1.15, spaceBetween: 12 },
    420: { slidesPerView: 1.4, spaceBetween: 12 },
    520: { slidesPerView: 1.75, spaceBetween: 14 },
    640: { slidesPerView: 2.1, spaceBetween: 14 },
    768: { slidesPerView: 2.6, spaceBetween: 16 }
  }

  if (isSidebarOpen.value) {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 3.2, spaceBetween: 16 },
      1280: { slidesPerView: 4, spaceBetween: 16 },
      1700: { slidesPerView: 5, spaceBetween: 16 }
    }
  } else {
    return {
      ...baseBreakpoints,
      1024: { slidesPerView: 3.75, spaceBetween: 16 },
      1280: { slidesPerView: 4.5, spaceBetween: 16 },
      1700: { slidesPerView: 5.5, spaceBetween: 16 }
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
    :slides-per-view="variant === 'chapter' ? 1.05 : 8"
    :breakpoints="swiperBreakpoints"
    :mousewheel="true"
    :free-mode="true"
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
