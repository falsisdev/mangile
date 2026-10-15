<script setup lang="ts">
import type { TrackerProvider, TrackerSearchResult } from '~/composables/useTrackers'

const props = withDefaults(
  defineProps<{
    open?: boolean
    provider?: TrackerProvider
    seriesId?: string
    initialTitle?: string
  }>(),
  {
    open: false,
    provider: 'mangadex',
    seriesId: '',
    initialTitle: ''
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'matched': [provider: TrackerProvider, matchedId: string]
}>()

const isOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val)
})

const { user } = useAuthUser()
const { searchTitles, bindTracker } = useTrackers()

const searchQuery = ref('')
const searching = ref(false)
const results = ref<TrackerSearchResult[]>([])
const hasSearched = ref(false)
const globalBind = ref(false)
const bindingId = ref<string | null>(null)

const isAdminOrMod = computed(() => {
  const roles = user.value?.roles || []
  return roles.includes('001') || roles.includes('002')
})

const providerTitle = computed(() => {
  switch (props.provider) {
    case 'mal':
      return 'MyAnimeList'
    case 'anilist':
      return 'AniList'
    case 'mangadex':
      return 'MangaDex'
    default:
      return 'Takipçi'
  }
})

watch(
  () => props.open,
  (val) => {
    if (val) {
      searchQuery.value = props.initialTitle || ''
      results.value = []
      hasSearched.value = false
      globalBind.value = false
      bindingId.value = null
      if (searchQuery.value.trim()) {
        executeSearch()
      }
    }
  }
)

async function executeSearch() {
  if (!searchQuery.value.trim()) return
  searching.value = true
  hasSearched.value = true
  try {
    results.value = await searchTitles(props.provider, searchQuery.value.trim())
  } finally {
    searching.value = false
  }
}

async function handleSelect(result: TrackerSearchResult) {
  if (!props.seriesId) return
  bindingId.value = result.id
  try {
    const success = await bindTracker(
      props.seriesId,
      props.initialTitle || result.title,
      props.provider,
      result.id,
      globalBind.value && isAdminOrMod.value
    )
    if (success) {
      emit('matched', props.provider, result.id)
      isOpen.value = false
    }
  } finally {
    bindingId.value = null
  }
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard class="w-full max-w-2xl overflow-hidden rounded-2xl max-h-[90dvh] overflow-y-auto">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <TrackerBrandIcon
                :provider="props.provider"
                class="size-5"
                :show-background="true"
              />
              <div>
                <h3 class="text-base font-bold text-foreground">
                  {{ providerTitle }} ile Eşleştir
                </h3>
                <p class="text-xs text-muted">
                  Başlık arayın veya direkt bağlantı / ID yapıştırın
                </p>
              </div>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="sm"
              class="rounded-xl"
              @click="void (isOpen = false)"
            />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Arama Inputu -->
          <div class="flex items-center gap-2">
            <UInput
              v-model="searchQuery"
              placeholder="Örn: Solo Leveling veya https://mangadex.org/title/..."
              icon="i-lucide-search"
              class="flex-1"
              :disabled="searching"
              @keydown.enter.prevent="executeSearch"
            />
            <UButton
              label="Ara"
              icon="i-lucide-search"
              color="primary"
              class="rounded-xl"
              :loading="searching"
              @click="executeSearch"
            />
          </div>

          <!-- Admin/Mod Global Eşleme Opsiyonu -->
          <div
            v-if="isAdminOrMod"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs"
          >
            <UCheckbox v-model="globalBind" />
            <span
              class="text-foreground/90 font-medium cursor-pointer"
              @click="globalBind = !globalBind"
            >
              Bu eşleşmeyi ana seriye kalıcı olarak kaydet (Tüm kullanıcılar için otomatikleşir)
            </span>
          </div>

          <!-- Yükleniyor Göstergesi -->
          <div
            v-if="searching"
            class="py-12 flex flex-col items-center justify-center gap-3 text-muted"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="size-6 animate-spin text-primary"
            />
            <span class="text-xs">{{ providerTitle }} üzerinde aranıyor...</span>
          </div>

          <!-- Sonuç Listesi -->
          <div
            v-else-if="results.length > 0"
            class="space-y-2 max-h-[380px] overflow-y-auto pr-1"
          >
            <div
              v-for="item in results"
              :key="item.id"
              class="group p-2.5 rounded-xl bg-muted/20 hover:bg-muted/35 border border-default/20 transition-all flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  v-if="item.coverImage"
                  :src="item.coverImage"
                  :alt="item.title"
                  class="size-14 rounded-lg object-cover flex-shrink-0 bg-muted/30"
                  loading="lazy"
                >
                <div
                  v-else
                  class="size-14 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0"
                >
                  <UIcon
                    name="i-lucide-book"
                    class="size-6 text-muted"
                  />
                </div>
                <div class="min-w-0 space-y-1">
                  <div class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {{ item.title }}
                  </div>
                  <div
                    v-if="item.romajiTitle && item.romajiTitle !== item.title"
                    class="text-xs text-muted truncate"
                  >
                    {{ item.romajiTitle }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] text-muted">
                    <UBadge
                      v-if="item.format"
                      size="xs"
                      variant="subtle"
                      color="neutral"
                      class="rounded"
                    >
                      {{ item.format }}
                    </UBadge>
                    <span v-if="item.year">{{ item.year }}</span>
                    <span v-if="item.totalChapters">{{ item.totalChapters }} Bölüm</span>
                    <span
                      v-if="item.status"
                      class="capitalize"
                    >{{ item.status }}</span>
                  </div>
                </div>
              </div>

              <UButton
                label="Seç"
                icon="i-lucide-link"
                color="primary"
                variant="soft"
                size="xs"
                class="rounded-xl flex-shrink-0 font-bold"
                :loading="bindingId === item.id"
                @click="handleSelect(item)"
              />
            </div>
          </div>

          <!-- Sonuç Bulunamadı -->
          <div
            v-else-if="hasSearched"
            class="py-10 flex flex-col items-center justify-center gap-2 text-muted text-center"
          >
            <UIcon
              name="i-lucide-file-x"
              class="size-8 text-muted/60"
            />
            <p class="text-xs">
              Hiçbir sonuç bulunamadı.
            </p>
            <p class="text-[11px] text-muted/80 max-w-sm">
              Başlığı İngilizce/Romaji olarak aramayı veya doğrudan serinin URL linkini yapıştırmayı deneyebilirsiniz.
            </p>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
