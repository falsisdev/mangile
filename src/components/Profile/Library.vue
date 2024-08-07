<script setup>
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";
import { useCookies } from "vue3-cookies";
//////////////////////////////////////////////////////////
import {
  getUserByID,
  getUser,
  getBookCaseById,
  getCollectionById,
  getUsersLikedList,
  getFavoriteMangas,
  getListById,
} from "../../firebase";
import Card from "../Profile/Card/Library.vue";
import LikedCard from "../List/Card/Liked.vue";
import CreatedCard from "../List/Card/Created.vue";
import FavMangaCard from "../Profile/Card/FavManga.vue";
//////////////////////////////////////////////////////////
const { cookies } = useCookies();
const route = useRoute();
//////////////////////////////////////////////////////////
let id = route.params.id;
let loggeduser;
let series0;
let likedlists = [];
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
  liked: [],
  favmangas: [],
};
//////////////////////////////////////////////////////////
const user = await getUserByID(id);
const bookcase = await getBookCaseById(id);
const collection = await getCollectionById(id);
const favmangas = await getFavoriteMangas(id);
const likedids = collection.liked;
//////////////////////////////////////////////////////////
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
} else {
  loggeduser = null;
}
//////////////////////////////////////////////////////////
for (let item of favmangas) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item.mangaid}`);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers["favmangas"].push(
    JSON.parse(cover.data.value).data.attributes.fileName
  );
}
//////////////////////////////////////////////////////////
for (let item of likedids) {
  likedlists.push(await getListById(item.userid, item.listid));
}
for (let item of likedlists) {
  try {
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
      covers["liked"].push(
        JSON.parse(cover.data.value).data.attributes.fileName
      );
      series0 = item.series[0];
    } else {
      covers["liked"].push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
      series0 = false;
    }
  } catch (err) {
    covers["liked"].push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
    series0 = false;
  }
}
//////////////////////////////////////////////////////////
for (let item of collection.lists) {
  try {
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
      covers["lists"].push(
        JSON.parse(cover.data.value).data.attributes.fileName
      );
      series0 = item.series[0];
    } else {
      covers["lists"].push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
      series0 = false;
    }
  } catch (err) {
    covers["lists"].push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
    series0 = false;
  }
}
//////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////
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
            <div v-if="!bookcase['reading'].length">
              Okumakta olduğunuz bir seri yok.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.reading"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            <div v-if="!bookcase['completed'].length">
              Daha önce hiçbir manga bitirmediniz.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.completed"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            <div v-if="!bookcase['onhold'].length">
              Bekletmekte olduğunuz bir seri yok.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.onhold"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            <div v-if="!bookcase['dropped'].length">
              Bırakıtğınız bir seri yok.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.dropped"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            <div v-if="!bookcase['plantoread'].length">
              Okumayı planladığınız bir seri yok.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.plantoread"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            <div v-if="!bookcase['rereading'].length">
              Yeniden okuyor olduğunuz bir seri yok.
            </div>
            <div v-else class="flex flex-row flex-wrap">
              <Card
                v-for="item of bookcase.rereading"
                class="m-2"
                :key="item"
                :isOwner="user.email == loggeduser.email"
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
            Oluşturulan Listeler
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      <div v-if="!collection['lists'].length">Hiç liste oluşturmamışsınız.</div>
      <div v-else class="flex flex-row flex-wrap">
        <CreatedCard
          v-for="item of collection.lists"
          class="m-2"
          :key="item"
          :likes="item['likes'].length"
          :id="item.id"
          :userid="id"
          :isOwner="user.email == loggeduser.email"
          :description="item.description"
          :cover="covers.lists[collection['lists'].indexOf(item)]"
          :coverid="
            item.series[0]
              ? item.series[0]
              : '8e67e13e-fdeb-44f5-8ecb-c4609df6b02c'
          "
          :name="item.title"
        />
      </div>
      <article class="prose mt-5">
        <h1>
          <span class="flex flex-row"
            ><Icon icon="material-symbols:list-alt" class="h-8 w-8 m-2" />
            Beğenilen Listeler
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      <div v-if="!series0">Hiç liste beğenmemişsiniz.</div>
      <div v-else class="flex flex-row flex-wrap">
        <LikedCard
          v-for="item of likedlists"
          class="m-2"
          :key="item"
          :id="item.id"
          :userid="likedids[likedlists.indexOf(item)].userid"
          :description="item.description"
          :cover="covers.liked[likedlists.indexOf(item)]"
          :coverid="series0 ? series0 : '8e67e13e-fdeb-44f5-8ecb-c4609df6b02c'"
          :name="item.title"
        />
      </div>
    </div>
    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      class="tab"
      aria-label="Favoriler"
    />
    <div role="tabpanel" class="tab-content">
      <article class="prose mt-5">
        <h1>
          <span class="flex flex-row"
            ><Icon icon="mdi:book-heart" class="h-8 w-8 m-2" />
            Favori Mangalar
          </span>
          <span class="divider"></span>
        </h1>
      </article>
      <div v-if="favmangas[0]" class="flex flex-row flex-wrap">
        <FavMangaCard
          v-for="item of favmangas"
          class="m-2"
          :key="item"
          :isOwner="user.email == loggeduser.email"
          :id="item.mangaid"
          :description="item.description"
          :cover="covers.favmangas[favmangas.indexOf(item)]"
          :name="item.title"
        />
      </div>
      <div v-else>Seçtiğiniz bir manga bulunmamaktadır.</div>
    </div>
  </div>
</template>
