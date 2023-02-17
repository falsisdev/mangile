<template>
  <div class="col-span-2 col-start-2 col-end-6 my-5 ml-10"><!--page view-->
  <br>
  <!--arama sonuçları-->
  <article class="prose max-w-none p-5">
    <h1>Arama Sonuçları</h1>
    Arama İbareniz: {{  route.query["q"].replaceAll("+", " ") }}
  </article>
  <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <MangaCard v-for="item of results" v-bind:key="item" :id="item.id" :cover="cover[results.indexOf(item)].data.value.data.attributes.fileName" :name="!item.attributes.title['en'] ? !item.attributes.title['ja-ro'] ? '' : item.attributes.title['ja-ro'] : item.attributes.title['en']"/>
  </div>
  <div v-else>
      <article class="prose max-w-none p-5">
        <h2> Hiçbir Sonuç Bulunamadı!</h2>
      </article>
    </div>
  <!--arama sonuçları-->
  </div><!--page view-->
</template>
<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig();
let statuscode;
let results;
let data;
let cover = [];
try{
data = await useFetch(`https://api.mangadex.org/manga?title=${route.query.q}&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&limit=24&order[relevance]=desc`)
results = data.data.value.data
let coverartid;
  for(let item of results) {
    for(let i of item.relationships) {
      if(i.type == 'cover_art') {
          coverartid = i.id
          cover.push(await useFetch(`https://api.mangadex.org/cover/${coverartid}`))
      }
    }
  }
statuscode = 200
}catch(error) {
statuscode = 404
}
useHead({
  title: "Arama Sonuçları"
})
definePageMeta({
    layout: "list",
  })
</script>