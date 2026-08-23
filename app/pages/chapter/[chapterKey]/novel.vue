<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const route = useRoute()
const config = useRuntimeConfig()
useColorMode()
const chapterKey = computed(() => route.params.chapterKey as string)

interface ChapterResponse {
  title: string
  type: string
  myAnimeListId: number
  chapter: {
    title: string
    content: unknown
  }
  chapterKeys: string[]
}

const {
  data: chapterData,
  pending
} = await useFetch<ChapterResponse>(
  () =>
    `${config.public.backend.baseUrl}/api/chapter?filterType=lightNovel&key=${chapterKey.value}`,
  {
    lazy: true,
    server: false,
    watch: [chapterKey],
    retry: 3,
    retryDelay: 1000
  }
)

const currentChapterIndex = computed(
  () =>
    chapterData.value?.chapterKeys.findIndex(
      key => key === chapterKey.value
    ) ?? -1
)

const previousChapterKey = computed(() => {
  const keys = chapterData.value?.chapterKeys
  const index = currentChapterIndex.value
  if (!keys || index <= 0) return null
  return keys[index - 1]
})

const nextChapterKey = computed(() => {
  const keys = chapterData.value?.chapterKeys
  const index = currentChapterIndex.value
  if (!keys || index === -1 || index >= keys.length - 1) return null
  return keys[index + 1]
})

const hasPreviousChapter = computed(() => !!previousChapterKey.value)
const hasNextChapter = computed(() => !!nextChapterKey.value)

const goToPreviousChapter = () => {
  if (previousChapterKey.value)
    navigateTo(`/chapter/${previousChapterKey.value}/novel`)
}

const goToNextChapter = () => {
  if (nextChapterKey.value)
    navigateTo(`/chapter/${nextChapterKey.value}/novel`)
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
  if (!chapterData.value?.chapter?.content) return ''

  return chapterData.value.chapter.content
    .map((block: any) => {
      if (block._type === 'image') {
        const imageUrl
          = block.asset?.url
          || (block.asset?._ref ? getSanityImageUrl(block.asset._ref) : '')
        const caption = block.caption || block.alt || ''

        return toImageFigure(imageUrl, caption, 'my-12')
      }

      if (block._type !== 'block') return ''

      const htmlContent = block.children
        .map((child: any) => {
          const marks = child.marks || []
          const linkDef = marks
            .map((mark: string) =>
              block.markDefs?.find((m: any) => m._key === mark)
            )
            .find((def: any) => def?._type === 'link' && isImageUrl(def.href))

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
            marks.forEach((mark: string) => {
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
                const def = block.markDefs.find((m: any) => m._key === mark)
                if (def && def._type === 'link') {
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
    : `Okunuyor: ${chapterData.value?.chapter?.title ?? ''}`
}))

definePageMeta({
  isLayouted: false
})
</script>

<template>
  <div
    class="min-h-screen dark:bg-linear-to-b dark:from-default dark:via-default dark:to-black transition-colors duration-300"
  >
    <header
      class="sticky top-0 z-40 bg-default backdrop-blur-xl border-b border-primary/50 shadow-md"
    >
      <UContainer
        class="h-auto py-3 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl"
      >
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <UButton
            :disabled="!hasPreviousChapter"
            icon="i-lucide-chevron-left"
            size="sm"
            color="gray"
            variant="soft"
            @click="goToPreviousChapter"
          />
          <UButton
            :to="`/title/${chapterData?.myAnimeListId}`"
            icon="i-lucide-book-open"
            size="sm"
            color="primary"
            variant="soft"
          />
          <span
            class="text-xs font-medium text-gray-600 dark:text-gray-400 truncate flex-1 sm:flex-none"
          >
            {{ chapterData?.title }} | {{ chapterData?.chapter?.title }}
          </span>
        </div>

        <div
          class="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end"
        >
          <UButtonGroup size="xs" orientation="horizontal">
            <UButton
              icon="i-lucide-a-arrow-down"
              color="gray"
              variant="ghost"
              title="Yazıyı Küçült"
              @click="changeFontSize(-1)"
            />
            <UButton
              icon="i-lucide-a-arrow-up"
              color="gray"
              variant="ghost"
              title="Yazıyı Büyüt"
              @click="changeFontSize(1)"
            />
          </UButtonGroup>

          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="gray"
            variant="soft"
            size="xs"
            @click="toggleTheme"
          />

          <UButton
            icon="i-lucide-settings"
            color="gray"
            variant="soft"
            size="xs"
            @click="showSettings = !showSettings"
          />

          <UButton
            :disabled="!hasNextChapter"
            icon="i-lucide-chevron-right"
            size="sm"
            color="gray"
            variant="soft"
            @click="goToNextChapter"
          />
        </div>
      </UContainer>
    </header>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
    >
      <div
        v-if="showSettings"
        class="fixed top-20 right-4 z-40 w-full sm:w-96 bg-default/90 dark:bg-default/90 backdrop-blur-lg border border-primary/50 rounded-xl shadow-lg p-6 transition-all duration-300"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Okuma Ayarları</h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            size="xs"
            square
            @click="showSettings = false"
          />
        </div>

        <div class="space-y-5">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-semibold"
              >Yazı Boyutu: {{ settings.fontSize }}px</label
              >
              <UButtonGroup size="xs">
                <UButton
                  icon="i-lucide-minus"
                  variant="soft"
                  color="gray"
                  @click="changeFontSize(-1)"
                />
                <UButton
                  icon="i-lucide-plus"
                  variant="soft"
                  color="gray"
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
              class="w-full accent-primary"
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-2"
            >Satır Yüksekliği:
              {{ (settings.lineHeight * 10).toFixed(0) }}%</label
            >
            <input
              v-model.number="settings.lineHeight"
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              class="w-full accent-primary"
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-2">Yazı Tipi</label>
            <UButtonGroup size="sm" orientation="horizontal" class="w-full">
              <UButton
                :variant="settings.fontFamily === 'sans' ? 'soft' : 'ghost'"
                class="flex-1"
                @click="settings.fontFamily = 'sans'"
              >
                Düz
              </UButton>
              <UButton
                :variant="settings.fontFamily === 'serif' ? 'soft' : 'ghost'"
                class="flex-1"
                @click="settings.fontFamily = 'serif'"
              >
                Serif
              </UButton>
              <UButton
                :variant="settings.fontFamily === 'mono' ? 'soft' : 'ghost'"
                class="flex-1"
                @click="settings.fontFamily = 'mono'"
              >
                Monospace
              </UButton>
            </UButtonGroup>
          </div>

          <div>
            <label class="text-sm font-semibold block mb-2">Hizalama</label>
            <UButtonGroup size="sm" orientation="horizontal" class="w-full">
              <UButton
                :variant="settings.textAlignment === 'left' ? 'soft' : 'ghost'"
                icon="i-lucide-align-left"
                class="flex-1"
                @click="settings.textAlignment = 'left'"
              />
              <UButton
                :variant="
                  settings.textAlignment === 'justify' ? 'soft' : 'ghost'
                "
                icon="i-lucide-align-justify"
                class="flex-1"
                @click="settings.textAlignment = 'justify'"
              />
              <UButton
                :variant="
                  settings.textAlignment === 'center' ? 'soft' : 'ghost'
                "
                icon="i-lucide-align-center"
                class="flex-1"
                @click="settings.textAlignment = 'center'"
              />
            </UButtonGroup>
          </div>

          <div>
            <label class="text-sm font-semibold block mb-2"
            >Parlaklık: {{ settings.brightness }}%</label
            >
            <input
              v-model.number="settings.brightness"
              type="range"
              min="50"
              max="150"
              step="5"
              class="w-full accent-primary"
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-2"
            >Sayfa Genişliği: {{ settings.lineWidth }}%</label
            >
            <input
              v-model.number="settings.lineWidth"
              type="range"
              min="50"
              max="100"
              step="5"
              class="w-full accent-primary"
            />
          </div>
        </div>
      </div>
    </Transition>

    <UContainer class="max-w-5xl py-10">
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-12 w-2/3 mx-auto mb-12" />
        <div class="space-y-4">
          <USkeleton class="h-6 w-full" />
          <USkeleton class="h-6 w-full" />
          <USkeleton class="h-6 w-5/6" />
        </div>
        <USkeleton class="h-80 w-full rounded-2xl my-8" />
        <div class="space-y-4">
          <USkeleton class="h-6 w-full" />
          <USkeleton class="h-6 w-4/5" />
        </div>
      </div>

      <div
        v-else-if="!chapterData?.chapter"
        class="min-h-[60vh] flex items-center justify-center"
      >
        <UEmpty
          icon="i-lucide-alert-circle"
          title="Bölüm Bulunamadı"
          description="Lütfen tekrar deneyiniz veya sayfaya dönüp başka bir bölüm seçiniz."
        >
          <template #action>
            <UButton color="primary" @click="goHome"> Ana Sayfaya Dön </UButton>
          </template>
        </UEmpty>
      </div>

      <article
        v-else
        class="transition-all duration-200 text-foreground max-w-none"
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
        <div class="mb-10 text-center">
          <h1
            class="font-black text-4xl md:text-5xl leading-tight text-foreground"
          >
            {{ chapterData.chapter.title }}
          </h1>
        </div>

        <div v-html="renderedContent" />
      </article>

      <div
        v-if="!pending && chapterData?.chapter"
        class="pt-12 mt-12 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <UButton
          :disabled="!hasPreviousChapter"
          icon="i-lucide-chevron-left"
          size="lg"
          color="primary"
          variant="soft"
          class="w-full sm:w-auto"
          @click="goToPreviousChapter"
        >
          Önceki Bölüm
        </UButton>

        <span
          class="text-sm text-gray-500 dark:text-gray-400 font-medium text-center line-clamp-2 px-4 flex-1"
        >
          {{ chapterData.chapter.title }}
        </span>

        <UButton
          :disabled="!hasNextChapter"
          trailing-icon="i-lucide-chevron-right"
          size="lg"
          color="primary"
          variant="soft"
          class="w-full sm:w-auto"
          @click="goToNextChapter"
        >
          Sonraki Bölüm
        </UButton>
      </div>
    </UContainer>

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
        size="lg"
        color="primary"
        class="fixed bottom-8 right-8 shadow-xl z-50"
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
