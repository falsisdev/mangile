<template>
  <navbar/>
  <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
  <leftmenu/>
  <div class="col-span-2 col-start-2 col-end-6 p-5 pl-20"><!--page view-->
  <br>
  <!--arama sonuçları-->
  <article class="prose max-w-none p-5">
    <h1>Arama Sonuçları</h1>
    Arama İbareniz: {{  route.query["q"].replaceAll("+", " ") }}
  </article>
  <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
  <div v-for="item of results" v-bind:key="item" class="basis-1/4 card w-auto h-auto bg-base-100 p-[10px] shadow-lg rounded-lg">
    <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${item.id}/${cover[results.indexOf(item)].data.value.data.attributes.fileName}.512.jpg`"/></figure>
    <div class="card-body">
      <h2 class="card-title">{{ !item.attributes.title["en"] ? !item.attributes.title["ja-ro"] ? "" : item.attributes.title["ja-ro"] : item.attributes.title["en"] }}</h2>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-primary" :href="route.query.theme ? `/manga/${item.id}?theme=` + route.query.theme : `/manga/${item.id}`">Oku!</a>
      </div>
    </div>
  </div>
  </div>
  <div v-else>
      <article class="prose max-w-none p-5">
        <h2> Hiçbir Sonuç Bulunamadı!</h2>
      </article>
    </div>
  <!--arama sonuçları-->
  </div><!--page view-->
  </div><!--grid-->
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
</script>