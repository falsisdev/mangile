<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

interface ExploreCard {
  id: number
  title: string
  cover: string
  type: string
  year: number
}

interface LocalTitleItem {
  _id: string
  _type: string
  title: string
  myAnimeListId: number
  coverImage: string
  uploadStatus?: string
  tags?: string[]
}

interface LocalTitlesApiResponse {
  data: LocalTitleItem[]
  total: number
  page: number
  limit: number
}

const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()

breadcrumbs.value = [{ label: 'Ana Sayfa', to: '/' }, { label: 'Keşfet' }]

const page = ref(1)
const localPage = ref(1)
const exploreMode = ref<'menu' | 'all' | 'local'>('menu')

// Filtre Seçenekleri - Tüm Seriler
const allSortItems = [
  { label: 'En Popüler', value: 'POPULARITY_DESC' },
  { label: 'En Yüksek Puanlı', value: 'SCORE_DESC' },
  { label: 'Trend Olanlar', value: 'TRENDING_DESC' },
  { label: 'Yayın Tarihi (En Yeni)', value: 'START_DATE_DESC' },
  { label: 'İsme Göre (A-Z)', value: 'TITLE_ROMAJI' }
]

const allFormatItems = [
  { label: 'Tüm Formatlar', value: 'ALL' },
  { label: 'Manga', value: 'MANGA' },
  { label: 'Hafif Roman', value: 'NOVEL' },
  { label: 'One-Shot', value: 'ONE_SHOT' }
]

const allGenreItems = [
  { label: 'Tüm Türler', value: 'ALL' },
  { label: 'Aksiyon', value: 'Action' },
  { label: 'Macera', value: 'Adventure' },
  { label: 'Komedi', value: 'Comedy' },
  { label: 'Dram', value: 'Drama' },
  { label: 'Fantezi', value: 'Fantasy' },
  { label: 'Korku', value: 'Horror' },
  { label: 'Gizem', value: 'Mystery' },
  { label: 'Psikolojik', value: 'Psychological' },
  { label: 'Romantik', value: 'Romance' },
  { label: 'Bilim Kurgu', value: 'Sci-Fi' },
  { label: 'Yaşamdan Kesit', value: 'Slice of Life' },
  { label: 'Doğaüstü', value: 'Supernatural' },
  { label: 'Gerilim', value: 'Thriller' }
]

const allStatusItems = [
  { label: 'Tüm Durumlar', value: 'ALL' },
  { label: 'Devam Ediyor', value: 'RELEASING' },
  { label: 'Tamamlandı', value: 'FINISHED' },
  { label: 'Yakında', value: 'NOT_YET_RELEASED' }
]

const allFilters = ref({
  search: '',
  sort: 'POPULARITY_DESC',
  format: 'ALL',
  genre: 'ALL',
  status: 'ALL'
})

const debouncedAllSearch = refDebounced(computed(() => allFilters.value.search), 350)

const hasAllFilters = computed(() => {
  return !!(
    allFilters.value.search ||
    allFilters.value.format !== 'ALL' ||
    allFilters.value.genre !== 'ALL' ||
    allFilters.value.status !== 'ALL' ||
    allFilters.value.sort !== 'POPULARITY_DESC'
  )
})

function resetAllFilters() {
  allFilters.value = {
    search: '',
    sort: 'POPULARITY_DESC',
    format: 'ALL',
    genre: 'ALL',
    status: 'ALL'
  }
  page.value = 1
}

watch(
  [
    debouncedAllSearch,
    () => allFilters.value.sort,
    () => allFilters.value.format,
    () => allFilters.value.genre,
    () => allFilters.value.status
  ],
  () => {
    page.value = 1
  }
)

// Filtre Seçenekleri - Mangile Serileri
const localSortItems = [
  { label: 'En Yeni Eklenenler', value: 'date_desc' },
  { label: 'En Eski Eklenenler', value: 'date_asc' },
  { label: 'İsme Göre (A-Z)', value: 'title_asc' },
  { label: 'İsme Göre (Z-A)', value: 'title_desc' }
]

const localTypeItems = [
  { label: 'Tüm İçerikler', value: 'ALL' },
  { label: 'Manga', value: 'manga' },
  { label: 'Hafif Roman', value: 'lightNovel' }
]

const localTagItems = [
  { label: 'Tüm Türler', value: 'ALL' },
  { label: 'Aksiyon', value: 'Aksiyon' },
  { label: 'Macera', value: 'Macera' },
  { label: 'Komedi', value: 'Komedi' },
  { label: 'Dram', value: 'Dram' },
  { label: 'Fantezi', value: 'Fantezi' },
  { label: 'Romantik', value: 'Romantik' },
  { label: 'Korku', value: 'Korku' },
  { label: 'Doğaüstü', value: 'Doğaüstü' },
  { label: 'Psikolojik', value: 'Psikolojik' },
  { label: 'Yaşamdan Kesit', value: 'Yaşamdan Kesit' },
  { label: 'Gizem', value: 'Gizem' },
  { label: 'Gerilim', value: 'Gerilim' },
  { label: 'Bilim Kurgu', value: 'Bilim Kurgu' },
  { label: 'Tarihi', value: 'Tarihi' },
  { label: 'Felsefik', value: 'Felsefik' },
  { label: 'One-Shot', value: 'One-Shot' },
  { label: 'Adaptasyon', value: 'Adaptasyon' },
  { label: 'Ödüllü', value: 'Ödüllü' },
  { label: 'Vahşet', value: 'Vahşet' },
  { label: 'Cinsellik', value: 'Cinsellik' }
]

const localStatusItems = [
  { label: 'Tüm Durumlar', value: 'ALL' },
  { label: 'Yükleme Aşamasında', value: 'uploading' },
  { label: 'Yükleme Tamamlandı', value: 'completed' },
  { label: 'Yüklemeye Ara Verildi', value: 'hiatus' },
  { label: 'Yükleme İptal Edildi', value: 'cancelled' }
]

const localFilters = ref({
  search: '',
  type: 'ALL',
  tag: 'ALL',
  status: 'ALL',
  sort: 'date_desc'
})

const debouncedLocalSearch = refDebounced(computed(() => localFilters.value.search), 350)

const hasLocalFilters = computed(() => {
  return !!(
    localFilters.value.search ||
    localFilters.value.type !== 'ALL' ||
    localFilters.value.tag !== 'ALL' ||
    localFilters.value.status !== 'ALL' ||
    localFilters.value.sort !== 'date_desc'
  )
})

function resetLocalFilters() {
  localFilters.value = {
    search: '',
    type: 'ALL',
    tag: 'ALL',
    status: 'ALL',
    sort: 'date_desc'
  }
  localPage.value = 1
}

watch(
  [
    debouncedLocalSearch,
    () => localFilters.value.sort,
    () => localFilters.value.type,
    () => localFilters.value.tag,
    () => localFilters.value.status
  ],
  () => {
    localPage.value = 1
  }
)

const { data: titles, pending: allPending } = await useLazyFetch<ExploreCard[]>(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: 'exploreTitles',
    query: computed(() => ({
      limit: 48,
      page: page.value || 1,
      search: debouncedAllSearch.value || undefined,
      sort: allFilters.value.sort || undefined,
      format: allFilters.value.format !== 'ALL' ? allFilters.value.format : undefined,
      genre: allFilters.value.genre !== 'ALL' ? allFilters.value.genre : undefined,
      status: allFilters.value.status !== 'ALL' ? allFilters.value.status : undefined
    })),
    transform: (data: unknown) => {
      const list = Array.isArray(data)
        ? data
        : (data as Record<string, unknown>).data || []
      return (list as Record<string, unknown>[]).map(
        (title: Record<string, unknown>): ExploreCard => ({
          id: Number(title.mal_id),
          title: String(title.anilist_title ?? ''),
          type:
            String(title.mal_type ?? '')
              ?.replaceAll('MANGA', 'Manga')
              .replaceAll('NOVEL', 'Hafif Roman')
              .replaceAll('ONE_SHOT', 'One-Shot') || 'Manga',
          year: Number(title.mal_year ?? 0),
          cover: String(title.anilist_cover_image ?? '')
        })
      )
    }
  }
)

const { data: localTitlesData, pending: localPending } = await useLazyFetch<LocalTitlesApiResponse>(
  `${config.public.backend.baseUrl}/api/localTitles`,
  {
    key: 'exploreLocalTitles',
    query: computed(() => ({
      page: localPage.value || 1,
      limit: 24,
      search: debouncedLocalSearch.value || undefined,
      type: localFilters.value.type !== 'ALL' ? localFilters.value.type : undefined,
      tag: localFilters.value.tag !== 'ALL' ? localFilters.value.tag : undefined,
      status: localFilters.value.status !== 'ALL' ? localFilters.value.status : undefined,
      sort: localFilters.value.sort || undefined
    }))
  }
)

const localTitles = computed(() => {
  if (!localTitlesData.value?.data) return []
  return localTitlesData.value.data.map(item => ({
    id: item.myAnimeListId,
    title: item.title,
    cover: item.coverImage,
    type: item._type === 'lightNovel' ? 'Hafif Roman' : 'Manga',
    year: 0
  }))
})
</script>

<template>
  <div class="px-4 md:px-8 max-w-7xl mx-auto pb-10">
    <div class="flex flex-col mb-6 mt-4">
      <h1 class="text-3xl font-black text-foreground">
        Keşfet
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Mangile'da bulunan serileri ara, filtrele ve keşfet!
      </p>
    </div>

    <div
      v-if="exploreMode === 'menu'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
    >
      <div
        class="bg-muted/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
        style="
        background-image: url('https://cdn.sanity.io/images/1yge7tlr/production/82d9ae08a8b6318090165bad8229d9fb2d072317-700x420.gif');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.7);
        "
        @click="void (exploreMode = 'all')"
      >
        <div class="rounded-full text-primary group-hover:scale-110 transition-transform">
          <UIcon
            name="i-lucide-globe"
            class="w-10 h-10"
          />
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-foreground">
            Tüm Serileri Keşfet
          </h3>
          <p class="text-sm text-muted-foreground mt-2">
            Geniş veritabanındaki (AniList) tüm serileri inceleyin
          </p>
        </div>
      </div>

      <div
        class="bg-muted/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
        style="
        background-image: url('https://cdn.sanity.io/images/1yge7tlr/production/23d03703d1751a1e51b27a4c4099e80ad1673545-540x250.gif');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.7);
        "
        @click="void (exploreMode = 'local')"
      >
        <div class="rounded-full text-primary group-hover:scale-110 transition-transform">
          <UIcon
            name="i-lucide-library"
            class="w-10 h-10"
          />
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-foreground">
            Mangile Serilerini Keşfet
          </h3>
          <p class="text-sm text-muted-foreground mt-2">
            Mangile sistemine eklenmiş serileri görüntüleyin
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="exploreMode === 'all'"
      class="space-y-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <UButton
          icon="i-lucide-arrow-left"
          variant="soft"
          color="neutral"
          size="sm"
          class="rounded-xl"
          @click="void (exploreMode = 'menu')"
        >
          Geri Dön
        </UButton>
      </div>

      <!-- Filtreleme Paneli - Tüm Seriler -->
      <div class="bg-muted/20 border border-border/50 rounded-2xl p-4 space-y-3">
        <div class="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
          <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4" />
          Filtreleme & Sıralama
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <UInput
            v-model="allFilters.search"
            placeholder="Seri ismi yazın..."
            icon="i-lucide-search"
            class="w-full"
          />
          <USelect
            v-model="allFilters.sort"
            :items="allSortItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="allFilters.format"
            :items="allFormatItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="allFilters.genre"
            :items="allGenreItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="allFilters.status"
            :items="allStatusItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </div>
        <div v-if="hasAllFilters" class="flex justify-end">
          <UButton
            icon="i-lucide-rotate-ccw"
            variant="soft"
            color="neutral"
            size="xs"
            class="rounded-lg"
            @click="resetAllFilters"
          >
            Filtreleri Temizle
          </UButton>
        </div>
      </div>

      <div
        v-if="allPending"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        <USkeleton
          v-for="i in 12"
          :key="i"
          class="h-64 rounded-2xl"
        />
      </div>

      <div
        v-else-if="titles && titles.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        <CardExplore
          v-for="item of titles"
          :id="item.id"
          :key="item.id"
          :title="item.title"
          :cover="item.cover"
          :type="item.type"
          :year="item.year"
          class="w-full"
        />
      </div>

      <div
        v-else
        class="text-center py-16"
      >
        <UIcon
          name="i-lucide-search-x"
          class="w-12 h-12 text-muted-foreground mx-auto mb-2"
        />
        <p class="text-muted-foreground">
          Aradığınız kriterlere uygun seri bulunamadı.
        </p>
      </div>

      <div class="flex justify-center w-full pt-8">
        <UPagination
          v-model:page="page"
          active-color="primary"
          active-variant="soft"
          :items-per-page="48"
          :total="1000"
        />
      </div>
    </div>

    <div
      v-else-if="exploreMode === 'local'"
      class="space-y-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <UButton
          icon="i-lucide-arrow-left"
          variant="soft"
          color="neutral"
          size="sm"
          class="rounded-xl"
          @click="void (exploreMode = 'menu')"
        >
          Geri Dön
        </UButton>
      </div>

      <!-- Filtreleme Paneli - Mangile Serileri -->
      <div class="bg-muted/20 border border-border/50 rounded-2xl p-4 space-y-3">
        <div class="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
          <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4" />
          Filtreleme & Sıralama
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <UInput
            v-model="localFilters.search"
            placeholder="Mangile serisi ara..."
            icon="i-lucide-search"
            class="w-full"
          />
          <USelect
            v-model="localFilters.sort"
            :items="localSortItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="localFilters.type"
            :items="localTypeItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="localFilters.tag"
            :items="localTagItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <USelect
            v-model="localFilters.status"
            :items="localStatusItems"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </div>
        <div v-if="hasLocalFilters" class="flex justify-end">
          <UButton
            icon="i-lucide-rotate-ccw"
            variant="soft"
            color="neutral"
            size="xs"
            class="rounded-lg"
            @click="resetLocalFilters"
          >
            Filtreleri Temizle
          </UButton>
        </div>
      </div>

      <div
        v-if="localPending"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        <USkeleton
          v-for="i in 12"
          :key="i"
          class="h-64 rounded-2xl"
        />
      </div>

      <div
        v-else-if="localTitles.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        <CardExplore
          v-for="item of localTitles"
          :id="item.id"
          :key="item.id"
          :title="item.title"
          :cover="item.cover"
          :type="item.type"
          :year="item.year"
          class="w-full"
        />
      </div>

      <div
        v-else
        class="text-center py-16"
      >
        <UIcon
          name="i-lucide-library"
          class="w-12 h-12 text-muted-foreground mx-auto mb-2"
        />
        <p class="text-muted-foreground">
          Aradığınız kriterlere uygun yerel seri bulunamadı.
        </p>
      </div>

      <div
        v-if="localTitlesData?.total && localTitlesData.total > 24"
        class="flex justify-center w-full pt-8"
      >
        <UPagination
          v-model:page="localPage"
          active-color="primary"
          active-variant="soft"
          :items-per-page="24"
          :total="localTitlesData.total"
        />
      </div>
    </div>
  </div>
</template>
