<script setup>
import { data } from "@/assets/data.ts";

const { isMobileOrTablet } = useDevice();

const props = defineProps({
  itemData: Object,
  relationName: {
    type: String,
    default: ""
  }
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
  <div v-if="!isMobileOrTablet" class="card card-side w-lg bg-base-100 rounded-lg mx-2 mb-2">
    <figure class="w-48 h-64">
      <img
        class="w-48 h-full rounded shadow-md"
        :src="itemData.images.jpg.large_image_url"
      />
    </figure>
    <div class="card-body h-64 w-96 shadow-xl">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <b id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </b>
        </h2>
        <span class="text-xs -mt-1">{{ itemData["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman") }}</span>
      </span>
      <p>
        <span class="badge badge-accent badge-soft badge-soft lg:badge-sm badge-xs gap-2 mr-1">{{
          data["malstatus"][String(itemData.status)]
        }}</span>
        <span
          v-for="genre of itemData.genres"
          :key="genre"
          class="badge badge-neutral lg:badge-sm badge-xs gap-2 my-1 mr-1"
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
  <NuxtLink v-else :to="`/title/${itemData.mal_id}`" class="card card-sm image-full w-36 h-56 mx-2 my-1 bg-base-100">
    <figure class="w-36 h-56">
      <img class="w-36 h-56" :src="itemData.images.jpg.large_image_url" />
    </figure>
    <div class="card-body h-56 w-36 place-self-end flex-col-reverse">
      <span class="flex flex-col w-full overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden text-sm font-extrabold">
          <b id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </b>
        </h2>
        <span v-if="relationName" class="text-xs -mt-2 opacity-75">
            {{
              relationName
                .replaceAll("Other", "Diğer")
                .replaceAll("Adaptation", "Adaptasyon")
                .replaceAll("Sequel", "Devam Serisi")
                .replaceAll("Prequel", "Önceki Seri")
                .replaceAll("Side Story", "Yan Öykü")
                .replaceAll("Alternative Version", "Alternatif Yorum")
                .replaceAll("Parent Story", "Ana Öykü")
                .replaceAll("Character", "Karakter")
            }}
        </span>
      </span>
    </div>
  </NuxtLink>
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
