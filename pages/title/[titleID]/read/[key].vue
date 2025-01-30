<script setup>
import { data } from "@/assets/data.ts";
import imageUrlBuilder from "@sanity/image-url";

const route = useRoute();
const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

const query = groq`*[myAnimeListId == ${route.params.titleID}]`;
const { data: preSanityData } = useSanityQuery(query);

const sanityData = ref([]);
const chapter = ref(null);
const images = ref([]);

const mangaID = ref(route.params.titleID);
const manga = ref([]);

async function fetchManga() {
  try {
    const mangaData = await Promise.resolve(
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`)
    );

    manga.value = mangaData.data;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
}

watchEffect(() => {
  if (preSanityData.value) {
    const fetchedData = toRaw(preSanityData.value);
    sanityData.value = fetchedData;

    if (fetchedData.length > 0) {
      fetchedData[0]["chapters"].forEach((x) =>
        x._key == route.params.key ? (chapter.value = x) : ""
      );
      if (sanityData.value[0]._type == "manga") {
        for (let image of chapter.value.pages) {
          images.value.push(
            builder.image(image.asset._ref).auto("format").url()
          );
        }
      }
    }
  }
});

watchEffect(() => {
  if (manga.value?.title && chapter.value) {
    useSeoMeta({
      author: "Falsis",
      twitterData1: "Falsis",
      twitterLabel1: "created by",
      twitterTitle:
        chapter.value.chapterNumber +
        " | " +
        chapter.value.title +
        " -- " +
        sanityData.value[0].title,
      title:
        chapter.value.chapterNumber +
        " | " +
        chapter.value.title +
        " -- " +
        sanityData.value[0].title,
      ogTitle: "%s",
      description:
        sanityData.value[0].title + " " + chapter.value.title + " Oku",
      ogDescription:
        sanityData.value[0].title + " " + chapter.value.title + " Oku",
      ogImage: manga.value.images.jpg.large_image_url,
      twitterCard: "summary_large_image",
      twitterImage: manga.value.images.jpg.large_image_url,
    });
  }
});

watch([mangaID], async (newID, oldID) => {
  if (newID !== oldID) {
    await fetchManga();
  }
});
onMounted(fetchManga);
</script>
<template>
  <main v-if="chapter && manga" class="lg:m-0 mx-5">
    <div class="lg:pt-0 pt-5">
      <article class="prose max-w-none flex flex-col">
        <h1 class="flex flex-col">
          <span class="text-3xl">{{ sanityData[0].title }}</span>
          <span class="flex flex-row">
            <span class="text-2xl mt-1">
              <span class="kbd kbd-md -mt-1"
                ><span
                  class="tooltip"
                  :data-tip="`Bölüm ${chapter.chapterNumber}`"
                  >{{ chapter.chapterNumber }}</span
                ></span
              >
              - {{ chapter.title }}</span
            >
            <span class="grow" />
          </span>
        </h1>
        <span class="flex flex-row -mt-5">
          <NuxtLink
            :to="`/title/${route.params.titleID}`"
            class="btn btn-primary"
          >
            <Icon name="material-symbols:book-rounded" />
          </NuxtLink>
          <NuxtLink
            :to="
              sanityData[0]['chapters'].indexOf(chapter) == 0
                ? ''
                : `/title/${route.params.titleID}/read/${sanityData[0]['chapters'][parseInt(sanityData[0]['chapters'].indexOf(chapter)) - 1]._key}`
            "
            :class="`btn btn-ghost ${sanityData[0]['chapters'].indexOf(chapter) == 0 ? 'btn-disabled' : ''}`"
            ><Icon name="material-symbols:arrow-back" /> Önceki Bölüm</NuxtLink
          >
          <span class="grow" />
          <NuxtLink
            :to="
              parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1 ==
              sanityData[0]['chapters'].length
                ? ''
                : `/title/${route.params.titleID}/read/${sanityData[0]['chapters'][parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1]._key}`
            "
            :class="`btn btn-ghost ${parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1 == sanityData[0]['chapters'].length ? 'btn-disabled' : ''}`"
            >Sonraki Bölüm <Icon name="material-symbols:arrow-forward"
          /></NuxtLink>
        </span>
      </article>
      <article class="prose max-w-none mt-5">
        <h3 class="text-lg">
          Bu bölüm {{ data.scans[chapter.source] }} tarafından çevrilmiştir
        </h3>
      </article>
      <div class="divider" />
      <article
        v-if="sanityData[0]._type == 'lightNovel'"
        class="prose max-w-none lg:mb-0 mb-20"
      >
        <SanityContent :blocks="chapter.content"></SanityContent>
      </article>
      <div v-else-if="sanityData[0]._type == 'manga' && manga.type != 'Manhwa'">
        <div
          role="alert"
          class="alert alert-info lg:text-md text-sm lg:mt-2 px-5 text-start flex"
        >
          <Icon
            v-if="!isMobileOrTablet"
            name="material-symbols:info"
            class="w-5 h-5 lg:-mr-2"
          />
          <span
            >Bilgi: Mangalar Türkçe kitapların aksine soldan sağa değil sağdan
            sola okunur. Yakınlaştırmak için çift tıklamanız yeterlidir.</span
          >
        </div>
        <swiper
          class="mt-5"
          dir="rtl"
          :autoHeight="true"
          :pagination="{
            clickable: true,
            type: 'progressbar',
          }"
          :zoom="{ maxRatio: 3 }"
          :modules="[SwiperPagination, SwiperZoom]"
        >
          <swiper-slide v-for="item of [...new Set(images)]" v-bind:key="item">
            <div class="swiper-zoom-container">
              <img :src="item" class="w-full h-full" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div v-else-if="manga.type == 'Manhwa'">
        <div
          role="alert"
          class="alert alert-info lg:text-md text-sm lg:mt-2 px-5 text-start flex mb-2"
        >
          <Icon
            v-if="!isMobileOrTablet"
            name="material-symbols:info"
            class="w-5 h-5 lg:-mr-2"
          />
          <span
            >Bilgi: Bu seri bir Manhwa olduğundan Webtoon tipi okunuşa sahiptir.
            Tüm sayfayı yukarıdan aşağıya doğru kaydırarak okuyunuz.</span
          >
        </div>
        <div
          v-for="item of [...new Set(images)]"
          :key="item"
          class="flex justify-center"
        >
          <img :src="item" />
        </div>
      </div>
      <div class="divider" />
      <article class="prose max-w-none mb-5">
        <h3 class="text-lg">
          Bu bölüm {{ data.scans[chapter.source] }} tarafından çevrilmiştir
        </h3>
      </article>
      <span class="flex flex-row">
        <NuxtLink
          :to="`/title/${route.params.titleID}`"
          class="btn btn-primary"
        >
          <Icon name="material-symbols:book-rounded" />
        </NuxtLink>
        <NuxtLink
          :to="
            sanityData[0]['chapters'].indexOf(chapter) == 0
              ? ''
              : `/title/${route.params.titleID}/read/${sanityData[0]['chapters'][parseInt(sanityData[0]['chapters'].indexOf(chapter)) - 1]._key}`
          "
          :class="`btn btn-ghost ${sanityData[0]['chapters'].indexOf(chapter) == 0 ? 'btn-disabled' : ''}`"
          ><Icon name="material-symbols:arrow-back" /> Önceki Bölüm</NuxtLink
        >
        <span class="grow" />
        <NuxtLink
          :to="
            parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1 ==
            sanityData[0]['chapters'].length
              ? ''
              : `/title/${route.params.titleID}/read/${sanityData[0]['chapters'][parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1]._key}`
          "
          :class="`btn btn-ghost ${parseInt(sanityData[0]['chapters'].indexOf(chapter)) + 1 == sanityData[0]['chapters'].length ? 'btn-disabled' : ''}`"
          >Sonraki Bölüm <Icon name="material-symbols:arrow-forward"
        /></NuxtLink>
      </span>
    </div>
    <DisqusComments :identifier="route.fullPath" />
    <br v-if="isMobileOrTablet" />
    <br v-if="isMobileOrTablet" />
  </main>
  <main v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </main>
</template>
