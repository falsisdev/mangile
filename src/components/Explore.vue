<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useFetch, useTitle } from "@vueuse/core";
//////////////////////////////////////////////////////////
import tags from "../assets/data/tags.json";
//////////////////////////////////////////////////////////
const route = useRoute();
useTitle("Keşfet", { titleTemplate: "%s | Mangile" });
//////////////////////////////////////////////////////////
const reload = () => window.location.reload();
const typecheck = (id) => {
  var searchParams = new URLSearchParams(window.location.search);
  if (
    document.getElementById(id).checked == true ||
    (document.getElementById(id).checked == "checked" &&
      searchParams.get("genres"))
  ) {
    searchParams.set(
      "genres",
      searchParams.get("genres") == undefined ||
        searchParams.get("genres") == "" ||
        searchParams.get("genres") == null
        ? id
        : `${searchParams.get("genres")},${id}`
    );
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
    document.getElementById("clearfilters").className = "btn visible";
  } else {
    var spc = searchParams.get("genres").split(",");
    delete spc[spc.indexOf(id)];
    searchParams.delete("genres");
    var newRelativePathQuery =
      window.location.pathname + spc.toString() == ","
        ? "?" + searchParams.toString()
        : "?" + searchParams.toString() + "&genres=" + spc.toString();
    history.pushState(
      null,
      "",
      newRelativePathQuery == window.location.pathname + "?"
        ? window.location.pathname
        : newRelativePathQuery
    );
  }
};
const demographicCheck = (id) => {
  var searchParams = new URLSearchParams(window.location.search);
  if (
    document.getElementById(id).checked == true ||
    (document.getElementById(id).checked == "checked" &&
      searchParams.get("demographic"))
  ) {
    searchParams.set(
      "demographic",
      searchParams.get("demographic") == undefined ||
        searchParams.get("demographic") == "" ||
        searchParams.get("demographic") == null
        ? id
        : `${searchParams.get("demographic")},${id}`
    );
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    document.getElementById("clearfilters").className = "btn visible";
    history.pushState(null, "", newRelativePathQuery);
  } else {
    var spc = searchParams.get("demographic").split(",");
    delete spc[spc.indexOf(id)];
    searchParams.delete("demographic");
    var newRelativePathQuery =
      window.location.pathname + spc.toString() == ","
        ? "?" + searchParams.toString()
        : "?" + searchParams.toString() + "&demographic=" + spc.toString();
    history.pushState(
      null,
      "",
      newRelativePathQuery == window.location.pathname + "?"
        ? window.location.pathname
        : newRelativePathQuery
    );
  }
};
const statusCheck = (id) => {
  var searchParams = new URLSearchParams(window.location.search);
  if (
    document.getElementById(id).checked == true ||
    (document.getElementById(id).checked == "checked" &&
      searchParams.get("status"))
  ) {
    searchParams.set(
      "status",
      searchParams.get("status") == undefined ||
        searchParams.get("status") == "" ||
        searchParams.get("status") == null
        ? id
        : `${searchParams.get("status")},${id}`
    );
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    document.getElementById("clearfilters").className = "btn visible";
    history.pushState(null, "", newRelativePathQuery);
  } else {
    var spc = searchParams.get("status").split(",");
    delete spc[spc.indexOf(id)];
    searchParams.delete("status");
    var newRelativePathQuery =
      window.location.pathname + spc.toString() == ","
        ? "?" + searchParams.toString()
        : "?" + searchParams.toString() + "&status=" + spc.toString();
    history.pushState(
      null,
      "",
      newRelativePathQuery == window.location.pathname + "?"
        ? window.location.pathname
        : newRelativePathQuery
    );
  }
};
const clearFilters = () => {
  var searchParams = new URLSearchParams(window.location.search);
  searchParams.delete("genres");
  searchParams.delete("demographic");
  searchParams.delete("status");
  var newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(
    null,
    "",
    newRelativePathQuery == window.location.pathname + "?"
      ? window.location.pathname
      : newRelativePathQuery
  );
  document.getElementById("clearfilters").className = "btn hidden";
  window.location.reload();
};
//////////////////////////////////////////////////////////
let statuscode;
let results;
let data;
let cover = [];
//////////////////////////////////////////////////////////
try {
  var isGenres =
    route.query.genres == null ||
    route.query.genres == "" ||
    route.query.genres == ","
      ? false
      : true;
  var isDemographic =
    route.query.demographic == null ||
    route.query.demographic == "" ||
    route.query.demographic == ","
      ? false
      : true;
  var isStatus =
    route.query.status == null ||
    route.query.status == "" ||
    route.query.status == ","
      ? false
      : true;
  let includedTags;
  let publicationDemographic;
  let status;
  if (isGenres) {
    for (let item of String(route.query.genres).split(",")) {
      includedTags = `${
        includedTags == undefined ? "" : includedTags
      }&includedTags[]=${item}`;
    }
  } else {
    includedTags = false;
  }
  if (isDemographic) {
    for (let item of String(route.query.demographic).split(",")) {
      publicationDemographic = `${
        publicationDemographic == undefined ? "" : publicationDemographic
      }&publicationDemographic[]=${item}`;
    }
  } else {
    publicationDemographic = false;
  }
  if (isStatus) {
    for (let item of String(route.query.status).split(",")) {
      status = `${status == undefined ? "" : status}&status[]=${item}`;
    }
  } else {
    status = false;
  }
  data = await useFetch(
    `https://api.mangadex.org/manga?excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb${
      includedTags == false ? "" : includedTags + "&includedTagsMode=OR"
    }${publicationDemographic == false ? "" : publicationDemographic}${
      status == false ? "" : status
    }&limit=100&order[rating]=desc&originalLanguage[]=ja`
  );
  results = JSON.parse(data.data.value).data;
  let coverartid;
  for (let item of results) {
    for (let i of item.relationships) {
      if (i.type == "cover_art") {
        coverartid = i.id;
        cover.push(
          await useFetch(`https://api.mangadex.org/cover/${coverartid}`)
        );
      }
    }
  }
  statuscode = 200;
} catch (error) {
  console.log(error);
  statuscode = 404;
}
//////////////////////////////////////////////////////////
</script>

<template>
  <br />
  <div class="grid grid-cols-12">
    <div class="col-span-8 col-start-1 col-end-11 my-5 ml-5">
      <!--page view-->
      <!--arama sonuçları-->
      <article class="prose max-w-none flex flex-row">
        <h1>Keşfet</h1>
        <span class="grow"></span>
        <button
          id="clearfilters"
          @click="clearFilters()"
          :class="`btn ${
            route.query.genres || route.query.demographic || route.query.status
              ? 'visible'
              : 'hidden'
          }`"
        >
          Filtreleri Temizle
        </button>
      </article>
      <div v-if="statuscode == 200" class="flex flex-row flex-wrap">
        <div
          v-for="item of results"
          v-bind:key="item"
          class="basis-1/5 card-side card card-compact bg-base-200 mx-1 shadow-lg border border-base-100 rounded-lg"
        >
          <div
            v-if="
              route.query.page == 1
                ? parseInt(results.indexOf(item)) < 20 &&
                  parseInt(results.indexOf(item)) > -1
                : route.query.page == 2
                ? parseInt(results.indexOf(item)) < 40 &&
                  parseInt(results.indexOf(item)) > 19
                : route.query.page == 3
                ? parseInt(results.indexOf(item)) < 60 &&
                  parseInt(results.indexOf(item)) > 39
                : route.query.page == 4
                ? parseInt(results.indexOf(item)) < 80 &&
                  parseInt(results.indexOf(item)) > 59
                : route.query.page == 5
                ? parseInt(results.indexOf(item)) < 100 &&
                  parseInt(results.indexOf(item)) > 79
                : parseInt(results.indexOf(item)) < 20 &&
                  parseInt(results.indexOf(item)) > -1
            "
          >
            <figure>
              <img
                class="rounded shadow-md w-full h-48"
                :src="`https://mangadex.org/covers/${item.id}/${
                  JSON.parse(cover[results.indexOf(item)].data.value).data
                    .attributes.fileName
                }.512.jpg`"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">
                {{
                  !item.attributes["altTitles"].some((x) => x.tr)
                    ? !item.attributes.title["en"]
                      ? !item.attributes.title["ja-ro"]
                        ? !item.attributes.title["ja"]
                          ? "Bilinmeyen Başlık"
                          : item.attributes.title["ja"]
                        : item.attributes.title["ja-ro"]
                      : item.attributes.title["en"]
                    : item.attributes["altTitles"].find((x) => x.tr).tr
                }}
              </h2>
              <p>
                {{
                  item.attributes.description["en"].substring(0, 100) + "..."
                }}
              </p>
              <div
                class="dropdown dropdown-hover dropdown-top flex justify-end bottom-0"
              >
                <a class="btn btn-primary" :href="`/manga/${item.id}`">
                  İncele!</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <article class="prose max-w-none p-5">
          <h2>Hiçbir Sonuç Bulunamadı!</h2>
        </article>
      </div>
      <div class="tabs tab-boxed my-2 justify-center">
        <RouterLink to="/explore?page=1" class="tab">1</RouterLink>
        <RouterLink to="/explore?page=2" class="tab">2</RouterLink>
        <RouterLink to="/explore?page=3" class="tab">3</RouterLink>
        <RouterLink to="/explore?page=4" class="tab">4</RouterLink>
        <RouterLink to="/explore?page=5" class="tab">5</RouterLink>
      </div>
      <!--arama sonuçları-->
    </div>
    <!--FILTER MENU-->
    <div class="col-span-1 col-start-11 col-end-12 mt-5">
      <ul class="menu w-64 p-2 h-full flex flex-col">
        <article class="prose"><h1>Filtreleme</h1></article>
        <div class="divider"></div>
        <li class="menu-title">
          <span>Türlere Göre Filtrele</span>
        </li>
        <div v-for="item of tags.genres" v-bind:key="item" class="form-control">
          <li>
            <label class="cursor-pointer label">
              <span class="label-text">{{ item.name }}</span>
              <input
                :id="item.id"
                @click="typecheck(item.id)"
                type="checkbox"
                :checked="
                  route.query['genres']
                    ? route.query['genres'].split(',').includes(item.id)
                      ? 'checked'
                      : false
                    : false
                "
                class="checkbox checkbox-secondary checkbox-sm"
              />
            </label>
          </li>
        </div>
        <div class="divider"></div>
        <li class="menu-title">
          <span>Demografiğe Göre Filtrele</span>
        </li>
        <div
          v-for="item of tags.demographics"
          v-bind:key="item"
          class="form-control"
        >
          <li>
            <label class="cursor-pointer label">
              <span class="label-text">{{ item.name }}</span>
              <input
                :id="item.id"
                @click="demographicCheck(item.id)"
                type="checkbox"
                :checked="
                  route.query['demographic']
                    ? route.query['demographic'].split(',').includes(item.id)
                      ? 'checked'
                      : false
                    : false
                "
                class="checkbox checkbox-secondary checkbox-sm"
              />
            </label>
          </li>
        </div>
        <div class="divider"></div>
        <li class="menu-title">
          <span>Yayın Durumuna Göre Filtrele</span>
        </li>
        <div v-for="item of tags.status" v-bind:key="item" class="form-control">
          <li>
            <label class="cursor-pointer label">
              <span class="label-text">{{ item.name }}</span>
              <input
                :id="item.id"
                @click="statusCheck(item.id)"
                type="checkbox"
                :checked="
                  route.query['status']
                    ? route.query['status'].split(',').includes(item.id)
                      ? 'checked'
                      : false
                    : false
                "
                class="checkbox checkbox-secondary checkbox-sm"
              />
            </label>
          </li>
        </div>
        <div class="divider"></div>
        <button @click="reload()" class="btn btn-secondary">Filtrele</button>
      </ul>
    </div>
  </div>
  <!--FILTER MENU-->
</template>
