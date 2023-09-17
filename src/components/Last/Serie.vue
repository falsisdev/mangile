<script setup>
import { useFetch } from "@vueuse/core";
import MangaCard from "../Manga/Card.vue";

let statuscode;
let results;
let data;
let cover = [];
try {
  data = await useFetch(`https://api.mangadex.org/manga`);
  results = JSON.parse(data.data.value).data;
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
}
</script>
<template>
  <br />
  <!--arama sonuçları-->
  <article class="prose max-w-none p-5">
    <h1>Son Yüklenen Mangalar</h1>
    Yükleme Kaynağı: MangaDex
  </article>
  <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <MangaCard
      v-for="item of results"
      :key="item"
      :id="item.id"
      :cover="
        JSON.parse(cover[results.indexOf(item)].data.value).data.attributes
          .fileName
      "
      :name="
        !item.attributes.title['en']
          ? !item.attributes.title['ja-ro']
            ? 'Bilinmeyen Seri'
            : item.attributes.title['ja-ro'].substring(0, 20) + '...'
          : item.attributes.title['en'].substring(0, 20) + '...'
      "
    />
  </div>
  <div v-else>
    <article class="prose max-w-none p-5">
      <h2>Hiçbir Sonuç Bulunamadı!</h2>
    </article>
  </div>
  <!--arama sonuçları-->
</template>
