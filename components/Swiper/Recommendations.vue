<script setup>
import { data } from "@/assets/data.ts";

const { isMobileOrTablet, isTablet, isMobile } = useDevice();

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
    :slidesPerView="isMobile ? 2 : isTablet ? 5 : 4"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :centeredSlides="true"
    :modules="[SwiperAutoplay]"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div v-if="!isMobileOrTablet" class="card w-72 bg-base-100 rounded-lg">
        <figure class="w-full h-56">
          <img class="w-full rounded shadow-md" :src="item.entry.images.jpg.large_image_url" />
        </figure>
        <div class="card-body h-72 shadow-xl">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ item.entry.title }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{ item.entry.type }}</span>
          </span>
      <p>
        Serinin ayrıntılarını görmek için seriyi görüntülemeniz
        gerekmektedir.
      </p>
      <div class="flex justify-end">
        <NuxtLink
          class="btn btn-primary btn-soft lg:btn-md btn-sm flex flex-row"
          :href="`/title/${item.entry.mal_id}`"
          ><Icon
            name="material-symbols:visibility-rounded"
            class="h-4 w-4"
          />Görüntüle</NuxtLink
        >
      </div>
    </div>
  </div>
  <NuxtLink v-else :to="`/title/${item.entry.mal_id}`" class="card card-sm image-full w-[85%] h-72 mx-2 my-1 bg-base-100">
        <figure>
          <img class="w-full" :src="item.entry.images.jpg.large_image_url" />
        </figure>
        <div class="card-body flex-col-reverse">
          <span class="flex flex-col-reverse w-full h-full overflow-hidden">
            <h2 class="card-title whitespace-nowrap text-lg font-extrabold">
              <b id="marquee-text" class="inline-block">
                {{ item.entry.title }}
              </b>
            </h2>
            <span class="text-xs -mt-2">{{
              item.entry["type"]
            }}</span>
          </span>
        </div>
      </NuxtLink>
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
