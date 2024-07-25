<script setup>
import { useFetch } from "@vueuse/core";
import { getLastChapters, getLastChapter } from "../../firebase";

let statuscode;
let data = new Array();
let cover = [];
let chdata = [];
try {
  for (let i of await getLastChapters()) {
    let a = await useFetch(
      `https://api.mangadex.org/manga/${
        Object(await getLastChapter(i)).mangaid
      }`
    );
    chdata.push(Object(await getLastChapter(i)));
    data.push(JSON.parse(a.data.value).data);
  }
  let coverartid;
  for (let item of data) {
    for (let i of item.relationships) {
      if (i.type == "cover_art") {
        coverartid = i.id;
        let a = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
        cover.push(JSON.parse(a.data.value).data);
      }
    }
  }
  statuscode = 200;
} catch (error) {
  statuscode = 404;
  console.log(error);
}
</script>

<template>
  <br />
  <article class="prose max-w-none p-5">
    <h1>Son Yüklenen Bölümler</h1>
    Yükleme Kaynağı: Mangile Verileri
  </article>
  <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
    <div
      v-for="item of data"
      :key="item"
      class="basis-1/4 card card-compact card-side bg-base-200 mx-2 shadow-lg border border-base-100 rounded-lg"
    >
      <figure>
        <img
          class="rounded w-full h-48"
          :src="`https://mangadex.org/covers/${item.id}/${
            cover[parseInt(data.indexOf(item))].attributes.fileName
          }.512.jpg`"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
          {{
            !data[data.indexOf(item)].attributes.title["en"]
              ? !data[data.indexOf(item)].attributes.title["ja-ro"]
                ? ""
                : data[data.indexOf(item)].attributes.title["ja-ro"]
              : data[data.indexOf(item)].attributes.title["en"]
          }}
        </h2>
        <p>
          Cilt {{ chdata[data.indexOf(item)].vol }}
          {{ chdata[data.indexOf(item)].epname }}<br />
          Kaynak: {{ chdata[data.indexOf(item)].fansub }}
        </p>
        <div class="dropdown dropdown-hover dropdown-top flex justify-end">
          <a
            class="btn btn-primary"
            :href="`/manga/${data[data.indexOf(item)].id}/read/${
              chdata[data.indexOf(item)].vol
            }/${chdata[data.indexOf(item)].ep}`"
            >Oku!</a
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <article class="prose max-w-none p-5">
      <h2>Hiçbir Sonuç Bulunamadı!</h2>
    </article>
  </div>
</template>
