<script setup>
import { useFetch, useTitle } from "@vueuse/core";
import { useRoute } from "vue-router";
//////////////////////////////////////////////////////////
import { getScan } from "../../firebase";
import Card from "./Card.vue";
//////////////////////////////////////////////////////////
const route = useRoute();
const scan = await getScan(route.params.name);
//////////////////////////////////////////////////////////
useTitle(scan.name, { titleTemplate: "%s | Mangile" });
//////////////////////////////////////////////////////////
let infos = [];
let covers = [];
//////////////////////////////////////////////////////////
for (let item of scan.series) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos.push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers.push(JSON.parse(cover.data.value).data.attributes.fileName);
}
</script>
<template>
  <div class="card card-compact w-full bg-base-100 p-5 m-5">
    <figure>
      <img
        :src="scan.banner"
        class="opacity-75 shadow-lg border border-base-200"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">
        <div class="avatar absolute mb-20">
          <div class="w-24 mask mask-squircl">
            <img :src="scan.logo" />
          </div>
        </div>
      </h2>
      <h2 class="card-title">
        {{ scan.name }}
      </h2>
      <br />
      <p>
        {{ scan.description }}
      </p>
      <div class="card-actions justify-end">
        <a :href="scan.website" target="_blank"
          ><button class="btn btn-accent">
            <span><Icon icon="tabler:external-link" class="h-5 w-5" /></span
            >Websitesini ziyaret et
          </button></a
        >
      </div>
    </div>
  </div>
  <Card
    v-for="item of scan.series"
    class="m-2"
    :key="item"
    :id="item"
    :cover="covers[scan['series'].indexOf(item)]"
    :name="
      !JSON.parse(
        infos[scan['series'].indexOf(item)].data.value
      ).data.attributes['altTitles'].some((x) => x.tr)
        ? !JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
            .attributes.title['en']
          ? !JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
              .attributes.title['ja-ro']
            ? !JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
                .attributes.title['ja']
              ? 'Bilinmeyen Başlık'
              : JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
                  .attributes.title['ja']
            : JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
                .attributes.title['ja-ro']
          : JSON.parse(infos[scan['series'].indexOf(item)].data.value).data
              .attributes.title['en']
        : JSON.parse(
            infos[scan['series'].indexOf(item)].data.value
          ).data.attributes['altTitles'].find((x) => x.tr).tr
    "
  />
</template>
