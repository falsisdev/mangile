<script setup>
import { data } from "@/assets/data.ts";
import imageUrlBuilder from "@sanity/image-url";
import Flipbook from "flipbook-vue";

const route = useRoute();
const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

const query = groq`*[myAnimeListId == ${route.params.titleID}]`;
const { data: preSanityData } = useSanityQuery(query);

const sanityData = ref([]);
const chapter = ref(null);
const images = ref([]);

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
  if (chapter.value) {
    const seoMeta = [
      {
        property: "og:title",
        content:
          chapter.value.chapterNumber +
          "-" +
          chapter.value.title +
          "--" +
          sanityData.value[0].title +
          " | Mangile",
      },
      {
        property: "og:description",
        content: sanityData.value[0].title + chapter.value.title + " Oku",
      },
      {
        property: "og:image",
        content: `https://mangile.vercel.app/api/canvas/manga/${route.params.titleID}`,
      },
      {
        name: "twitter:card",
        content: `https://mangile.vercel.app/api/canvas/manga/${route.params.titleID}`,
      },
      {
        name: "theme-color",
        content: "#0a0a0a",
      },
    ];
    useHead({
      title:
        chapter.value.chapterNumber +
        "-" +
        chapter.value.title +
        "--" +
        sanityData.value[0].title,
      meta: seoMeta,
    });
  }
});
</script>
<template>
  <main v-if="chapter" class="lg:m-0 mx-5">
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
            <select class="select select-xs lg:select-sm max-w-xs">
              <option disabled selected>Bölüm</option>
              <option
                v-for="chapter of sanityData[0].chapters"
                :key="chapter"
                @click.prevent="
                  navigateTo(
                    `/title/${route.params.titleID}/read/${chapter._key}`
                  )
                "
              >
                {{ chapter.chapterNumber }}
              </option>
            </select>
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
      <div class="divider" />
      <article
        v-if="sanityData[0]._type == 'lightNovel'"
        class="prose max-w-none lg:mb-0 mb-20"
      >
        <SanityContent :blocks="chapter.content"></SanityContent>
      </article>
      <div v-else-if="sanityData[0]._type == 'manga'">
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
            sola okunur. Yakınlaştırmak için üzerine tıklamanız
            yeterlidir.</span
          >
        </div>
        <Flipbook
          v-if="!isMobileOrTablet"
          class="flipbook mt-2"
          :pages="[...new Set(images)]"
          :flipDuration="500"
          forwardDirection="left"
          :singlePage="true"
        />
        <Flipbook
          v-else
          class="flipbook-mobile mt-2"
          :pages="[...new Set(images)]"
          :singlePage="true"
          forwardDirection="left"
        />
      </div>
      <div class="divider" />
      <article class="prose max-w-none mb-5">
        <h3 class="text-lg">
          Bu seri {{ data.scans[chapter.source] }} tarafından çevrilmiştir
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
    <br v-if="isMobileOrTablet" />
    <br v-if="isMobileOrTablet" />
  </main>
  <main v-else>Yükleniyor...</main>
</template>
<style scoped>
.flipbook {
  width: 67vw;
  height: 60vw;
}
.flipbook-mobile {
  width: 80vw;
  height: 120vw;
}
</style>
