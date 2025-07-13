<script setup>
//Bu component kitaplıktaki listeler kısmında listeye özel card componentidir.
const cover = ref(null);
const props = defineProps({
  itemData: Object,
});

async function coverGet() {
  const { data: coverSerieData } = await useFetch(
    `https://api.jikan.moe/v4/manga/${props.itemData.items.find((x) => x.index == 0).id}`
  );

  cover.value = toRaw(coverSerieData.value).data.images.jpg.large_image_url;
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

watch([props.itemData], coverGet, { immediate: true });

// Tür isimlerini Türkçeye çeviren fonksiyon
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
</script>
<template>
  <div
    class="card bg-base-100 h-96 w-64 my-3 shadow-lg shadow-base-300 image-full"
  >
    <figure class="h-full -my-0">
      <img class="h-full w-full" :src="cover" />
    </figure>
    <div class="prose card-body -mt-6">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <span id="marquee-text" class="inline-block">
            {{ itemData.title }}
          </span>
        </h2>
        <!-- Liste türü badge'i -->
        <span v-if="itemData.type" class="text-xs -mt-3">{{ turkceType(itemData.type) }}</span>
      </span>
      <p class="-mt-2 flex flex-col">
        <span class="flex flex-row">
          <span
            class="badge badge-secondary tooltip tooltip-secondary gap-2 mr-1"
            data-tip="Oluşturulma Tarihi"
          >
            <Icon
              name="material-symbols:calendar-add-on"
              class="w-3 h-3 -ml-1"
            />
            {{ itemData.createdAt }}
          </span>
          <span class="grow" />
          <span
            class="badge badge-accent gap-2 tooltip tooltip-accent"
            data-tip="Favorileyenler"
          >
            <Icon
              name="material-symbols:bookmark-heart"
              class="w-3 h-3 -ml-1"
            />
            {{ itemData.favs.length }}
          </span>
        </span>
        <!-- Ekstra badge örnekleri (varsa) -->
        <span class="flex flex-row flex-wrap gap-1 mt-2">
          <span
            v-for="genre in itemData.genres"
            :key="genre"
            class="badge badge-neutral badge-xs gap-1"
          >{{ turkceType(genre) }}</span>
        </span>
      </p>
      <div class="flex justify-end">
        <NuxtLink
          class="btn btn-primary flex flex-row mx-1"
          :to="`list/${itemData.key}`"
          ><Icon name="material-symbols:visibility-rounded" class="h-4 w-4"
        />Görüntüle</NuxtLink>
        <NuxtLink class="btn btn-soft btn-warning flex flex-row mx-1"
          ><Icon name="material-symbols:edit" class="h-4 w-4"
        /></NuxtLink>
        <NuxtLink class="btn btn-soft btn-error flex flex-row"
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
