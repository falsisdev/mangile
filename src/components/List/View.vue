<script setup>
import {
  getListById,
  getUser,
  getIDByEmail,
  getUserByID,
  likeList,
  unlikeList,
  getUsersLikedList,
  isUserLikedTheList,
} from "../../firebase";
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";
import { useCookies } from "vue3-cookies";
import { ref } from "vue";
import ListEdit from "./Edit.vue";

const route = useRoute();
const { cookies } = useCookies();
const list = await getListById(route.params.id, route.params.listid);
const listuser = await getUserByID(route.params.id);
const users = await getUsersLikedList(route.params.id, route.params.listid);

let cover = [];
let manga = [];
let loggeduser;
let cookedid;
let likess = [];

if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
  cookedid = await getIDByEmail(cookies.get("email"));
} else {
  loggeduser = null;
}

for (let item of users) {
  likess.push(await getUserByID(item));
}

if (list.series[0]) {
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
} else {
  //
}

let likes = ref(list["likes"].length);
let isLiked = ref(await isUserLikedTheList(cookedid, route.params.listid));
const like = async () => {
  if (isLiked.value) {
    await unlikeList(cookedid, route.params.id, list.id);
    isLiked.value = false;
    likes.value -= 1;
  } else {
    await likeList(cookedid, route.params.id, route.params.listid);
    isLiked.value = true;
    likes.value += 1;
  }
};
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
      v-if="route.params.id == cookedid"
      class="btn btn-ghost hover:bg-transparent"
      ><div
        class="tooltip flex flex-row"
        data-tip="Kendi listenizi beğenemezsiniz"
      >
        <Icon icon="solar:heart-lock-bold" class="h-5 w-5 mr-1" />
        {{ likes }}
      </div>
    </label>
    <label v-else class="swap btn btn-ghost">
      <input id="likes" @click="like()" type="checkbox" />
      <span class="flex flex-row">
        <Icon
          v-if="isLiked"
          id="fav"
          icon="material-symbols:favorite"
          class="h-5 w-5"
        /><Icon
          v-else
          id="unfav"
          icon="material-symbols:favorite-outline"
          class="h-5 w-5"
        />
        {{ likes }}
      </span>
    </label>
    <label
      v-if="route.params.id == cookedid"
      class="btn btn-ghost hover:bg-transparent"
    >
      <div
        data-tip="Listeyi Beğenenler (yalnızca sen görebilirsin)"
        class="tooltip dropdown dropdown-bottom dropdown-end"
      >
        <div tabindex="0" role="button">
          <Icon icon="mdi:account-heart" class="h-5 w-5" />
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow no-animation"
        >
          <li>Listeyi Beğenenler</li>
          <li
            v-for="item of likess"
            :key="item"
            class="no-underline flex flex-row no-animation"
          >
            <a
              :href="`/user/${users[likess.indexOf(item)]}`"
              target="_blank"
              class="w-full no-underline"
              ><Icon icon="material-symbols:account-box" class="h-5 w-5" /><span
                class="mb-1"
                >{{ item.username }}</span
              ></a
            >
          </li>
        </ul>
      </div>
    </label>
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
  <div v-if="list.series[0]" class="flex flex-row flex-wrap">
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
  <div v-else>Bu listede herhangi bir manga bulunmamaktadır.</div>
</template>
