<script setup>
const { isMobileOrTablet } = useDevice()
const props = defineProps({
  itemData: Object,
});
</script>
<template>
  <swiper
    :centeredSlides="!isMobileOrTablet"
    :slidesPerView="isMobileOrTablet ? 2 : 1"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :scrollbar="{
      hide: false,
    }"
    :modules="[SwiperAutoplay, SwiperScrollbar, SwiperPagination]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      >
      <div
      v-if="!isMobileOrTablet"
        class="card lg:card-side lg:h-72 lg:m-0 m-5 bg-base-100 p-[10px] rounded-lg shadow-base-300"
      >
        <figure class="w-full lg:h-auto h-72">
          <img class="w-full lg:h-full rounded shadow-md" :src="item.image" />
        </figure>
        <div class="card-body">
          <span class="flex flex-col">
            <h2 class="card-title font-bold">{{ item.name }}</h2>
            <span class="text-xs -mt-1">{{ item.type }}</span>
          </span>
          <p class="max-h-32 overflow-auto my-2 text-sm lg:text-md">
            {{ item.description }}
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-ghost lg:btn-md btn-sm flex flex-row mx-1 tooltip"
              data-tip="MyAnimeList sayfasını görüntüle"
              :href="item.url"
              ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
            /></NuxtLink>
            <NuxtLink
              class="btn btn-primary lg:btn-md btn-sm flex flex-row tooltip"
              data-tip="Mangile sayfasını Görüntüle"
              :href="`/title/${item.id}`"
              ><Icon
                name="material-symbols:visibility-rounded"
                class="h-4 w-4"
              />Görüntüle</NuxtLink
            >
          </div>
        </div>
      </div>
      <NuxtLink :to="`/title/${item.id}`" v-else class="card card-compact image-full w-48 h-72 m-5 bg-base-100">
        <figure>
          <img class="w-full" :src="item.image" />
        </figure>
        <div class="card-body h-72 w-48 place-self-end flex-col-reverse">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ item.name }}
              </b>
            </h2>
            <span class="text-xs -mt-2 opacity-75">{{
              item["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
        </div>
      </NuxtLink>
    </swiper-slide>
  </swiper>
</template>
