<script setup>
import {
  getListById,
  getUser,
  getIDByEmail,
  getUserByID,
} from "../../firebase";
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";
import { useCookies } from "vue3-cookies";
import ListEdit from "./Edit.vue";

const route = useRoute();
const { cookies } = useCookies();
const list = await getListById(route.params.id, route.params.listid);
const listuser = await getUserByID(route.params.id);

let cover = [];
let manga = [];
let loggeduser;
let cookedid;

if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
  cookedid = await getIDByEmail(cookies.get("email"));
} else {
  loggeduser = null;
}

for (let item of list.series) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  manga.push(JSON.parse(info.data.value).data);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cv = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  cover.push(JSON.parse(cv.data.value).data.attributes.fileName);
}
</script>
<template>
  <br />
  <article class="prose max-w-none p-5 flex flex-row">
    <span>
      <h1>{{ list.title }}</h1>
      {{ list.description }}
    </span>
    <span class="grow" />
    <label class="btn btn-ghost hover:bg-transparent"
      ><RouterLink
        class="no-underline flex flex-row items-center"
        :to="`/user/${route.params.id}`"
        ><div class="avatar placeholder mx-1">
          <div class="bg-neutral text-neutral-content w-8 rounded-full">
            <img :src="listuser.pfp" />
          </div>
        </div>
        {{ listuser.username }} tarafından</RouterLink
      ></label
    >
    <label
      :for="route.params.listid + 'edit'"
      v-if="cookedid == route.params.id"
      class="btn btn-ghost"
      ><Icon icon="material-symbols:edit" class="h-5 w-5" /> Düzenle</label
    >
  </article>
  <input
    type="checkbox"
    :id="route.params.listid + 'edit'"
    class="modal-toggle"
  />
  <div class="modal" role="dialog">
    <ListEdit
      :name="list.title"
      :id="route.params.listid"
      :description="list.description"
      :userid="route.params.id"
    />
  </div>
  <span class="divider" />
  <div class="flex flex-row flex-wrap">
    <div
      v-for="item of list.series"
      :key="item"
      class="lg:basis-1/5 w-full h-48 card card-compact card-side bg-base-200 m-1 shadow-lg border border-base-100 rounded-lg"
    >
      <figure>
        <img
          class="rounded shadow-md w-full h-48"
          :src="`https://mangadex.org/covers/${
            manga[list['series'].indexOf(item)].id
          }/${cover[list['series'].indexOf(item)]}.512.jpg`"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
          {{
            !manga[list["series"].indexOf(item)].attributes["altTitles"].some(
              (x) => x.tr
            )
              ? !manga[list["series"].indexOf(item)].attributes.title["en"]
                ? !manga[list["series"].indexOf(item)].attributes.title["ja-ro"]
                  ? !manga[list["series"].indexOf(item)].attributes.title["ja"]
                    ? "Bilinmeyen Başlık"
                    : manga[list["series"].indexOf(item)].attributes.title["ja"]
                  : manga[list["series"].indexOf(item)].attributes.title[
                      "ja-ro"
                    ]
                : manga[list["series"].indexOf(item)].attributes.title["en"]
              : manga[list["series"].indexOf(item)].attributes[
                  "altTitles"
                ].find((x) => x.tr).tr
          }}
        </h2>
        <p>Seri, {{ list.title }}'ın bir parçasıdır.</p>
        <div class="dropdown dropdown-hover dropdown-top flex justify-end">
          <a
            class="btn btn-primary"
            :href="`/manga/${manga[list['series'].indexOf(item)].id}`"
            >Görüntüle</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
