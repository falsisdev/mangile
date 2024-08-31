<script setup>
const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper
    :centeredSlides="true"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :scrollbar="{
      hide: true,
    }"
    :modules="[SwiperAutoplay, SwiperScrollbar, SwiperPagination]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div
        class="card lg:card-side lg:h-72 lg:m-0 m-5 bg-base-100 shadow-lg p-[10px] rounded-lg shadow-base-300"
      >
        <figure class="w-full lg:h-auto h-72">
          <img class="w-full lg:h-full rounded shadow-md" :src="item.image" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ item.name }}</h2>
          <p class="max-h-32 overflow-auto my-2">
            {{ item.description }}
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-ghost flex flex-row mx-1 tooltip"
              data-tip="MyAnimeList sayfasını görüntüle"
              :href="item.url"
              ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
            /></NuxtLink>
            <NuxtLink
              class="btn btn-primary flex flex-row tooltip"
              data-tip="Mangile sayfasını Görüntüle"
              :href="`/manga/${item.id}`"
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
