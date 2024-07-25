<template>
  <div class="col-span-2 col-start-2 col-end-6 my-5 ml-10">
    <!--page view-->
    <br />
    <!--arama sonuçları-->
    <article class="prose max-w-none p-5">
      <h1>Aramaya göre Mangalar</h1>
      Arama İfadesi: {{ route.query["q"].replaceAll("+", " ") }}
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
      <MangaCard
        v-for="item of results"
        v-bind:key="item"
        :id="item.id"
        :cover="
          JSON.parse(cover[results.indexOf(item)].data.value).data.attributes
            .fileName
        "
        :name="
          !item.attributes.title['en']
            ? !item.attributes.title['ja-ro']
              ? ''
              : item.attributes.title['ja-ro']
            : item.attributes.title['en']
        "
      />
    </div>
    <div v-else>
      <article class="prose max-w-none p-5">
        <h2>Hiçbir Sonuç Bulunamadı!</h2>
      </article>
    </div>
    <div class="divider" />
    <article class="prose max-w-none p-5">
      <h1>Aramaya göre Karakterler</h1>
      Arama İfadesi: {{ route.query["q"].replaceAll("+", " ") }}
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
      <PeopleCard
        v-for="item of charRes"
        v-bind:key="item"
        :id="String(item.mal_id)"
        :cover="item.images.jpg.image_url"
        :name="item.name"
        :url="item.url"
      />
    </div>
    <div v-else>
      <article class="prose max-w-none p-5">
        <h2>Hiçbir Sonuç Bulunamadı!</h2>
      </article>
    </div>
    <div class="divider" />
    <article class="prose max-w-none p-5">
      <h1>Aramaya göre Yapımda Emeği Geçenler</h1>
      Arama İfadesi: {{ route.query["q"].replaceAll("+", " ") }}
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
      <PeopleCard
        v-for="item of peopleResults"
        v-bind:key="item"
        :id="String(item.mal_id)"
        :cover="item.images.jpg.image_url"
        :name="item.name"
        :url="item.url"
      />
    </div>
    <div v-else>
      <article class="prose max-w-none p-5">
        <h2>Hiçbir Sonuç Bulunamadı!</h2>
      </article>
    </div>
    <!--arama sonuçları-->
  </div>
  <!--page view-->
</template>
<script setup>
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";
import MangaCard from "./Manga/Card.vue";
import PeopleCard from "./PeopleCard.vue";

const route = useRoute();
let statuscode;
let results;
let data;
let peopleData;
let peopleResults;
let charData;
let charRes;
let cover = [];
try {
  data = await useFetch(
    `https://api.mangadex.org/manga?title=${route.query.q}&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&limit=24&order[relevance]=desc`
  );
  peopleData = await useFetch(
    `https://api.jikan.moe/v4/people?q=${route.query.q}`
  );
  charData = await useFetch(
    `https://api.jikan.moe/v4/characters?q=${route.query.q}`
  );
  results = JSON.parse(data.data.value).data;
  peopleResults = JSON.parse(peopleData.data.value).data;
  charRes = JSON.parse(charData.data.value).data;
  let coverartid;
  for (let item of results) {
    for (let i of item.relationships) {
      if (i.type == "cover_art") {
        coverartid = i.id;
        cover.push(
          await useFetch(`https://api.mangadex.org/cover/${coverartid}`)
        );
      }
    }
  }
  statuscode = 200;
} catch (error) {
  statuscode = 404;
  console.log(error);
}
</script>
