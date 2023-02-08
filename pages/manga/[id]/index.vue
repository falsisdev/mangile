<template>
  <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
<div class="card lg:card-side bg-base-100 p-[10px]">
  <span class="flex flex-col">
  <article class="prose">
<figure><img class="rounded shadow-md w-4/6 h-auto" :src="`https://mangadex.org/covers/${info.data.value.data.id}/${cover.data.value.data.attributes.fileName}.512.jpg`"></figure>
</article>
<article class="prose ml-20 w-96 mt-5">
<div v-for="item of info.data.value.data.attributes.tags" :key="item">
          <div v-if="item.attributes.name.en == 'Gore' || item.attributes.name.en == 'Sexual Violence' || item.attributes.name.en == 'Doujinshi'" class="alert alert-warning shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Bu seri 18 yaşının altındaki bireylerin psikolojik durumunu ve akli dengesini bozabilecek içerikler içermektedir. 18 yaş altı bireylerin bu riskin farkında olmadan bu seriyi okuması önerilmemektedir.</span>
          </div>
          </div>
</div>
<div class="divider"></div>
<div tabindex="0" class="collapse collapse-open border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Serinin Yazarı ve Çizeri
        </div>
        <div class="collapse-content">
<span v-if="author.data.value.data.attributes.name == artist.data.value.data.attributes.name">{{  author.data.value.data.attributes.name }}</span>
<span v-else>Yazar: {{  author.data.value.data.attributes.name }}<br/>Çizer: {{  artist.data.value.data.attributes.name }}</span>
</div></div><br/>
<div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Serinin Konusu
        </div>
        <div class="collapse-content">
<span>{{ statuscode == 200 ? epdata.description : info.data.value.data.attributes.description.en }}</span>
</div></div>
</article>
</span>
<div class="card-body">
  <article class="prose">
      <span class="card-title">
      <h1>{{ info.data.value.data.attributes.title.en || info.data.value.data.attributes.title["ja-ro"] }}</h1>
      </span>
      <span>
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Bilgiler
        </div>
        <div class="collapse-content">  
        <span><font-awesome-icon icon="fa-solid fa-clock-rotate-left" /></span> Yayın Tarihi: {{ !info.data.value.data.attributes.year ? "Bilinmiyor" :  `${info.data.value.data.attributes.year}`  }}, {{ info.data.value.data.attributes.status == 'completed' ? ' Yayın Tamamlandı.' : info.data.value.data.attributes.status == 'ongoing' ? ' Yayın Devam Ediyor.' : info.data.value.data.attributes.status == 'hiatus' ? ' Yayına Ara Verildi.' : '.'}}<br/>
        <span><font-awesome-icon icon="fa-solid fa-language" /></span> Serinin Orjinal Dili: {{ info.data.value.data.attributes.originalLanguage == 'ja' ? 'Japonca' : info.data.value.data.attributes.originalLanguage == 'ko' ? 'Korece' : info.data.value.data.attributes.originalLanguage == 'ch' ? 'Çince' : info.data.value.data.attributes.originalLanguage}}<br/> 
        <span><font-awesome-icon icon="fa-solid fa-id-card-clip" /></span> Serinin Demografiği: {{ info.data.value.data.attributes.publicationDemographic == 'shounen' ? 'Shounen' : info.data.value.data.attributes.publicationDemographic == 'seinen' ? 'Seinen' : info.data.value.data.attributes.publicationDemographic == 'josei' ? 'Josei' : info.data.value.data.attributes.publicationDemographic == 'shoujo' ? 'Shoujo' : info.data.value.data.attributes.publicationDemographic }}
      </div></div><br/>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Diğer Başlıklar
        </div>
        <div class="collapse-content">  
          <span v-for="item of info.data.value.data.attributes.altTitles" :key="item">
          <a v-for="i of Object.values(item)" :key="i" class="m-1 badge badge-lg no-underline">
          {{ i }}
          </a>
        </span> 
        </div></div><br/>
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Serinin Türleri
        </div>
        <div class="collapse-content">
        <span class="tooltip" v-for="item of info.data.value.data.attributes.tags" :key="item" :data-tip="item.attributes.name.en == 'Reincarnation' ? 'Reenkarnasyon' : item.attributes.name.en == 'Action' ? 'Aksiyon' : item.attributes.name.en == 'Romance' ? 'Romantik' : item.attributes.name.en == 'Comedy' ? 'Komedi' : item.attributes.name.en == 'Adventure' ? 'Macera' : item.attributes.name.en == 'Magic' ? 'Büyü' : item.attributes.name.en == 'Drama' ? 'Dram' : item.attributes.name.en == 'Fantasy' ? 'Fantezi' : item.attributes.name.en == 'Adaptation' ? 'Adaptasyon' : item.attributes.name.en == 'Thriller' ? 'Gerilim' : item.attributes.name.en == 'Award Winning' ? 'Ödüllü' : item.attributes.name.en == 'Monsters' ? 'Canavarlar' : item.attributes.name.en == 'Psychological' ? 'Psikolojik' : item.attributes.name.en == 'Crime' ? 'Suç' : item.attributes.name.en == 'Survival' ? 'Hayatta Kalma' : item.attributes.name.en == 'Martial Arts' ? 'Dövüş Sanatları' : item.attributes.name.en == 'Mafia' ? 'Mafya' : item.attributes.name.en == 'Military' ? 'Askeri' : item.attributes.name.en == 'Philosophical' ? 'Felsefi' : item.attributes.name.en == 'Gore' ? 'Kan' : item.attributes.name.en == 'Medical' ? 'Tıbbi' : item.attributes.name.en == 'School Life' ? 'Okul Yaşamı' : item.attributes.name.en == 'Horror' ? 'Korku' : item.attributes.name.en == 'Police' ? 'Polisiye' : item.attributes.name.en == 'Slice of Life' ? 'Yaşamdan Kesit' : item.attributes.name.en == 'Mystery' ? 'Gizem' : item.attributes.name.en == 'Tragedy' ? 'Trajedi' : item.attributes.name.en == 'Demons' ? 'İblisler' : item.attributes.name.en == 'Monster Girls' ? 'Canavar Kızlar' : item.attributes.name.en == 'Supernatural' ? 'Doğaüstü' : item.attributes.name.en == 'Samurai' ? 'Samuray' : item.attributes.name.en == 'Time Travel' ? 'Zaman Yolculuğu' : item.attributes.name.en == 'Full Color' ? 'Tamamen Renkli' : item.attributes.name.en == `Boys' Love` ? 'Gay' : item.attributes.name.en == 'Music' ? 'Müzik' : item.attributes.name.en == `Girls' Love` ? 'Lezbiyen' : item.attributes.name.en == 'Vampires' ? 'Vampirler' : item.attributes.name.en == 'Web Comic' ? 'Web Çizgi Romanı' : item.attributes.name.en == 'Cooking' ? 'Yemek' : item.attributes.name.en == 'Historical' ? 'Tarihi' : item.attributes.name.en == 'Sci-Fi' ? 'Bilim Kurgu' : item.attributes.name.en"><NuxtLink :class="`m-1 badge badge-lg no-underline ${item.attributes.name.en == 'Award Winning' ? 'badge-accent' : item.attributes.name.en == 'Gore' ? 'badge-error' : ''}`" :to="route.query.theme ? `/discover/?genres=${item.id}&theme=` + route.query.theme : `/manga/genre/${item.id}`">
          {{ item.attributes.name.en == 'Reincarnation' ? 'Reenkarnasyon' : item.attributes.name.en == 'Action' ? 'Aksiyon' : item.attributes.name.en == 'Romance' ? 'Romantik' : item.attributes.name.en == 'Comedy' ? 'Komedi' : item.attributes.name.en == 'Adventure' ? 'Macera' : item.attributes.name.en == 'Magic' ? 'Büyü' : item.attributes.name.en == 'Drama' ? 'Dram' : item.attributes.name.en == 'Fantasy' ? 'Fantezi' : item.attributes.name.en == 'Adaptation' ? 'Adaptasyon' : item.attributes.name.en == 'Thriller' ? 'Gerilim' : item.attributes.name.en == 'Award Winning' ? 'Ödüllü' : item.attributes.name.en == 'Monsters' ? 'Canavarlar' : item.attributes.name.en == 'Psychological' ? 'Psikolojik' : item.attributes.name.en == 'Crime' ? 'Suç' : item.attributes.name.en == 'Survival' ? 'Hayatta Kalma' : item.attributes.name.en == 'Martial Arts' ? 'Dövüş Sanatları' : item.attributes.name.en == 'Mafia' ? 'Mafya' : item.attributes.name.en == 'Military' ? 'Askeri' : item.attributes.name.en == 'Philosophical' ? 'Felsefi' : item.attributes.name.en == 'Gore' ? 'Kan' : item.attributes.name.en == 'Medical' ? 'Tıbbi' : item.attributes.name.en == 'School Life' ? 'Okul Yaşamı' : item.attributes.name.en == 'Horror' ? 'Korku' : item.attributes.name.en == 'Police' ? 'Polisiye' : item.attributes.name.en == 'Slice of Life' ? 'Yaşamdan Kesit' : item.attributes.name.en == 'Mystery' ? 'Gizem' : item.attributes.name.en == 'Tragedy' ? 'Trajedi' : item.attributes.name.en == 'Demons' ? 'İblisler' : item.attributes.name.en == 'Monster Girls' ? 'Canavar Kızlar' : item.attributes.name.en == 'Supernatural' ? 'Doğaüstü' : item.attributes.name.en == 'Samurai' ? 'Samuray' : item.attributes.name.en == 'Time Travel' ? 'Zaman Yolculuğu' : item.attributes.name.en == 'Full Color' ? 'Tamamen Renkli' : item.attributes.name.en == `Boys' Love` ? 'Gay' : item.attributes.name.en == 'Music' ? 'Müzik' : item.attributes.name.en == `Girls' Love` ? 'Lezbiyen' : item.attributes.name.en == 'Vampires' ? 'Vampirler' : item.attributes.name.en == 'Web Comic' ? 'Web Çizgi Romanı' : item.attributes.name.en == 'Cooking' ? 'Yemek' : item.attributes.name.en == 'Historical' ? 'Tarihi' : item.attributes.name.en == 'Sci-Fi' ? 'Bilim Kurgu' : item.attributes.name.en }}
        </NuxtLink></span></div></div><br/>
        <button @click="redirect(`https://mangadex.org/manga/${info.data.value.data.id}`)" class="btn btn-block no-animation">MangaDex Sayfasına Gidin</button>
          <div class="divider"></div>
      </span>
</article><br/>
<br/>
<br/>
<div tabindex="0" class="collapse collapse-open border border-base-300 bg-base-100 rounded-box mr-14">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          <article class="prose pl-5 pt-5">
          <h2>Bölümler</h2>
          </article>
        </div>
        <div class="collapse-content">
<ul v-if="statuscode == 200" class="menu bg-base-100 w-full p-2 rounded-box">
<span v-for="item of epdata.volumes" :key="item">
  <li class="menu-title">
  <span>{{ item.title }}</span>
</li>
<li v-for="a of item.episodes" :key="a" class="hover-bordered">
  <a :href="route.query.theme ? `/manga/${route.params.id}/read/${a.vol}/${a.ep}?theme=` + route.query.theme : `/manga/${route.params.id}/read/${a.vol}/${a.ep}`">
<span class="text-primary"><font-awesome-icon icon="fa-solid fa-book-open" /></span>
    <b>{{ a.title }}</b> ({{ a.source }})
  </a>
</li>
</span>
</ul>
<div v-else class="alert shadow-lg">
<div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>Görünüşe göre bu serinin yüklü hiçbir bölümü yok.</span>
</div>
</div></div>
</div>
</div>
</div>
</div>
</template>
<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig();
function redirect(url) {
    window.location.href = url
  }
const info = await useFetch(`https://api.mangadex.org/manga/${route.params.id}`)
let coverartid;
  for(let item of info.data.value.data.relationships) {
      if(item.type == 'cover_art') {
          coverartid = item.id
      }
  }
let authorid;
  for(let item of info.data.value.data.relationships) {
      if(item.type == 'author') {
          authorid = item.id
      }
  }
  let artistid;
  for(let item of info.data.value.data.relationships) {
      if(item.type == 'artist') {
          artistid = item.id
      }
  }
const artist = await useFetch(`https://api.mangadex.org/author/${artistid}`)
const author = await useFetch(`https://api.mangadex.org/author/${authorid}`)
const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`)
const episodedata = await useFetch(`https://cdn.falsis.ga/mangile?token=${runtimeConfig.public.token}&id=${route.params.id}`)
const statuscode = episodedata.data.value.code
const epdata = episodedata.data.value.data
useHead({
  title: `${ info.data.value.data.attributes.title.en || info.data.value.data.attributes.title["ja-ro"] }`
})
</script>