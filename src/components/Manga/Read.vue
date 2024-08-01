<template>
  <!--page view-->
  <div class="card lg:card-side bg-base-100">
    <div class="card-body">
      <Flipbook
        class="flipbook"
        v-slot="flipbook"
        :pages="pages"
        forwardDirection="left"
        wheel="zoom"
      >
        <RouterLink class="link link-hover" :to="`/manga/${route.params.id}`">{{
          JSON.parse(info.data.value).data.attributes.title.en
        }}</RouterLink>
        <article class="prose max-w-none">
          <h1>{{ epp.title }}</h1>
        </article>
        <span class="flex flex-row">
          <span
            >Çeviri Ekibi:
            <RouterLink class="link" :to="`/scan/${epp.scan}`">{{
              epp.source
            }}</RouterLink></span
          >
          <span class="grow" />
          <span
            >Sayfa: {{ flipbook.numPages }} - {{ flipbook.numPages - 1 }}/{{
              flipbook.page + 1
            }}
            - {{ flipbook.page }}</span
          >
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
        <div class="divider"></div>
        <div role="alert" class="alert bg-base-400 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span
            >Manga okumak, Türkçe yazılmış bir çizgi roman, kitap veya dergi
            okumaktan farklıdır. Mangalar geleneksel olarak sağdan sola,
            yukarıdan aşağıya doğru okunur. Dolayısıyla sayfayı soldan sağa
            doğru çevirmeniz gerekiyor. Hala anlamadıysanız
            <a
              href="https://www.google.com/search?q=Manga+panelleri+nasıl+okunmalıdır%3F"
              class="link"
              target="_blank"
              >ufak bir araştırma</a
            >
            yapabilirsiniz.</span
          >
        </div>
      </Flipbook>
      <br />
      <div class="divider"></div>
    </div>
  </div>
</template>
<style scoped>
.flipbook {
  width: 67vw;
  height: 60vw;
}
</style>
<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useFetch, useTitle } from "@vueuse/core";
import Flipbook from "flipbook-vue";
//////////////////////////////////////////////////////////
import { /*getManga,*/ getVol } from "../../firebase";
//////////////////////////////////////////////////////////
const route = useRoute();
const info = await useFetch(
  `https://api.mangadex.org/manga/${route.params.id}`
);
useTitle(
  !JSON.parse(info.data.value).data.attributes["altTitles"].some((x) => x.tr)
    ? !JSON.parse(info.data.value).data.attributes.title["en"]
      ? !JSON.parse(info.data.value).data.attributes.title["ja-ro"]
        ? !JSON.parse(info.data.value).data.attributes.title["ja"]
          ? "Bilinmeyen Başlık"
          : JSON.parse(info.data.value).data.attributes.title["ja"]
        : JSON.parse(info.data.value).data.attributes.title["ja-ro"]
      : JSON.parse(info.data.value).data.attributes.title["en"]
    : JSON.parse(info.data.value).data.attributes["altTitles"].find((x) => x.tr)
        .tr +
        " " +
        route.params.vol +
        ". Cilt " +
        route.params.ep +
        ". Bölüm",
  { titleTemplate: "%s | Mangile" }
);
//////////////////////////////////////////////////////////
async function getVolData(i) {
  const voldata = await getVol(route.params.id, i);
  return voldata;
}

let epp;
for (let item of Object(await Object(getVolData(route.params.vol))).episodes) {
  if (item.ep == route.params.ep) {
    epp = item;
  }
}

let pages = [];
for (var i = 0; i < epp.page; i++) {
  pages.push(
    `https://firebasestorage.googleapis.com/v0/b/mangile-2229f.appspot.com/o/mangas%2F${route.params.id}%2F${route.params.vol}%2F${route.params.ep}%2F${i}_0.png?alt=media&token=a5def522-8428-4c79-9f9b-d5ca4c750624`
  );
}

async function onceki() {
  try {
    if (
      Object(await Object(getVolData(route.params.vol)))["episodes"].some(
        (x) => x.ep == parseInt(route.params.ep) - 1
      )
    ) {
      window.location.href = `/manga/${route.params.id}/read/${
        route.params.vol
      }/${parseInt(route.params.ep) - 1}`;
    } else if (
      Object(await Object(getVolData(parseInt(route.params.vol) - 1)))[
        "episodes"
      ].some((x) => x.ep == parseInt(route.params.ep) - 1)
    ) {
      window.location.href = `/manga/${route.params.id}/read/${
        route.params.vol - 1
      }/${parseInt(route.params.ep) - 1}`;
    } else {
      window.location.href = `/manga/${route.params.id}`;
    }
  } catch (err) {
    window.location.href = `/manga/${route.params.id}`;
  }
}
async function sonraki() {
  try {
    if (
      Object(await Object(getVolData(route.params.vol)))["episodes"].some(
        (x) => x.ep == parseInt(route.params.ep) + 1
      )
    ) {
      window.location.href = `/manga/${route.params.id}/read/${
        route.params.vol
      }/${parseInt(route.params.ep) + 1}`;
    } else if (
      Object(await Object(getVolData(parseInt(route.params.vol) + 1)))[
        "episodes"
      ].some((x) => x.ep == parseInt(route.params.ep) + 1)
    ) {
      window.location.href = `/manga/${route.params.id}/read/${
        parseInt(route.params.vol) + 1
      }/${parseInt(route.params.ep) + 1}`;
    } else {
      window.location.href = `/manga/${route.params.id}`;
    }
  } catch (err) {
    window.location.href = `/manga/${route.params.id}`;
  }
}

let current = 0;
</script>
