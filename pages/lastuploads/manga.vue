<template>
    <navbar/>
    <div class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-2 col-start-2 col-end-6 p-5 pl-20"><!--page view-->
    <br>
    <!--arama sonuçları-->
    <article class="prose max-w-none p-5">
      <h1>Son Yüklenen Mangalar</h1>
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <div v-for="item of results" v-bind:key="item" class="basis-1/4 card w-auto h-auto bg-base-100 p-[10px] shadow-lg rounded-lg">
      <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${item.id}/${cover[results.indexOf(item)].data.value.data.attributes.fileName}.512.jpg`"/></figure>
      <div class="card-body">
        <h2 class="card-title">{{ !item.attributes.title["en"] ? !item.attributes.title["ja-ro"] ? "" : item.attributes.title["ja-ro"].substring(0,20) + "...": item.attributes.title["en"].substring(0,20) + "..." }}</h2>
        <p>{{ !item.attributes.description["en"] ? "" : parseInt(item.attributes.description["en"]) == 0 ? "" : item.attributes.description["en"].substring(0,20) + "..."}}</p><br>
        <div class="dropdown dropdown-hover dropdown-top flex justify-end">
          <a class="btn btn-secondary" :href="`/manga/${item.id}`">Oku!</a>
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
let statuscode;
let results;
let data;
let cover = [];
try{
data = await useFetch(`https://api.mangadex.org/manga`)
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
</script>