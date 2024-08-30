<script setup>
const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper
    :slidesPerView="4"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :modules="[SwiperAutoplay]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div class="card w-72 bg-base-100 rounded-lg shadow-base-300">
        <figure class="w-full h-56">
          <img
            lass="w-full rounded shadow-md"
            :src="item.entry.images.jpg.large_image_url"
          />
        </figure>
        <div class="card-body h-72">
          <h2 class="card-title">{{ item.entry.title }}</h2>
          <p class="max-h-32 overflow-auto my-2">
            Serinin ayrıntılarını görmek için seriyi görüntülemeniz
            gerekmektedir.
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-ghost flex flex-row mx-1 tooltip"
              data-tip="MyAnimeList sayfasını görüntüle"
              :href="item.entry.url"
              ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
            /></NuxtLink>
            <NuxtLink
              class="btn btn-primary flex flex-row tooltip"
              data-tip="Mangile sayfasını Görüntüle"
              :href="`/manga/${item.entry.mal_id}`"
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
