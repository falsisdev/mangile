<script setup>
const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()
const { user } = useAuthUser()
const { localHistory, cloudHistory } = useReadingHistory()

const continueReadingItems = computed(() => {
  if (user.value) {
    return cloudHistory.value.length > 0 ? cloudHistory.value : localHistory.value
  }
  return localHistory.value.slice(0, 5)
})

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

  return latestChaptersData.value.map((item) => {
    const vol = item.volumeNumber
    const num = item.chapterNumber
    const t = item.title
    const label = [
      vol !== null && vol !== undefined && vol !== '' ? `Cilt ${vol}` : null,
      num !== null && num !== undefined && num !== '' ? `Bölüm ${num}` : null,
      t ? `: ${t}` : null
    ].filter(Boolean).join(' ')

    return {
      title: label || 'Bilinmeyen Bölüm',
      dateStamp: item._createdAt,
      cover: item.lightNovel?.coverImage?.url || item.manga?.coverImage?.url,
      id: item._id,
      type: 'chapter',
      titleType: item.lightNovel ? 'novel' : 'manga'
    }
  })
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
      class="relative h-[340px] xs:h-[380px] sm:h-[440px] md:h-[500px] lg:h-[560px] xl:h-[620px] overflow-hidden rounded-2xl md:rounded-3xl"
    />
    <HeroSlider
      v-else
      :slides="slides"
    />

    <!-- Kaldığın Yerden Devam Et / Yerel Kayıtlardan Devam Et Section -->
    <section
      v-if="continueReadingItems.length > 0"
      class="mt-5 sm:mt-7 mb-2 sm:mb-4"
    >
      <div class="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
        <div class="flex items-center gap-2 flex-wrap">
          <UIcon
            name="i-lucide-history"
            class="size-5 sm:size-6 text-primary shrink-0"
          />
          <h2 class="font-black text-lg sm:text-xl md:text-2xl text-foreground">
            {{ user ? 'Kaldığın Yerden Devam Et' : 'Yerel Kayıtlardan Devam Et' }}
          </h2>
          <span
            v-if="!user"
            class="text-[11px] text-muted flex items-center gap-1.5"
          >
            <span>•</span>
            <span>Tarayıcı geçmişi (En fazla 5 kayıt)</span>
            <NuxtLink
              to="/sign-in"
              :external="true"
              class="text-primary font-bold hover:underline hidden sm:inline"
            >
              (Giriş Yaparak Yükselt)
            </NuxtLink>
          </span>
        </div>

        <NuxtLink
          to="/history"
          class="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Tümünü Gör</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-3"
          />
        </NuxtLink>
      </div>

      <CardContinueReading :items="continueReadingItems" />
    </section>

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
