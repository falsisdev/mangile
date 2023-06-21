<template>
    <div class="col-span-2 col-start-2 col-end-7 my-5"><!--page view-->
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
            <TurkishGenres v-for="item of info.data.value.data.attributes.tags" :key="item" :genre="item.attributes.name.en" :id="item.id"/>
            <br/>
            <span><font-awesome-icon icon="fa-solid fa-clock-rotate-left" /></span> {{ !info.data.value.data.attributes.year ? "Fi Tarihi'nde" :  `${info.data.value.data.attributes.year}'de`  }} yayınlanmaya başladı{{ info.data.value.data.attributes.status == 'completed' ? ' ve tamamlandı.' : info.data.value.data.attributes.status == 'ongoing' ? ' ve yayınlanmaya devam ediyor.' : info.data.value.data.attributes.status == 'hiatus' ? ' ve yayına ara verildi.' : '.'}}<br/>
            <div class="divider"></div>
            <span>{{ info.data.value.data.attributes.description.en }}</span>
        </span>
</article><br/>
<div class="divider"></div>
</div>
</div>
    <div class="card-actions justify-center my-5">
      <button @click="mangapage()" class="btn">Manganın Sayfasına Git</button>
      <button :disabled="refreshing" @click="refreshAll" class="btn">Mangayı Değiştir </button>
    </div>
</div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
const info = await useFetch('https://api.mangadex.org/manga/random?contentRating[]=safe')
let coverartid;
    for(let item of info.data.value.data.relationships) {
        if(item.type == 'cover_art') {
            coverartid = item.id
        }
    }
const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`)
function mangapage() {
            window.location.href = route.query.theme ? '/manga/' + info.data.value.data.id + "?theme=" + route.query.theme : '/manga/' + info.data.value.data.id
        }
const refreshing = ref(false)
const refreshAll = async () => {
  refreshing.value = true
  try {
    await refreshNuxtData()
  } finally {
    refreshing.value = false
  }
}

useHead({
  title: "Rastgele Manga"
})
definePageMeta({
    layout: "default",
})
</script>