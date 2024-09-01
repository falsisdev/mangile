<script setup>
const { isMobileOrTablet } = useDevice();

const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper
    :spaceBetween="isMobileOrTablet ? 0 : 20"
    :slidesPerView="isMobileOrTablet ? 1 : 4"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :modules="[SwiperAutoplay]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div
        class="card w-72 mx-5 bg-base-100 rounded-lg shadow-lg shadow-base-300"
      >
        <figure class="w-full h-64">
          <img
            class="w-full rounded shadow-md"
            :src="item['manga'].images.jpg.large_image_url"
          />
        </figure>
        <div class="card-body h-72">
          <h2 class="card-title">{{ item.manga.title }}</h2>
          <p class="max-h-32 overflow-auto my-2 text-sm lg:text-md">
            Söz konusu kişi bu seride "{{
              item["position"].replaceAll("Story", "Yazar")
            }}" pozisyonunda görev almış.
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-ghost lg:btn-md btn-sm flex flex-row mx-1 tooltip"
              data-tip="MyAnimeList sayfasını görüntüle"
              :href="item.manga.url"
              ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
            /></NuxtLink>
            <NuxtLink
              class="btn btn-primary lg:btn-md btn-sm flex flex-row tooltip"
              data-tip="Mangile sayfasını Görüntüle"
              :href="`/manga/${item.manga.mal_id}`"
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
