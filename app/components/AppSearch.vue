<script setup lang="ts">
import type { CommandPaletteItem } from '@nuxt/ui'

interface MangaTitle {
  mal_id: number
  anilist_title: string
  anilist_type: string
  anilist_cover_image: string
  mal_year: number | string
  mal_type: string
}

interface SearchItem extends CommandPaletteItem {
  id: number
}

const searchTerm = shallowRef('')
const debouncedSearch = shallowRef('')
const isOpen = shallowRef(false)
const config = useRuntimeConfig()
const { isAppleTheme } = useOsTheme()

let debounceTimeout: ReturnType<typeof setTimeout>
watch(searchTerm, (newVal) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedSearch.value = newVal.trim()
  }, 400)
})

watch(isOpen, (newVal) => {
  if (!newVal) {
    searchTerm.value = ''
    debouncedSearch.value = ''
  }
})

const { data: titles, status } = await useLazyFetch(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: 'searchTitles',
    query: computed(() => ({
      filterType: 'SCORE_DESC',
      limit: 12,
      query: debouncedSearch.value || undefined
    })),
    transform: (data: unknown): SearchItem[] => {
      let list: MangaTitle[] = []
      if (Array.isArray(data)) {
        list = data as MangaTitle[]
      } else if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>
        if (Array.isArray(obj.data)) {
          list = obj.data as MangaTitle[]
        } else if (Array.isArray(obj.results)) {
          list = obj.results as MangaTitle[]
        }
      }
      return list.map(title => ({
        id: title.mal_id,
        label: title.anilist_title,
        suffix: `(${title.mal_year}) | ${title.mal_type
          .replaceAll('MANGA', 'Manga')
          .replaceAll('NOVEL', 'Hafif Roman')
          .replaceAll('ONE_SHOT', 'One-Shot')}`,
        avatar: { src: title.anilist_cover_image, loading: 'lazy' as const }
      }))
    }
  }
)

const groups = computed(() => [
  {
    id: 'titles',
    label: searchTerm.value
      ? `Aranıyor: “${searchTerm.value}”...`
      : 'Öne Çıkan Seriler',
    items: titles.value || [],
    ignoreFilter: true
  }
])

function onSelect(value: CommandPaletteItem | null) {
  const item = value as SearchItem | null
  if (item?.id) {
    navigateTo(`/title/${item.id}`)
    isOpen.value = false
  }
}

function openSearch() {
  isOpen.value = true
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <!-- Mobile Icon Trigger -->
  <UButton
    icon="i-lucide-search"
    color="neutral"
    variant="ghost"
    size="sm"
    class="sm:hidden"
    aria-label="Ara"
    @click="openSearch"
  />

  <!-- Desktop / Tablet OS-Adaptive Search Bar Trigger -->
  <button
    type="button"
    class="hidden sm:inline-flex items-center justify-between gap-3 h-8 px-3 rounded-(--os-btn-radius) border border-default bg-elevated/60 hover:bg-elevated text-muted hover:text-highlighted text-xs transition-all cursor-pointer min-w-44 lg:min-w-56"
    aria-label="İçerikleri Ara"
    @click="openSearch"
  >
    <span class="flex items-center gap-2 truncate">
      <UIcon
        name="i-lucide-search"
        class="size-3.5 shrink-0 text-muted"
      />
      <span class="truncate">Seri veya roman ara...</span>
    </span>
    <kbd class="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-muted/70 text-muted border border-default/60 shrink-0">
      {{ isAppleTheme ? '⌘K' : 'Ctrl K' }}
    </kbd>
  </button>

  <UModal
    v-model:open="isOpen"
    :ui="{ content: 'sm:max-w-lg max-h-[85dvh] overflow-hidden os-modal-surface' }"
  >
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="Manga, webtoon veya hafif roman ara..."
        class="h-80 sm:h-96"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
