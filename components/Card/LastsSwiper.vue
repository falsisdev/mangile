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
    :spaceBetween="isMobileOrTablet ? 0 : 20"
    :slidesPerView="isMobileOrTablet ? 1 : 4"
  >
    <swiper-slide v-for="item of itemData" v-bind:key="item"
      ><div class="card w-96 lg:m-0 m-5 bg-base-100 rounded-lg">
        <figure class="h-56 w-72">
          <img class="w-full rounded" :src="item.image" />
        </figure>
        <div class="card-body h-72 w-72 shadow-xl">
          <span class="flex flex-col w-full overflow-hidden relative">
            <h2 class="card-title whitespace-nowrap overflow-hidden">
              <b id="marquee-text" class="inline-block">
                {{ item.name }}
              </b>
            </h2>
            <span class="text-xs -mt-1">{{
              item["type"]
                .replaceAll("manga", "Manga")
                .replaceAll("lightNovel", "Hafif Roman")
            }}</span>
          </span>
          <p class="text-sm max-h-32 overflow-auto">
            <span class="flex flex-row flex-wrap">
              <span
                class="badge badge-secondary badge-sm mb-1 tooltip tooltip-accent"
                >{{
                  `${new Date(item.date).getDate()} ${new Date(item.date).toLocaleString("default", { month: "long" })} ${new Date(item.date).getFullYear()}, ${new Date(item.date).getHours().toString().padStart(2, "0")}.${new Date(item.date).getMinutes().toString().padStart(2, "0")}`
                }}</span
              >
            </span>
            {{ item.description }}
          </p>
          <div class="flex justify-end">
            <NuxtLink
              class="btn btn-primary lg:btn-md btn-sm flex flex-row"
              :href="`/title/${item.id}`"
              ><Icon
                name="material-symbols:visibility-rounded"
                class="h-4 w-4"
              />Görüntüle</NuxtLink
            >
          </div>
        </div>
      </div>
    </swiper-slide>
    <br />
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
