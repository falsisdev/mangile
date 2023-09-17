<script setup>
import { useFetch } from "@vueuse/core";
import Tags from "../Tags.vue";

const info = await useFetch(
  "https://api.mangadex.org/manga/random?contentRating[]=safe"
);
let coverartid;
for (let item of JSON.parse(info.data.value).data.relationships) {
  if (item.type == "cover_art") {
    coverartid = item.id;
  }
}
const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
function mangapage() {
  window.location.href = "/manga/" + JSON.parse(info.data.value).data.id;
}

const refreshAll = () => {
  window.location.reload();
};
</script>

<template>
  <div
    v-for="item of JSON.parse(info.data.value).data.attributes.tags"
    :key="item"
  >
    <div
      class="alert alert-warning"
      v-if="
        item.attributes.name.en == `Boys' Love` ||
        item.attributes.name.en == `Girls' Love` ||
        item.attributes.name.en == 'Sexual Violence' ||
        item.attributes.name.en == 'Sexual Violence' ||
        item.attributes.name.en == 'Genderswap' ||
        item.attributes.name.en == 'Harem' ||
        item.attributes.name.en == 'Reverse Harem' ||
        item.attributes.name.en == 'Doujinshi'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span
        >Dikkat: Şuanda bakışıyor olduğunuz seri içerisinde olumsuz örnek
        içeriyor olabilir. Lütfen seriyi okumaya başlamadan önce bundan haberdar
        olun.</span
      >
      <div class="alert alert-error" v-if="item.attributes.name.en == `Gore`">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span
          >Dikkat: Şuanda karşı karşıya olduğunuz seri kan, vahşet veya mide
          bulandırıcı içerikler içeriyor olabilir. Lütfen bu konuda hassassanız
          seriyi okumayın.</span
        >
      </div>
    </div>
  </div>

  <div class="col-span-2 col-start-2 col-end-7 my-5">
    <!--page view-->
    <div class="card lg:card-side bg-base-100 p-[10px]">
      <article class="prose">
        <figure>
          <img
            class="rounded shadow-md w-4/6 h-auto"
            :src="`https://mangadex.org/covers/${
              JSON.parse(info.data.value).data.id
            }/${JSON.parse(cover.data.value).data.attributes.fileName}.512.jpg`"
          />
        </figure>
      </article>
      <div class="card-body">
        <article class="prose">
          <span class="card-title">
            <h1>{{ JSON.parse(info.data.value).data.attributes.title.en }}</h1>
          </span>
          <span>
            <Tags
              :tags="
                JSON.stringify(JSON.parse(info.data.value).data.attributes.tags)
              "
            />
            <br />
            <span
              ><font-awesome-icon icon="fa-solid fa-clock-rotate-left"
            /></span>
            {{
              !JSON.parse(info.data.value).data.attributes.year
                ? "Fi Tarihi'nde"
                : `${JSON.parse(info.data.value).data.attributes.year}'de`
            }}
            yayınlanmaya başladı{{
              JSON.parse(info.data.value).data.attributes.status == "completed"
                ? " ve tamamlandı."
                : JSON.parse(info.data.value).data.attributes.status ==
                  "ongoing"
                ? " ve yayınlanmaya devam ediyor."
                : JSON.parse(info.data.value).data.attributes.status == "hiatus"
                ? " ve yayına ara verildi."
                : "."
            }}<br />
            <div class="divider"></div>
            <span>{{
              JSON.parse(info.data.value).data.attributes.description.en
            }}</span>
          </span>
        </article>
        <br />
        <div class="divider"></div>
      </div>
    </div>
    <div class="card-actions justify-center my-5">
      <button @click="mangapage()" class="btn">Manganın Sayfasına Git</button>
      <button @click="refreshAll" class="btn">Mangayı Değiştir</button>
    </div>
  </div>
</template>
