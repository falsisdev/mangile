<template>
    <navbar/>
    <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-2 col-start-2 col-end-6 p-5 pl-20"><!--page view-->
    <br>
    <!--arama sonuçları-->
    <article class="prose max-w-none p-5">
      <h1>Son Yüklenen Bölümler</h1>
      Yükleme Kaynağı: Mangile Verileri
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <div v-for="[index, deger] of Object.entries(results.lastsids)" v-bind:key="[index, deger]" class="basis-1/4 card w-auto h-auto bg-base-100 p-[10px] shadow-lg rounded-lg">
        <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${deger}/${cover[parseInt(settedids.indexOf(deger))].data.value.data.attributes.fileName}.512.jpg`"/></figure>
      <div class="card-body">
        <h2 class="card-title">{{ !lastidsfetch[settedids.indexOf(deger)].attributes.title["en"] ? !lastidsfetch[settedids.indexOf(deger)].attributes.title["ja-ro"] ? "" : lastidsfetch[settedids.indexOf(deger)].attributes.title["ja-ro"] : lastidsfetch[settedids.indexOf(deger)].attributes.title["en"] }}</h2>
        <p>
           Cilt  {{ results.lasteps[index].vol }} {{ results.lasteps[index].title }}<br/>
           Kaynak:  {{ results.lasteps[index].source }}
        </p>
        <div class="dropdown dropdown-hover dropdown-top flex justify-end">
          <a class="btn btn-primary" :href="route.query.theme ? `/manga/${deger}/read/${results.lasteps[index].vol}/${results.lasteps[index].ep}?theme=` + route.query.theme : `/manga/${deger}/read/${results.lasteps[index].vol}/${results.lasteps[index].ep}`">Oku!</a>
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
  useHead({
    title: "Son Yüklenen Bölümler"
  })
  let statuscode;
  let results;
  let data;
  let cover = [];
  var lastidsfetch = [];
  let coverartid;
  let settedids = [];
  try{
  data = await useFetch(`https://cdn.falsis.ga/lasteps?token=${runtimeConfig.public.token}`)
  results = data.data.value.lasteps
  settedids = [...new Set(results.lastsids)]
    for(let item of settedids) {
        let a = await useFetch(`https://api.mangadex.org/manga/${item}`)
        lastidsfetch.push(a.data.value.data)
      }
      for(let i of lastidsfetch) {
        for(let b of i.relationships) {
        if(b.type == 'cover_art') {
            coverartid = b.id
            cover.push(await useFetch(`https://api.mangadex.org/cover/${coverartid}`))
        }
    }
    }
  statuscode = 200
  }catch(error) {
  statuscode = 404
  console.log(error)
  }
  </script>