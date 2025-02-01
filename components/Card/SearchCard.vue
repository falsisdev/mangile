<script setup>
import { data } from "@/assets/data.ts";

const props = defineProps({
  itemData: Object,
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
  <div class="card lg:w-[275px] bg-base-100 rounded-lg mx-2 mb-2">
    <figure class="w-full h-56">
      <img
        class="w-full rounded shadow-md"
        :src="itemData.images.jpg.large_image_url"
      />
    </figure>
    <div class="card-body h-72 shadow-xl">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <b id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </b>
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
        <NuxtLink
          class="btn btn-primary lg:btn-md btn-sm flex flex-row"
          :href="`/title/${itemData.mal_id}`"
          ><Icon
            name="material-symbols:visibility-rounded"
            class="h-4 w-4"
          />Görüntüle</NuxtLink
        >
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
