<script setup>
const { isMobileOrTablet } = useDevice();
// Öne çıkan mangalar
let highlights = ref([]);

const { data: highlightsData } = await useFetch(
  "https://api.jikan.moe/v4/manga",
  {
    params: {
      limit: 20,
      sfw: true,
      genres_exclude: "28,26,9,49,12,53,44,35,65,74,15",
      order_by: "popularity",
      sort: "asc",
    },
    key: "highlights",
    staleTime: 1000 * 60 * 10, // 10 dakika taze kalacak
    cacheTime: 1000 * 60 * 60 * 24, // 24 saat boyunca önbellekte kalacak
  }
);

for (let item of highlightsData.value.data) {
  highlights.value.push({
    name: item.title,
    description: item.synopsis,
    type: item.type,
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

const { data: topMangasData } = await useFetch(
  "https://api.jikan.moe/v4/top/manga",
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
    type: item.type,
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

const { data: pubsData } = await useFetch(
  "https://api.jikan.moe/v4/top/manga",
  {
    params: {
      filter: "publishing",
    },
    key: "publishing-mangas",
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60 * 24,
  }
);

for (let item of pubsData.value.data) {
  pubs.value.push({
    name: item.title,
    description: item.synopsis,
    type: item.type,
    image: item.images.jpg.large_image_url,
    date: item.published.prop,
    status: item.status,
    genres: item.genres,
    url: item.url,
    id: item.mal_id,
  });
}

// Rastgele manga
let randomManga = ref([]);

const { data: randomMangaData } = await useFetch(
  "https://api.jikan.moe/v4/random/manga",
  {
    params: {
      sfw: true,
    },
    key: "random-manga",
  }
);

randomManga.value.push({
  name: randomMangaData.value.data.title,
  description: randomMangaData.value.data.synopsis,
  type: randomMangaData.value.data.type,
  image: randomMangaData.value.data.images.jpg.large_image_url,
  date: randomMangaData.value.data.published.prop,
  status: randomMangaData.value.data.status,
  genres: randomMangaData.value.data.genres,
  url: randomMangaData.value.data.url,
  id: randomMangaData.value.data.mal_id,
});

const seoMeta = [
  {
    property: "title",
    content: "Ana Sayfa | Mangile",
  },
  {
    property: "og:title",
    content: "Mangile",
  },
  {
    property: "description",
    content:
      "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi. ",
  },
  {
    property: "og:description",
    content: `Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi. `,
  },
  {
    property: "og:image",
    url: "https://raw.githubusercontent.com/falsisdev/mangile/beta/src/assets/mangile_sun.svg",
  },
  {
    property: "twitterCard",
    url: "https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed",
  },
];
useHead({
  title: "Ana Sayfa",
  meta: seoMeta,
});
</script>
<template>
  <main>
    <br v-if="!isMobileOrTablet" />
    <HeroCard :itemData="highlights" />
    <div class="divider" />
    <article class="prose max-w-none px-5">
      <h1 v-if="!isMobileOrTablet">En Yüksek Puanlı Mangalar</h1>
      <h1 v-if="isMobileOrTablet">En Yüksek Puan</h1>
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
