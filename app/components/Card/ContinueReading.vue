<script setup lang="ts">
import type { ReadingHistoryItem } from '~/composables/useReadingHistory'
import { formatTimeAgo } from '~/utils/time'

withDefaults(
  defineProps<{
    items?: ReadingHistoryItem[]
  }>(),
  {
    items: () => []
  }
)

const isSidebarOpen = useSidebar()

const continueBreakpoints = computed(() => {
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

function getResumeLink(item: ReadingHistoryItem): string {
  const routeType = item.seriesType === 'lightNovel' ? 'novel' : 'manga'
  const url = `/chapter/${item.chapterId}/${routeType}`
  const params = new URLSearchParams()
  if (item.currentPage && item.currentPage > 1) {
    params.set('page', String(item.currentPage))
  } else if (item.progress && item.progress > 0) {
    params.set('progress', String(Math.round(item.progress)))
  }
  const queryStr = params.toString()
  return queryStr ? `${url}?${queryStr}` : url
}

function formatBadgeLabel(item: ReadingHistoryItem): string {
  if (item.seriesFormat) {
    if (item.seriesFormat.toLowerCase() === 'manhwa') return 'Manhwa'
    if (item.seriesFormat.toLowerCase() === 'webtoon') return 'Webtoon'
    if (item.seriesFormat.toLowerCase() === 'light_novel') return 'Roman'
  }
  return item.seriesType === 'lightNovel' ? 'Roman' : 'Manga'
}
</script>

<template>
  <swiper-container
    :key="`continue-${String(isSidebarOpen)}`"
    :loop="false"
    :slides-per-view="1.15"
    :space-between="10"
    :breakpoints="continueBreakpoints"
    :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
    :mousewheel-force-to-axis="true"
    :mousewheel-release-on-edges="true"
    :free-mode="true"
    :grab-cursor="true"
  >
    <swiper-slide
      v-for="item in items"
      :key="item.seriesId"
    >
      <NuxtLink
        :to="getResumeLink(item)"
        class="group relative flex items-stretch gap-2.5 sm:gap-3 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-default bg-elevated/50 p-2 sm:p-2.5 cursor-pointer select-none touch-manipulation transition-all duration-300 hover:border-primary/50 hover:bg-elevated hover:shadow-md active:scale-[0.98]"
      >
        <!-- Thumbnail -->
        <div class="relative w-16 sm:w-20 shrink-0 aspect-2/3 overflow-hidden rounded-lg sm:rounded-xl border border-default/60 bg-muted">
          <img
            v-if="item.coverUrl"
            :src="item.coverUrl"
            :alt="item.seriesTitle"
            loading="lazy"
            decoding="async"
            class="size-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div
            v-else
            class="size-full flex items-center justify-center text-muted"
          >
            <UIcon
              name="i-lucide-image"
              class="size-5"
            />
          </div>
          <span class="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-bold bg-black/75 text-white backdrop-blur-xs">
            {{ formatBadgeLabel(item) }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div class="space-y-0.5 sm:space-y-1">
            <div class="flex items-center justify-between gap-1 text-[10px] text-muted">
              <span class="flex items-center gap-1 font-semibold text-primary truncate">
                <UIcon
                  name="i-lucide-bookmark"
                  class="size-3 shrink-0"
                />
                Bölüm {{ item.chapterNumber }}
              </span>
              <span class="shrink-0 flex items-center gap-0.5">
                <UIcon
                  name="i-lucide-clock"
                  class="size-2.5"
                />
                {{ formatTimeAgo(item.readAt) }}
              </span>
            </div>

            <h3 class="text-xs sm:text-sm font-bold leading-tight text-highlighted line-clamp-1 group-hover:text-primary transition-colors">
              {{ item.seriesTitle }}
            </h3>

            <p
              v-if="item.chapterTitle"
              class="text-[10px] text-muted line-clamp-1"
            >
              {{ item.chapterTitle }}
            </p>
          </div>

          <!-- Progress Bar & Continue Reading -->
          <div class="mt-2 space-y-1">
            <div class="flex items-center justify-between text-[10px] text-muted font-medium">
              <span>
                {{
                  item.currentPage && item.totalPages
                    ? `Sayfa ${item.currentPage}/${item.totalPages}`
                    : item.progress !== undefined
                      ? `%${Math.round(item.progress)}`
                      : 'Kaydedildi'
                }}
              </span>
              <span class="text-primary font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                Devam Et
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-3"
                />
              </span>
            </div>
            <div class="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
              <div
                class="bg-primary h-full rounded-full transition-all duration-300"
                :style="{
                  width: `${
                    item.totalPages && item.currentPage
                      ? Math.min(100, Math.round((item.currentPage / item.totalPages) * 100))
                      : item.progress !== undefined
                        ? Math.min(100, Math.round(item.progress))
                        : 100
                  }%`
                }"
              />
            </div>
          </div>
        </div>
      </NuxtLink>
    </swiper-slide>
  </swiper-container>
</template>
