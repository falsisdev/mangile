<script setup lang="ts">
interface ExploreCard {
  id: number;
  title: string;
  cover: string;
  type: string;
  year: number;
}

const breadcrumbs = useBreadcrumbs();
const config = useRuntimeConfig();

breadcrumbs.value = [{ label: "Ana Sayfa", to: "/" }, { label: "Keşfet" }];

const page = ref(1);

const { data: titles, status } = await useLazyFetch<ExploreCard[]>(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: "exploreTitles",
    query: computed(() => ({
      filterType: "POPULARITY_DESC",
      limit: 50,
      page: page.value || 1,
    })),
    transform: (data: any) => {
      const list = Array.isArray(data) ? data : data?.data || [];
      return list.map((title: any) => ({
        id: title.mal_id,
        title: title.anilist_title,
        type:
          title.mal_type
            ?.replaceAll("MANGA", "Manga")
            .replaceAll("NOVEL", "Hafif Roman")
            .replaceAll("ONE_SHOT", "One-Shot") || "Manga",
        year: title.mal_year,
        cover: title.anilist_cover_image,
      }));
    },
  },
);
</script>

<template>
  <div class="mx-20">
    <div class="flex flex-row mb-2">
      <div>
        <h1 class="text-3xl font-bold">Keşfet</h1>
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
          :title="item.title"
          :cover="item.cover"
          :type="item.type"
          :year="item.year"
          :id="item.id"
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
