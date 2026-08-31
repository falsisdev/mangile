<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { isWebtoonFormat } from '~/utils/mediaType'

const route = useRoute()
const config = useRuntimeConfig()
useColorMode()
const chapterKey = computed(() => route.params.chapterKey as string)

interface ChapterResponse {
  _id: string
  _type?: string
  title?: string
  chapterNumber?: number
  volumeNumber?: number
  pages?: {
    url: string
  }[]
  source?: {
    name?: string
    logo?: { url?: string }
  }
  manga?: {
    _id?: string
    _type?: string
    myAnimeListId?: number
    title?: string
    tags?: string[]
    format?: string
  }
  chapters?: {
    _id: string
    title?: string
    chapterNumber?: number
    volumeNumber?: number
    source?: {
      name?: string
      logo?: { url?: string }
    }
  }[]
}

const {
  data: chapterData,
  pending
} = await useFetch<ChapterResponse>(
  () =>
    `${config.public.backend.baseUrl}/api/chapter?id=${chapterKey.value}`,
  {
    lazy: true,
    server: false,
    watch: [chapterKey],
    retry: 3,
    retryDelay: 1000
  }
)

interface Page {
  url: string
}

const images = computed<Page[]>(() => chapterData.value?.pages ?? [])

type ReadingMode = 'paged' | 'webtoon' | 'continuous'
type ReadingDirection = 'rtl' | 'ltr'

const settings = reactive({
  readingMode: useStorage<ReadingMode>(
    'manga-reading-mode',
    'paged' as ReadingMode
  ),
  readingDirection: useStorage<ReadingDirection>(
    'manga-reading-direction',
    'rtl' as ReadingDirection
  ),
  autoScroll: useStorage('manga-auto-scroll', false),
  scrollSpeed: useStorage('manga-scroll-speed', 3),
  brightness: useStorage('manga-brightness', 100),
  contrast: useStorage('manga-contrast', 100)
})

// Auto-switch to webtoon mode if series is Manhwa / Webtoon
watch(
  chapterData,
  (newData) => {
    if (!newData?.manga) return
    const manga = newData.manga
    if (
      isWebtoonFormat({
        format: manga.format,
        tags: manga.tags,
        titleType: manga.format
      })
    ) {
      settings.readingMode = 'webtoon'
    }
  },
  { immediate: true }
)

const currentPage = ref(1)
const controlsVisible = ref(true)
const isChapterSelectOpen = ref(false)
const showSettings = ref(false)
let controlsTimeout: ReturnType<typeof setTimeout> | null = null
let autoScrollInterval: ReturnType<typeof setInterval> | null = null
const webtoonWrapper = ref<HTMLElement | null>(null)
const pagedWrapper = ref<HTMLElement | null>(null)

// Zoom & Pan state (active only on the targeted/current page)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const activeWebtoonZoomIndex = ref<number | null>(null)

let dragStartX = 0
let dragStartY = 0
let initialPanX = 0
let initialPanY = 0

// Touch gestures tracking
let initialPinchDist = 0
let initialPinchZoom = 1
let lastTapTime = 0
let lastTapX = 0
let lastTapY = 0
let touchStartTime = 0
let tapTimer: ReturnType<typeof setTimeout> | null = null

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  isPanning.value = false
  activeWebtoonZoomIndex.value = null
}

const zoomIn = () => {
  zoomLevel.value = Math.min(3.5, +(zoomLevel.value + 0.25).toFixed(2))
}

const zoomOut = () => {
  const next = Math.max(1, +(zoomLevel.value - 0.25).toFixed(2))
  zoomLevel.value = next
  if (next === 1) {
    resetZoom()
  }
}

const setZoomLevel = (level: number) => {
  zoomLevel.value = Math.min(3.5, Math.max(1, +level.toFixed(2)))
  if (zoomLevel.value === 1) {
    resetZoom()
  }
}

const toggleDoubleTapZoom = (pageIndex?: number) => {
  if (zoomLevel.value > 1) {
    resetZoom()
  } else {
    zoomLevel.value = 2.2
    panX.value = 0
    panY.value = 0
    if (pageIndex !== undefined) {
      activeWebtoonZoomIndex.value = pageIndex
    }
  }
}

const totalPages = computed(() => images.value.length)
const currentImage = computed(
  () => images.value[currentPage.value - 1]?.url ?? null
)
const readingPercentage = computed(() =>
  totalPages.value > 0
    ? Math.round((currentPage.value / totalPages.value) * 100)
    : 0
)

const chapterOrder = (chapter: {
  volumeNumber?: number
  chapterNumber?: number
}) => {
  const vol = chapter.volumeNumber
  const ch = chapter.chapterNumber
  const volNum = vol === undefined || vol === null
    ? Number.POSITIVE_INFINITY
    : typeof vol === 'string'
      ? Number(vol)
      : vol
  const chapNum = ch === undefined || ch === null
    ? Number.POSITIVE_INFINITY
    : typeof ch === 'string'
      ? Number(ch)
      : ch
  return {
    volume: Number.isNaN(volNum) ? Number.POSITIVE_INFINITY : volNum,
    chapter: Number.isNaN(chapNum) ? Number.POSITIVE_INFINITY : chapNum
  }
}

const siblingChapters = computed(() => {
  const list = chapterData.value?.chapters ?? []
  return [...list].sort((a, b) => {
    const aOrder = chapterOrder(a)
    const bOrder = chapterOrder(b)
    return aOrder.volume - bOrder.volume || aOrder.chapter - bOrder.chapter
  })
})

const currentChapterIndex = computed(() =>
  siblingChapters.value.findIndex(
    chapter => chapter._id === chapterKey.value
  )
)

const previousChapterId = computed(() => {
  const index = currentChapterIndex.value
  if (index <= 0) return null
  return siblingChapters.value[index - 1]?._id ?? null
})

const nextChapterId = computed(() => {
  const index = currentChapterIndex.value
  if (index === -1 || index >= siblingChapters.value.length - 1) return null
  return siblingChapters.value[index + 1]?._id ?? null
})

const hasPreviousChapter = computed(() => !!previousChapterId.value)
const hasNextChapter = computed(() => !!nextChapterId.value)

const selectedSiblingChapter = ref<string | undefined>(undefined)

const getSiblingChapterLabel = (chapter: {
  _id?: string
  title?: string
  chapterNumber?: number
  volumeNumber?: number
}): string => {
  const num = chapter.chapterNumber
  const vol = chapter.volumeNumber
  const t = chapter.title
  if (num !== undefined && num !== null) {
    return t ? `Cilt ${vol} Bölüm ${num} - ${t}` : `Cilt ${vol} Bölüm ${num}`
  }
  return t ?? 'Bilinmeyen bölüm'
}

const siblingChapterOptions = computed(() =>
  siblingChapters.value.map(chapter => ({
    value: chapter._id,
    label: getSiblingChapterLabel(chapter)
  }))
)

watch(selectedSiblingChapter, (chapterId) => {
  if (chapterId && chapterId !== chapterKey.value) {
    resetZoom()
    void navigateTo(`/chapter/${chapterId}/manga`)
  }
})

const goToPreviousChapter = () => {
  if (!previousChapterId.value) return
  resetZoom()
  navigateTo(`/chapter/${previousChapterId.value}/manga`)
}

const goToNextChapter = () => {
  if (!nextChapterId.value) return
  resetZoom()
  navigateTo(`/chapter/${nextChapterId.value}/manga`)
}

const nextPage = () => {
  resetZoom()
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (hasNextChapter.value) {
    goToNextChapter()
  }
}

const prevPage = () => {
  resetZoom()
  if (currentPage.value > 1) {
    currentPage.value--
  } else if (hasPreviousChapter.value) {
    goToPreviousChapter()
  }
}

const goToPage = (page: number) => {
  resetZoom()
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (['webtoon', 'continuous'].includes(settings.readingMode)) {
      scrollToPage(page)
    }
  }
}

const handlePageSelect = (event: Event) => {
  goToPage(Number((event.target as HTMLSelectElement).value))
}

const handleSliderInput = (event: Event) => {
  goToPage(Number((event.target as HTMLInputElement).value))
}

const handlePagedTap = (clientX: number, targetWidth: number) => {
  if (showSettings.value || zoomLevel.value > 1) return
  const clickPosition = clientX / targetWidth

  if (settings.readingDirection === 'rtl') {
    if (clickPosition < 0.3) nextPage()
    else if (clickPosition > 0.7) prevPage()
    else toggleControls()
  } else {
    if (clickPosition < 0.3) prevPage()
    else if (clickPosition > 0.7) nextPage()
    else toggleControls()
  }
}

const handlePagedClick = (event: MouseEvent) => {
  if (showSettings.value || zoomLevel.value > 1) return
  const { clientX, currentTarget } = event
  const { offsetWidth } = currentTarget as HTMLElement
  handlePagedTap(clientX, offsetWidth)
}

// Mouse Drag / Pan handlers for desktop
const handleMouseDown = (e: MouseEvent) => {
  if (zoomLevel.value <= 1) return
  isPanning.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  initialPanX = panX.value
  initialPanY = panY.value
}

const handleMouseMove = (e: MouseEvent) => {
  showControls()
  if (!isPanning.value || zoomLevel.value <= 1) return
  panX.value = initialPanX + (e.clientX - dragStartX)
  panY.value = initialPanY + (e.clientY - dragStartY)
}

const handleMouseUp = () => {
  isPanning.value = false
}

// Touch Gestures (Pinch-to-zoom, Pan, Double-tap) for mobile
const handleTouchStart = (e: TouchEvent, pageIndex?: number) => {
  touchStartTime = Date.now()

  if (e.touches.length === 2) {
    // Pinch gesture start
    const t0 = e.touches[0]
    const t1 = e.touches[1]
    if (t0 && t1) {
      initialPinchDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY)
      initialPinchZoom = zoomLevel.value
      if (pageIndex !== undefined) {
        activeWebtoonZoomIndex.value = pageIndex
      }
    }
  } else if (e.touches.length === 1) {
    const t0 = e.touches[0]
    if (!t0) return
    dragStartX = t0.clientX
    dragStartY = t0.clientY
    initialPanX = panX.value
    initialPanY = panY.value
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2 && initialPinchDist > 0) {
    const t0 = e.touches[0]
    const t1 = e.touches[1]
    if (t0 && t1) {
      const currentDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY)
      const scale = currentDist / initialPinchDist
      setZoomLevel(initialPinchZoom * scale)
      e.preventDefault()
    }
  } else if (e.touches.length === 1 && zoomLevel.value > 1) {
    const t0 = e.touches[0]
    if (!t0) return
    panX.value = initialPanX + (t0.clientX - dragStartX)
    panY.value = initialPanY + (t0.clientY - dragStartY)
    e.preventDefault()
  }
}

const handleTouchEnd = (e: TouchEvent, pageIndex?: number, containerWidth?: number) => {
  if (initialPinchDist > 0 && e.touches.length < 2) {
    initialPinchDist = 0
    if (zoomLevel.value < 1.05) {
      resetZoom()
    }
    return
  }

  const touch = e.changedTouches[0]
  if (!touch) return

  const now = Date.now()
  const timeSinceLastTap = now - lastTapTime
  const dist = Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY)
  const isQuickTap = now - touchStartTime < 250

  if (timeSinceLastTap < 300 && dist < 30) {
    // Double tap detected!
    if (tapTimer) {
      clearTimeout(tapTimer)
      tapTimer = null
    }
    lastTapTime = 0
    toggleDoubleTapZoom(pageIndex)
  } else {
    lastTapTime = now
    lastTapX = touch.clientX
    lastTapY = touch.clientY

    if (isQuickTap && zoomLevel.value <= 1 && containerWidth) {
      tapTimer = setTimeout(() => {
        handlePagedTap(touch.clientX, containerWidth)
        tapTimer = null
      }, 260)
    }
  }
}

const toggleControls = () => {
  controlsVisible.value = !controlsVisible.value
  if (controlsVisible.value) {
    resetControlsTimeout()
  } else if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
}

const showControls = () => {
  controlsVisible.value = true
  resetControlsTimeout()
}

const hideControls = () => {
  if (isChapterSelectOpen.value) return
  if (controlsTimeout) clearTimeout(controlsTimeout)
  controlsVisible.value = false
}

const resetControlsTimeout = () => {
  if (controlsTimeout) clearTimeout(controlsTimeout)
  if (isChapterSelectOpen.value) return
  controlsTimeout = setTimeout(() => {
    if (!showSettings.value && !isChapterSelectOpen.value && zoomLevel.value <= 1) {
      controlsVisible.value = false
    }
  }, 4000)
}

const toggleReadingMode = () => {
  resetZoom()
  const modes: ReadingMode[] = ['paged', 'webtoon', 'continuous']
  const current = settings.readingMode as ReadingMode
  const currentIndex = Math.max(0, modes.indexOf(current))
  settings.readingMode = modes[(currentIndex + 1) % modes.length] as ReadingMode
  nextTick(() => {
    if (['webtoon', 'continuous'].includes(settings.readingMode)) {
      scrollToPage(currentPage.value)
    }
  })
}

const scrollToPage = (page: number) => {
  const pageElement = webtoonWrapper.value?.querySelector(
    `[data-page-index="${page}"]`
  ) as HTMLElement
  if (pageElement) {
    webtoonWrapper.value?.scrollTo({
      top: pageElement.offsetTop - 10,
      behavior: 'smooth'
    })
  }
}

const updatePageOnScroll = () => {
  if (!webtoonWrapper.value) return
  const { scrollTop, scrollHeight, clientHeight } = webtoonWrapper.value

  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (currentPage.value !== totalPages.value) {
      currentPage.value = totalPages.value
      if (activeWebtoonZoomIndex.value !== null && activeWebtoonZoomIndex.value !== currentPage.value) {
        resetZoom()
      }
    }
    return
  }

  const pageElements = Array.from(
    webtoonWrapper.value.querySelectorAll('[data-page-index]')
  )
  let mostVisiblePage = currentPage.value
  let maxVisibility = 0

  for (const el of pageElements) {
    const rect = el.getBoundingClientRect()
    const viewportHeight = webtoonWrapper.value.clientHeight
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
    )
    const visibility = visibleHeight / (rect.height || 1)

    if (visibility > maxVisibility) {
      maxVisibility = visibility
      mostVisiblePage = parseInt(el.getAttribute('data-page-index') || '1', 10)
    }
  }
  if (currentPage.value !== mostVisiblePage) {
    currentPage.value = mostVisiblePage
    if (activeWebtoonZoomIndex.value !== null && activeWebtoonZoomIndex.value !== mostVisiblePage) {
      resetZoom()
    }
  }
  showControls()
}

const startAutoScroll = () => {
  if (autoScrollInterval) clearInterval(autoScrollInterval)
  autoScrollInterval = setInterval(() => {
    if (webtoonWrapper.value) {
      webtoonWrapper.value.scrollTop += settings.scrollSpeed
    }
  }, 50)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) clearInterval(autoScrollInterval)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.target instanceof HTMLInputElement
    || event.target instanceof HTMLSelectElement
  )
    return

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      if (settings.readingDirection === 'rtl') {
        prevPage()
      } else {
        nextPage()
      }
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (settings.readingDirection === 'rtl') {
        nextPage()
      } else {
        prevPage()
      }
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
    case '_':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
    case 'a':
    case 'A':
      event.preventDefault()
      settings.autoScroll = !settings.autoScroll
      break
    case ' ':
      event.preventDefault()
      toggleControls()
      break
    case 'Escape':
      if (zoomLevel.value > 1) {
        resetZoom()
      } else {
        showSettings.value = false
      }
      break
  }
}

watch(
  () => settings.autoScroll,
  (newVal) => {
    if (newVal) startAutoScroll()
    else stopAutoScroll()
  }
)

watch(
  () => settings.readingMode,
  () => {
    resetZoom()
    if (settings.autoScroll) {
      stopAutoScroll()
      settings.autoScroll = false
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mouseup', handleMouseUp)
  resetControlsTimeout()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mouseup', handleMouseUp)
  if (controlsTimeout) clearTimeout(controlsTimeout)
  if (tapTimer) clearTimeout(tapTimer)
  stopAutoScroll()
})

watch(chapterKey, (key) => {
  selectedSiblingChapter.value = key
  currentPage.value = 1
  settings.autoScroll = false
  resetZoom()
})

useHead(() => ({
  title: `Okunuyor: Bölüm ${
    chapterData.value?.title ?? ''
  } - Sayfa ${currentPage.value}/${totalPages.value}`
}))

definePageMeta({
  isLayouted: false
})
</script>

<template>
  <div
    v-if="chapterData && !pending"
    class="reader-container"
    @mousemove="handleMouseMove"
    @mouseleave="hideControls"
  >
    <!-- SAYFALI MOD (Paged) -->
    <div
      v-if="settings.readingMode === 'paged'"
      ref="pagedWrapper"
      class="image-wrapper select-none"
      :class="{ 'cursor-grab': zoomLevel > 1, 'cursor-grabbing': isPanning }"
      @click="handlePagedClick"
      @dblclick.prevent="toggleDoubleTapZoom()"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart($event)"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd($event, undefined, pagedWrapper?.offsetWidth)"
    >
      <transition
        name="page-fade"
        mode="out-in"
      >
        <div
          v-if="currentImage"
          :key="currentImage"
          class="image-container"
        >
          <img
            :src="currentImage"
            :alt="`Sayfa ${currentPage}`"
            class="manga-page"
            :class="{ 'transition-transform duration-200 ease-out': !isPanning && initialPinchDist === 0 }"
            :style="{
              transform: `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
              transformOrigin: 'center center',
              filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`
            }"
            loading="lazy"
            decoding="async"
            draggable="false"
          >
        </div>
      </transition>
    </div>

    <!-- WEBTOON MODU -->
    <div
      v-else-if="settings.readingMode === 'webtoon'"
      ref="webtoonWrapper"
      class="webtoon-wrapper"
      @scroll="updatePageOnScroll"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="webtoon-page-container"
        :data-page-index="index + 1"
        @dblclick.prevent="toggleDoubleTapZoom(index + 1)"
        @touchstart="handleTouchStart($event, index + 1)"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd($event, index + 1)"
      >
        <img
          :src="image.url"
          :alt="`Sayfa ${index + 1}`"
          class="webtoon-page"
          :class="{
            'zoomed-page shadow-2xl': activeWebtoonZoomIndex === index + 1 && zoomLevel > 1,
            'transition-transform duration-200 ease-out': activeWebtoonZoomIndex === index + 1 && !isPanning && initialPinchDist === 0
          }"
          :style="{
            transform: activeWebtoonZoomIndex === index + 1 && zoomLevel > 1
              ? `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`
              : 'none',
            transformOrigin: 'center center',
            filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`
          }"
          loading="lazy"
          decoding="async"
          draggable="false"
        >
      </div>
    </div>

    <!-- SÜREKLİ MOD (Continuous) -->
    <div
      v-else
      ref="webtoonWrapper"
      class="continuous-wrapper"
      @scroll="updatePageOnScroll"
    >
      <div class="continuous-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="continuous-page-container"
          :data-page-index="index + 1"
          @dblclick.prevent="toggleDoubleTapZoom(index + 1)"
          @touchstart="handleTouchStart($event, index + 1)"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd($event, index + 1)"
        >
          <img
            :src="image.url"
            :alt="`Sayfa ${index + 1}`"
            class="continuous-page"
            :class="{
              'zoomed-page shadow-2xl': activeWebtoonZoomIndex === index + 1 && zoomLevel > 1,
              'transition-transform duration-200 ease-out': activeWebtoonZoomIndex === index + 1 && !isPanning && initialPinchDist === 0
            }"
            :style="{
              transform: activeWebtoonZoomIndex === index + 1 && zoomLevel > 1
                ? `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`
                : 'none',
              transformOrigin: 'center center',
              filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`
            }"
            loading="lazy"
            decoding="async"
            draggable="false"
          >
        </div>
      </div>
    </div>

    <!-- OKUMA İLERLEME ÇUBUĞU -->
    <div
      class="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-primary to-primary/50 z-50 pointer-events-none"
      :style="{ width: readingPercentage + '%' }"
    />

    <!-- ZOOM GÖSTERGESİ / YÜZEN KONTROL PİLİ (Zoom Aktifken veya Arayüz Açıkken) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="zoomLevel > 1 || (controlsVisible && !showSettings)"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 z-45 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 shadow-xl text-white pointer-events-auto"
      >
        <UButton
          icon="i-lucide-minus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="rounded-full"
          :disabled="zoomLevel <= 1"
          @click.stop="zoomOut"
        />
        <span class="text-xs font-mono font-bold px-1 min-w-[3.2rem] text-center select-none">
          %{{ Math.round(zoomLevel * 100) }}
        </span>
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="rounded-full"
          :disabled="zoomLevel >= 3.5"
          @click.stop="zoomIn"
        />
        <UButton
          v-if="zoomLevel > 1"
          icon="i-lucide-rotate-ccw"
          size="xs"
          color="primary"
          variant="soft"
          class="rounded-full ml-0.5 text-[11px]"
          title="Yakınlaştırmayı Sıfırla"
          @click.stop="resetZoom"
        >
          1x
        </UButton>
      </div>
    </Transition>

    <!-- ARAYÜZ KONTROLLERİ OVERLAY -->
    <transition name="fade">
      <div
        v-show="controlsVisible"
        class="controls-overlay"
        @click.self="toggleControls"
      >
        <!-- ÜST ÇUBUK -->
        <div class="top-bar">
          <UButton
            :to="`/title/${chapterData?.manga?.myAnimeListId || chapterData?.manga?._id}`"
            variant="ghost"
            size="lg"
            icon="i-lucide-x"
            square
            class="touch-manipulation"
          />
          <div class="chapter-info hidden sm:block">
            <p class="font-bold text-white truncate">
              {{ chapterData?.manga?.title }}
            </p>
            <p class="text-xs text-gray-300">
              Bölüm
              {{ chapterData?.chapterNumber ?? '-' }} ·
              {{ chapterData?.source?.name ?? "Bilinmeyen" }}
            </p>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-white font-bold text-sm">{{ currentPage }} / {{ totalPages }}</span>
            <span class="text-gray-400 text-xs">%{{ readingPercentage }}</span>
          </div>
        </div>

        <!-- ALT ÇUBUK -->
        <div class="bottom-bar">
          <div class="flex items-center gap-2 flex-1">
            <UButton
              :disabled="!hasPreviousChapter"
              icon="i-lucide-skip-back"
              size="sm"
              color="neutral"
              variant="soft"
              class="touch-manipulation"
              title="Önceki Bölüm"
              @click="goToPreviousChapter"
            />
            <UButton
              :disabled="currentPage <= 1"
              icon="i-lucide-chevron-left"
              size="sm"
              color="neutral"
              variant="soft"
              class="touch-manipulation"
              title="Önceki Sayfa"
              @click="prevPage"
            />
            <input
              :value="currentPage"
              type="range"
              :min="1"
              :max="totalPages"
              class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
              @input="handleSliderInput"
            >
            <UButton
              :disabled="currentPage >= totalPages"
              icon="i-lucide-chevron-right"
              size="sm"
              color="neutral"
              variant="soft"
              class="touch-manipulation"
              title="Sonraki Sayfa"
              @click="nextPage"
            />
            <UButton
              :disabled="!hasNextChapter"
              icon="i-lucide-skip-forward"
              size="sm"
              color="neutral"
              variant="soft"
              class="touch-manipulation"
              title="Sonraki Bölüm"
              @click="goToNextChapter"
            />

            <USelect
              v-if="siblingChapterOptions.length"
              v-model="selectedSiblingChapter"
              :items="siblingChapterOptions"
              :placeholder="`Bölüm ${chapterData?.chapterNumber ?? '-'} / ${siblingChapters.length}`"
              size="xs"
              class="w-36 sm:w-40"
              @update:open="
                (open) => {
                  isChapterSelectOpen = open
                  if (open) {
                    controlsVisible = true
                    resetControlsTimeout()
                  }
                }
              "
            />
          </div>
          <UButton
            :icon="showSettings ? 'i-lucide-x' : 'i-lucide-settings'"
            size="sm"
            color="neutral"
            variant="soft"
            class="touch-manipulation"
            @click="void (showSettings = !showSettings)"
          />
        </div>

        <!-- AYARLAR PANELİ -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="showSettings"
            class="settings-panel"
          >
            <div class="space-y-4">
              <!-- OKUMA MODU -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-white text-sm font-medium">Okuma Modu</label>
                  <UButton
                    size="xs"
                    color="primary"
                    variant="soft"
                    class="rounded-lg"
                    @click="toggleReadingMode"
                  >
                    {{
                      settings.readingMode === "paged"
                        ? "Sayfalı"
                        : settings.readingMode === "webtoon"
                          ? "Webtoon"
                          : "Sürekli"
                    }}
                  </UButton>
                </div>
              </div>

              <!-- OKUMA YÖNÜ (Sayfalı mod için RTL / LTR) -->
              <div v-if="settings.readingMode === 'paged'">
                <div class="flex justify-between items-center mb-2">
                  <label class="text-white text-sm font-medium">Okuma Yönü</label>
                  <div class="flex items-center gap-1 bg-gray-800/80 p-1 rounded-lg border border-gray-700/60">
                    <UButton
                      size="xs"
                      :color="settings.readingDirection === 'rtl' ? 'primary' : 'neutral'"
                      :variant="settings.readingDirection === 'rtl' ? 'solid' : 'ghost'"
                      class="rounded-md text-[11px]"
                      @click="void (settings.readingDirection = 'rtl')"
                    >
                      Sağdan Sola (RTL)
                    </UButton>
                    <UButton
                      size="xs"
                      :color="settings.readingDirection === 'ltr' ? 'primary' : 'neutral'"
                      :variant="settings.readingDirection === 'ltr' ? 'solid' : 'ghost'"
                      class="rounded-md text-[11px]"
                      @click="void (settings.readingDirection = 'ltr')"
                    >
                      Soldan Sağa (LTR)
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- YAKINLAŞTIRMA KONTROLLERİ -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-white text-sm font-medium">
                    Büyütme (Zoom): %{{ Math.round(zoomLevel * 100) }}
                  </label>
                  <div class="flex items-center gap-1">
                    <UButton
                      icon="i-lucide-minus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      :disabled="zoomLevel <= 1"
                      @click="zoomOut"
                    />
                    <UButton
                      icon="i-lucide-plus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      :disabled="zoomLevel >= 3.5"
                      @click="zoomIn"
                    />
                    <UButton
                      v-if="zoomLevel > 1"
                      size="xs"
                      color="primary"
                      variant="soft"
                      @click="resetZoom"
                    >
                      Sıfırla
                    </UButton>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <UButton
                    v-for="preset in [1, 1.5, 2, 2.5]"
                    :key="preset"
                    size="xs"
                    :color="Math.abs(zoomLevel - preset) < 0.05 ? 'primary' : 'neutral'"
                    :variant="Math.abs(zoomLevel - preset) < 0.05 ? 'solid' : 'soft'"
                    class="flex-1 text-[11px]"
                    @click="setZoomLevel(preset)"
                  >
                    %{{ preset * 100 }}
                  </UButton>
                </div>
              </div>

              <!-- OTOMATİK KAYDIRMA (Webtoon & Sürekli mod için) -->
              <div v-if="settings.readingMode !== 'paged'">
                <div class="flex justify-between items-center mb-2">
                  <label class="text-white text-sm font-medium">Otomatik Kaydırma</label>
                  <UToggle v-model="settings.autoScroll" />
                </div>
              </div>

              <div
                v-if="settings.autoScroll && settings.readingMode !== 'paged'"
              >
                <label class="text-white text-sm font-medium block mb-2">Kaydırma Hızı: {{ settings.scrollSpeed }}</label>
                <input
                  v-model.number="settings.scrollSpeed"
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                >
              </div>

              <!-- PARLAKLIK -->
              <div>
                <label class="text-white text-sm font-medium block mb-2">Parlaklık: {{ settings.brightness }}%</label>
                <input
                  v-model.number="settings.brightness"
                  type="range"
                  min="50"
                  max="150"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                >
              </div>

              <!-- KONTRAST -->
              <div>
                <label class="text-white text-sm font-medium block mb-2">Kontrast: {{ settings.contrast }}%</label>
                <input
                  v-model.number="settings.contrast"
                  type="range"
                  min="50"
                  max="150"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                >
              </div>

              <!-- SAYFA SEÇİMİ -->
              <div>
                <label class="text-white text-sm font-medium block mb-2">Sayfa Seç</label>
                <select
                  :value="currentPage"
                  class="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600 cursor-pointer"
                  @change="handlePageSelect"
                >
                  <option
                    v-for="page in totalPages"
                    :key="page"
                    :value="page"
                  >
                    Sayfa {{ page }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </transition>
  </div>
  <div v-else-if="!pending">
    <div class="min-h-screen flex items-center justify-center">
      <UEmpty
        icon="i-lucide-alert-circle"
        title="Bölüm Bulunamadı"
        description="Lütfen tekrar deneyiniz veya sayfaya dönüp başka bir bölüm seçiniz."
      >
        <template #action>
          <UButton
            to="/"
            variant="soft"
          >
            Geri Dön
          </UButton>
        </template>
      </UEmpty>
    </div>
  </div>
  <div
    v-else
    class="reader-container bg-default flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-6 px-6 text-center">
      <div
        class="reader-loader"
        aria-hidden="true"
      >
        <span class="reader-loader-ring" />
        <UIcon
          name="i-lucide-book-open"
          class="reader-loader-icon"
        />
      </div>

      <div class="space-y-1.5">
        <p class="text-white font-bold text-base">
          Bölüm yükleniyor...
        </p>
        <p class="text-gray-400 text-xs">
          Sayfalar hazırlanıyor, lütfen bekleyin.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.manga-page {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  will-change: transform;
  pointer-events: auto;
}

.webtoon-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
  scroll-behavior: smooth;
  touch-action: pan-y pinch-zoom;
}

.webtoon-page-container {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible;
  position: relative;
}

.webtoon-page {
  display: block;
  max-width: 100%;
  width: auto;
  margin: 0 auto;
  height: auto;
  user-select: none;
  will-change: transform;
  position: relative;
}

.zoomed-page {
  z-index: 30;
  position: relative;
}

.continuous-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  touch-action: pan-y pinch-zoom;
}

.continuous-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5px;
}

.continuous-page-container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: visible;
}

.continuous-page {
  width: 100%;
  max-width: 100vw;
  height: auto;
  display: block;
  user-select: none;
  will-change: transform;
  position: relative;
}

@media (min-width: 640px) {
  .webtoon-page,
  .continuous-page {
    max-width: 600px;
    width: 100%;
  }
}

.controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    transparent 18%,
    transparent 82%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: 40;
}

.top-bar,
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: env(safe-area-inset-top, 0.75rem) 1rem 0.75rem;
  pointer-events: auto;
  gap: 0.75rem;
}

.bottom-bar {
  padding: 0.75rem 1rem env(safe-area-inset-bottom, 0.75rem);
}

.chapter-info {
  flex: 1;
  text-align: left;
}

.settings-panel {
  position: absolute;
  bottom: 4.5rem;
  right: 1rem;
  left: auto;
  width: 340px;
  background: var(--color-background) / 92%;
  border: 1px solid var(--color-primary) / 50%;
  border-radius: 16px;
  padding: 1.25rem;
  pointer-events: auto;
  backdrop-filter: blur(16px);
  z-index: 50;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

@media (max-width: 640px) {
  .settings-panel {
    width: calc(100vw - 2rem);
    right: 1rem;
    left: 1rem;
    bottom: 5rem;
  }
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.reader-loader {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reader-loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--color-primary);
  animation: reader-spin 0.9s linear infinite;
}

.reader-loader-icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

@keyframes reader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
