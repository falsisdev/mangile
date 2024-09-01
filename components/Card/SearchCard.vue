<script setup>
import { data } from "@/assets/data.ts";

const props = defineProps({
  itemData: Object,
  index: Number,
});
</script>
<template>
  <div
    class="card lg:w-[285px] bg-base-100 rounded-lg lg:mx-2 mx-5 mb-2 shadow-lg shadow-base-300"
  >
    <figure class="w-full h-56">
      <img
        class="w-full rounded shadow-md"
        :src="itemData.images.jpg.large_image_url"
      />
    </figure>
    <div class="card-body h-72">
      <h2 class="card-title">
        {{
          itemData["title"].length >= 61
            ? itemData["title"].substring(0, 60) + "..."
            : itemData["title"]
        }}
      </h2>
      <p>
        <span class="badge badge-accent badge-sm lg:badge-md gap-2 mr-1">{{
          data["malstatus"][String(itemData.status)]
        }}</span>
        <span
          v-for="genre of itemData.genres"
          :key="genre"
          class="badge badge-neutral badge-sm lg:badge-md gap-2 my-1 mr-1"
          >{{ data.malgenres[String(genre.name)] }}</span
        >
      </p>
      <div class="flex justify-end">
        <div
          :class="`dropdown dropdown-hover dropdown-top ${
            index % 4 > 1 ? 'dropdown-end' : 'dropdown-start'
          }`"
        >
          <NuxtLink
            class="btn btn-primary lg:btn-md btn-sm flex flex-row"
            :href="`/manga/${itemData.mal_id}`"
            ><Icon
              name="material-symbols:visibility-rounded"
              class="h-4 w-4"
            />Görüntüle</NuxtLink
          >
          <div
            tabindex="0"
            class="dropdown-content card lg:card-side image-full card-compact bg-base-200 lg:w-[700px] z-[1] shadow"
          >
            <figure class="h-96">
              <img
                class="rounded shadow-md"
                :src="itemData.images.jpg.large_image_url"
              />
            </figure>
            <div class="card-body">
              <h3 class="card-title text-white">
                {{ itemData["title"] }}
              </h3>
              <p class="text-white">
                <span class="badge badge-accent gap-2 mr-1">{{
                  data["malstatus"][String(itemData.status)]
                }}</span>
                <span
                  v-for="genre of itemData.genres"
                  :key="genre"
                  class="badge badge-neutral gap-2 my-1 mr-1"
                  >{{ data.malgenres[String(genre.name)] }}</span
                >
                <br /><br />
                {{
                  `${itemData["published"].prop.from.day} ${
                    data.months[
                      parseInt(itemData["published"].prop.from.month) - 1
                    ]
                  } ${itemData["published"].prop.from.year}'den ${
                    itemData["published"].prop.to.day
                      ? itemData["published"].prop.to.day
                      : ""
                  } ${
                    itemData["published"].prop.to.month
                      ? data.months[
                          parseInt(itemData["published"].prop.to.month) - 1
                        ]
                      : ""
                  } ${
                    itemData["published"].prop.to.year
                      ? itemData["published"].prop.to.year
                      : ""
                  }${
                    itemData.published.prop.year
                      ? "'e kadar yayınlandı"
                      : " günümüze kadar yayınını sürdürüyor"
                  }`
                }}
                <br />
                {{ itemData["synopsis"] }}
              </p>
              <div class="flex justify-end">
                <NuxtLink
                  class="btn btn-ghost flex flex-row mx-1"
                  :href="itemData.url"
                  ><Icon
                    name="simple-icons:myanimelist"
                    class="h-6 w-6 text-white"
                /></NuxtLink>
                <NuxtLink
                  class="btn btn-primary flex flex-row"
                  :href="`/manga/${itemData.mal_id}`"
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
</template>
