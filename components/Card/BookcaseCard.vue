<script setup>
import { data } from "@/assets/data.ts";
const { isMobileOrTablet } = useDevice();

const props = defineProps({
  itemData: Object,
  entryData: Object,
  index: Number,
});

function turkceType(type) {
  if (!type) return "";
  switch (type.toLowerCase()) {
    case "manga":
      return "Manga";
    case "lightnovel":
    case "light_novel":
    case "light novel":
      return "Hafif Roman";
    case "manhwa":
      return "Manhwa";
    case "manhua":
      return "Manhua";
    case "novel":
      return "Roman";
    case "one-shot":
    case "oneshot":
      return "Tek Atış";
    case "doujinshi":
      return "Doujinshi";
    default:
      return type;
  }
}

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
    <aside>
      <!-- Masaüstü görünümü -->
      <div v-if="!isMobileOrTablet" class="card w-96 bg-base-100 rounded-lg">
        <figure class="h-56 w-72">
          <img class="w-full mt-25" :src="itemData.images?.jpg?.large_image_url || itemData.image" />
        </figure>
       <div class="card-body h-72 w-72 -mt-12">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ itemData.title || itemData.name }}
              </b>
            </h2>
            <span class="text-xs -mt-3">{{ turkceType(itemData["type"]) }}</span>
          </span>
          <p class="text-sm">
          <div class="flex flex-row flex-wrap gap-1 mb-2">
            <span class="badge badge-soft lg:badge-sm badge-xs badge-secondary gap-1" data-tip="Okuma Durumu">
              {{ data.status[String(entryData.status)] }}
            </span>
            <span class="badge lg:badge-sm badge-xs badge-neutral gap-1 tooltip" data-tip="Okunan Bölüm / Toplam Bölüm">
              {{ entryData.chapters }}/{{ itemData.chapters ? itemData.chapters : "?" }}
            </span>
            <span class="badge lg:badge-sm badge-xs badge-neutral gap-1 flex flex-row tooltip" data-tip="Yeniden Okuma Sayısı">
              <Icon name="material-symbols:refresh" class="w-[3.5] h-[3.5]" />
              {{ entryData.reread }}
            </span>
          </div>
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-primary btn-soft btn-md flex flex-row"
              :href="`/title/${itemData.mal_id || itemData.id}`"
              ><Icon
                name="material-symbols:visibility-rounded"
                class="h-4 w-4"
              />Görüntüle</NuxtLink
            >
            <NuxtLink class="btn btn-soft btn-warning flex flex-row mx-1"
              ><Icon name="material-symbols:edit" class="h-4 w-4"
            /></NuxtLink>
            <NuxtLink class="btn btn-soft btn-error flex flex-row"
              ><Icon name="material-symbols:delete" class="h-4 w-4"
            /></NuxtLink>
          </div>
        </div>
      </div>
      <!-- Mobil/tablet görünümü -->
      <NuxtLink
        v-else
        :to="`/title/${itemData.mal_id}`"
        class="card card-sm image-full w-48 h-72 m-5 bg-base-100"
      >
        <figure>
          <img class="w-full" :src="itemData.images.jpg.large_image_url" />
        </figure>
        <div class="card-body h-72 w-48 place-self-end flex-col-reverse">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ itemData.title }}
              </b>
            </h2>
            <span class="text-xs -mt-2 opacity-75">{{ turkceType(itemData["type"]) }}</span>
          </span>
          <div class="flex flex-row flex-wrap gap-1 mt-2">
            <span class="badge badge-secondary gap-2">
              {{ data.status[String(entryData.status)] }}
            </span>
            <span class="badge badge-neutral gap-2 tooltip" data-tip="İzlenen Bölümler">
              {{ entryData.chapters }}/{{ itemData.chapters ? itemData.chapters : "?" }}
            </span>
            <span class="badge badge-accent gap-2">
              {{ data["malstatus"][String(itemData.status)] }}
            </span>
            <span class="badge badge-neutral gap-2 flex flex-row tooltip" data-tip="Yeniden Okunma Sayısı">
              <Icon name="material-symbols:refresh" class="w-[3.5] h-[3.5] -mx-1" />
              {{ entryData.reread }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </aside>
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
