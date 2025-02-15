<script setup>
import { data } from "@/assets/data.ts";

const { isMobileOrTablet } = useDevice();

const props = defineProps({
    itemData: Object,
    type: String,
    index: Number
})

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
<main>
    <!-- type = default -->
    <aside v-if="type == 'default'">
        <div v-if="!isMobileOrTablet" class="card w-72 bg-base-100 rounded-lg">
            <figure class="w-full h-56">
            <img class="w-full rounded shadow-md" :src="itemData.image" />
            </figure>
        <div class="card-body h-72 shadow-xl">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{ itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman") }}</span>
          </span>
          <p class="text-sm">
            {{
              itemData.description ? itemData.description.substring(0, 75) + "..." : ""
            }}
          </p>
          <div class="flex justify-end">
            <div
              :class="`dropdown dropdown-hover dropdown-top ${
                index > 1 ? 'dropdown-end' : 'dropdown-start'
              }`"
            >
              <NuxtLink
                class="btn btn-primary btn-md flex flex-row"
                :href="`/title/${itemData.id}`"
                ><Icon
                  name="material-symbols:visibility-rounded"
                  class="h-4 w-4"
                />Görüntüle</NuxtLink
              >
              <div
                tabindex="0"
                class="dropdown-content card card-side card-compact bg-base-200 w-[700px] z-[1] shadow"
              >
                <figure class="w-full">
                  <img
                    class="w-full h-full rounded shadow-md"
                    :src="itemData.image"
                  />
                </figure>
                <div class="card-body max-w-lg">
                  <h3 class="card-title">{{ itemData.name }}</h3>
                  <span class="flex flex-row flex-wrap">
                    <span
                      class="badge badge-accent gap-2 mr-1 mt-1 tooltip tooltip-accent"
                      :data-tip="data['malstatus'][String(itemData.status)]"
                      >{{ data["malstatus"][String(itemData.status)] }}</span
                    >
                    <span
                      v-for="genre of itemData.genres"
                      :key="genre"
                      class="badge badge-neutral gap-2 my-1 mr-1 tooltip"
                      :data-tip="data.malgenres[String(genre.name)]"
                      >{{ data.malgenres[String(genre.name)] }}</span
                    >
                    <br /><br />
                  </span>
                  {{
                    `${itemData["date"].from.day} ${
                      data.months[parseInt(itemData["date"].from.month) - 1]
                    } ${itemData["date"].from.year}'den ${
                        itemData["date"].to.day ? itemData["date"].to.day : ""
                    } ${
                        itemData["date"].to.month
                        ? data.months[parseInt(itemData["date"].to.month) - 1]
                        : ""
                    } ${itemData["date"].to.year ? itemData["date"].to.year : ""}${
                        itemData.date.to.year
                        ? "'e kadar yayınlandı"
                        : " günümüze kadar yayınını sürdürüyor"
                    }`
                  }}
                  <p class="max-h-32 overflow-auto">
                    {{ itemData.description }}
                  </p>
                  <div class="flex justify-end">
                    <NuxtLink
                      class="btn btn-ghost flex flex-row mx-1 tooltip"
                      data-tip="MyAnimeList sayfasını görüntüle"
                      :href="itemData.url"
                      ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
                    /></NuxtLink>
                    <NuxtLink
                      class="btn btn-primary flex flex-row tooltip"
                      data-tip="Mangile sayfasını görüntüle"
                      :href="`/title/${itemData.id}`"
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
      <NuxtLink :to="`/title/${itemData.id}`" v-else class="card card-compact image-full w-48 h-72 m-5 bg-base-100">
        <figure>
          <img class="w-full" :src="itemData.image" />
        </figure>
        <div class="card-body h-72 w-48 place-self-end flex-col-reverse">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-2 opacity-75">{{
              itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
        </div>
      </NuxtLink>
    </aside>
    <!-- type = default -->
    <!-- type = sanityDefault -->
     <aside v-else-if="type == 'sanityDefault'">
        <div v-if="!isMobileOrTablet" class="card w-96 bg-base-100 rounded-lg">
        <figure class="h-56 w-72">
          <img class="w-full rounded" :src="itemData.image" />
        </figure>
        <div class="card-body h-72 w-72 shadow-xl">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{
              itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
          <p class="text-sm max-h-32 overflow-auto">
            <span class="flex flex-row flex-wrap">
              <span
                class="badge badge-secondary badge-sm mb-1 tooltip"
                >{{
                  `${new Date(itemData.date).getDate()} ${new Date(itemData.date).toLocaleString("default", { month: "long" })} ${new Date(itemData.date).getFullYear()}, ${new Date(itemData.date).getHours().toString().padStart(2, "0")}.${new Date(itemData.date).getMinutes().toString().padStart(2, "0")}`
                }}</span
              >
            </span>
            {{ itemData.description }}
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-primary btn-md flex flex-row"
              :href="`/title/${itemData.id}`"
              ><Icon
                name="material-symbols:visibility-rounded"
                class="h-4 w-4"
              />Görüntüle</NuxtLink
            >
          </div>
        </div>
      </div>
      <NuxtLink :to="`/title/${itemData.id}`" v-else class="card card-compact image-full w-48 h-72 m-5 bg-base-100">
        <figure>
          <img class="w-full" :src="itemData.image" />
        </figure>
        <div class="card-body h-72 w-48 place-self-end flex-col-reverse">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-2 opacity-75">{{
              itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
          <span class="overflow-auto -mt-1">
            <span class="flex flex-row flex-wrap">
              <span
                class="badge badge-secondary badge-sm tooltip tooltip-accent"
                >{{
                  `${new Date(itemData.date).getDate()} ${new Date(itemData.date).toLocaleString("default", { month: "long" })} ${new Date(itemData.date).getFullYear()}, ${new Date(itemData.date).getHours().toString().padStart(2, "0")}.${new Date(itemData.date).getMinutes().toString().padStart(2, "0")}`
                }}</span
              >
            </span>
          </span>
        </div>
      </NuxtLink>
     </aside>
    <!-- type = sanityDefault -->
    <!-- type = search -->
    <aside v-if="type == 'search'">
        <div v-if="!isMobileOrTablet" class="card w-72 bg-base-100 rounded-lg mx-1">
            <figure class="w-full h-56">
            <img class="w-full rounded shadow-md" :src="itemData.images.jpg.large_image_url" />
            </figure>
        <div class="card-body h-72 shadow-xl">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ itemData.title }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{ itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman") }}</span>
          </span>
          <p class="text-sm">
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
            >
              <NuxtLink
                class="btn btn-primary btn-md flex flex-row"
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
      <NuxtLink :to="`/title/${itemData.mal_id}`" v-else class="card card-compact image-full w-[170px] h-72 mx-2 my-1 bg-base-100">
        <figure>
          <img class="w-full" :src="itemData.images.jpg.large_image_url" />
        </figure>
        <div class="card-body h-72 w-[170px] place-self-end flex-col-reverse">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ itemData.title }}
              </b>
            </h2>
            <span class="text-xs -mt-2 opacity-75">{{
              itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
        </div>
      </NuxtLink>
    </aside>
    <!-- type = search -->
</main>
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