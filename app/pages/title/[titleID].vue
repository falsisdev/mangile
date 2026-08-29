<script setup lang="ts">
import { PortableText } from '@portabletext/vue'
import { useStorage } from '@vueuse/core'
import type { VNode } from 'vue'

interface ChapterData {
  id: number | string
  _key: string
  title?: string
  chapter_number?: number | string
  volume_number?: number | string
  source?: { name?: string }
  [key: string]: unknown
}

interface PortableTextBlock {
  _type: string
  [key: string]: unknown
}

interface TitleApiResponseChapter {
  _id: string
  title?: string
  chapterNumber?: number
  volumeNumber?: number
  source?: { name?: string }
}

interface TitleApiResponse {
  _id?: string
  _type?: string
  title?: string
  description?: string
  uploadStatus?: string
  tags?: string[]
  notes?: PortableTextBlock[]
  myAnimeListId?: number
  bannerImage?: { url?: string }
  coverImage?: { url?: string }
  chapters?: TitleApiResponseChapter[]
  externalMal?: {
    url?: string
    status?: string
    score?: number
    authors?: Array<{ name?: string }>
  }
  externalAnilist?: {
    id?: number
    title?: { romaji?: string, english?: string, native?: string }
    averageScore?: number
    bannerImage?: string
    coverImage?: { extraLarge?: string }
    description?: string
    relations?: { edges?: Record<string, unknown>[] }
    recommendations?: {
      nodes?: Array<{
        mediaRecommendation?: {
          id?: number
          idMal?: number
          type?: string
          title?: { romaji?: string, english?: string, native?: string }
          coverImage?: { extraLarge?: string }
        }
      }>
    }
  } | null
  sanity_data_missing?: boolean
}

interface SerieData {
  id: number | string
  title: string
  type?: string
  description?: string
  banner?: string
  cover?: string
  tags?: string[]
  uploadStatus?: string
  anilistID?: number
  anilistTitle?: string
  anilistScore?: number
  anilistBanner?: string
  anilistCover?: string
  anilistDescription?: string
  anilistRelations?: RelationItem[]
  malID?: number
  malStatus?: string
  malScore?: number
  malAuthors?: Array<{ name: string }>
  malURL?: string
  notes?: PortableTextBlock[]
  chapters?: ChapterData[]
  recommendations?: RecommendationItem[]
}

interface RecommendationItem {
  id: number
  title: string
  cover: string
  type: string
}

interface RelationItem {
  id: number
  title: string
  cover: string
  type: string
  relationType: string
}

const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const titleId = computed(() => {
  const value = route.params.titleID
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
})
const titleApiBase = String(config.public.backend.baseUrl ?? '')

function mapTitleResponse(title: TitleApiResponse | null): SerieData {
  if (!title) {
    return {
      id: 0,
      title: 'Bilinmeyen',
      tags: [],
      chapters: [],
      recommendations: []
    }
  }

  const anilist = title.externalAnilist ?? null
  const mal = title.externalMal ?? null
  const anilistTitle = anilist?.title

  return {
    id: title._id ?? title.myAnimeListId ?? 0,
    title:
      title.title
      ?? anilistTitle?.romaji
      ?? anilistTitle?.english
      ?? 'Bilinmeyen',
    type: title._type
      ?.replaceAll('manga', 'Manga')
      .replaceAll('lightNovel', 'Hafif Roman'),
    uploadStatus: title.uploadStatus,
    description: title.description || anilist?.description,
    banner: title.bannerImage?.url || anilist?.bannerImage,
    cover: title.coverImage?.url || anilist?.coverImage?.extraLarge,
    tags: title.tags ?? [],
    anilistID: anilist?.id,
    anilistTitle: anilistTitle?.romaji ?? anilistTitle?.english,
    anilistScore: anilist?.averageScore ? anilist.averageScore / 10 : 0,
    anilistBanner: anilist?.bannerImage,
    anilistCover: anilist?.coverImage?.extraLarge,
    anilistDescription: anilist?.description,
    anilistRelations: (anilist?.relations?.edges ?? []).map((edge) => {
      const e = edge as {
        relationType?: string
        node?: {
          id?: number
          idMal?: number
          type?: string
          title?: { romaji?: string, english?: string, native?: string }
          coverImage?: { extraLarge?: string }
        }
      }
      return {
        relationType: e.relationType ?? 'OTHER',
        id: e.node?.idMal ?? e.node?.id ?? 0,
        title:
          e.node?.title?.english
          || e.node?.title?.romaji
          || e.node?.title?.native
          || 'Bilinmeyen',
        cover: e.node?.coverImage?.extraLarge ?? '',
        type:
          (e.node?.type ?? '')
            .replaceAll('MANGA', 'Manga')
            .replaceAll('ANIME', 'Anime')
            .replaceAll('LIGHT_NOVEL', 'Hafif Roman')
            || 'Manga'
      }
    }).filter(r => r.id !== 0),
    malID: title.myAnimeListId,
    malStatus: mal?.status,
    malScore: mal?.score,
    malAuthors: (mal?.authors ?? []).filter(
      (author): author is { name: string } => typeof author?.name === 'string'
    ),
    malURL: mal?.url,
    notes: title.notes ?? [],
    chapters: (title.chapters ?? []).map(chapter => ({
      id: chapter._id,
      _key: chapter._id,
      title: chapter.title,
      chapter_number: chapter.chapterNumber,
      volume_number: chapter.volumeNumber,
      source: { name: chapter.source?.name }
    })),
    recommendations: (anilist?.recommendations?.nodes ?? [])
      .map(node => node?.mediaRecommendation)
      .filter((media): media is NonNullable<typeof media> => !!media)
      .map(media => ({
        id: media.idMal ?? media.id ?? 0,
        title: media.title?.english
          || media.title?.romaji
          || media.title?.native
          || 'Bilinmeyen',
        cover: media.coverImage?.extraLarge ?? '',
        type: media.type
          ?.replaceAll('MANGA', 'Manga')
          .replaceAll('LIGHT_NOVEL', 'Hafif Roman') || 'Manga'
      }))
  }
}

const { data: serie, status } = await useLazyAsyncData<SerieData | null>(
  'title-' + titleId.value,
  async () => {
    const id = titleId.value
    if (!id) return null

    // Kartlar mal_id, Sanity kartlari ise dokuman _id ile linkler; bu yuzden
    // parametrenin sekilline gore dogru sorgu parametresi secilir.
    const endpoint = /^\d+$/.test(id)
      ? `/api/titles?mal_id=${encodeURIComponent(id)}`
      : `/api/titles?id=${encodeURIComponent(id)}`

    const response = await fetch(`${titleApiBase}${endpoint}`)
    if (!response.ok) return null
    return mapTitleResponse((await response.json()) as TitleApiResponse | null)
  },
  {
    default: () => null
  }
)

// Oneriler seri verisinden reaktif olarak hesaplanir
const recommendations = computed(() => serie.value?.recommendations ?? [])

const breadcrumbsList = computed(() => [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Seriler' },
  { label: serie.value?.title || serie.value?.anilistTitle || 'Yükleniyor...' }
])

const customComponents: Record<string, Record<string, unknown>> = {
  marks: {
    link: (
      props: { value?: { href?: string } },
      context: { slots?: { default?: () => VNode[] } }
    ) =>
      h(
        'a',
        {
          href: props.value?.href,
          class: 'text-primary hover:underline font-semibold',
          target: '_blank'
        },
        context.slots?.default?.() ?? []
      )
  }
}

const chapterRouteType = (type?: string) =>
  (type ?? 'manga').toLowerCase().replaceAll('hafif roman', 'novel')

const chapterViewMode = useStorage<'grid' | 'list' | 'compact'>('mangile-chapter-view-mode', 'grid')
const chapterSortOrder = useStorage<'asc' | 'desc'>('mangile-chapter-sort-order', 'desc')
const chapterSearchQuery = ref('')

const expandedVolumes = ref<string[]>([])
function toggleVolume(key: string | number) {
  const strKey = String(key)
  if (expandedVolumes.value.includes(strKey)) {
    expandedVolumes.value = expandedVolumes.value.filter(k => k !== strKey)
  } else {
    expandedVolumes.value.push(strKey)
  }
}

const isDescriptionLong = ref(false)

const isNotesLong = computed(() => {
  if (!serie.value?.notes || !serie.value.notes.length) return false
  const text = JSON.stringify(serie.value.notes)
  return text.length > 300
})

const isDescriptionExpanded = ref(false)
const isNotesExpanded = ref(false)

const ageVerified = ref(false)

const warningTags = computed(() =>
  (serie.value?.tags ?? []).filter(
    tag => tag === 'Vahşet' || tag === 'Cinsellik'
  )
)

const showAgeGate = computed(() => {
  const tags = serie.value?.tags ?? []
  return (
    !ageVerified.value
    && tags.some(tag => tag === 'Vahşet' || tag === 'Cinsellik')
  )
})

function acceptAgeGate() {
  ageVerified.value = true
}

function rejectAgeGate() {
  navigateTo('/')
}

function getChapterNumber(chapter: ChapterData): number {
  const rawValue
    = chapter.chapter_number
      ?? (chapter as Record<string, unknown>).number
      ?? chapter.id

  if (typeof rawValue === 'number') return rawValue

  if (typeof rawValue === 'string') {
    const normalized = rawValue.replace(',', '.')
    const parsed = parseFloat(normalized)

    if (!isNaN(parsed)) return parsed
  }

  return 0
}

function getChapterDisplayValue(chapter: ChapterData | null): string {
  if (!chapter) return ''

  if (
    chapter.chapter_number !== undefined
    && chapter.chapter_number !== null
    && chapter.chapter_number !== ''
  ) {
    return String(chapter.chapter_number)
  }

  const anyCh = chapter as Record<string, unknown>

  if (
    anyCh.number !== undefined
    && anyCh.number !== null
    && anyCh.number !== ''
  ) {
    return String(anyCh.number)
  }

  const num = getChapterNumber(chapter)

  if (num !== 0) return String(num)

  if (
    chapter.id !== undefined
    && chapter.id !== null
    && chapter.id !== ''
  ) {
    return String(chapter.id)
  }

  return ''
}

function getChapterLabel(chapter: ChapterData): string {
  const vol = chapter.volume_number
  const ch = chapter.chapter_number
  const hasVol = vol !== undefined && vol !== null && vol !== ''
  const chNum = ch !== undefined && ch !== null && ch !== '' ? ch : chapter.id
  const prefix = hasVol ? `Cilt ${vol} Bölüm ${chNum}` : `Bölüm ${chNum}`
  return chapter.title ? `${prefix}: ${chapter.title}` : prefix
}

function chapterSortValue(chapter: ChapterData) {
  const vol = chapter.volume_number
  const volNum
    = typeof vol === 'string'
      ? parseFloat(vol.replace(',', '.'))
      : Number(vol)
  const chapterNum = getChapterNumber(chapter)
  return {
    volume: Number.isNaN(volNum) ? Number.POSITIVE_INFINITY : volNum,
    chapter: chapterNum
  }
}

const allChaptersSortedAsc = computed(() => {
  if (!serie.value?.chapters) return []

  return [...serie.value.chapters].sort((a, b) => {
    const aSort = chapterSortValue(a)
    const bSort = chapterSortValue(b)
    return aSort.volume - bSort.volume || aSort.chapter - bSort.chapter
  })
})

const firstChapter = computed(
  () => allChaptersSortedAsc.value[0] || null
)

const lastChapter = computed(
  () =>
    allChaptersSortedAsc.value[
      allChaptersSortedAsc.value.length - 1
    ] || null
)

const sortedChapters = computed(() => {
  const list
    = chapterSortOrder.value === 'asc'
      ? allChaptersSortedAsc.value
      : [...allChaptersSortedAsc.value].reverse()

  const query = chapterSearchQuery.value?.toLowerCase().trim()

  if (!query) return list

  return list.filter((ch) => {
    const titleStr = String(ch.title || '').toLowerCase()
    const numStr = String(getChapterDisplayValue(ch)).toLowerCase()
    const rawNumStr = String(
      ch.chapter_number
      ?? (ch as Record<string, unknown>).number
      ?? ch.id
      ?? ''
    ).toLowerCase()
    const srcStr = String(ch.source?.name || '').toLowerCase()

    return (
      titleStr.includes(query)
      || numStr.includes(query)
      || rawNumStr.includes(query)
      || srcStr.includes(query)
    )
  })
})

// Bölümleri cilt numarasına göre grupla (volume_number yoksa "Tek Cilt" grubu)
interface VolumeChapterGroup {
  volumeKey: string | number
  volumeTitle: string
  chapters: ChapterData[]
}

const volumeChapterGroups = computed<VolumeChapterGroup[]>(() => {
  const query = chapterSearchQuery.value?.toLowerCase().trim()
  const base = allChaptersSortedAsc.value

  const filtered = query
    ? base.filter((ch) => {
        const titleStr = String(ch.title || '').toLowerCase()
        const numStr = String(getChapterDisplayValue(ch)).toLowerCase()
        const rawNumStr = String(
          ch.chapter_number
          ?? (ch as Record<string, unknown>).number
          ?? ch.id
          ?? ''
        ).toLowerCase()
        const srcStr = String(ch.source?.name || '').toLowerCase()
        return (
          titleStr.includes(query)
          || numStr.includes(query)
          || rawNumStr.includes(query)
          || srcStr.includes(query)
        )
      })
    : base

  const groups = new Map<string | number, ChapterData[]>()

  for (const ch of filtered) {
    const vol = ch.volume_number
    const key = vol !== undefined && vol !== null && vol !== '' ? vol : 'single'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(ch)
  }

  // Cilt numaralarini kucukten buyuge sirala ('single' en sona)
  const sortedKeys = [...groups.keys()].sort((a, b) => {
    if (a === 'single') return 1
    if (b === 'single') return -1
    const na = Number(a)
    const nb = Number(b)

    let diff = 0
    if (isNaN(na) && isNaN(nb)) diff = String(a).localeCompare(String(b))
    else if (isNaN(na)) diff = 1
    else if (isNaN(nb)) diff = -1
    else diff = na - nb

    return chapterSortOrder.value === 'desc' ? -diff : diff
  })

  return sortedKeys.map((key) => {
    const volNum = Number(key)
    const volumeTitle
      = key === 'single'
        ? 'Tek Cilt'
        : `Cilt ${!isNaN(volNum) ? volNum : key}`

    const chapters = groups.get(key)!
    // Cilt icindeki bolumler siralama moduna gore duzenlenir
    const sortedChaps
      = chapterSortOrder.value === 'desc' ? [...chapters].reverse() : chapters

    return { volumeKey: key, volumeTitle, chapters: sortedChaps }
  })
})

watchEffect(() => {
  if (volumeChapterGroups.value && expandedVolumes.value.length === 0) {
    expandedVolumes.value = volumeChapterGroups.value.map(g => String(g.volumeKey))
  }
})

watchEffect(() => {
  breadcrumbs.value = breadcrumbsList.value
})

const bannerOpacity = ref(1)
const isMobile = ref(false)
const descriptionMobileEl = useTemplateRef<HTMLElement>('descriptionMobileEl')
const descriptionDesktopEl = useTemplateRef<HTMLElement>('descriptionDesktopEl')

function handleScroll() {
  if (!isMobile.value) {
    bannerOpacity.value = 1
    return
  }

  const scrollY = window.scrollY
  bannerOpacity.value = Math.max(0, 1 - scrollY / 120)
}

function checkDevice() {
  isMobile.value = window.innerWidth < 768
}

function measureDescriptionOverflow() {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (isDescriptionExpanded.value) return
      const el = isMobile.value
        ? descriptionMobileEl.value
        : descriptionDesktopEl.value
      if (el) isDescriptionLong.value = el.scrollHeight > el.clientHeight + 1
    })
  })
}

watch(
  () => serie.value?.description || serie.value?.anilistDescription || '',
  () => {
    isDescriptionExpanded.value = false
    measureDescriptionOverflow()
  }
)

watch(isDescriptionExpanded, (expanded) => {
  if (!expanded) measureDescriptionOverflow()
})

onMounted(() => {
  checkDevice()
  measureDescriptionOverflow()
  window.addEventListener('resize', checkDevice)
  window.addEventListener('resize', measureDescriptionOverflow)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
  window.removeEventListener('resize', measureDescriptionOverflow)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <UContainer class="space-y-8 relative pb-20 md:pb-0">
      <div
        v-if="status === 'pending'"
        class="space-y-8"
      >
        <USkeleton class="h-64 md:h-96 w-full rounded-3xl" />
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <USkeleton
              class="h-72 w-full rounded-2xl mx-auto max-w-[240px] md:max-w-none"
            />
            <USkeleton class="h-10 w-full rounded-xl" />
          </div>

          <div class="md:col-span-3 space-y-4">
            <USkeleton class="h-10 w-2/3" />

            <div class="flex gap-2">
              <USkeleton
                v-for="i in 3"
                :key="i"
                class="h-6 w-16"
              />
            </div>

            <USkeleton class="h-24 w-full" />
          </div>
        </div>
      </div>

      <div
        v-else-if="serie && !showAgeGate"
        class="space-y-6"
      >
        <div class="block md:hidden space-y-6 -mx-4 -mt-4">
          <div class="relative bg-background pb-3 overflow-hidden">
            <div class="relative h-60 w-full overflow-hidden">
              <img
                :src="serie.banner || serie.anilistBanner || serie.cover || serie.anilistCover"
                class="w-full h-full object-cover select-none"
                alt="Banner"
                :style="{ opacity: bannerOpacity }"
              >
              <div class="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-black/50" />
              <div class="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </div>
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              size="lg"
              square
              class="absolute top-3 left-3 z-30 rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/55"
              aria-label="Geri dön"
              @click="router.back()"
            />
            <div class="px-4 -mt-24 relative z-20 flex gap-4 items-end">
              <div class="relative w-28 shrink-0">
                <div class="aspect-2/3 rounded-xl overflow-hidden bg-background ring-2 ring-background/50 shadow-xl">
                  <img
                    :src="serie.cover || serie.anilistCover"
                    class="w-full h-full object-cover"
                    :alt="serie.title"
                  >
                </div>
                <UBadge
                  v-if="warningTags.length"
                  color="error"
                  variant="solid"
                  size="xs"
                  class="absolute -top-2 -right-2 rounded-full font-black shadow-lg px-2 ring-2 ring-background"
                >
                  18+
                </UBadge>
              </div>
              <div class="min-w-0 flex-1 space-y-2 pb-2">
                <UBadge
                  color="primary"
                  variant="solid"
                  size="sm"
                  class="font-bold rounded-full shadow"
                >
                  {{ serie.type || 'Manga' }}
                </UBadge>
                <h1 class="text-xl font-extrabold text-foreground leading-tight line-clamp-2 bg-background/85 backdrop-blur rounded-md px-2 py-1">
                  {{ serie.title }}
                </h1>
                <p
                  v-if="serie.anilistTitle && serie.anilistTitle !== serie.title"
                  class="text-xs font-medium text-foreground/80 truncate"
                >
                  {{ serie.anilistTitle }}
                </p>
              </div>
            </div>
            <div class="px-4 pt-3 flex flex-wrap gap-2 items-center">
              <div class="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md ring-1 ring-default/30 shadow text-xs font-bold flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-star"
                  class="w-4 h-4 text-emerald-500 fill-current"
                />
                <span>{{ serie.anilistScore ? serie.anilistScore.toFixed(1) : '-' }}</span>
                <span class="text-[10px] text-muted-foreground font-normal">AniList</span>
              </div>
              <div class="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md ring-1 ring-default/30 shadow text-xs font-bold flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-star"
                  class="w-4 h-4 text-amber-500 fill-current"
                />
                <span>{{ serie.malScore || '-' }}</span>
                <span class="text-[10px] text-muted-foreground font-normal">MAL</span>
              </div>
              <div class="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md ring-1 ring-default/30 shadow text-xs font-bold flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-chart-no-axes-column-increasing"
                  class="w-4 h-4 text-primary fill-current"
                />
                {{ serie.uploadStatus?.replaceAll('uploading', 'Yükleniyor').replaceAll('completed', 'Tamamlandı').replaceAll('hiatus', 'Beklemede').replaceAll('cancelled', 'İptal Edildi') || 'Yükleniyor' }}
              </div>
              <UBadge
                v-for="tag in serie.tags"
                :key="tag"
                :color="tag === 'Ödüllü' ? 'warning' : tag === 'Vahşet' || tag === 'Cinsellik' ? 'error' : tag === 'Adaptasyon' ? 'info' : 'neutral'"
                variant="subtle"
                size="sm"
                class="rounded-full px-2"
              >
                {{ tag }}
              </UBadge>
            </div>
            <div
              v-if="firstChapter || lastChapter"
              class="px-4 pt-3 grid grid-cols-2 gap-2"
            >
              <UButton
                v-if="firstChapter"
                :to="`/chapter/${firstChapter._key}/${chapterRouteType(serie?.type)}`"
                color="primary"
                variant="solid"
                icon="i-lucide-play"
                class="justify-center rounded-xl font-bold"
              >
                Baştan Oku
              </UButton>
              <UButton
                v-if="lastChapter && lastChapter._key !== firstChapter?._key"
                :to="`/chapter/${lastChapter._key}/${chapterRouteType(serie?.type)}`"
                color="primary"
                variant="soft"
                icon="i-lucide-fast-forward"
                class="justify-center rounded-xl font-bold"
              >
                Son Bölüm
              </UButton>
            </div>
          </div>

          <div class="px-4 space-y-5">
            <div
              class="space-y-2 bg-muted/20 p-4 rounded-2xl ring-1 ring-default/20"
            >
              <h3
                class="text-sm font-bold text-foreground flex items-center gap-2"
              >
                <UIcon
                  name="i-lucide-book-open"
                  class="text-primary w-4 h-4"
                />
                Özet
              </h3>

              <div class="relative">
                <p
                  ref="descriptionMobileEl"
                  class="text-xs text-muted-foreground leading-relaxed transition-[max-height] duration-500 ease-in-out overflow-hidden"
                  :class="isDescriptionExpanded ? 'max-h-[1000px]' : 'max-h-20'"
                >
                  {{ serie.description || serie.anilistDescription || "Bu seri için açıklama eklenmemiş." }}
                </p>
                <div
                  v-if="!isDescriptionExpanded && isDescriptionLong"
                  class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent pointer-events-none"
                />
              </div>

              <button
                v-if="isDescriptionLong"
                class="text-xs font-bold text-primary flex items-center gap-1 pt-1"
                @click="isDescriptionExpanded = !isDescriptionExpanded"
              >
                {{ isDescriptionExpanded ? 'Daralt' : 'Devamını Oku' }}

                <UIcon
                  :name="isDescriptionExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-3.5 h-3.5"
                />
              </button>
            </div>

            <div
              v-if="serie.notes && serie.notes.length"
              class="space-y-2 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl"
            >
              <h3 class="text-sm font-bold text-amber-500 flex items-center gap-2">
                <UIcon
                  name="i-lucide-sticky-note"
                  class="w-4 h-4"
                />
                Editör Notu
              </h3>

              <div class="relative">
                <div
                  class="text-xs prose dark:prose-invert prose-amber max-w-none transition-[max-height] duration-500 ease-in-out overflow-hidden"
                  :class="isNotesExpanded ? 'max-h-[1000px]' : 'max-h-20'"
                >
                  <PortableText
                    :value="serie.notes"
                    :components="customComponents"
                  />
                </div>

                <div
                  v-if="!isNotesExpanded && isNotesLong"
                  class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent pointer-events-none"
                />
              </div>

              <button
                v-if="isNotesLong"
                class="text-xs font-bold text-amber-500 flex items-center gap-1 pt-1"
                @click="isNotesExpanded = !isNotesExpanded"
              >
                {{ isNotesExpanded ? 'Daralt' : 'Oku' }}

                <UIcon
                  :name="isNotesExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-3.5 h-3.5"
                />
              </button>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-black text-foreground">
                    Bölümler
                  </h3>

                  <UBadge
                    color="neutral"
                    variant="soft"
                    size="md"
                    class="rounded-lg font-bold px-2.5 py-0.5"
                  >
                    {{ serie.chapters?.length || 0 }} Bölüm
                  </UBadge>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :icon="chapterSortOrder === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'"
                  class="rounded-lg font-semibold"
                  @click="void (chapterSortOrder = chapterSortOrder === 'asc' ? 'desc' : 'asc')"
                >
                  {{ chapterSortOrder === 'asc' ? 'Eski' : 'Yeni' }}
                </UButton>
              </div>

              <UInput
                v-model="chapterSearchQuery"
                icon="i-lucide-search"
                placeholder="Bölüm ara..."
                size="xs"
                color="neutral"
                variant="outline"
                class="w-full rounded-lg"
                clearable
              />

              <div
                v-if="sortedChapters.length"
                class="space-y-3 pt-1"
              >
                <div
                  v-for="group in volumeChapterGroups"
                  :key="group.volumeKey"
                  class="mb-4 last:mb-0"
                >
                  <h4
                    class="font-semibold text-sm text-foreground mb-2 px-1 flex items-center justify-between cursor-pointer select-none"
                    @click="toggleVolume(group.volumeKey)"
                  >
                    <span>{{ group.volumeTitle }}</span>
                    <UIcon
                      :name="expandedVolumes.includes(String(group.volumeKey)) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="w-4 h-4 text-muted-foreground"
                    />
                  </h4>

                  <div
                    class="grid transition-[grid-template-rows] duration-500 ease-in-out"
                    :class="expandedVolumes.includes(String(group.volumeKey)) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                  >
                    <div
                      class="overflow-hidden min-h-0"
                    >
                      <div class="flex flex-col gap-2">
                        <UCard
                          v-for="chapter in group.chapters"
                          :key="chapter.id"
                          class="shrink-0 transition-all hover:border-primary/40 cursor-pointer rounded-xl mx-1 mt-0.5"
                          :ui="{ body: 'p-3' }"
                        >
                          <NuxtLink
                            :to="`/chapter/${chapter._key}/${chapterRouteType(serie?.type)}`"
                            class="flex items-center justify-between gap-2"
                          >
                            <div class="truncate pr-1 min-w-0 flex-1">
                              <p class="font-bold text-xs text-foreground truncate">
                                {{ getChapterLabel(chapter) }}
                              </p>

                              <p
                                class="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate"
                              >
                                <UIcon
                                  name="i-lucide-languages"
                                  class="w-3 h-3 text-muted-foreground/70 shrink-0"
                                />
                                <span class="truncate">{{ chapter.source?.name || "Bilinmeyen Çevirmen" }}</span>
                              </p>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                              <UBadge
                                v-if="chapter.chapter_number"
                                color="primary"
                                variant="soft"
                                size="xs"
                                class="rounded-md text-[10px] font-semibold"
                              >
                                {{ chapter.chapter_number }}
                              </UBadge>

                              <UIcon
                                name="i-lucide-chevron-right"
                                class="w-4 h-4 text-muted-foreground"
                              />
                            </div>
                          </NuxtLink>
                        </UCard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="text-center py-8 rounded-xl bg-muted/20 border border-dashed border-default"
              >
                <UIcon
                  name="i-lucide-folder-open"
                  class="w-6 h-6 text-muted-foreground mb-1 mx-auto"
                />

                <p class="text-xs font-medium text-muted-foreground">
                  {{ chapterSearchQuery ? 'Aramanıza uygun bölüm bulunamadı.' : 'Henüz bu seriye ait bir bölüm yüklenmemiş.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="hidden md:block relative h-64 md:h-96 w-full overflow-hidden rounded-3xl transition-opacity duration-150 ease-out"
          :style="{ opacity: bannerOpacity }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-default via-default/40 to-transparent z-10"
          />
          <div
            class="absolute inset-0 bg-gradient-to-b from-default/20 via-transparent to-transparent z-10"
          />

          <img
            :src="serie.banner || serie.anilistBanner || serie.cover || serie.anilistCover"
            class="w-full h-full object-cover select-none"
            alt="Banner"
          >
        </div>

        <div
          class="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8 relative z-20 -mt-24 md:-mt-24 px-2 md:px-4"
        >
          <div class="flex flex-col items-center md:items-stretch space-y-4">
            <div
              class="w-48 md:w-full aspect-2/3 rounded-2xl overflow-hidden bg-muted shadow-[0px_0px_30px_0px_var(--color-neutral-700)]"
            >
              <img
                :src="serie.cover || serie.anilistCover"
                class="w-full h-full object-cover"
                :alt="serie.title"
              >
            </div>

            <div class="w-full space-y-2.5 max-w-60 md:max-w-none">
              <UButton
                v-if="serie.malURL"
                :to="serie.malURL"
                target="_blank"
                color="neutral"
                variant="subtle"
                block
                icon="i-lucide-external-link"
                class="rounded-xl font-medium"
              >
                MyAnimeList'te Gör
              </UButton>

              <div class="grid grid-cols-2 gap-2 text-center pt-1">
                <div
                  class="p-2.5 rounded-xl bg-muted/40 ring-1 ring-default/30 backdrop-blur-xs"
                >
                  <span
                    class="text-[11px] text-muted-foreground block font-medium mb-0.5"
                  >
                    AniList Skoru
                  </span>

                  <div
                    class="flex items-center justify-center gap-1 font-extrabold text-emerald-500 text-sm"
                  >
                    <UIcon
                      name="i-lucide-star"
                      class="w-3.5 h-3.5 fill-current"
                    />
                    {{ serie.anilistScore ? serie.anilistScore.toFixed(1) : "-" }}
                  </div>
                </div>

                <div
                  class="p-2.5 rounded-xl bg-muted/40 ring-1 ring-default/30 backdrop-blur-xs"
                >
                  <span
                    class="text-[11px] text-muted-foreground block font-medium mb-0.5"
                  >
                    MAL Skoru
                  </span>

                  <div
                    class="flex items-center justify-center gap-1 font-extrabold text-amber-500 text-sm"
                  >
                    <UIcon
                      name="i-lucide-star"
                      class="w-3.5 h-3.5 fill-current"
                    />
                    {{ serie.malScore || "-" }}
                  </div>
                </div>
              </div>

              <div
                class="p-3 rounded-xl bg-muted/40 ring-1 ring-default/30 text-xs font-medium flex items-center justify-between"
              >
                <span class="text-muted-foreground"> Sitedeki Durum: </span>

                <span class="font-bold text-primary">
                  {{
                    serie.uploadStatus
                      ?.replaceAll("uploading", "Yükleniyor")
                      .replaceAll("completed", "Tamamlandı")
                      .replaceAll("hiatus", "Ara Verildi")
                      .replaceAll("cancelled", "İptal Edildi") || "Belirtilmedi"
                  }}
                </span>
              </div>

              <div
                class="text-xs space-y-1.5 pt-2 text-muted-foreground bg-muted/20 p-3 rounded-xl ring-1 ring-default/20"
              >
                <p
                  v-if="serie.malStatus"
                  class="flex justify-between items-center"
                >
                  <span>Orijinal Durum:</span>

                  <b class="text-foreground font-semibold">
                    {{
                      serie.malStatus
                        .replaceAll("Publishing", "Yayınlanıyor")
                        .replaceAll("Finished", "Tamamlandı")
                        .replaceAll("On Hiatus", "Ara Verildi")
                        .replaceAll("Not yet published", "Yayınlanmadı")
                    }}
                  </b>
                </p>

                <p
                  v-if="serie.malAuthors?.length"
                  class="flex justify-between items-center gap-2 truncate"
                >
                  <span>Yazar:</span>

                  <b class="text-foreground font-semibold truncate">
                    {{
                      serie.malAuthors
                        .map((a: any) => a.name)
                        .join(", ")
                    }}
                  </b>
                </p>
              </div>
            </div>
          </div>

          <div class="md:col-span-3 space-y-6">
            <div class="space-y-2 text-center md:text-left">
              <div
                class="flex flex-wrap items-center justify-center md:justify-start gap-2"
              >
                <UBadge
                  color="primary"
                  variant="solid"
                  size="md"
                  class="rounded-lg font-bold"
                >
                  {{ serie.type || "Manga" }}
                </UBadge>
              </div>

              <h1 class="text-3xl md:text-5xl font-black tracking-tight mt-1">
                {{ serie.title }}
              </h1>

              <h2
                v-if="serie.anilistTitle && serie.anilistTitle !== serie.title"
                class="text-base md:text-lg text-muted-foreground font-medium"
              >
                {{ serie.anilistTitle }}
              </h2>
            </div>

            <div
              class="flex flex-wrap items-center justify-center md:justify-start gap-2"
            >
              <UBadge
                v-for="tag in serie.tags"
                :key="tag"
                :color="
                  tag === 'Ödüllü'
                    ? 'warning'
                    : tag === 'Vahşet' || tag === 'Cinsellik'
                      ? 'error'
                      : tag == 'Adaptasyon' ? 'info' : 'neutral'
                "
                variant="subtle"
                size="md"
                class="rounded-lg"
              >
                {{ tag }}
              </UBadge>
            </div>

            <div class="space-y-2">
              <h3
                class="text-base font-bold flex items-center gap-2 text-foreground"
              >
                <UIcon
                  name="i-lucide-book-open"
                  class="text-primary w-5 h-5"
                />
                Özet
              </h3>

              <div class="relative">
                <div
                  ref="descriptionDesktopEl"
                  class="p-4 rounded-2xl bg-muted/40 ring-1 ring-default/30 leading-relaxed text-sm text-muted-foreground transition-[max-height] duration-500 ease-in-out overflow-hidden"
                  :class="isDescriptionExpanded ? 'max-h-[1000px]' : 'max-h-36'"
                >
                  {{
                    serie.description
                      || serie.anilistDescription
                      || "Bu seri için henüz bir açıklama eklenmemiş."
                  }}
                </div>

                <div
                  v-if="!isDescriptionExpanded && isDescriptionLong"
                  class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none rounded-b-2xl transition-opacity duration-300"
                  :class="isDescriptionExpanded ? 'opacity-0' : 'opacity-100'"
                />
              </div>

              <div
                v-if="isDescriptionLong"
                class="flex justify-end"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :icon="isDescriptionExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="font-semibold"
                  @click="void (isDescriptionExpanded = !isDescriptionExpanded)"
                >
                  {{ isDescriptionExpanded ? 'Devamını Gizle' : 'Devamını Oku' }}
                </UButton>
              </div>
            </div>

            <div
              v-if="serie.notes && serie.notes.length"
              class="space-y-2"
            >
              <h3
                class="text-base font-bold text-amber-500 flex items-center gap-2"
              >
                <UIcon
                  name="i-lucide-sticky-note"
                  class="w-5 h-5"
                />
                Editör Notları
              </h3>

              <div class="relative">
                <div
                  class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm prose dark:prose-invert prose-amber max-w-none transition-[max-height] duration-500 ease-in-out overflow-hidden"
                  :class="isNotesExpanded ? 'max-h-[1000px]' : 'max-h-24'"
                >
                  <PortableText
                    :value="serie.notes"
                    :components="customComponents"
                  />
                </div>

                <div
                  v-if="!isNotesExpanded && isNotesLong"
                  class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none rounded-b-2xl transition-opacity duration-300"
                  :class="isNotesExpanded ? 'opacity-0' : 'opacity-100'"
                />
              </div>

              <div
                v-if="isNotesLong"
                class="flex justify-end"
              >
                <UButton
                  color="warning"
                  variant="ghost"
                  size="xs"
                  :icon="isNotesExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="font-semibold"
                  @click="void (isNotesExpanded = !isNotesExpanded)"
                >
                  {{ isNotesExpanded ? 'Devamını Gizle' : 'Devamını Oku' }}
                </UButton>
              </div>
            </div>

            <div
              v-if="serie.chapters && serie.chapters.length"
              class="flex flex-col sm:flex-row items-center gap-3 pt-1"
            >
              <UButton
                v-if="firstChapter"
                :to="`/chapter/${firstChapter._key}/${chapterRouteType(serie?.type)}`"
                color="primary"
                variant="solid"
                size="md"
                icon="i-lucide-play"
                class="w-full sm:w-1/2 justify-center rounded-xl font-bold py-3 shadow-md hover:scale-[1.005] active:scale-[0.98] transition-all"
              >
                İlk Bölüm
                {{ getChapterDisplayValue(firstChapter) ? `(${getChapterDisplayValue(firstChapter)})` : '' }}
              </UButton>

              <UButton
                v-if="lastChapter && lastChapter._key !== firstChapter?._key"
                :to="`/chapter/${lastChapter._key}/${chapterRouteType(serie?.type)}`"
                color="primary"
                variant="soft"
                size="md"
                icon="i-lucide-fast-forward"
                class="w-full sm:w-1/2 justify-center rounded-xl font-bold py-3 hover:scale-[1.005] active:scale-[0.98] transition-all"
              >
                Son Bölüm
                {{ getChapterDisplayValue(lastChapter) ? `(${getChapterDisplayValue(lastChapter)})` : '' }}
              </UButton>
            </div>

            <div
              id="chapters-section"
              class="space-y-4 pt-4"
            >
              <div
                class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-3"
              >
                <h3 class="text-xl font-black flex items-center gap-2">
                  <UIcon
                    name="i-lucide-layers"
                    class="text-primary"
                  />
                  Bölümler

                  <UBadge
                    color="neutral"
                    variant="soft"
                    size="md"
                    class="rounded-md font-bold"
                  >
                    {{ serie.chapters?.length || 0 }} Bölüm
                  </UBadge>
                </h3>

                <div
                  v-if="serie.chapters && serie.chapters.length"
                  class="flex flex-wrap items-center gap-2"
                >
                  <UInput
                    v-model="chapterSearchQuery"
                    icon="i-lucide-search"
                    placeholder="Bölüm ara..."
                    size="sm"
                    color="neutral"
                    variant="outline"
                    class="w-full sm:w-48 rounded-xl"
                    clearable
                  />

                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    :icon="chapterSortOrder === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'"
                    class="rounded-xl font-medium"
                    @click="void (chapterSortOrder = chapterSortOrder === 'asc' ? 'desc' : 'asc')"
                  >
                    {{ chapterSortOrder === 'asc' ? 'Önce En Eski' : 'Önce En Yeni' }}
                  </UButton>

                  <div
                    class="flex items-center gap-0.5 p-1 bg-muted/60 rounded-xl ring-1 ring-default/20"
                  >
                    <UButton
                      icon="i-lucide-layout-grid"
                      :variant="chapterViewMode === 'grid' ? 'solid' : 'ghost'"
                      color="primary"
                      size="xs"
                      class="rounded-lg"
                      @click="void (chapterViewMode = 'grid')"
                    />
                    <UButton
                      icon="i-lucide-layout-list"
                      :variant="chapterViewMode === 'list' ? 'solid' : 'ghost'"
                      color="primary"
                      size="xs"
                      class="rounded-lg"
                      @click="void (chapterViewMode = 'list')"
                    />
                    <UButton
                      icon="i-lucide-layout-template"
                      :variant="chapterViewMode === 'compact' ? 'solid' : 'ghost'"
                      color="primary"
                      size="xs"
                      class="rounded-lg"
                      @click="void (chapterViewMode = 'compact')"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="volumeChapterGroups.length"
                class="space-y-6"
              >
                <div
                  v-for="group in volumeChapterGroups"
                  :key="group.volumeKey"
                  class="space-y-3"
                >
                  <h4
                    class="text-sm font-bold text-foreground flex items-center justify-between border-b border-border/30 pb-2 cursor-pointer select-none"
                    @click="toggleVolume(group.volumeKey)"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon
                        name="i-lucide-book"
                        class="w-4 h-4 text-primary"
                      />
                      {{ group.volumeTitle }}

                      <UBadge
                        color="neutral"
                        variant="soft"
                        size="xs"
                        class="rounded-md font-semibold ml-1"
                      >
                        {{ group.chapters.length }} Bölüm
                      </UBadge>
                    </div>
                    <UIcon
                      :name="expandedVolumes.includes(String(group.volumeKey)) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="w-5 h-5 text-muted-foreground"
                    />
                  </h4>

                  <div
                    class="grid transition-[grid-template-rows] duration-500 ease-in-out"
                    :class="expandedVolumes.includes(String(group.volumeKey)) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                  >
                    <div
                      class="overflow-hidden min-h-0"
                    >
                      <div
                        :class="[
                          {
                            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3': chapterViewMode === 'grid',
                            'flex flex-col gap-2': chapterViewMode === 'list',
                            'flex flex-wrap gap-2': chapterViewMode === 'compact'
                          }
                        ]"
                      >
                        <UCard
                          v-for="chapter in group.chapters"
                          :key="chapter.id"
                          class="transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 cursor-pointer group rounded-2xl mx-0.5 mt-0.5"
                          :class="{ 'flex-auto min-w-[120px]': chapterViewMode === 'compact' }"
                          :ui="{ body: chapterViewMode === 'compact' ? 'p-3' : 'p-4' }"
                        >
                          <NuxtLink
                            :to="`/chapter/${chapter._key}/${chapterRouteType(serie?.type)}`"
                            class="flex items-center justify-between gap-2"
                          >
                            <div class="truncate pr-1 min-w-0 flex-1">
                              <p
                                class="font-bold text-sm group-hover:text-primary transition-colors truncate"
                              >
                                {{ getChapterLabel(chapter) }}
                              </p>

                              <p
                                v-if="chapterViewMode !== 'compact'"
                                class="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate"
                              >
                                <UIcon
                                  name="i-lucide-languages"
                                  class="w-3 h-3 text-muted-foreground/70 shrink-0"
                                />
                                <span class="truncate">{{ chapter.source?.name || "Bilinmeyen Çevirmen" }}</span>
                              </p>
                            </div>

                            <UButton
                              v-if="chapterViewMode !== 'compact'"
                              size="xs"
                              color="primary"
                              variant="ghost"
                              icon="i-lucide-chevron-right"
                              square
                              class="group-hover:translate-x-0.5 transition-transform shrink-0"
                            />
                          </NuxtLink>
                        </UCard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="text-center py-12 rounded-2xl bg-muted/30 border border-dashed border-default"
              >
                <UIcon
                  name="i-lucide-folder-open"
                  class="w-8 h-8 text-muted-foreground mb-2 mx-auto"
                />

                <p class="text-sm font-medium text-muted-foreground">
                  {{ chapterSearchQuery ? 'Aramanıza uygun bölüm bulunamadı.' : 'Henüz bu seriye ait bir bölüm yüklenmemiş.' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!showAgeGate && serie?.anilistRelations && serie?.anilistRelations.length"
        class="mt-12 px-4 md:px-0"
      >
        <USeparator
          position="start"
          class="font-black text-2xl md:text-3xl mb-6"
        >
          <span class="mr-3 flex items-center gap-2">
            <UIcon
              name="i-lucide-link"
              class="text-primary w-6 h-6"
            />
            İlgili Seriler
          </span>
        </USeparator>

        <swiper-container
          :key="'relations-' + String(serie?.id)"
          :slides-per-view="2"
          :breakpoints="{
            480: { slidesPerView: 3, spaceBetween: 12 },
            640: { slidesPerView: 4, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 6, spaceBetween: 20 },
            1280: { slidesPerView: 7, spaceBetween: 20 }
          }"
          :space-between="10"
          :mousewheel="true"
          :free-mode="true"
        >
          <swiper-slide
            v-for="relation in serie?.anilistRelations"
            :key="relation.id"
          >
            <NuxtLink
              :to="`/title/${relation.id}`"
              class="group flex flex-col gap-2 h-full"
            >
              <div class="aspect-2/3 rounded-xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  :src="relation.cover || serie?.cover"
                  :alt="relation.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
              </div>

              <div class="space-y-1 px-0.5 flex flex-col flex-1">
                <div class="self-start">
                  <UBadge
                    :color="
                      relation.relationType === 'SEQUEL' ? 'primary'
                      : relation.relationType === 'PREQUEL' ? 'info'
                        : relation.relationType === 'ALTERNATIVE' ? 'warning'
                          : 'neutral'
                    "
                    variant="subtle"
                    size="xs"
                    class="rounded-md font-semibold text-[10px]"
                  >
                    {{
                      relation.relationType === 'SEQUEL' ? 'Devam'
                      : relation.relationType === 'PREQUEL' ? 'Önceki'
                        : relation.relationType === 'SIDE_STORY' ? 'Yan Hikaye'
                          : relation.relationType === 'ALTERNATIVE' ? 'Alternatif'
                            : relation.relationType === 'PARENT' ? 'Ana Seri'
                              : relation.relationType === 'ADAPTATION' ? 'Adaptasyon'
                                : relation.relationType === 'SPIN_OFF' ? 'Spin-off'
                                  : relation.relationType === 'CHARACTER' ? 'Karakter'
                                    : relation.relationType === 'SUMMARY' ? 'Özet'
                                      : relation.relationType === 'SOURCE' ? 'Kaynak'
                                        : 'İlgili'
                    }}
                  </UBadge>
                </div>

                <p class="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {{ relation.title }}
                </p>

                <p class="text-[10px] text-muted-foreground mt-auto">
                  {{ relation.type }}
                </p>
              </div>
            </NuxtLink>
          </swiper-slide>
        </swiper-container>
      </div>

      <USeparator
        v-if="!showAgeGate"
        position="start"
        class="font-black text-2xl md:text-3xl mt-12 mb-4 px-4 md:px-0"
      >
        <span class="mr-3 flex items-center gap-2">
          <UIcon
            name="i-lucide-sparkles"
            class="text-amber-500 w-6 h-6"
          />
          Önerilen Seriler
        </span>
      </USeparator>

      <CardRecommendations
        v-if="!showAgeGate && recommendations.length"
        :items="recommendations"
      />

      <div
        v-if="serie && showAgeGate"
        class="min-h-[70vh] flex items-center justify-center px-4 py-12"
      >
        <UCard
          class="w-full max-w-lg"
          :ui="{ body: 'p-6 sm:p-8' }"
        >
          <div class="space-y-6 text-center">
            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error"
            >
              <UIcon
                name="i-lucide-shield-alert"
                class="h-7 w-7"
              />
            </div>

            <div class="space-y-2">
              <h1 class="text-2xl font-black text-foreground">
                18+ İçerik Uyarısı
              </h1>

              <p class="text-sm leading-relaxed text-muted-foreground">
                Bu seri
                <span class="font-semibold text-foreground">
                  {{ warningTags.join(' ve ') }}
                </span>
                etiker(ler)i nedeniyle yetişkin içerik barındırabilir. Devam etmek için
                18 yaşından büyük olduğunuzu beyan etmek durumundasınız.
              </p>
            </div>

            <div
              class="rounded-xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
            >
              {{ serie.title }}
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                class="rounded-xl"
                @click="rejectAgeGate"
              >
                18 Yaşından Küçüğüm
              </UButton>

              <UButton
                color="primary"
                variant="solid"
                size="lg"
                class="rounded-xl"
                @click="acceptAgeGate"
              >
                18 Yaşından Büyüğüm, Devam Et
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
