<script setup>
const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()

breadcrumbs.value = [
  { label: 'Ana Sayfa' }
]

const { data: heroData, pending: heroPending } = await useFetch(`${config.public.backend.baseUrl}/api/mangaList?filterType=POPULAR&limit=12`, { lazy: true, server: false })

const slides = computed(() => {
  if (!heroData.value) return []

  let list = []
  if (Array.isArray(heroData.value)) {
    list = heroData.value
  } else if (heroData.value.data && Array.isArray(heroData.value.data)) {
    list = heroData.value.data
  } else if (heroData.value.results && Array.isArray(heroData.value.results)) {
    list = heroData.value.results
  } else {
    return []
  }

  return list.map(item => ({
    title: item.anilist_title,
    type: item.anilist_type?.replaceAll('MANGA', 'Manga').replaceAll('NOVEL', 'Hafif Roman').replaceAll('ONE_SHOT', 'One-Shot') || '',
    year: item.mal_year,
    score: String(Number(item.anilist_score) / 10),
    description: item.has_local_content ? item.sanity_description : item.anilist_description,
    banner: item.anilist_banner_image,
    id: item.mal_id
  }))
})

const { data: createdData } = await useFetch(`${config.public.backend.baseUrl}/api/latestTitles`, { lazy: true, server: false })

const createdItems = computed(() => {
  if (!createdData.value) return []

  return createdData.value.map(item => ({
    title: item.title,
    dateStamp: item._createdAt,
    cover: item.coverImage,
    id: item.myAnimeListId,
    type: 'title'
  }))
})

const { data: latestChaptersData } = await useFetch(`${config.public.backend.baseUrl}/api/latestChapters`, { lazy: true, server: false })

const latestChaptersItems = computed(() => {
  if (!latestChaptersData.value) return []

  return latestChaptersData.value.map(item => ({
    title: 'Cilt ' + item.volumeNumber + ' Bölüm ' + item.chapterNumber + ': ' + item.title,
    dateStamp: item._createdAt,
    cover: item.lightNovel?.coverImage?.url || item.manga?.coverImage?.url,
    id: item._id,
    type: 'chapter',
    titleType: item.lightNovel ? 'novel' : 'manga'
  }))
})
</script>

<template>
  <main>
    <USkeleton
      v-if="heroPending"
      class="relative h-[80vh] overflow-hidden rounded-3xl"
    />
    <HeroSlider
      v-else
      :slides="slides"
    />
    <USeparator
      position="start"
      class="font-bold text-3xl mt-5 mb-3"
    >
      <span class="mr-3"> Son Eklenen Bölümler </span>
    </USeparator>
    <CardSanity
      variant="chapter"
      :items="latestChaptersItems"
    />
    <USeparator
      position="start"
      class="font-bold text-3xl mt-5 mb-3"
    >
      <span class="mr-3"> Son Oluşturulan İçerikler </span>
    </USeparator>
    <CardSanity
      :items="createdItems"
    />
  </main>
</template>
