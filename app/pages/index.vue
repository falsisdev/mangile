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
    type: item.mal_type?.replaceAll('MANGA', 'Manga').replaceAll('NOVEL', 'Hafif Roman').replaceAll('ONE_SHOT', 'One-Shot') || item.anilist_type?.replaceAll('MANGA', 'Manga').replaceAll('NOVEL', 'Hafif Roman').replaceAll('ONE_SHOT', 'One-Shot') || 'Manga',
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

const tags = ['Ödüllü', 'Macera', 'Dram', 'Fantezi']

const titlesByTagData = await Promise.all(
  tags.map(tag =>
    useFetch(`${config.public.backend.baseUrl}/api/titlesByTag?tag=${encodeURIComponent(tag)}`, {
      lazy: true,
      server: false
    })
  )
)

const titlesByTagItems = computed(() =>
  titlesByTagData.map(({ data }) =>
    (data.value || []).map(item => ({
      title: item.title,
      dateStamp: item._createdAt,
      cover: item.coverImage.url,
      id: item.myAnimeListId,
      type: 'tagTitle'
    }))
  )
)
</script>

<template>
  <main>
    <USkeleton
      v-if="heroPending"
      class="relative h-[320px] xs:h-[360px] sm:h-[420px] md:h-[500px] lg:h-[560px] xl:h-[620px] overflow-hidden rounded-2xl md:rounded-3xl"
    />
    <HeroSlider
      v-else
      :slides="slides"
    />
    <USeparator
      position="start"
      class="font-black text-lg sm:text-xl md:text-2xl mt-5 mb-2.5 sm:mt-7 sm:mb-3.5"
    >
      <span class="mr-2 sm:mr-3"> Son Eklenen Bölümler </span>
    </USeparator>
    <CardSanity
      variant="chapter"
      :items="latestChaptersItems"
    />
    <USeparator
      position="start"
      class="font-black text-lg sm:text-xl md:text-2xl mt-5 mb-2.5 sm:mt-7 sm:mb-3.5"
    >
      <span class="mr-2 sm:mr-3"> Son Oluşturulan İçerikler </span>
    </USeparator>
    <CardSanity
      :items="createdItems"
    />

    <template
      v-for="(items, index) in titlesByTagItems"
      :key="tags[index]"
    >
      <USeparator
        v-if="items.length"
        position="start"
        class="font-black text-lg sm:text-xl md:text-2xl mt-5 mb-2.5 sm:mt-7 sm:mb-3.5"
      >
        <span class="mr-2 sm:mr-3">{{ tags[index] }} Türünde Seriler</span>
      </USeparator>
      <CardSanity
        v-if="items.length"
        :items="items"
      />
    </template>
  </main>
</template>
