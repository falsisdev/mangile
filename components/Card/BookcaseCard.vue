<script setup>
import { data } from "@/assets/data.ts";
const { isMobileOrTablet } = useDevice();

const props = defineProps({
  itemData: Object,
  entryData: Object,
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
    class="card bg-base-100 h-72 w-96 lg:mx-2 mb-2 shadow-lg shadow-base-300 image-full"
  >
    <figure class="h-full -my-0">
      <img class="w-full" :src="itemData.images.jpg.large_image_url" />
    </figure>
    <div class="card-body w-96 -mt-6">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <span id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </span>
        </h2>
      </span>
      <p class="-mt-2 flex flex-col">
        <span class="flex flex-row">
          <span class="badge badge-secondary gap-2 mr-1">
            {{ data.status[String(entryData.status)] }}
          </span>
          <span class="grow" />
          <span
            class="badge badge-neutral gap-2 tooltip"
            data-tip="İzlenen Bölümler"
          >
            {{ entryData.chapters }}/{{
              itemData.chapters ? itemData.chapters : "?"
            }}
          </span>
          <span class="badge badge-accent gap-2 mx-1">
            {{ data["malstatus"][String(itemData.status)] }}
          </span>
        </span>
        <span class="flex flex-row mt-1">
          <span
            class="badge badge-neutral gap-2 mx-1 flex flex-row tooltip"
            data-tip="Yeniden Okunma Sayısı"
          >
            <Icon
              name="material-symbols:refresh"
              class="w-[3.5] h-[3.5] -mx-1"
            />
            {{ entryData.reread }}
          </span>
        </span>
      </p>
      <div class="flex justify-end">
        <NuxtLink
          class="btn btn-primary flex flex-row mx-1"
          :to="`/title/${itemData.mal_id}`"
          ><Icon name="material-symbols:visibility-rounded" class="h-4 w-4"
        /></NuxtLink>
        <NuxtLink class="btn btn-warning flex flex-row"
          ><Icon name="material-symbols:edit" class="h-4 w-4"
        /></NuxtLink>
        <NuxtLink class="btn btn-error flex flex-row mx-1"
          ><Icon name="material-symbols:delete" class="h-4 w-4"
        /></NuxtLink>
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
