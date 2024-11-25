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
</script>
<template>
  <div
    class="card bg-base-100 h-72 w-96 lg:mr-2 my-3 shadow-lg shadow-base-300 image-full"
  >
    <figure class="h-full -my-0">
      <img class="w-full" :src="cover" />
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
      </p>
      <div class="flex justify-end">
        <NuxtLink
          class="btn btn-primary flex flex-row mx-1"
          :to="`list/${itemData.key}`"
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
