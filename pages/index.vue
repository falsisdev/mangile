<script setup>
import imageUrlBuilder from "@sanity/image-url";

const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

const queryCreated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_createdAt desc)`;
const queryUpdated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_updatedAt desc)`;
const { data: preCreatedData } = useSanityQuery(queryCreated);
const { data: preUpdatedData } = useSanityQuery(queryCreated);

const createdSanityData = ref([]);
const updatedSanityData = ref([]);

watchEffect(() => {
  if (preCreatedData.value) {
    const fetchedData = toRaw(preCreatedData.value);
    createdSanityData.value = fetchedData;
  }
  if (preUpdatedData.value) {
    const fetchedData = toRaw(preUpdatedData.value);
    updatedSanityData.value = fetchedData;
  }
});

//Son Eklenen Seriler
let createdSeries = ref([]);

for (let item of createdSanityData.value) {
  createdSeries.value.push({
    name: item.title,
    description: item.description,
    type: item._type,
    image: builder.image(item.coverImage.asset._ref).auto("format").url(),
    date: item._createdAt,
    genres: item.tags,
    id: item.myAnimeListId,
  });
}

//Son Güncellenen Seriler
let updatedSeries = ref([]);

for (let item of updatedSanityData.value) {
  updatedSeries.value.push({
    name: item.title,
    description: item.description,
    type: item._type,
    image: builder.image(item.coverImage.asset._ref).auto("format").url(),
    date: item._updatedAt,
    genres: item.tags,
    id: item.myAnimeListId,
  });
}

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
    type: item["type"]
      .replaceAll("Light Novel", "Hafif Roman")
      .replaceAll("Novel", "Roman"),
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
    type: item["type"]
      .replaceAll("Light Novel", "Hafif Roman")
      .replaceAll("Novel", "Roman"),
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
    type: item["type"]
      .replaceAll("Light Novel", "Hafif Roman")
      .replaceAll("Novel", "Roman"),
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
    <div class="divider" />
    <article class="prose max-w-none px-5">
      <h1>Son Eklenen Seriler</h1>
    </article>
    <br />
    <LastsSwiper :itemData="createdSeries" />
    <div class="divider" />
    <article class="prose max-w-none px-5">
      <h1>Son Güncellenen Seriler</h1>
    </article>
    <br />
    <LastsSwiper :itemData="updatedSeries" />
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
