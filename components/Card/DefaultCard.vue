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
        <div v-if="!isMobileOrTablet" class="card card-xs w-56 bg-base-100 rounded-lg">
            <figure class="w-full h-84">
              <NuxtLink :href="`/title/${itemData.id}`">
                <img class="w-full rounded h-84" :src="itemData.image" />
              </NuxtLink>
            </figure>
        <div class="card-body">
          <span class="flex flex-col overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{ itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman") }}</span>
          </span>
        </div>
      </div>
      <NuxtLink :to="`/title/${itemData.id}`" v-else class="card card-sm image-full w-48 h-72 m-5 bg-base-100">
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
        <div v-if="!isMobileOrTablet" class="card card-xs w-56 bg-base-100 rounded-lg">
        <figure class="h-84">
          <NuxtLink  :href="`/title/${itemData.id}`">
            <img class="w-full rounded h-84" :src="itemData.image" />
          </NuxtLink>
        </figure>
        <div class="card-body">
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
              <span
                class="badge badge-soft badge-secondary badge-sm mb-1 tooltip tooltip-right"
                data-tip="Yayınlanma/Güncellenme Tarihi"
                >{{
                  `${new Date(itemData.date).getDate()} ${new Date(itemData.date).toLocaleString("default", { month: "long" })} ${new Date(itemData.date).getFullYear()}, ${new Date(itemData.date).getHours().toString().padStart(2, "0")}.${new Date(itemData.date).getMinutes().toString().padStart(2, "0")}`
                }}</span
              >
        </div>
      </div>
      <NuxtLink :to="`/title/${itemData.id}`" v-else class="card card-sm image-full w-48 h-72 m-5 bg-base-100">
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
                class="badge badge-soft badge-secondary badge-sm tooltip tooltip-accent"
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
        <div v-if="!isMobileOrTablet" class="card card-xs mb-5 w-56 bg-base-100 rounded-lg mx-1">
            <figure class="w-full h-84">
              <NuxtLink  :href="`/title/${itemData.mal_id}`">
                <img class="w-full h-84 rounded shadow-md" :src="itemData.images.jpg.large_image_url" />
              </NuxtLink>
            </figure>
        <div class="card-body">
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
        </div>
      </div>
      <NuxtLink :to="`/title/${itemData.mal_id}`" v-else class="card card-sm image-full w-[170px] h-72 mx-2 my-1 bg-base-100">
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