<template>
<navbar/>
<div class="grid grid-rows-1 grid-cols-7"><!--grid-->
<leftmenu/>
<div class="col-span-2 col-start-2 col-end-7 p-5 pl-20"><!--page view-->
<alert/>
<br>
<!--arama sonuçları-->
<article class="prose max-w-none p-5">
      <h1>Keşfet</h1>
    </article>
    <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <div v-for="item of results" v-bind:key="item" class="basis-1/4 card w-auto h-auto bg-base-100 p-[10px] rounded-lg">
      <figure><img class="rounded shadow-md w-64 h-72" :src="`https://mangadex.org/covers/${item.id}/${cover[results.indexOf(item)].data.value.data.attributes.fileName}.512.jpg`"/></figure>
      <div class="card-body">
        <h2 class="card-title">{{ !item.attributes.title["en"] ? !item.attributes.title["ja-ro"] ? "" : item.attributes.title["ja-ro"].substring(0,20) + "...": item.attributes.title["en"].substring(0,20) + "..." }}</h2>
        <p>{{ !item.attributes.description["en"] ? "" : parseInt(item.attributes.description["en"]) == 0 ? "" : item.attributes.description["en"].substring(0,20) + "..."}}</p><br>
        <div class="dropdown dropdown-hover dropdown-top flex justify-end">
          <a class="btn btn-secondary" :href="`/manga/${item.id}`"> İncele!</a>
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
</div>
<!--FILTER MENU-->
<div class="col-span-2 col-start-7 col-end-7">
<ul class="menu w-64 p-2 h-full flex flex-col"> 
    <div class="divider"></div>
  <li class="menu-title">
    <span>Türlere Göre Filtrele</span>
  </li>
<div v-for="item of tags.genres" v-bind:key="item" class="form-control">
  <li>
  <label class="cursor-pointer label">
    <span class="label-text">{{ item.name }}</span>
    <input :id="item.id" @click="typecheck(item.id)" type="checkbox" :checked="route.query['genres[]'] ? route.query['genres[]'].split(',').includes(item.id) ? false : 'checked' : 'checked'" class="checkbox checkbox-secondary checkbox-sm" />
  </label>
</li></div>
  <div class="divider"></div>
  <li class="menu-title">
    <span>Demografiğe Göre Filtrele</span>
  </li>
  <div v-for="item of tags.demographics" v-bind:key="item" class="form-control"><li>
    <label class="cursor-pointer label">
    <span class="label-text">{{ item.name }}</span> 
    <input :id="item.id" type="checkbox" checked="checked" class="checkbox checkbox-secondary checkbox-sm" />
    </label>
</li></div>
<div class="divider"></div>
  <li class="menu-title">
    <span>Yayın Durumuna Göre Filtrele</span>
  </li>
  <div v-for="item of tags.status" v-bind:key="item" class="form-control"><li>
    <label class="cursor-pointer label">
    <span class="label-text">{{  item.name }}</span> 
    <input :id="item.id" type="checkbox" checked="checked" class="checkbox checkbox-secondary checkbox-sm" />
    </label>
</li></div>
<div class="divider"></div>
<button @click="reload()" class="btn btn-secondary">Filtrele</button>
</ul>
</div>
<!--FILTER MENU-->
</div>    
</template>
<script setup>
const route = useRoute()
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
  if(document.getElementById(id).checked == true || document.getElementById(id).checked == "checked" && searchParams.get("genres[]")){
    var spc = searchParams
    delete spc.get("genres[]").split(",")[searchParams.get("genres[]").split(",").indexOf(id)]
    var newRelativePathQuery = window.location.pathname + '?' + spc.toString();
    history.pushState(null, '', newRelativePathQuery == window.location.pathname + '?' ? window.location.pathname : newRelativePathQuery);
  }else{
    searchParams.set("genres[]", searchParams.get("genres[]") == undefined ? id : String(`${Array(searchParams.get("genres[]")).join(",")},${id}`))
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
  }
}

let statuscode;
let results;
let data;
let cover = [];
try{
data = await useFetch(`https://api.mangadex.org/manga?excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb${route.query["genres"] ? "," + route.query["genres"] : ""}&limit=100&order[followedCount]=desc&originalLanguage[]=ja`)
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