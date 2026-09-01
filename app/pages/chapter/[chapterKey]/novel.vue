<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const route = useRoute()
const config = useRuntimeConfig()
useColorMode()
const chapterKey = computed(() => route.params.chapterKey as string)

interface SanityMark {
  _key: string
  _type: string
  href?: string
}

interface SanityChild {
  text: string
  marks?: string[]
}

interface SanityBlock {
  _type: string
  style?: string
  children: SanityChild[]
  markDefs?: SanityMark[]
  asset?: {
    _ref?: string
    url?: string
  }
  caption?: string
  alt?: string
}

interface ChapterResponse {
  _id: string
  _type?: string
  title?: string
  chapterNumber?: number
  volumeNumber?: number
  content?: SanityBlock[]
  source?: {
    name?: string
    logo?: { url?: string }
  }
  lightNovel?: {
    myAnimeListId?: number
    title?: string
  }
  chapters?: {
    _id: string
    title?: string
    chapterNumber?: number
    volumeNumber?: number
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
    void navigateTo(`/chapter/${chapterId}/novel`)
  }
})

watch(chapterKey, (key) => {
  selectedSiblingChapter.value = key
})

const goToPreviousChapter = () => {
  if (previousChapterId.value)
    navigateTo(`/chapter/${previousChapterId.value}/novel`)
}

const goToNextChapter = () => {
  if (nextChapterId.value)
    navigateTo(`/chapter/${nextChapterId.value}/novel`)
}

const settings = reactive({
  fontSize: useStorage('novel-font-size', 18),
  lineHeight: useStorage('novel-line-height', 1.8),
  letterSpacing: useStorage('novel-letter-spacing', 0),
  fontFamily: useStorage('novel-font-family', 'sans') as Ref<
    'sans' | 'serif' | 'mono'
  >,
  textAlignment: useStorage('novel-alignment', 'justify') as Ref<
    'left' | 'justify' | 'center'
  >,
  brightness: useStorage('novel-brightness', 100),
  lineWidth: useStorage('novel-line-width', 100)
})

const readingProgress = ref(0)
const showBackToTop = ref(false)
const showSettings = ref(false)

const changeFontSize = (step: number) => {
  const newSize = settings.fontSize + step * 2
  if (newSize >= 12 && newSize <= 32) {
    settings.fontSize = newSize
  }
}

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value: boolean) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
  const winScroll
    = document.body.scrollTop || document.documentElement.scrollTop
  const height
    = document.documentElement.scrollHeight
      - document.documentElement.clientHeight
  readingProgress.value = (winScroll / height) * 100
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goHome = () => {
  navigateTo('/')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.target instanceof HTMLInputElement
    || event.target instanceof HTMLSelectElement
  )
    return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      window.scrollBy({ top: -100, behavior: 'smooth' })
      break
    case 'ArrowDown':
      event.preventDefault()
      window.scrollBy({ top: 100, behavior: 'smooth' })
      break
    case ' ':
      event.preventDefault()
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
      break
    case 'Escape':
      showSettings.value = false
      break
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

const getSanityImageUrl = (ref: string) => {
  if (!ref) return ''
  const projectId = config.public.sanity?.projectId
  const dataset = config.public.sanity?.dataset || 'production'
  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}

const isImageUrl = (url: string) =>
  /\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/i.test(url || '')

const toImageFigure = (src: string, alt = '', className = '') => {
  if (!src) return ''
  const caption = alt?.trim() || ''
  return `<figure class="my-10 flex flex-col items-center ${className}">
    <img src="${src}" alt="${caption}" loading="lazy" class="max-w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-xl border border-gray-200 dark:border-gray-800" style="filter: brightness(${settings.brightness}%);" />
    ${caption ? `<figcaption class="mt-3 text-sm text-gray-500 dark:text-gray-400 italic text-center">${caption}</figcaption>` : ''}
  </figure>`
}

const renderedContent = computed(() => {
  if (!chapterData.value?.content) return ''

  return chapterData.value.content
    .map((block) => {
      if (block._type === 'image') {
        const imageUrl
          = block.asset?.url
            || (block.asset?._ref ? getSanityImageUrl(block.asset._ref) : '')
        const caption = block.caption || block.alt || ''

        return toImageFigure(imageUrl, caption, 'my-12')
      }

      if (block._type !== 'block') return ''

      const htmlContent = block.children
        .map((child) => {
          const marks = child.marks || []
          const linkDef = marks
            .map(mark =>
              block.markDefs?.find(m => m._key === mark)
            )
            .find(def => def?._type === 'link' && isImageUrl(def.href ?? ''))

          if (linkDef && linkDef.href) {
            return toImageFigure(linkDef.href, child.text || '', 'my-8')
          }

          const markdownImageMatch = (child.text || '').match(
            /!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i
          )
          if (markdownImageMatch?.[1] && isImageUrl(markdownImageMatch[1])) {
            return toImageFigure(
              markdownImageMatch[1],
              child.text || '',
              'my-8'
            )
          }

          const text = child.text || ''
          let tagsOpen = ''
          let tagsClose = ''

          if (marks.length > 0) {
            marks.forEach((mark) => {
              if (mark === 'strong') {
                tagsOpen += '<strong class="font-bold text-foreground">'
                tagsClose = '</strong>' + tagsClose
              } else if (mark === 'em') {
                tagsOpen += '<em class="italic">'
                tagsClose = '</em>' + tagsClose
              } else if (mark === 'code') {
                tagsOpen
                  += '<code class="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">'
                tagsClose = '</code>' + tagsClose
              } else if (block.markDefs) {
                const def = block.markDefs.find(m => m._key === mark)
                if (def && def._type === 'link' && def.href) {
                  if (isImageUrl(def.href)) {
                    return
                  }
                  tagsOpen += `<a href="${def.href}" class="text-primary hover:underline font-semibold transition-colors" target="_blank" rel="noopener">`
                  tagsClose = `</a>` + tagsClose
                }
              }
            })
          }
          return tagsOpen + text.replace(/\n/g, '<br/>') + tagsClose
        })
        .join('')

      const style = block.style || 'normal'
      if (style === 'h1')
        return `<h1 class="text-4xl md:text-5xl font-black mt-12 mb-8 leading-tight text-foreground">${htmlContent}</h1>`
      if (style === 'h2')
        return `<h2 class="text-3xl md:text-4xl font-bold mt-10 mb-6 leading-tight text-foreground">${htmlContent}</h2>`
      if (style === 'h3')
        return `<h3 class="text-2xl font-bold mt-8 mb-4 text-foreground">${htmlContent}</h3>`
      if (style === 'h4')
        return `<h4 class="text-xl font-bold mt-6 mb-3 text-foreground">${htmlContent}</h4>`
      if (style === 'blockquote')
        return `<blockquote class="border-l-4 border-primary pl-6 py-2 my-6 italic text-gray-700 dark:text-gray-300 bg-primary/5 rounded">${htmlContent}</blockquote>`

      return `<p class="mb-6 text-foreground leading-relaxed">${htmlContent}</p>`
    })
    .join('')
})

useHead(() => ({
  title: pending.value
    ? 'Yükleniyor...'
    : `Okunuyor: ${chapterData.value?.title ?? ''}`
}))

definePageMeta({
  isLayouted: false
})
</script>

<template>
  <div
    class="min-h-screen dark:bg-linear-to-b dark:from-default dark:via-default dark:to-black transition-colors duration-300 pb-20"
  >
    <!-- OKUMA İLERLEME ÇUBUĞU -->
    <div
      class="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-primary/60 z-50 pointer-events-none"
      :style="{ width: readingProgress + '%' }"
    />

    <!-- ÜST ÇUBUK (Sticky App Bar) -->
    <header
      class="sticky top-0 z-40 bg-default/90 backdrop-blur-xl border-b border-border/50 shadow-xs"
    >
      <div class="px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2 max-w-5xl mx-auto">
        <!-- Sol: Geri butonu ve Başlık Bilgisi -->
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <UButton
            :to="`/title/${chapterData?.lightNovel?.myAnimeListId}`"
            icon="i-lucide-arrow-left"
            size="sm"
            color="neutral"
            variant="ghost"
            class="rounded-full shrink-0"
            aria-label="Seriye Dön"
          />
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">
              {{ chapterData?.lightNovel?.title }}
            </p>
            <p class="text-[10px] sm:text-xs text-muted-foreground truncate">
              {{ chapterData?.title }}
            </p>
          </div>
        </div>

        <!-- Sağ: Yazı Boyutu, Tema ve Ayarlar Butonları -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <UButtonGroup size="xs">
            <UButton
              icon="i-lucide-a-arrow-down"
              color="neutral"
              variant="ghost"
              aria-label="Yazıyı Küçült"
              @click="changeFontSize(-1)"
            />
            <UButton
              icon="i-lucide-a-arrow-up"
              color="neutral"
              variant="ghost"
              aria-label="Yazıyı Büyüt"
              @click="changeFontSize(1)"
            />
          </UButtonGroup>

          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            size="xs"
            class="rounded-full"
            aria-label="Tema Değiştir"
            @click="toggleTheme"
          />

          <UButton
            :icon="showSettings ? 'i-lucide-x' : 'i-lucide-settings'"
            :color="showSettings ? 'primary' : 'neutral'"
            :variant="showSettings ? 'solid' : 'ghost'"
            size="xs"
            class="rounded-full"
            aria-label="Okuma Ayarları"
            @click="void (showSettings = !showSettings)"
          />
        </div>
      </div>
    </header>

    <!-- AYARLAR PANELİ -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="showSettings"
        class="fixed bottom-20 sm:bottom-auto sm:top-16 inset-x-3 sm:inset-x-auto sm:right-4 z-50 w-auto sm:w-96 bg-default/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[75vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-border/50">
          <h3 class="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
            <UIcon
              name="i-lucide-sliders-horizontal"
              class="w-3.5 h-3.5 text-primary"
            />
            Okuma Ayarları
          </h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            size="xs"
            color="neutral"
            class="rounded-full"
            aria-label="Kapat"
            @click="void (showSettings = false)"
          />
        </div>

        <div class="space-y-4 text-xs sm:text-sm">
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="font-semibold text-foreground">Yazı Boyutu: {{ settings.fontSize }}px</label>
              <UButtonGroup size="xs">
                <UButton
                  icon="i-lucide-minus"
                  variant="soft"
                  color="neutral"
                  @click="changeFontSize(-1)"
                />
                <UButton
                  icon="i-lucide-plus"
                  variant="soft"
                  color="neutral"
                  @click="changeFontSize(1)"
                />
              </UButtonGroup>
            </div>
            <input
              v-model.number="settings.fontSize"
              type="range"
              min="12"
              max="32"
              step="1"
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            >
          </div>

          <div>
            <label class="font-semibold block mb-1.5 text-foreground">Satır Yüksekliği:
              {{ (settings.lineHeight * 10).toFixed(0) }}%</label>
            <input
              v-model.number="settings.lineHeight"
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            >
          </div>

          <div>
            <label class="font-semibold block mb-1.5 text-foreground">Yazı Tipi</label>
            <UButtonGroup
              size="xs"
              orientation="horizontal"
              class="w-full"
            >
              <UButton
                :variant="settings.fontFamily === 'sans' ? 'solid' : 'ghost'"
                :color="settings.fontFamily === 'sans' ? 'primary' : 'neutral'"
                class="flex-1"
                @click="void (settings.fontFamily = 'sans')"
              >
                Düz
              </UButton>
              <UButton
                :variant="settings.fontFamily === 'serif' ? 'solid' : 'ghost'"
                :color="settings.fontFamily === 'serif' ? 'primary' : 'neutral'"
                class="flex-1"
                @click="void (settings.fontFamily = 'serif')"
              >
                Serif
              </UButton>
              <UButton
                :variant="settings.fontFamily === 'mono' ? 'solid' : 'ghost'"
                :color="settings.fontFamily === 'mono' ? 'primary' : 'neutral'"
                class="flex-1"
                @click="void (settings.fontFamily = 'mono')"
              >
                Monospace
              </UButton>
            </UButtonGroup>
          </div>

          <div>
            <label class="font-semibold block mb-1.5 text-foreground">Hizalama</label>
            <UButtonGroup
              size="xs"
              orientation="horizontal"
              class="w-full"
            >
              <UButton
                :variant="settings.textAlignment === 'left' ? 'solid' : 'ghost'"
                :color="settings.textAlignment === 'left' ? 'primary' : 'neutral'"
                icon="i-lucide-align-left"
                class="flex-1"
                @click="void (settings.textAlignment = 'left')"
              />
              <UButton
                :variant="settings.textAlignment === 'justify' ? 'solid' : 'ghost'"
                :color="settings.textAlignment === 'justify' ? 'primary' : 'neutral'"
                icon="i-lucide-align-justify"
                class="flex-1"
                @click="void (settings.textAlignment = 'justify')"
              />
              <UButton
                :variant="settings.textAlignment === 'center' ? 'solid' : 'ghost'"
                :color="settings.textAlignment === 'center' ? 'primary' : 'neutral'"
                icon="i-lucide-align-center"
                class="flex-1"
                @click="void (settings.textAlignment = 'center')"
              />
            </UButtonGroup>
          </div>

          <div>
            <label class="font-semibold block mb-1.5 text-foreground">Parlaklık: {{ settings.brightness }}%</label>
            <input
              v-model.number="settings.brightness"
              type="range"
              min="50"
              max="150"
              step="5"
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            >
          </div>

          <div>
            <label class="font-semibold block mb-1.5 text-foreground">Sayfa Genişliği: {{ settings.lineWidth }}%</label>
            <input
              v-model.number="settings.lineWidth"
              type="range"
              min="50"
              max="100"
              step="5"
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
        </div>
      </div>
    </Transition>

    <UContainer class="max-w-5xl py-6 sm:py-10 px-3 sm:px-6">
      <div
        v-if="pending"
        class="space-y-6"
      >
        <USkeleton class="h-10 w-2/3 mx-auto mb-10" />
        <div class="space-y-4">
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-5/6" />
        </div>
        <USkeleton class="h-64 w-full rounded-2xl my-8" />
        <div class="space-y-4">
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-4/5" />
        </div>
      </div>

      <div
        v-else-if="!chapterData"
        class="min-h-[60vh] flex items-center justify-center"
      >
        <UEmpty
          icon="i-lucide-alert-circle"
          title="Bölüm Bulunamadı"
          description="Lütfen tekrar deneyiniz veya sayfaya dönüp başka bir bölüm seçiniz."
        >
          <template #action>
            <UButton
              color="primary"
              @click="goHome"
            >
              Ana Sayfaya Dön
            </UButton>
          </template>
        </UEmpty>
      </div>

      <article
        v-else
        class="transition-all duration-200 text-foreground max-w-none px-1 sm:px-0"
        :style="{
          fontSize: settings.fontSize + 'px',
          lineHeight: settings.lineHeight,
          letterSpacing: settings.letterSpacing + 'px',
          filter: `brightness(${settings.brightness}%)`,
          maxWidth: settings.lineWidth + '%',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily:
            settings.fontFamily === 'serif'
              ? 'Georgia, serif'
              : settings.fontFamily === 'mono'
                ? 'monospace'
                : 'inherit',
          textAlign: settings.textAlignment
        }"
      >
        <div class="mb-6 sm:mb-10 text-center">
          <h1
            class="font-black text-2xl sm:text-3xl md:text-4xl leading-tight text-foreground"
          >
            {{ chapterData.title }}
          </h1>
        </div>

        <div v-html="renderedContent" />
      </article>

      <!-- Sayfa Sonu Bölüm Geçiş Butonları -->
      <div
        v-if="!pending && chapterData"
        class="pt-8 sm:pt-12 mt-8 sm:mt-12 mb-16 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
      >
        <UButton
          :disabled="!hasPreviousChapter"
          icon="i-lucide-chevron-left"
          size="md"
          color="primary"
          variant="soft"
          class="w-full sm:w-auto justify-center rounded-xl"
          @click="goToPreviousChapter"
        >
          Önceki Bölüm
        </UButton>

        <span
          class="text-xs sm:text-sm text-muted-foreground font-medium text-center line-clamp-2 px-2 flex-1"
        >
          {{ chapterData.title }}
        </span>

        <UButton
          :disabled="!hasNextChapter"
          trailing-icon="i-lucide-chevron-right"
          size="md"
          color="primary"
          variant="solid"
          class="w-full sm:w-auto justify-center rounded-xl font-bold"
          @click="goToNextChapter"
        >
          Sonraki Bölüm
        </UButton>
      </div>
    </UContainer>

    <!-- YÜZEN ALT BÖLÜM GEZİNME ÇUBUĞU (Android Reader Style) -->
    <div
      v-if="!pending && chapterData"
      class="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-default/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl sm:rounded-full max-w-[calc(100vw-1.5rem)]"
    >
      <UButton
        :disabled="!hasPreviousChapter"
        icon="i-lucide-chevron-left"
        size="sm"
        color="neutral"
        variant="soft"
        class="rounded-xl shrink-0"
        aria-label="Önceki Bölüm"
        @click="goToPreviousChapter"
      />
      <USelect
        v-if="siblingChapterOptions.length"
        v-model="selectedSiblingChapter"
        :items="siblingChapterOptions"
        :placeholder="`Bölüm ${chapterData?.chapterNumber ?? '-'} / ${siblingChapters.length}`"
        size="sm"
        class="w-40 sm:w-56 text-xs"
      />
      <UButton
        :disabled="!hasNextChapter"
        icon="i-lucide-chevron-right"
        size="sm"
        color="neutral"
        variant="soft"
        class="rounded-xl shrink-0"
        aria-label="Sonraki Bölüm"
        @click="goToNextChapter"
      />
    </div>

    <!-- BAŞA DÖN BUTONU -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-16 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-16 opacity-0"
    >
      <UButton
        v-if="showBackToTop"
        icon="i-lucide-arrow-up"
        size="sm"
        color="primary"
        variant="soft"
        class="fixed bottom-18 right-3 sm:bottom-20 sm:right-8 shadow-xl z-30 rounded-full"
        aria-label="Başa Dön"
        @click="scrollToTop"
      />
    </Transition>
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
