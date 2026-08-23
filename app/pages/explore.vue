<script setup lang="ts">
interface ExploreCard {
  id: number
  title: string
  cover: string
  type: string
  year: number
}

const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()

breadcrumbs.value = [{ label: 'Ana Sayfa', to: '/' }, { label: 'Keşfet' }]

const page = ref(1)

const { data: titles } = await useLazyFetch<ExploreCard[]>(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: 'exploreTitles',
    query: computed(() => ({
      filterType: 'POPULARITY_DESC',
      limit: 50,
      page: page.value || 1
    })),
    transform: (data: unknown) => {
      const list = Array.isArray(data) ? data : (data as Record<string, unknown>)?.data || []
      return (list as Record<string, unknown>[]).map((title: Record<string, unknown>) => ({
        id: title.mal_id,
        title: title.anilist_title,
        type:
          (title.mal_type as string)
            ?.replaceAll('MANGA', 'Manga')
            .replaceAll('NOVEL', 'Hafif Roman')
            .replaceAll('ONE_SHOT', 'One-Shot') || 'Manga',
        year: title.mal_year,
        cover: title.anilist_cover_image
      }))
    }
  }
)
</script>

<template>
  <div class="mx-20">
    <div class="flex flex-row mb-2">
      <div>
        <h1 class="text-3xl font-bold">
          Keşfet
        </h1>
        <p class="text-sm">
          Mangile'da bulunan tüm serileri ara, filtrele, keşfet!
        </p>
      </div>
    </div>
    <USeparator />

    <div class="flex flex-row flex-wrap my-2">
      <NuxtLink
        v-for="item of titles"
        :key="item.title"
        :to="`/title/${item.id}`"
      >
        <CardExplore
          :id="item.id"
          :title="item.title"
          :cover="item.cover"
          :type="item.type"
          :year="item.year"
          class="m-1"
        />
      </NuxtLink>
    </div>

    <USeparator />
    <div class="flex justify-center w-full">
      <UPagination
        v-model:page="page"
        active-color="primary"
        active-variant="soft"
        :total="1000"
        class="mt-2"
      />
    </div>
  </div>
</template>
