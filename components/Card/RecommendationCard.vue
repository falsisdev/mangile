<script setup>
const { isMobileOrTablet } = useDevice();

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
  <swiper
    :spaceBetween="0"
    :slidesPerView="isMobileOrTablet ? 1 : 4"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :modules="[SwiperAutoplay]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div
        class="card lg:w-72 lg:m-0 mx-5 bg-base-100 rounded-lg shadow-base-300"
      >
        <figure class="w-full h-56">
          <img
            lass="w-full rounded shadow-md"
            :src="item.entry.images.jpg.large_image_url"
          />
        </figure>
        <div class="card-body h-72">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <span id="marquee-text" class="inline-block">
                {{ item.entry.title }}
              </span>
            </h2>
            <span class="text-xs -mt-1">{{ item.entry.type }}</span>
          </span>
          <p class="max-h-32 overflow-auto my-2 text-sm lg:text-md">
            Serinin ayrıntılarını görmek için seriyi görüntülemeniz
            gerekmektedir.
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-ghost lg:btn-md btn-sm flex flex-row mx-1 tooltip"
              data-tip="MyAnimeList sayfasını görüntüle"
              :href="item.entry.url"
              ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
            /></NuxtLink>
            <NuxtLink
              class="btn btn-primary lg:btn-md btn-sm flex flex-row tooltip"
              data-tip="Mangile sayfasını Görüntüle"
              :href="`/title/${item.entry.mal_id}`"
              ><Icon
                name="material-symbols:visibility-rounded"
                class="h-4 w-4"
              />Görüntüle</NuxtLink
            >
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
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
