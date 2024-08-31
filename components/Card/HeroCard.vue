<script setup>
import { data } from "@/assets/data.ts";

const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper
    :centeredSlides="true"
    :autoplay="{
      delay: 10000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :modules="[SwiperAutoplay]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div
        class="hero bg-base-200 h-auto"
        :style="`background-image: url(${item.image});`"
      >
        <div class="hero-overlay bg-opacity-90 bg-base-200"></div>
        <div class="hero-content flex flex-row-reverse mx-10">
          <img
            :src="item.image"
            class="max-w-sm h-[500px] rounded-lg shadow-2xl"
          />
          <div>
            <h1 class="text-5xl font-bold">{{ item.name }}</h1>
            <span class="flex mt-5">
              <span
                class="badge badge-accent gap-2 tooltip tooltip-accent"
                :data-tip="data['malstatus'][String(item.status)]"
                >{{ data["malstatus"][String(item.status)] }}</span
              >
              <span
                v-for="genre of item.genres"
                :key="genre"
                class="badge badge-neutral gap-2 mx-1 tooltip"
                :data-tip="data.malgenres[String(genre.name)]"
                >{{ data.malgenres[String(genre.name)] }}</span
              >
            </span>
            <p class="max-h-48 overflow-auto my-2">
              {{ item.description }}
            </p>
            <div class="dropdown dropdown-hover dropdown-top">
              <NuxtLink class="btn btn-primary" :href="`/manga/${item.id}`"
                ><Icon
                  name="material-symbols:visibility-rounded"
                  class="h-4 w-4"
                />Görüntüle</NuxtLink
              >
              <div
                tabindex="0"
                class="dropdown-content card lg:card-side card-compact bg-base-200 lg:w-[700px] z-[1] shadow"
              >
                <figure>
                  <img class="h-full rounded shadow-md" :src="item.image" />
                </figure>
                <div class="card-body max-w-lg">
                  <h3 class="card-title">{{ item.name }}</h3>
                  <span class="flex flex-row flex-wrap">
                    <span
                      class="badge badge-accent gap-2 tooltip tooltip-accent mr-1"
                      :data-tip="data['malstatus'][String(item.status)]"
                      >{{ data["malstatus"][String(item.status)] }}</span
                    >
                    <span
                      v-for="genre of item.genres"
                      :key="genre"
                      class="badge badge-neutral gap-2 mr-1 mb-1 tooltip"
                      :data-tip="data.malgenres[String(genre.name)]"
                      >{{ data.malgenres[String(genre.name)] }}</span
                    >
                  </span>
                  <span class="-mt-1">
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
                  </span>
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
  </swiper>
</template>
