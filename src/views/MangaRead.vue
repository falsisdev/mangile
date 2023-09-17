<template>
  <!--page view-->
  <div class="card lg:card-side bg-base-100 p-[10px]">
    <div class="card-body">
      <RouterLink class="link link-hover" :to="`/manga/${route.params.id}`">{{
        JSON.parse(info.data.value).data.attributes.title.en
      }}</RouterLink>
      <article class="prose max-w-none">
        <h1>{{ epp.title }}</h1>
      </article>
      <span class="flex flex-row">
        <span>Çeviri Ekibi: {{ epp.source }}</span>
        <span class="grow"></span>
        <span>Sayfa Sayısı: {{ epp["pages"].length }}</span>
      </span>
      <span class="flex flex-row">
        <button @click="onceki()" class="btn btn-ghost btn-sm">
          <Icon
            icon="material-symbols:drive-file-move-rtl-rounded"
            class="h-5 w-5"
          />
          Önceki Bölüm
        </button>
        <div class="grow"></div>
        <button @click="sonraki()" class="btn btn-ghost btn-sm">
          Sonraki Bölüm
          <Icon icon="material-symbols:drive-file-move" class="h-5 w-5" />
        </button>
      </span>
      <br />
      <div class="divider"></div>
      <span class="flex flex-row">
        <button
          @click="sayfa('geri')"
          class="btn btn-ghost btn-sm btn-disabled"
          id="geri"
        >
          <Icon icon="material-symbols:arrow-back" class="h-5 w-5" /> Önceki
          Sayfa
        </button>
        <div class="grow"></div>
        <button @click="sayfa('ileri')" class="btn btn-ghost btn-sm" id="ileri">
          Sonraki Sayfa
          <Icon icon="material-symbols:arrow-forward" class="h-5 w-5" />
        </button>
      </span>
      <br />
      <div v-if="statuscode == 200" class="flex flex-col flex-wrap">
        <img :src="epp.pages[currentsayfa]" id="pages" class="object-contain" />
      </div>
      <br />
      <div class="divider"></div>
      <span class="flex flex-row">
        <button @click="onceki()" class="btn btn-ghost btn-sm">
          <Icon
            icon="material-symbols:drive-file-move-rtl-rounded"
            class="h-5 w-5"
          />
          Önceki Bölüm
        </button>
        <div class="grow"></div>
        <button @click="sonraki()" class="btn btn-ghost btn-sm">
          Sonraki Bölüm
          <Icon icon="material-symbols:drive-file-move" class="h-5 w-5" />
        </button>
      </span>
    </div>
  </div>
</template>
<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useFetch } from "@vueuse/core";

const route = useRoute();
const info = await useFetch(
  `https://api.mangadex.org/manga/${route.params.id}`
);
const episodedata = await useFetch(
  `${import.meta.env.VITE_BASEURL}/mangile/manga?token=${
    import.meta.env.VITE_TOKEN
  }&id=${route.params.id}`
);
const statuscode = JSON.parse(episodedata.data.value).statusCode;
const epdata = JSON.parse(episodedata.data.value).data.result;
let eps;
for (let item of epdata.volumes) {
  if (item.vol == route.params.vol) {
    eps = item.episodes;
  }
}
let epp;
for (let item of eps) {
  if (item.ep == route.params.ep) {
    epp = item;
  }
}
function onceki() {
  window.location.href = `/manga/${route.params.id}/read/${route.params.vol}/${
    parseInt(route.params.ep) - 1
  }`;
}
function sonraki() {
  window.location.href = `/manga/${route.params.id}/read/${route.params.vol}/${
    parseInt(route.params.ep) + 1
  }`;
}
let currentsayfa = 0;
function sayfa(yon) {
  if (yon == "ileri") {
    if (parseInt(currentsayfa) + 1 == epp["pages"].length) {
      document.getElementById("ileri").className =
        "btn btn-ghost btn-sm btn-disabled";
    } else {
      if (parseInt(currentsayfa) == 0) {
        currentsayfa++;
        document.getElementById("geri").className = "btn btn-ghost btn-sm";
      }
      currentsayfa++;
      document.getElementById("pages").src = epp.pages[currentsayfa];
    }
  } else if (yon == "geri") {
    if (parseInt(currentsayfa) == 1) {
      document.getElementById("geri").className =
        "btn btn-ghost btn-sm btn-disabled";
    } else {
      if (parseInt(currentsayfa) + 1 == epp["pages"].length) currentsayfa -= 1;
      document.getElementById("ileri").className = "btn btn-ghost btn-sm";
    }
    currentsayfa -= 1;
    document.getElementById("pages").src = epp.pages[currentsayfa];
  }
}
</script>
