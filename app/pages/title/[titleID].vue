<script setup lang="ts">
import { PortableText } from '@portabletext/vue'

interface ChapterData {
  id: number | string
  _key: string
  title?: string
  chapter_number?: number | string
  source?: { name?: string }
  [key: string]: unknown
}

interface SerieData {
  id: number
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
  anilistRelations?: Record<string, unknown>[]
  malID?: number
  malStatus?: string
  malScore?: number
  malAuthors?: Array<{ name: string }>
  malURL?: string
  notes?: Record<string, unknown>[]
  chapters?: ChapterData[]
}

interface RecommendationItem {
  id: number
  title: string
  cover: string
  type: string
}

const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()
const route = useRoute()
const titleId = computed(() => {
  const value = route.params.titleID
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
})
const titleApiBase = String(config.public.backend.baseUrl ?? '')

const { data: serie, status } = await useLazyAsyncData<SerieData | null>(
  'title-' + titleId.value,
  async () => {
    const id = titleId.value
    if (!id) return null

    try {
      const response = await fetch(
        `${titleApiBase}/api/manga/${encodeURIComponent(id)}`
      )
      if (!response.ok) throw new Error('Manga request failed')
      return (await response.json()) as SerieData
    } catch {
      const response = await fetch(
        `${titleApiBase}/api/lightNovel/${encodeURIComponent(id)}`
      )
      if (!response.ok) return null
      return (await response.json()) as SerieData
    }
  },
  {
    default: () => null,
    transform: (title: Record<string, unknown>): SerieData => ({
      id: title.id as number,
      title: title.sanity_title as string,
      type: (title.type as string)
        ?.replaceAll('manga', 'Manga')
        .replaceAll('lightNovel', 'Hafif Roman'),
      uploadStatus: title.uploadStatus as string,
      description: title.sanity_description as string,
      banner: title.sanity_banner as string,
      cover: title.sanity_cover as string,
      tags: title.sanity_tags as string[],
      anilistID: title.anilist_id as number,
      anilistTitle: title.anilist_title as string,
      anilistScore: Number(title.anilist_score as string) / 10 || 0,
      anilistBanner: title.anilist_banner as string,
      anilistCover: title.anilist_cover as string,
      anilistDescription: title.anilist_description as string,
      anilistRelations: title.anilist_relations as Record<string, unknown>[],
      malID: title.mal_id as number,
      malStatus: title.mal_status as string,
      malScore: title.mal_score as number,
      malAuthors: title.mal_authors as Array<{ name: string }>,
      malURL: title.mal_url as string,
      notes: title.notes as Record<string, unknown>[],
      chapters: (title.chapters as ChapterData[]) || []
    })
  }
)

const { data: recommendations } = await useLazyAsyncData<RecommendationItem[]>(
  'title-recommendations-' + titleId.value,
  async () => {
    const id = titleId.value
    if (!id) return []

    const response = await fetch(
      `${titleApiBase}/api/manga/${encodeURIComponent(id)}/recommendations`
    )
    if (!response.ok) return []
    return (await response.json()) as RecommendationItem[]
  },
  {
    default: () => [],
    transform: (items: Record<string, unknown>[] = []) =>
      items.map((item: Record<string, unknown>) => {
        const title = item.title as Record<string, unknown>
        const coverImage = item.coverImage as Record<string, unknown>
        return {
          id: item.idMal as number,
          title:
            (title?.english as string)
            || (title?.romaji as string)
            || (title?.native as string)
            || 'Bilinmeyen',
          cover: (coverImage?.extraLarge as string) || '',
          type:
            (item.type as string)
              ?.replaceAll('MANGA', 'Manga')
              .replaceAll('LIGHT_NOVEL', 'Hafif Roman') || 'Manga'
        }
      })
  }
)

const breadcrumbsList = computed(() => [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Seriler' },
  { label: serie.value?.title || serie.value?.anilistTitle || 'Yükleniyor...' }
])

const customComponents: Record<string, Record<string, unknown>> = {
  marks: {
    link: (
      props: Record<string, unknown>,
      context: Record<string, () => unknown>
    ) =>
      h(
        'a',
        {
          href: (props.value as Record<string, unknown>)?.href,
          class: 'text-primary hover:underline font-semibold',
          target: '_blank'
        },
        (context.slots?.default as (() => unknown) | undefined)?.()
      )
  }
}

const chapterRouteType = (type?: string) =>
  (type ?? 'manga').toLowerCase().replaceAll('hafif roman', 'novel')

const chapterViewMode = ref<'grid' | 'list' | 'compact'>('grid')
const chapterSortOrder = ref<'asc' | 'desc'>('asc')
const chapterSearchQuery = ref('')

const isDescriptionExpanded = ref(false)
const isNotesExpanded = ref(false)
const isChaptersExpanded = ref(false)
const chapterLimit = 12

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
  const rawValue =
    chapter.chapter_number
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

const allChaptersSortedAsc = computed(() => {
  if (!serie.value?.chapters) return []

  return [...serie.value.chapters].sort(
    (a, b) => getChapterNumber(a) - getChapterNumber(b)
  )
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
  const list =
    chapterSortOrder.value === 'asc'
      ? allChaptersSortedAsc.value
      : [...allChaptersSortedAsc.value].reverse()

  const query = chapterSearchQuery.value?.toLowerCase().trim()

  if (!query) return list

  return list.filter(ch => {
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

watchEffect(() => {
  breadcrumbs.value = breadcrumbsList.value
})

const bannerOpacity = ref(1)
const isMobile = ref(false)

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

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <UContainer class="space-y-8 relative pb-20 md:pb-0">
    <div v-if="status === 'pending'" class="space-y-8">
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
            <USkeleton v-for="i in 3" :key="i" class="h-6 w-16" />
          </div>

          <USkeleton class="h-24 w-full" />
        </div>
      </div>
    </div>

    <div v-else-if="serie && !showAgeGate" class="space-y-6">
      <div class="block md:hidden space-y-6 -mx-4 -mt-4">
        <div
          class="relative bg-muted/30 border-b border-border/40 pb-4 overflow-hidden"
        >
          <div class="relative h-56 w-full overflow-hidden">
            <img
              :src="serie.banner || serie.anilistBanner || serie.cover || serie.anilistCover"
              class="w-full h-full object-cover"
              alt="Banner"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/70 z-10"
            />
          </div>

          <div class="px-4 -mt-32 relative z-20 flex gap-4 items-end">
            <div
              class="w-32 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-background"
            >
              <img
                :src="serie.cover || serie.anilistCover"
                class="w-full h-full object-cover"
                :alt="serie.title"
              />
            </div>

            <div class="space-y-1.5 pb-1 overflow-hidden">
              <UBadge color="primary" size="sm" class="font-bold rounded-md">
                {{ serie.type || "Manga" }}
              </UBadge>

              <h1
                class="text-2xl font-black text-foreground leading-tight drop-shadow-md line-clamp-2"
              >
                {{ serie.title }}
              </h1>

              <p
                v-if="serie.anilistTitle && serie.anilistTitle !== serie.title"
                class="text-xs text-muted-foreground truncate"
              >
                {{ serie.anilistTitle }}
              </p>
            </div>
          </div>

          <div class="px-4 pt-4 flex flex-wrap gap-2 items-center">
            <div
              class="px-3 py-1 rounded-xl bg-muted/80 ring-1 ring-default/30 text-xs font-bold flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-star"
                class="w-4 h-4 text-emerald-500 fill-current"
              />
              <span
              >{{ serie.anilistScore ? serie.anilistScore.toFixed(1) : '-' }}</span
              >
              <span class="text-[10px] text-muted-foreground font-normal"
              >AniList</span
              >
            </div>

            <div
              class="px-3 py-1 rounded-xl bg-muted/80 ring-1 ring-default/30 text-xs font-bold flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-star"
                class="w-4 h-4 text-amber-500 fill-current"
              />
              <span>{{ serie.malScore || '-' }}</span>
              <span class="text-[10px] text-muted-foreground font-normal"
              >MAL</span
              >
            </div>

            <div
              class="px-3 py-1 rounded-xl bg-muted/80 ring-1 ring-default/30 text-xs font-bold flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-chart-no-axes-column-increasing"
                class="w-4 h-4 text-primary fill-current"
              />
              {{ serie.uploadStatus.replaceAll("uploading", "Yükleniyor").replaceAll("completed", "Tamamlandı") || "Yükleniyor" }}
            </div>

            <UBadge
              v-for="tag in serie.tags"
              :key="tag"
              color="neutral"
              variant="subtle"
              size="md"
              class="rounded-lg px-2"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <div class="px-4 space-y-5">
          <div
            class="space-y-2 bg-muted/20 p-4 rounded-2xl ring-1 ring-default/20"
          >
            <h3
              class="text-sm font-bold text-foreground flex items-center gap-2"
            >
              <UIcon name="i-lucide-book-open" class="text-primary w-4 h-4" />
              Özet
            </h3>

            <div class="relative">
              <p
                class="text-xs text-muted-foreground leading-relaxed transition-[max-height] duration-500 ease-in-out overflow-hidden"
                :class="isDescriptionExpanded ? 'max-h-[1000px]' : 'max-h-20'"
              >
                {{ serie.description || serie.anilistDescription || "Bu seri için açıklama eklenmemiş." }}
              </p>

              <div
                v-if="!isDescriptionExpanded"
                class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"
              />
            </div>

            <button
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
            <h3
              class="text-sm font-bold text-amber-500 flex items-center gap-2"
            >
              <UIcon name="i-lucide-sticky-note" class="w-4 h-4" />
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
                v-if="!isNotesExpanded"
                class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent pointer-events-none"
              />
            </div>

            <button
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
                <h3 class="text-xl font-black text-foreground">Bölümler</h3>

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
                @click="chapterSortOrder = chapterSortOrder === 'asc' ? 'desc' : 'asc'"
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

            <div v-if="sortedChapters.length" class="space-y-3 pt-1">
              <div class="relative">
                <div
                  class="flex flex-col gap-2 transition-[max-height] duration-300 ease-in-out overflow-hidden"
                  :class="isChaptersExpanded || chapterSearchQuery.trim() ? 'max-h-[25000px]' : 'max-h-[440px]'"
                >
                  <UCard
                    v-for="chapter in sortedChapters"
                    :key="chapter.id"
                    class="shrink-0 transition-all hover:border-primary/40 cursor-pointer rounded-xl mx-1 mt-0.5"
                    :ui="{ body: { padding: 'p-3' } }"
                  >
                    <NuxtLink
                      :to="`/chapter/${chapter._key}/${chapterRouteType(serie?.type)}`"
                      class="flex items-center justify-between gap-2"
                    >
                      <div class="truncate pr-1">
                        <p class="font-bold text-xs text-foreground truncate">
                          {{ chapter.title || `Bölüm ${chapter.chapter_number || chapter.id}` }}
                        </p>

                        <p
                          class="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1"
                        >
                          <UIcon
                            name="i-lucide-languages"
                            class="w-3 h-3 text-muted-foreground/70"
                          />
                          {{ chapter.source?.name || "Bilinmeyen Çevirmen" }}
                        </p>
                      </div>

                      <UIcon
                        name="i-lucide-chevron-right"
                        class="w-4 h-4 text-muted-foreground shrink-0"
                      />
                    </NuxtLink>
                  </UCard>
                </div>

                <div
                  v-if="!isChaptersExpanded && sortedChapters.length > chapterLimit && !chapterSearchQuery.trim()"
                  class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none z-10"
                />
              </div>

              <div
                v-if="sortedChapters.length > chapterLimit && !chapterSearchQuery.trim()"
                class="pt-2 flex justify-center"
              >
                <UButton
                  :icon="isChaptersExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  variant="soft"
                  color="primary"
                  size="xs"
                  class="rounded-lg px-5 font-semibold"
                  @click="isChaptersExpanded = !isChaptersExpanded"
                >
                  {{ isChaptersExpanded ? 'Daha Az Göster' : `Tümünü Göster (${sortedChapters.length - chapterLimit} bölüm daha)` }}
                </UButton>
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
        />
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
            />
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
                    .replaceAll("uploading", "Yükleniyor")
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
              <UIcon name="i-lucide-book-open" class="text-primary w-5 h-5" />
              Özet
            </h3>

            <div class="relative">
              <div
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
                class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none rounded-b-2xl transition-opacity duration-300"
                :class="isDescriptionExpanded ? 'opacity-0' : 'opacity-100'"
              />
            </div>

            <div
              v-if="(serie.description || serie.anilistDescription || '').length > 150"
              class="flex justify-end"
            >
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                :icon="isDescriptionExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="font-semibold"
                @click="isDescriptionExpanded = !isDescriptionExpanded"
              >
                {{ isDescriptionExpanded ? 'Devamını Gizle' : 'Devamını Oku' }}
              </UButton>
            </div>
          </div>

          <div v-if="serie.notes && serie.notes.length" class="space-y-2">
            <h3
              class="text-base font-bold text-amber-500 flex items-center gap-2"
            >
              <UIcon name="i-lucide-sticky-note" class="w-5 h-5" />
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
                class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none rounded-b-2xl transition-opacity duration-300"
                :class="isNotesExpanded ? 'opacity-0' : 'opacity-100'"
              />
            </div>

            <div class="flex justify-end">
              <UButton
                color="warning"
                variant="ghost"
                size="xs"
                :icon="isNotesExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="font-semibold"
                @click="isNotesExpanded = !isNotesExpanded"
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

          <div id="chapters-section" class="space-y-4 pt-4">
            <div
              class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-3"
            >
              <h3 class="text-xl font-black flex items-center gap-2">
                <UIcon name="i-lucide-layers" class="text-primary" />
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
                  @click="chapterSortOrder = chapterSortOrder === 'asc' ? 'desc' : 'asc'"
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
                    @click="chapterViewMode = 'grid'"
                  />
                  <UButton
                    icon="i-lucide-layout-list"
                    :variant="chapterViewMode === 'list' ? 'solid' : 'ghost'"
                    color="primary"
                    size="xs"
                    class="rounded-lg"
                    @click="chapterViewMode = 'list'"
                  />
                  <UButton
                    icon="i-lucide-layout-template"
                    :variant="chapterViewMode === 'compact' ? 'solid' : 'ghost'"
                    color="primary"
                    size="xs"
                    class="rounded-lg"
                    @click="chapterViewMode = 'compact'"
                  />
                </div>
              </div>
            </div>

            <div v-if="sortedChapters.length" class="space-y-4">
              <div class="relative">
                <div
                  class="transition-[max-height] duration-500 ease-in-out overflow-hidden"
                  :class="[
                isChaptersExpanded || chapterSearchQuery.trim()
                  ? 'max-h-[25000px]'
                  : 'max-h-[580px]',
                {
                  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3': chapterViewMode === 'grid',
                  'flex flex-col gap-2': chapterViewMode === 'list',
                  'flex flex-wrap gap-2': chapterViewMode === 'compact'
                }
              ]"
                >
                  <UCard
                    v-for="chapter in sortedChapters"
                    :key="chapter.id"
                    class="transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 cursor-pointer group rounded-2xl mx-0.5 mt-0.5"
                    :class="{ 'flex-auto min-w-[120px]': chapterViewMode === 'compact' }"
                    :ui="{ body: { padding: chapterViewMode === 'compact' ? 'p-3' : 'p-4' } }"
                  >
                    <NuxtLink
                      :to="`/chapter/${chapter._key}/${chapterRouteType(serie?.type)}`"
                      class="flex items-center justify-between gap-2"
                    >
                      <div class="truncate pr-1">
                        <p
                          class="font-bold text-sm group-hover:text-primary transition-colors truncate"
                        >
                          {{ chapter.title || `Bölüm ${chapter.chapter_number || chapter.id}` }}
                        </p>

                        <p
                          v-if="chapterViewMode !== 'compact'"
                          class="text-xs text-muted-foreground mt-1 flex items-center gap-1"
                        >
                          <UIcon
                            name="i-lucide-languages"
                            class="w-3 h-3 text-muted-foreground/70"
                          />
                          {{ chapter.source?.name || "Bilinmeyen Çevirmen" }}
                        </p>
                      </div>

                      <UButton
                        v-if="chapterViewMode !== 'compact'"
                        size="xs"
                        color="primary"
                        variant="ghost"
                        icon="i-lucide-chevron-right"
                        square
                        class="group-hover:translate-x-0.5 transition-transform"
                      />
                    </NuxtLink>
                  </UCard>
                </div>

                <div
                  v-if="!isChaptersExpanded && sortedChapters.length > chapterLimit && !chapterSearchQuery.trim()"
                  class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none transition-opacity duration-300"
                />
              </div>

              <div
                v-if="sortedChapters.length > chapterLimit && !chapterSearchQuery.trim()"
                class="mt-4 flex justify-center"
              >
                <UButton
                  :icon="isChaptersExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  variant="soft"
                  color="primary"
                  class="rounded-xl px-6 font-semibold"
                  @click="isChaptersExpanded = !isChaptersExpanded"
                >
                  {{ isChaptersExpanded ? 'Daha Az Göster' : `Tümünü Göster (${sortedChapters.length - chapterLimit} bölüm daha)` }}
                </UButton>
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

      <USeparator
        position="start"
        class="font-black text-2xl md:text-3xl mt-12 mb-4 px-4 md:px-0"
      >
        <span class="mr-3 flex items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="text-amber-500 w-6 h-6" />
          Önerilen Seriler
        </span>
      </USeparator>

      <CardRecommendations
        v-if="recommendations.length"
        :items="recommendations"
      />
    </div>
  </UContainer>

  <div
    v-if="serie && showAgeGate"
    class="min-h-[70vh] flex items-center justify-center px-4 py-12"
  >
    <UCard class="w-full max-w-lg" :ui="{ body: { padding: 'p-6 sm:p-8' } }">
      <div class="space-y-6 text-center">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error"
        >
          <UIcon name="i-lucide-shield-alert" class="h-7 w-7" />
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
</template>
