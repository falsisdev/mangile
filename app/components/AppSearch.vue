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

const searchTerm = ref('')
const debouncedSearch = ref('')
const isOpen = ref(false)
const config = useRuntimeConfig()

let debounceTimeout: ReturnType<typeof setTimeout>
watch(searchTerm, (newVal) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedSearch.value = newVal.trim()
  }, 500)
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
      : 'Öne Çıkanlar',
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
</script>

<template>
  <UButton
    icon="i-lucide-search"
    color="neutral"
    variant="ghost"
    size="sm"
    aria-label="Ara"
    @click="openSearch"
  />

  <UModal v-model:open="isOpen">
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="İçerikleri ara..."
        class="h-80"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
