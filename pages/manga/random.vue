<template><navbar/>
    <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
<div class="card lg:card-side bg-base-100 p-[10px]">
    <article class="prose">
  <figure><img class="rounded shadow-md w-4/6 h-auto" :src="`https://mangadex.org/covers/${info.data.value.data.id}/${cover.data.value.data.attributes.fileName}.512.jpg`"></figure>
  </article>
  <div class="card-body">
    <article class="prose">
        <span class="card-title">
        <h1>{{ info.data.value.data.attributes.title.en }}</h1>
        </span>
        <span>
            <span v-for="item of info.data.value.data.attributes.tags" :key="item" :class="`m-1 badge badge-lg no-underline ${item.attributes.name.en == 'Award Winning' ? 'badge-accent' : item.attributes.name.en == 'Gore' ? 'badge-error' : ''}`">
            {{ item.attributes.name.en == 'Reincarnation' ? 'Reenkarnasyon' : item.attributes.name.en == 'Action' ? 'Aksiyon' : item.attributes.name.en == 'Romance' ? 'Romantik' : item.attributes.name.en == 'Comedy' ? 'Komedi' : item.attributes.name.en == 'Adventure' ? 'Macera' : item.attributes.name.en == 'Magic' ? 'Büyü' : item.attributes.name.en == 'Drama' ? 'Dram' : item.attributes.name.en == 'Fantasy' ? 'Fantezi' : item.attributes.name.en == 'Adaptation' ? 'Adaptasyon' : item.attributes.name.en == 'Thriller' ? 'Gerilim' : item.attributes.name.en == 'Award Winning' ? 'Ödüllü' : item.attributes.name.en == 'Monsters' ? 'Canavarlar' : item.attributes.name.en == 'Psychological' ? 'Psikolojik' : item.attributes.name.en == 'Crime' ? 'Suç' : item.attributes.name.en == 'Survival' ? 'Hayatta Kalma' : item.attributes.name.en == 'Martial Arts' ? 'Dövüş Sanatları' : item.attributes.name.en == 'Mafia' ? 'Mafya' : item.attributes.name.en == 'Military' ? 'Askeri' : item.attributes.name.en == 'Philosophical' ? 'Felsefi' : item.attributes.name.en == 'Gore' ? 'Kan' : item.attributes.name.en == 'Medical' ? 'Tıbbi' : item.attributes.name.en == 'School Life' ? 'Okul Yaşamı' : item.attributes.name.en == 'Horror' ? 'Korku' : item.attributes.name.en == 'Police' ? 'Polisiye' : item.attributes.name.en == 'Slice of Life' ? 'Yaşamdan Kesit' : item.attributes.name.en == 'Mystery' ? 'Gizem' : item.attributes.name.en == 'Tragedy' ? 'Trajedi' : item.attributes.name.en == 'Demons' ? 'İblisler' : item.attributes.name.en == 'Monster Girls' ? 'Canavar Kızlar' : item.attributes.name.en == 'Supernatural' ? 'Doğaüstü' : item.attributes.name.en == 'Samurai' ? 'Samuray' : item.attributes.name.en == 'Time Travel' ? 'Zaman Yolculuğu' : item.attributes.name.en == 'Full Color' ? 'Tamamen Renkli' : item.attributes.name.en == `Boys' Love` ? 'Gay' : item.attributes.name.en == 'Music' ? 'Müzik' : item.attributes.name.en == `Girls' Love` ? 'Lezbiyen' : item.attributes.name.en == 'Vampires' ? 'Vampirler' : item.attributes.name.en == 'Web Comic' ? 'Web Çizgi Romanı' : item.attributes.name.en == 'Cooking' ? 'Yemek' : item.attributes.name.en == 'Historical' ? 'Tarihi' : item.attributes.name.en == 'Sci-Fi' ? 'Bilim Kurgu' : item.attributes.name.en }}
            </span><br/>
            <span><font-awesome-icon icon="fa-solid fa-clock-rotate-left" /></span> {{ !info.data.value.data.attributes.year ? "Fi Tarihi'nde" :  `${info.data.value.data.attributes.year}'de`  }} yayınlanmaya başladı{{ info.data.value.data.attributes.status == 'completed' ? ' ve tamamlandı.' : info.data.value.data.attributes.status == 'ongoing' ? ' ve yayınlanmaya devam ediyor.' : info.data.value.data.attributes.status == 'hiatus' ? ' ve yayına ara verildi.' : '.'}}<br/>
            <div class="divider"></div>
            <span>{{ info.data.value.data.attributes.description.en }}</span>
        </span>
</article><br/>
<div class="divider"></div>
</div>
</div>
    <div class="card-actions justify-center pt-5">
      <button @click="mangapage()" class="btn">Manganın Sayfasına Git</button>
    </div>
</div>
</div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
const info = await useFetch('https://api.mangadex.org/manga/random?contentRating[]=safe')
let coverartid;
//info.data["relationships"].forEach((item) => item.type == 'cover_art' ? coverartid = item.id : '')
    for(let item of info.data.value.data.relationships) {
        if(item.type == 'cover_art') {
            coverartid = item.id
        }
    }
const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`)
function mangapage() {
            window.location.href = route.query.theme ? '/manga/' + info.data.value.data.id + "?theme=" + route.query.theme : '/manga/' + info.data.value.data.id
        }
</script>