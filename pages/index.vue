<script setup>
import imageUrlBuilder from "@sanity/image-url";

const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

const queryCreated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_createdAt desc)`;
const queryUpdated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_updatedAt desc)`;
const { data: preCreatedData } = useSanityQuery(queryCreated);
const { data: preUpdatedData } = useSanityQuery(queryUpdated);

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
const createdSeries = ref([]);

//Son Güncellenen Seriler
const updatedSeries = ref([]);

onMounted(async () => {
  await nextTick();

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
});

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

useSeoMeta({
  author: "Falsis",
  twitterData1: "Falsis",
  twitterLabel1: "created by",
  twitterTitle: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
  title: "Ana Sayfa",
  ogTitle: "%s",
  description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
  ogDescription:
    "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
  ogImage:
    "https://2.downloader.disk.yandex.com.tr/preview/0f1ef17285f339df943684df9c4d4ad05a38c4f3facc53358bf66ada522403ee/inf/IIJ8_jhgrQhL6ACvSnfgiOiXORdnagm76z0t9-a4H17KliZNiukr1RWLA8C4nHLIyGt2yQZ-hwk647z50nvkVA%3D%3D?uid=1129069430&filename=homepage.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1129069430&tknv=v2&size=1708x793",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://2.downloader.disk.yandex.com.tr/preview/0f1ef17285f339df943684df9c4d4ad05a38c4f3facc53358bf66ada522403ee/inf/IIJ8_jhgrQhL6ACvSnfgiOiXORdnagm76z0t9-a4H17KliZNiukr1RWLA8C4nHLIyGt2yQZ-hwk647z50nvkVA%3D%3D?uid=1129069430&filename=homepage.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1129069430&tknv=v2&size=1708x793",
});
</script>
<template>
  <main v-if="createdSeries.length && updatedSeries.length">
    <br v-if="!isMobileOrTablet" />
    <HeroSlide :itemData="highlights" />
    <div class="divider" />
    <article class="prose max-w-none px-5 flex flex-row -mb-7">
      <h1 v-if="!isMobileOrTablet">Son Güncellenen Seriler</h1>
      <h2 v-else class="mt-2">Son Güncellenenler</h2>
      <span class="grow" />
      <h1>
        <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
      </h1>
    </article>
    <br />
    <LastsSwiper :itemData="updatedSeries" />
    <div class="divider" />
    <article class="prose max-w-none px-5 flex flex-row -mb-7">
      <h1 v-if="!isMobileOrTablet">En Yüksek Puanlı Seriler</h1>
      <h2 v-else class="mt-2">En Yüksek Puan</h2>
      <span class="grow" />
      <h1>
        <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
      </h1>
    </article>
    <br />
    <FreeSwiper :itemData="topMangas" />
    <div class="divider" />
    <article class="prose max-w-none px-5 pt-5 flex flex-row -mb-7">
      <h1 v-if="!isMobileOrTablet">Yayınlanıyor</h1>
      <h2 v-else class="mt-2">Yayınlanıyor</h2>
      <span class="grow" />
      <h1>
        <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
      </h1>
    </article>
    <br />
    <AutoSwiper :itemData="pubs" />
    <div class="divider" />
    <article class="prose max-w-none px-5 flex flex-row -mb-7">
      <h1 v-if="!isMobileOrTablet">Son Eklenen Seriler</h1>
      <h2 v-else class="mt-2">Son Eklenenler</h2>
      <span class="grow" />
      <h1>
        <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
      </h1>
    </article>
    <br />
    <LastsSwiper :itemData="createdSeries" />
    <div class="divider" />
    <article class="prose max-w-none px-5">
      <h1 v-if="!isMobileOrTablet" class="flex flex-row">Rastgele Seri</h1>
      <h2 v-else class="mt-2">Rastgele Seri</h2>
    </article>
    <br />
    <HeroSlide :itemData="randomManga" />
  </main>
  <div v-else class="lg:col-start-2 lg:col-end-11 lg:m-5 flex items-center justify-center min-h-screen">
      <Icon name="mingcute:loading-line" class="animate-spin w-full lg:h-32 h-16" />
    </div>
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
