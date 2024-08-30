<script setup>
// Öne çıkan mangalar
let highlights = ref([]);

const { data: highlightsData } = await useAsyncData(
  "highlights",
  () =>
    $fetch("https://api.jikan.moe/v4/manga", {
      params: {
        type: "manga",
        limit: 20,
        sfw: true,
        genres_exclude: "28,26,9,49,12,53,44,35,65,74,15",
        order_by: "popularity",
        sort: "asc",
      },
    }),
  {
    key: "highlights",
    staleTime: 1000 * 60 * 10, // 10 dakika taze kalacak
    cacheTime: 1000 * 60 * 60 * 24, // 24 saat boyunca önbellekte kalacak
  }
);

for (let item of highlightsData.value.data) {
  highlights.value.push({
    name: item.title,
    description: item.synopsis,
    image: item.images.jpg.large_image_url,
    date: item.published.prop,
    status: item.status,
    genres: item.genres,
    url: item.url,
    id: item.mal_id,
  });
}

// En yüksek puanlı mangalar
let topMangas = ref([]);

const { data: topMangasData } = await useAsyncData(
  "top-mangas",
  () =>
    $fetch("https://api.jikan.moe/v4/top/manga", {
      params: {
        type: "manga",
      },
    }),
  {
    key: "top-mangas",
    staleTime: 1000 * 60 * 10, // 10 dakika taze kalacak
    cacheTime: 1000 * 60 * 60 * 24, // 24 saat boyunca önbellekte kalacak
  }
);
for (let item of topMangasData.value.data) {
  topMangas.value.push({
    name: item.title,
    description: item.synopsis,
    image: item.images.jpg.large_image_url,
    date: item.published.prop,
    status: item.status,
    genres: item.genres,
    url: item.url,
    id: item.mal_id,
  });
}

// Yayınlanıyor olan mangalar
let pubs = ref([]);

const { data: pubsData } = await useAsyncData(
  "publishing-mangas",
  () =>
    $fetch("https://api.jikan.moe/v4/top/manga", {
      params: {
        type: "manga",
        filter: "publishing",
      },
    }),
  {
    key: "publishing-mangas",
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60 * 24,
  }
);
for (let item of pubsData.value.data) {
  pubs.value.push({
    name: item.title,
    description: item.synopsis,
    image: item.images.jpg.large_image_url,
    date: item.published.prop,
    status: item.status,
    genres: item.genres,
    url: item.url,
    id: item.mal_id,
  });
}

// En yüksek puanlı mangalar
let randomManga = ref([]);

const { data: randomMangaData } = await useAsyncData(
  "random-manga",
  () =>
    $fetch("https://api.jikan.moe/v4/random/manga", {
      params: {
        sfw: true,
      },
    }),
  {
    key: "random-manga",
  }
);
randomManga.value.push({
  name: randomMangaData.value.data.title,
  description: randomMangaData.value.data.synopsis,
  image: randomMangaData.value.data.images.jpg.large_image_url,
  date: randomMangaData.value.data.published.prop,
  status: randomMangaData.value.data.status,
  genres: randomMangaData.value.data.genres,
  url: randomMangaData.value.data.url,
  id: randomMangaData.value.data.mal_id,
});
</script>

<template>
  <main>
    <br />
    <HeroCard :itemData="highlights" />
    <div class="divider"></div>
    <article class="prose max-w-none px-5">
      <h1>En Yüksek Puanlı Mangalar</h1>
    </article>
    <br />
    <FreeSwiper :itemData="topMangas" />
    <div class="divider" />
    <article class="prose max-w-none px-5 pt-5">
      <h1>Yayınlanıyor</h1>
    </article>
    <br />
    <AutoSwiper :itemData="pubs" />
    <div class="divider" />
    <article class="prose max-w-none px-5">
      <h1 class="flex flex-row">Rastgele Manga</h1>
    </article>
    <br />
    <HeroCard :itemData="randomManga" />
  </main>
</template>

<style scoped>
.swiper {
  width: 100%;
  height: 17%;
}

.swiper-slide {
  background: transparent;
}

.swiper-slide img {
  display: block;
  object-fit: cover;
}
</style>
