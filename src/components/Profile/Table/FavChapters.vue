<script setup>
import {
  getVol,
  checkMangaExists,
  checkChapterInFavorites,
  unlikeChapter,
  likeChapter,
  getUser,
  getIDByEmail,
} from "../../../firebase";
import { useFetch } from "@vueuse/core";
import { useCookies } from "vue3-cookies";
import { ref } from "vue";

const { cookies } = useCookies();
const props = defineProps({
  isOwner: Boolean,
  infos: Object,
  covers: String,
});

let loggeduser;
let id;
//////////////////////////////////////////////////////////
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
  id = await getIDByEmail(cookies.get("email"));
} else {
  loggeduser = null;
}

let infos = [];
let epps = [];
let exists;
let isFav;
let likeSwitch;
for (let item of props.infos) {
  infos.push(await useFetch(`https://api.mangadex.org/manga/${item.mangaid}`));
  exists = await checkMangaExists(item.mangaid);
  isFav = ref(await checkChapterInFavorites(id, item.title));
  const getVolData = async (i) => {
    return await getVol(item.mangaid, i);
  };
  for (let i of Object(await Object(getVolData(item.vol))).episodes) {
    if (i.ep == item.ep) {
      epps.push(i);
    }
  }
  likeSwitch = async () => {
    if (isFav.value) {
      await unlikeChapter(id, item.title);
      isFav.value = false;
    } else {
      await likeChapter(id, item);
      isFav.value = true;
    }
  };
}
</script>
<template>
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th v-if="isOwner"></th>
          <th>Manga Adı</th>
          <th>Cilt No.</th>
          <th>Bölüm No.</th>
          <th>Kaynak</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of epps" :key="item">
          <th v-if="isOwner">
            <span v-if="exists" class="tooltip" data-tip="Favorilerden Çıkar">
              <label
                v-if="isFav"
                @click="likeSwitch()"
                class="btn btn-secondary btn-xs"
                ><Icon icon="material-symbols:favorite" class="h-3 w-3"
              /></label>
              <label v-else @click="likeSwitch()" class="btn btn-ghost btn-xs"
                ><Icon icon="material-symbols:favorite-outline" class="h-3 w-3"
              /></label>
            </span>
          </th>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img
                    :src="`https://mangadex.org/covers/${
                      JSON.parse(infos[epps.indexOf(item)].data.value).data.id
                    }/${covers[epps.indexOf(item)]}.512.jpg`"
                  />
                </div>
              </div>
              <div>
                <div class="font-bold">
                  {{ item["title"].replace(`Bölüm ${item.ep} - `, "") }}
                </div>
                <div class="text-sm opacity-50">
                  {{
                    (!JSON.parse(
                      infos[epps.indexOf(item)].data.value
                    ).data.attributes["altTitles"].some((x) => x.tr)
                      ? !JSON.parse(infos[epps.indexOf(item)].data.value).data
                          .attributes.title["en"]
                        ? !JSON.parse(infos[epps.indexOf(item)].data.value).data
                            .attributes.title["ja-ro"]
                          ? !JSON.parse(infos[epps.indexOf(item)].data.value)
                              .data.attributes.title["ja"]
                            ? "Bilinmeyen Başlık"
                            : JSON.parse(infos[epps.indexOf(item)].data.value)
                                .data.attributes.title["ja"]
                          : JSON.parse(infos[epps.indexOf(item)].data.value)
                              .data.attributes.title["ja-ro"]
                        : JSON.parse(infos[epps.indexOf(item)].data.value).data
                            .attributes.title["en"]
                      : JSON.parse(
                          infos[epps.indexOf(item)].data.value
                        ).data.attributes["altTitles"].find((x) => x.tr).tr
                    ).length >= 17
                      ? (!JSON.parse(
                          infos[epps.indexOf(item)].data.value
                        ).data.attributes["altTitles"].some((x) => x.tr)
                          ? !JSON.parse(infos[epps.indexOf(item)].data.value)
                              .data.attributes.title["en"]
                            ? !JSON.parse(infos[epps.indexOf(item)].data.value)
                                .data.attributes.title["ja-ro"]
                              ? !JSON.parse(
                                  infos[epps.indexOf(item)].data.value
                                ).data.attributes.title["ja"]
                                ? "Bilinmeyen Başlık"
                                : JSON.parse(
                                    infos[epps.indexOf(item)].data.value
                                  ).data.attributes.title["ja"]
                              : JSON.parse(infos[epps.indexOf(item)].data.value)
                                  .data.attributes.title["ja-ro"]
                            : JSON.parse(infos[epps.indexOf(item)].data.value)
                                .data.attributes.title["en"]
                          : JSON.parse(
                              infos[epps.indexOf(item)].data.value
                            ).data.attributes["altTitles"].find((x) => x.tr).tr
                        ).substring(0, 17) + "..."
                      : !JSON.parse(
                          infos[epps.indexOf(item)].data.value
                        ).data.attributes["altTitles"].some((x) => x.tr)
                      ? !JSON.parse(infos[epps.indexOf(item)].data.value).data
                          .attributes.title["en"]
                        ? !JSON.parse(infos[epps.indexOf(item)].data.value).data
                            .attributes.title["ja-ro"]
                          ? !JSON.parse(infos[epps.indexOf(item)].data.value)
                              .data.attributes.title["ja"]
                            ? "Bilinmeyen Başlık"
                            : JSON.parse(infos[epps.indexOf(item)].data.value)
                                .data.attributes.title["ja"]
                          : JSON.parse(infos[epps.indexOf(item)].data.value)
                              .data.attributes.title["ja-ro"]
                        : JSON.parse(infos[epps.indexOf(item)].data.value).data
                            .attributes.title["en"]
                      : JSON.parse(
                          infos[epps.indexOf(item)].data.value
                        ).data.attributes["altTitles"].find((x) => x.tr).tr
                  }}
                </div>
              </div>
            </div>
          </td>
          <td>
            Cilt
            <span class="badge badge-secondary badge-sm my-[1px]">{{
              item.vol
            }}</span>
          </td>
          <td>
            Bölüm
            <span class="badge badge-secondary badge-sm my-[1px]">{{
              item.ep
            }}</span>
          </td>
          <td>
            <a target="_blank" :href="`/scan/${item.scan}`">{{
              item.source
            }}</a>
          </td>
          <th>
            <a
              target="_blank"
              :href="`/manga/${
                JSON.parse(infos[epps.indexOf(item)].data.value).data.id
              }/read/${item.vol}/${item.ep}`"
              class="btn btn-ghost btn-xs"
              >Oku</a
            >
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
