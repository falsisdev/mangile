<script setup>
import toMarkdown from "@sanity/block-content-to-markdown";
import { marked } from "marked";

const route = useRoute();
const serializers = {
  types: {
    code: (props) =>
      "```" + props.node.language + "\n" + props.node.code + "\n```",
  },
};

const query = groq`*[myAnimeListId == ${route.params.titleID}]`;
const { data: preSanityData, refresh } = useSanityQuery(query);

const sanityData = ref([]);
const chapter = ref(null);

watchEffect(() => {
  if (preSanityData.value) {
    const fetchedData = toRaw(preSanityData.value);
    sanityData.value = fetchedData;

    if (fetchedData.length > 0) {
      fetchedData[0]["chapters"].forEach((x) =>
        x._key == route.params.key ? (chapter.value = x) : ""
      );
    }
  }
});
</script>
<template>
  <main v-if="chapter" class="lg:m-0 mx-5">
    <div v-if="sanityData[0]._type == 'lightNovel'" class="lg:pt-0 pt-5">
      <article class="prose max-w-none flex flex-col">
        <h1 class="flex flex-col">
          <span class="text-3xl">{{ sanityData[0].title }}</span>
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
            >Önceki Bölüm</NuxtLink
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
            >Sonraki Bölüm</NuxtLink
          >
        </span>
      </article>
      <div class="divider" />
      <article class="prose max-w-none lg:mb-0 mb-20">
        <div
          v-for="item of chapter.content"
          :key="item"
          v-html="marked(toMarkdown(item, { serializers }))"
        ></div>
      </article>
    </div>
  </main>
  <main v-else>Yükleniyor...</main>
</template>
