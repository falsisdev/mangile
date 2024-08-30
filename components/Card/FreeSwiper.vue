<script setup>
import { data } from "@/assets/data.ts";

const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper :spaceBetween="20" :slidesPerView="4">
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div class="card w-72 bg-base-100 shadow-lg rounded-lg shadow-base-300">
        <figure class="w-full h-56">
          <img class="w-full rounded shadow-md" :src="item.image" />
        </figure>
        <div class="card-body h-72">
          <h2 class="card-title">{{ item.name }}</h2>
          <p>
            {{
              item.description ? item.description.substring(0, 75) + "..." : ""
            }}
          </p>
          <div class="flex justify-end">
            <div
              :class="`dropdown dropdown-hover dropdown-top ${
                itemData.indexOf(item) > 1 ? 'dropdown-end' : 'dropdown-start'
              }`"
            >
              <NuxtLink
                class="btn btn-primary flex flex-row"
                :href="`/manga/${item.id}`"
                ><Icon
                  name="material-symbols:visibility-rounded"
                  class="h-4 w-4"
                />Görüntüle</NuxtLink
              >
              <div
                tabindex="0"
                class="dropdown-content card lg:card-side card-compact bg-base-200 lg:w-[700px] z-[1] shadow"
              >
                <figure class="w-full">
                  <img
                    class="w-full h-full rounded shadow-md"
                    :src="item.image"
                  />
                </figure>
                <div class="card-body max-w-lg">
                  <h3 class="card-title">{{ item.name }}</h3>
                  <span class="flex flex-row flex-wrap">
                    <span
                      class="badge badge-accent gap-2 mr-1 mt-1 tooltip tooltip-accent"
                      :data-tip="data['malstatus'][String(item.status)]"
                      >{{ data["malstatus"][String(item.status)] }}</span
                    >
                    <span
                      v-for="genre of item.genres"
                      :key="genre"
                      class="badge badge-neutral gap-2 my-1 mr-1 tooltip"
                      :data-tip="data.malgenres[String(genre.name)]"
                      >{{ data.malgenres[String(genre.name)] }}</span
                    >
                    <br /><br />
                  </span>
                  {{
                    `${item["date"].from.day} ${
                      data.months[parseInt(item["date"].from.month) - 1]
                    } ${item["date"].from.year}'den ${
                      item["date"].to.day ? item["date"].to.day : ""
                    } ${
                      item["date"].to.month
                        ? data.months[parseInt(item["date"].to.month) - 1]
                        : ""
                    } ${item["date"].to.year ? item["date"].to.year : ""}${
                      item.date.to.year
                        ? "'e kadar yayınlandı"
                        : " günümüze kadar yayınını sürdürüyor"
                    }`
                  }}
                  <p class="max-h-32 overflow-auto">
                    {{ item.description }}
                  </p>
                  <div class="flex justify-end">
                    <NuxtLink
                      class="btn btn-ghost flex flex-row mx-1 tooltip"
                      data-tip="MyAnimeList sayfasını görüntüle"
                      :href="item.url"
                      ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
                    /></NuxtLink>
                    <NuxtLink
                      class="btn btn-primary flex flex-row tooltip"
                      data-tip="Mangile sayfasını görüntüle"
                      :href="`/manga/${item.id}`"
                      ><Icon
                        name="material-symbols:visibility-rounded"
                        class="h-4 w-4"
                      />Görüntüle</NuxtLink
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
    <br />
  </swiper>
</template>
