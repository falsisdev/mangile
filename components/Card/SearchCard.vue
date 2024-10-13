<script setup>
import { data } from "@/assets/data.ts";

const props = defineProps({
  itemData: Object,
  index: Number,
});

onMounted(() => {
  const textElements = document.querySelectorAll("#marquee-text");
  textElements.forEach((textElement) => {
    const containerWidth = textElement.parentElement.offsetWidth;
    const textWidth = textElement.scrollWidth;

    if (textWidth > containerWidth) {
      textElement.classList.add("animate-marquee");
    }
  });
});
</script>
<template>
  <div
    class="card w-[275px] bg-base-100 rounded-lg mx-2 mb-2 shadow-lg shadow-base-300"
  >
    <figure class="w-full h-56">
      <img
        class="w-full rounded shadow-md"
        :src="itemData.images.jpg.large_image_url"
      />
    </figure>
    <div class="card-body h-72">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <span id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </span>
        </h2>
        <span class="text-xs -mt-1">{{ itemData.type }}</span>
      </span>
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
            :href="`/title/${itemData.mal_id}`"
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
                  :href="`/title/${itemData.mal_id}`"
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
<style>
@keyframes marquee {
  0% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 10s linear infinite;
  animation-delay: 0.5s;
}
</style>
