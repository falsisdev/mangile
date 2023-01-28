<template><navbar/>
    <div class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-4 col-start-2 col-end-6 p-5"><!--page view-->
<div class="card lg:card-side bg-base-100 p-[10px]">
  <div class="card-body">
    <NuxtLink class="link link-hover" :to="`/manga/${route.params.id}`">{{ info.data.value.data.attributes.title.en }}</NuxtLink>
    <article class="prose max-w-none">
    <h1>{{ epp.title }}</h1>
    </article>
    Çeviri Ekibi: {{ epp.source }}
<div class="divider"></div>
<div class="grid grid-rows-1 grid-cols-2">
<button @click="onceki()" class="btn btn-error col-span-1 col-start-1 col-end-2 m-2">Önceki Bölüm</button> <button @click="sonraki()" class="p-2 btn btn-success col-span-1 col-start-2 col-end-3 m-2">Sonraki Bölüm</button>
</div>
<br/>
<br/>
<div v-if="statuscode == 200" class="flex flex-col flex-wrap">
<img v-for="item of epp.pages" :src="item" class="object-contain" v-bind:key="item"/>
</div>
<div class="divider"></div>
<div class="grid grid-rows-1 grid-cols-2">
  <button @click="onceki()" class="btn btn-error col-span-1 col-start-1 col-end-2 m-2">Önceki Bölüm</button> <button @click="sonraki()" class="p-2 btn btn-success col-span-1 col-start-2 col-end-3 m-2">Sonraki Bölüm</button>
</div>
</div>
</div>
</div>
</div>
</template>
<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig();
const info = await useFetch(`https://api.mangadex.org/manga/${route.params.id}`)
const episodedata = await useFetch(`https://cdn.falsis.ga/mangile?token=${runtimeConfig.public.token}&id=${route.params.id}`)
const statuscode = episodedata.data.value.code
const epdata = episodedata.data.value.data
let eps;
for(let item of epdata.volumes) {
  if(item.vol == route.params.vol) {
     eps = item.episodes
  }
}
let epp;
for(let item of eps) {
  if(item.ep == route.params.ep) {
    epp = item
  }
}
function onceki() {
  window.location.href = `/manga/${route.params.id}/read/${route.params.vol}/${parseInt(route.params.ep) - 1}`
}
function sonraki() {
  window.location.href = `/manga/${route.params.id}/read/${route.params.vol}/${parseInt(route.params.ep) + 1}`
}
</script>