<template>
  <div class="col-span-2 col-start-2 col-end-8 my-5 ml-5"><!--page view-->
  <alert/>
  <br>
  <!--arama sonuçları-->
  <article class="prose max-w-none p-5 flex flex-row">
        <h1 class="pr-5">Keşfet</h1>
        <span class="grow"></span>
        <button id="clearfilters"  @click="clearFilters()" :class="`btn ${route.query.genres || route.query.demographic || route.query.status ? 'visible' : 'hidden'}`">Filtreleri Temizle</button>
      </article>
      <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
      <div v-for="item of results" v-bind:key="item" class="basis-1/5 card w-auto h-auto bg-base-100 rounded-lg">
        <div v-if="route.query.page == 1 ? parseInt(results.indexOf(item)) < 20 && parseInt(results.indexOf(item)) > -1 : route.query.page == 2 ? parseInt(results.indexOf(item)) < 40 && parseInt(results.indexOf(item)) > 19 : route.query.page == 3 ? parseInt(results.indexOf(item)) < 60 && parseInt(results.indexOf(item)) > 39 : route.query.page == 4 ? parseInt(results.indexOf(item)) < 80 && parseInt(results.indexOf(item)) > 59 : route.query.page == 5 ? parseInt(results.indexOf(item)) < 100 && parseInt(results.indexOf(item)) > 79 : parseInt(results.indexOf(item)) < 20 && parseInt(results.indexOf(item)) > -1">
        <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${item.id}/${cover[results.indexOf(item)].data.value.data.attributes.fileName}.512.jpg`"/></figure>
        <div class="card-body mx-7">
          <h2 class="card-title">{{ !item.attributes.title["en"] ? !item.attributes.title["ja-ro"] ? "" : item.attributes.title["ja-ro"] : item.attributes.title["en"] }}</h2>
          <div class="dropdown dropdown-hover dropdown-top flex justify-end">
            <a class="btn btn-primary" :href="route.query.theme ? `/manga/${item.id}?theme=` + route.query.theme : `/manga/${item.id}`"> İncele!</a>
          </div>
        </div>
      </div>
      </div>
      </div>
      <div v-else>
          <article class="prose max-w-none p-5">
            <h2> Hiçbir Sonuç Bulunamadı!</h2>
          </article>
        </div>
        <div class="tabs tab-boxed my-2 justify-center">
        <NuxtLink :to="route.query.theme ? '/discover?page=1&theme=' + route.query.theme : '/discover?page=1'" class="tab">1</NuxtLink>
        <NuxtLink :to="route.query.theme ? '/discover?page=2&theme=' + route.query.theme : '/discover?page=2'" class="tab">2</NuxtLink>
        <NuxtLink :to="route.query.theme ? '/discover?page=3&theme=' + route.query.theme : '/discover?page=3'" class="tab">3</NuxtLink>
        <NuxtLink :to="route.query.theme ? '/discover?page=4&theme=' + route.query.theme : '/discover?page=4'" class="tab">4</NuxtLink>
        <NuxtLink :to="route.query.theme ? '/discover?page=5&theme=' + route.query.theme : '/discover?page=5'" class="tab">5</NuxtLink>
  </div>  
      <!--arama sonuçları-->
  </div>
  <!--FILTER MENU-->
  <div class="col-span-2 col-start-8 col-end-8">
  <ul class="menu w-64 p-2 h-full flex flex-col"> 
      <div class="divider"></div>
    <li class="menu-title">
      <span>Türlere Göre Filtrele</span>
    </li>
  <div v-for="item of tags.genres" v-bind:key="item" class="form-control">
    <li>
    <label class="cursor-pointer label">
      <span class="label-text">{{ item.name }}</span>
      <input :id="item.id" @click="typecheck(item.id)" type="checkbox" :checked="route.query['genres'] ? route.query['genres'].split(',').includes(item.id) ? 'checked' : false : false" class="checkbox checkbox-secondary checkbox-sm" />
    </label>
  </li></div>
    <div class="divider"></div>
    <li class="menu-title">
      <span>Demografiğe Göre Filtrele</span>
    </li>
    <div v-for="item of tags.demographics" v-bind:key="item" class="form-control"><li>
      <label class="cursor-pointer label">
      <span class="label-text">{{ item.name }}</span> 
      <input :id="item.id" @click="demographicCheck(item.id)" type="checkbox" :checked="route.query['demographic'] ? route.query['demographic'].split(',').includes(item.id) ? 'checked' : false : false" class="checkbox checkbox-secondary checkbox-sm" />
      </label>
  </li></div>
  <div class="divider"></div>
    <li class="menu-title">
      <span>Yayın Durumuna Göre Filtrele</span>
    </li>
    <div v-for="item of tags.status" v-bind:key="item" class="form-control"><li>
      <label class="cursor-pointer label">
      <span class="label-text">{{  item.name }}</span> 
      <input :id="item.id" @click="statusCheck(item.id)" type="checkbox" :checked="route.query['status'] ? route.query['status'].split(',').includes(item.id) ? 'checked' : false : false" class="checkbox checkbox-secondary checkbox-sm" />
      </label>
  </li></div>
  <div class="divider"></div>
  <button @click="reload()" class="btn btn-secondary">Filtrele</button>
  </ul>
  </div>
  <!--FILTER MENU-->
  </template>
  <script setup>
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig();
  const tags = {
    genres: [
      {
        "name": "Aksiyon",
        "id": "391b0423-d847-456f-aff0-8b0cfc03066b"
      },
      {
        "name": "Macera",
        "id": "87cc87cd-a395-47af-b27a-93258283bbc6"
      },
      {
        "name": "Bilim Kurgu",
        "id": "256c8bd9-4904-4360-bf4f-508a76d67183"
      },
      {
        "name": "Fantezi",
        "id": "cdc58593-87dd-415e-bbc0-2ec27bf404cc"
      },
      {
        "name": "Dram",
        "id": "b9af3a63-f058-46de-a9a0-e0c13906197a"
      },
      {
        "name": "Trajedi",
        "id": "f8f62932-27da-4fe4-8ee1-6779a8c5edba"
      },
      {
        "name": "Gizem",
        "id": "ee968100-4191-4968-93d3-f82d72be7e46"
      },
      {
        "name": "Suç",
        "id": "5ca48985-9a9d-4bd8-be29-80dc0303db72"
      },
      {
        "name": "Polisiye",
        "id": "df33b754-73a3-4c54-80e6-1a74a8058539"
      },
      {
        "name": "Psikolojik",
        "id": "3b60b75c-a2d7-4860-ab56-05f391bb889c"
      },
      {
        "name": "Korku",
        "id": "cdad7e68-1419-41dd-bdce-27753074a640"
      },
      {
        "name": "Gerilim",
        "id": "07251805-a27e-4d59-b488-f0bfbec15168"
      },
      {
        "name": "Romantik",
        "id": "423e2eae-a7a2-4a8b-ac03-a8351462d71d"
      },
      {
        "name": "Komedi",
        "id": "4d32cc48-9f00-4cca-9b5a-a839f0764984"
      },
      {
        "name": "Zaman Yolculuğu",
        "id": "292e862b-2d17-4062-90a2-0356caa4ae27"
      },
      {
        "name": "Reenkarnasyon",
        "id": "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0"
      },
      {
        "name": "Isekai",
        "id": "ace04997-f6bd-436e-b261-779182193d3d"
      },
      {
        "name": "Doğaüstü",
        "id": "eabc5b4c-6aff-42f3-b657-3e90cbd00b75"
      },
      {
        "name": "Yaşamdan Kesit",
        "id": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9"
      },
      {
        "name": "Okul Yaşamı",
        "id": "caaa44eb-cd40-4177-b930-79d3ef2afe87"
      },
      {
        "name": "Ödüllü",
        "id": "0a39b5a1-b235-4886-a747-1d05d216532d"
      }
    ],
    demographics: [
      {
        "name": "Shounen",
        "id": "shounen"
      },
      {
        "name": "Seinen",
        "id": "seinen"
      },
      {
        "name": "Shoujo",
        "id": "shoujo"
      },
      {
        "name": "Josei",
        "id": "josei"
      }
    ],
    status: [
      {
        "name": "Yayınlanıyor",
        "id": "ongoing"
      },
      {
        "name": "Tamamlandı",
        "id": "completed"
      },
      {
        "name": "Ara Verildi",
        "id": "hiatus"
      },
      {
        "name": "İptal Edildi",
        "id": "cancelled"
      }
    ]
  }
  
  function reload() {
    window.location.reload();
  }
  
  function typecheck(id) {
    var searchParams = new URLSearchParams(window.location.search);
    if(document.getElementById(id).checked == true || document.getElementById(id).checked == "checked" && searchParams.get("genres")){
      searchParams.set("genres", searchParams.get("genres") == undefined || searchParams.get("genres") == '' || searchParams.get("genres") == null ? id : `${searchParams.get("genres")},${id}`)
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
      document.getElementById("clearfilters").className = "btn visible"
    }else{
      var spc = searchParams.get("genres").split(",")
      delete spc[spc.indexOf(id)]
      searchParams.delete("genres")
      var newRelativePathQuery = window.location.pathname + spc.toString() == ',' ? '?' + searchParams.toString() : '?' + searchParams.toString() + "&genres=" + spc.toString()
      history.pushState(null, '', newRelativePathQuery == window.location.pathname + '?' ? window.location.pathname : newRelativePathQuery);
    }
  }

  function demographicCheck(id) {
    var searchParams = new URLSearchParams(window.location.search);
    if(document.getElementById(id).checked == true || document.getElementById(id).checked == "checked" && searchParams.get("demographic")){
      searchParams.set("demographic", searchParams.get("demographic") == undefined || searchParams.get("demographic") == '' || searchParams.get("demographic") == null ? id : `${searchParams.get("demographic")},${id}`)
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      document.getElementById("clearfilters").className = "btn visible"
      history.pushState(null, '', newRelativePathQuery);
    }else{
      var spc = searchParams.get("demographic").split(",")
      delete spc[spc.indexOf(id)]
      searchParams.delete("demographic")
      var newRelativePathQuery = window.location.pathname + spc.toString() == ',' ? '?' + searchParams.toString() : '?' + searchParams.toString() + "&demographic=" + spc.toString()
      history.pushState(null, '', newRelativePathQuery == window.location.pathname + '?' ? window.location.pathname : newRelativePathQuery);
    }
  }

  function statusCheck(id) {
    var searchParams = new URLSearchParams(window.location.search);
    if(document.getElementById(id).checked == true || document.getElementById(id).checked == "checked" && searchParams.get("status")){
      searchParams.set("status", searchParams.get("status") == undefined || searchParams.get("status") == '' || searchParams.get("status") == null ? id : `${searchParams.get("status")},${id}`)
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      document.getElementById("clearfilters").className = "btn visible"
      history.pushState(null, '', newRelativePathQuery);
    }else{
      var spc = searchParams.get("status").split(",")
      delete spc[spc.indexOf(id)]
      searchParams.delete("status")
      var newRelativePathQuery = window.location.pathname + spc.toString() == ',' ? '?' + searchParams.toString() : '?' + searchParams.toString() + "&status=" + spc.toString()
      history.pushState(null, '', newRelativePathQuery == window.location.pathname + '?' ? window.location.pathname : newRelativePathQuery);
    }
  }

  function clearFilters() {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("genres")
    searchParams.delete("demographic")
    searchParams.delete("status")
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
    history.pushState(null, '', newRelativePathQuery == window.location.pathname + '?' ? window.location.pathname : newRelativePathQuery);
    document.getElementById("clearfilters").className = "btn hidden"
    window.location.reload()
  }

  let statuscode;
  let results;
  let data;
  let cover = [];
  try{
    var isGenres = route.query.genres == null || route.query.genres == '' || route.query.genres == ',' ? false : true
    var isDemographic = route.query.demographic == null || route.query.demographic == '' || route.query.demographic == ',' ? false : true
    var isStatus = route.query.demographic == null || route.query.demographic == '' || route.query.demographic == ',' ? false : true
    let includedTags;
    let publicationDemographic;
    let status;
    if(isGenres) {
    for(let item of String(route.query.genres).split(",")) {
      includedTags = `${includedTags == undefined ? '' : includedTags}&includedTags[]=${item}`
    }
  }else{
    includedTags = false
  }
  if(isDemographic) {
    for(let item of String(route.query.demographic).split(",")) {
      publicationDemographic = `${publicationDemographic == undefined ? '' : publicationDemographic}&publicationDemographic[]=${item}`
    }
  }else{
    publicationDemographic = false
  }
  if(isStatus) {
    for(let item of String(route.query.status).split(",")) {
      status = `${status == undefined ? '' : status}&status[]=${item}`
    }
  }else{
    status = false
  }
  data = await useFetch(`https://api.mangadex.org/manga?excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb${includedTags == false ? '' : includedTags + "&includedTagsMode=OR"}${publicationDemographic == false ? '' : publicationDemographic}${status == false ? '' : status}&limit=100&order[rating]=desc&originalLanguage[]=ja`)
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
    console.log(error)
    statuscode = 404
  }
  useHead({
  title: "Manga Keşfet"
})
  </script>