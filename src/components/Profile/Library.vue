<script setup>
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";
import {
  getUserByID,
  getUser,
  getBookCaseById,
  getCollectionById,
} from "../../firebase";
import { useCookies } from "vue3-cookies";
import Card from "../Manga/Card.vue";
const { cookies } = useCookies();
const route = useRoute();

let id = route.params.id;
let loggeduser;
let infos = {
  reading: [],
  completed: [],
  onhold: [],
  dropped: [],
  planned: [],
  rereading: [],
};
let covers = {
  reading: [],
  completed: [],
  onhold: [],
  dropped: [],
  planned: [],
  rereading: [],
  lists: [],
};

const user = await getUserByID(id);
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
} else {
  loggeduser = null;
}
const bookcase = await getBookCaseById(id);
const collection = await getCollectionById(id);

for (let item of collection.lists) {
  if (item.series[0]) {
    const info = await useFetch(
      `https://api.mangadex.org/manga/${item.series[0]}`
    );
    let coverartid;
    for (let item of JSON.parse(info.data.value).data.relationships) {
      coverartid;
      if (item.type == "cover_art") {
        coverartid = item.id;
      }
    }
    const cover = await useFetch(
      `https://api.mangadex.org/cover/${coverartid}`
    );
    covers["lists"].push(JSON.parse(cover.data.value).data.attributes.fileName);
  } else {
    covers["lists"].push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
  }
}

for (let item of bookcase.reading) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["reading"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["reading"].push(JSON.parse(cover.data.value).data.attributes.fileName);
}

for (let item of bookcase.completed) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["completed"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["completed"].push(
    JSON.parse(cover.data.value).data.attributes.fileName
  );
}

for (let item of bookcase.onhold) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["onhold"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["onhold"].push(JSON.parse(cover.data.value).data.attributes.fileName);
}

for (let item of bookcase.dropped) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["dropped"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["dropped"].push(JSON.parse(cover.data.value).data.attributes.fileName);
}

for (let item of bookcase.plantoread) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["planned"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["planned"].push(JSON.parse(cover.data.value).data.attributes.fileName);
}

for (let item of bookcase.rereading) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos["rereading"].push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["rereading"].push(
    JSON.parse(cover.data.value).data.attributes.fileName
  );
}
</script>
<template>
  <article class="prose my-2">
    <h1 v-if="user.email == loggeduser.email">
      Kişisel Kütüphaneniz
      <span class="divider"></span>
    </h1>
    <h1 v-else>
      {{ user.username }} Kişisinin Kütüphanesi
      <span class="divider"></span>
    </h1>
  </article>
  <div role="tablist" class="tabs tabs-lifted bg-base-100 mt-2">
    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      class="tab"
      aria-label="Kitaplık"
      checked
    />
    <div role="tabpanel" class="tab-content mt-2">
      <article class="prose mt-5">
        <h1>
          <span class="flex flex-row"
            ><Icon
              icon="material-symbols:library-books-rounded"
              class="h-8 w-8 m-2"
            />
            Kitaplık
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      <div role="tablist" class="tabs tabs-boxed bg-base-100">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Okunuyor"
          checked
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon icon="material-symbols:play-arrow" class="h-7 w-7 m-1" />
                Okunuyor ({{ bookcase["reading"].length }}) </span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.reading"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="reading"
                :cover="covers.reading[bookcase['reading'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.reading[bookcase['reading'].indexOf(item)].data.value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.reading[bookcase['reading'].indexOf(item)].data.value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Bitirildi"
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon icon="material-symbols:check" class="h-7 w-7 m-1" />
                Bitirildi ({{ bookcase["completed"].length }})</span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.completed"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="completed"
                :cover="covers.completed[bookcase['completed'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.completed[bookcase['completed'].indexOf(item)].data
                      .value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.completed[bookcase['completed'].indexOf(item)].data
                      .value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Bekletiliyor"
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon
                  icon="material-symbols:pause-rounded"
                  class="h-7 w-7 m-1"
                />
                Bekletiliyor ({{ bookcase["onhold"].length }}) </span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.onhold"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="onhold"
                :cover="covers.onhold[bookcase['onhold'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.onhold[bookcase['onhold'].indexOf(item)].data.value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.onhold[bookcase['onhold'].indexOf(item)].data.value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Bırakıldı"
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon icon="material-symbols:delete" class="h-7 w-7 m-1" />
                Bırakıldı ({{ bookcase["dropped"].length }}) </span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.dropped"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="dropped"
                :cover="covers.dropped[bookcase['dropped'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.dropped[bookcase['dropped'].indexOf(item)].data.value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.dropped[bookcase['dropped'].indexOf(item)].data.value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Planlandı"
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon
                  icon="material-symbols:timer-pause"
                  class="h-7 w-7 m-1"
                />
                Planlandı ({{ bookcase["plantoread"].length }}) </span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.plantoread"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="plantoread"
                :cover="covers.planned[bookcase['plantoread'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.planned[bookcase['plantoread'].indexOf(item)].data
                      .value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.planned[bookcase['plantoread'].indexOf(item)].data
                      .value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          aria-label="Yeniden Okunuyor"
        />
        <div role="tabpanel" class="tab-content">
          <article class="prose mt-5">
            <h2>
              <span class="flex flex-row"
                ><Icon icon="material-symbols:refresh" class="h-7 w-7 m-1" />
                Yeniden Okunuyor ({{ bookcase["rereading"].length }})</span
              ><span class="divider"></span>
            </h2>
            <div class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.rereading"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
                :isLib="true"
                :id="item"
                :userid="id"
                status="rereading"
                :cover="covers.rereading[bookcase['rereading'].indexOf(item)]"
                :name="
                  JSON.parse(
                    infos.rereading[bookcase['rereading'].indexOf(item)].data
                      .value
                  ).data.attributes.title.en ||
                  JSON.parse(
                    infos.rereading[bookcase['rereading'].indexOf(item)].data
                      .value
                  ).data.attributes.title['ja-ro']
                "
              />
            </div>
          </article>
        </div>
      </div>
    </div>

    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      class="tab"
      aria-label="Koleksiyon"
    />
    <div role="tabpanel" class="tab-content">
      <article class="prose mt-5">
        <h1>
          <span class="flex flex-row"
            ><Icon icon="material-symbols:list-alt" class="h-8 w-8 m-2" />
            Listeler
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      <div class="flex flex-row flex-wrap">
        <Card
          v-for="item of collection.lists"
          class="m-2"
          :key="item"
          :isOwner="user.email == loggeduser.email"
          :isLib="true"
          :isList="true"
          :likes="item['likes'].length"
          :id="item.id"
          :userid="id"
          :description="item.description"
          :cover="covers.lists[collection['lists'].indexOf(item)]"
          :coverid="
            item.series[0]
              ? item.series[0]
              : '8e67e13e-fdeb-44f5-8ecb-c4609df6b02c'
          "
          :name="item.title"
        /><!--window.crypto.randomUUID()-->
      </div>
    </div>
    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      class="tab"
      aria-label="Favoriler"
    />
    <div role="tabpanel" class="tab-content p-10">
      <article class="prose mt-5">
        <h1>
          <span class="flex flex-row"
            ><Icon icon="material-symbols:favorite" class="h-8 w-8 m-2" />
            Favoriler
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      Tab content 3
    </div>
  </div>
</template>
