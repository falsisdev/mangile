<template>
  <navbar/>
  <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
  <leftmenu/>
  <div class="col-span-2 col-start-2 col-end-6 p-5 pl-20"><!--page view-->
  <br>
  <!--arama sonuçları-->
  <article class="prose max-w-none p-5">
    <h1>{{  route.query.name == 'Reincarnation' ? 'Reenkarnasyon' : route.query.name == 'Action' ? 'Aksiyon' : route.query.name == 'Romance' ? 'Romantik' : route.query.name == 'Comedy' ? 'Komedi' : route.query.name == 'Adventure' ? 'Macera' : route.query.name == 'Magic' ? 'Büyü' : route.query.name == 'Drama' ? 'Dram' : route.query.name == 'Fantasy' ? 'Fantezi' : route.query.name == 'Adaptation' ? 'Adaptasyon' : route.query.name == 'Thriller' ? 'Gerilim' : route.query.name == 'Award Winning' ? 'Ödüllü' : route.query.name == 'Monsters' ? 'Canavarlar' : route.query.name == 'Psychological' ? 'Psikolojik' : route.query.name == 'Crime' ? 'Suç' : route.query.name == 'Survival' ? 'Hayatta Kalma' : route.query.name == 'Martial Arts' ? 'Dövüş Sanatları' : route.query.name == 'Mafia' ? 'Mafya' : route.query.name == 'Military' ? 'Askeri' : route.query.name == 'Philosophical' ? 'Felsefi' : route.query.name == 'Gore' ? 'Kan' : route.query.name == 'Medical' ? 'Tıbbi' : route.query.name == 'School Life' ? 'Okul Yaşamı' : route.query.name == 'Horror' ? 'Korku' : route.query.name == 'Police' ? 'Polisiye' : route.query.name == 'Slice of Life' ? 'Yaşamdan Kesit' : route.query.name == 'Mystery' ? 'Gizem' : route.query.name == 'Tragedy' ? 'Trajedi' : route.query.name == 'Demons' ? 'İblisler' : route.query.name == 'Monster Girls' ? 'Canavar Kızlar' : route.query.name == 'Supernatural' ? 'Doğaüstü' : route.query.name == 'Samurai' ? 'Samuray' : route.query.name == 'Time Travel' ? 'Zaman Yolculuğu' : route.query.name == 'Full Color' ? 'Tamamen Renkli' : route.query.name == `Boys' Love` ? 'Gay' : route.query.name == 'Music' ? 'Müzik' : route.query.name == `Girls' Love` ? 'Lezbiyen' : route.query.name == 'Vampires' ? 'Vampirler' : route.query.name == 'Web Comic' ? 'Web Çizgi Romanı' : route.query.name == 'Cooking' ? 'Yemek' : route.query.name == 'Historical' ? 'Tarihi' : route.query.name == 'Sci-Fi' ? 'Bilim Kurgu' : route.query.name }} Türünde Mangalar</h1>
  </article>
  <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
  <div v-for="item of results" v-bind:key="item" class="basis-1/4 card w-auto h-auto bg-base-100 p-[10px] shadow-lg rounded-lg">
    <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${item.id}/${cover[results.indexOf(item)].data.value.data.attributes.fileName}.512.jpg`"/></figure>
    <div class="card-body">
      <h2 class="card-title">{{ !item.attributes.title["en"] ? !item.attributes.title["ja-ro"] ? "" : item.attributes.title["ja-ro"].substring(0,20) + "...": item.attributes.title["en"].substring(0,20) + "..." }}</h2>
      <p>{{ !item.attributes.description["en"] ? "" : parseInt(item.attributes.description["en"]) == 0 ? "" : item.attributes.description["en"].substring(0,20) + "..."}}</p><br>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-secondary" :href="route.query.theme ? `/manga/${item.id}?theme=` + route.query.theme : `/manga/${item.id}`">Oku!</a>
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
  title: `${route.query.name == 'Reincarnation' ? 'Reenkarnasyon' : route.query.name == 'Action' ? 'Aksiyon' : route.query.name == 'Romance' ? 'Romantik' : route.query.name == 'Comedy' ? 'Komedi' : route.query.name == 'Adventure' ? 'Macera' : route.query.name == 'Magic' ? 'Büyü' : route.query.name == 'Drama' ? 'Dram' : route.query.name == 'Fantasy' ? 'Fantezi' : route.query.name == 'Adaptation' ? 'Adaptasyon' : route.query.name == 'Thriller' ? 'Gerilim' : route.query.name == 'Award Winning' ? 'Ödüllü' : route.query.name == 'Monsters' ? 'Canavarlar' : route.query.name == 'Psychological' ? 'Psikolojik' : route.query.name == 'Crime' ? 'Suç' : route.query.name == 'Survival' ? 'Hayatta Kalma' : route.query.name == 'Martial Arts' ? 'Dövüş Sanatları' : route.query.name == 'Mafia' ? 'Mafya' : route.query.name == 'Military' ? 'Askeri' : route.query.name == 'Philosophical' ? 'Felsefi' : route.query.name == 'Gore' ? 'Kan' : route.query.name == 'Medical' ? 'Tıbbi' : route.query.name == 'School Life' ? 'Okul Yaşamı' : route.query.name == 'Horror' ? 'Korku' : route.query.name == 'Police' ? 'Polisiye' : route.query.name == 'Slice of Life' ? 'Yaşamdan Kesit' : route.query.name == 'Mystery' ? 'Gizem' : route.query.name == 'Tragedy' ? 'Trajedi' : route.query.name == 'Demons' ? 'İblisler' : route.query.name == 'Monster Girls' ? 'Canavar Kızlar' : route.query.name == 'Supernatural' ? 'Doğaüstü' : route.query.name == 'Samurai' ? 'Samuray' : route.query.name == 'Time Travel' ? 'Zaman Yolculuğu' : route.query.name == 'Full Color' ? 'Tamamen Renkli' : route.query.name == `Boys' Love` ? 'Gay' : route.query.name == 'Music' ? 'Müzik' : route.query.name == `Girls' Love` ? 'Lezbiyen' : route.query.name == 'Vampires' ? 'Vampirler' : route.query.name == 'Web Comic' ? 'Web Çizgi Romanı' : route.query.name == 'Cooking' ? 'Yemek' : route.query.name == 'Historical' ? 'Tarihi' : route.query.name == 'Sci-Fi' ? 'Bilim Kurgu' : route.query.name} Türünde Mangalar`
})
let statuscode;
let results;
let data;
let cover = [];
try{
data = await useFetch(`https://api.mangadex.org/manga?excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&includedTags[]=${route.params.id}&limit=48&order[rating]=desc&originalLanguage[]=ja`)
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