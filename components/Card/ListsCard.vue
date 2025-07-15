<script setup>
const props = defineProps({
  itemData: Object,
});

const cover = ref(null);

// Güvenli şekilde ilk geçerli item'ı bul
const getValidItemId = () => {
  if (!props.itemData?.items || !Array.isArray(props.itemData.items)) return null;

  const valid = props.itemData.items.find((x) =>
    Array.isArray(x.item) && x.item.length >= 2 && x.item[1] === 0
  );

  return valid ? valid.item[0] : null;
};

const coverGet = async () => {
  const id = getValidItemId();
  if (!id) return;

  try {
    const { data: coverSerieData } = await useFetch(`https://api.jikan.moe/v4/manga/${id}`);
    const imageUrl = toRaw(coverSerieData.value)?.data?.images?.jpg?.large_image_url;
    console.log("Kapak URL:", imageUrl);
    cover.value = imageUrl;
  } catch (err) {
    console.error("Kapak verisi alınırken hata:", err);
  }
};


onMounted(() => {
  // başlık uzunluğu kontrolü
  const textElements = document.querySelectorAll("#marquee-text");
  textElements.forEach((textElement) => {
    const containerWidth = textElement.parentElement.offsetWidth;
    const textWidth = textElement.scrollWidth;
    if (textWidth > containerWidth) {
      textElement.classList.add("animate-marquee");
    }
  });
});

watch(() => props.itemData, coverGet, { immediate: true });

</script>

<template>
  <div
    class="card bg-base-100 h-96 w-64 my-3 shadow-lg shadow-base-300 image-full"
  >
    <figure class="h-full -my-0">
      <img
        class="h-full w-full object-cover"
        :src="cover || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'"
        alt="Kapak görseli"
      />
    </figure>
    <div class="prose card-body -mt-6">
      <span class="flex flex-col overflow-hidden relative">
        <h2 class="card-title whitespace-nowrap overflow-hidden">
          <span id="marquee-text" class="inline-block">
            {{ itemData.title || "Adsız Liste" }}
          </span>
        </h2>
      </span>
      <p class="-mt-2 flex flex-col">
        <span class="flex flex-row">
          <span
            class="badge badge-secondary badge-soft tooltip tooltip-secondary gap-2 mr-1"
            data-tip="Oluşturulma Tarihi"
          >
            <Icon
              name="material-symbols:calendar-add-on"
              class="w-3 h-3 -ml-1"
            />
            {{ new Date(itemData['createdAt']).toLocaleDateString(undefined, {year: "numeric",month: "long",day: "numeric"}) || "Tarih yok" }}
          </span>
          <span class="grow" />
          <span
            class="badge badge-accent badge-soft gap-2 tooltip tooltip-accent"
            data-tip="Favorileyenler"
          >
            <Icon
              name="material-symbols:bookmark-heart"
              class="w-3 h-3 -ml-1"
            />
            {{ itemData.likes?.length || 0 }}
          </span>
        </span>
      </p>
      <div class="flex justify-end">
        <NuxtLink
          class="btn btn-primary flex flex-row mx-1"
          :to="`/list/${itemData._id}`"
        >
          <Icon name="material-symbols:visibility-rounded" class="h-4 w-4" />
          Görüntüle
        </NuxtLink>
        <NuxtLink
          class="btn btn-soft btn-warning flex flex-row mx-1"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4" />
        </NuxtLink>
        <NuxtLink
          class="btn btn-soft btn-error flex flex-row"
        >
          <Icon name="material-symbols:delete" class="h-4 w-4" />
        </NuxtLink>
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
