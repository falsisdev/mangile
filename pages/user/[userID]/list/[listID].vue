<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const userData = ref(null);
const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);

async function fetchData() {
  loading.value = true;
  try {
    const { data: response } = await useFetch(
      `/api/users/${route.params.userID}?appSecret=${config.public.m2mAppSecret}`
    );

    if (!response.value) return;

    userData.value = response.value;
    const userLists = userData.value.customData?.userLists ?? [];

    const selectedList = userLists.find(
      (item) => item.key === route.params.listID
    );
    list.value = selectedList || "nil";

    if (list.value !== "nil" && list.value.items?.length) {
      const sortedItems = list.value.items.sort((a, b) => a.index - b.index);
      const mangaRequests = sortedItems.map((manga) =>
        $fetch(`https://api.jikan.moe/v4/manga/${manga.id}`).then(
          (res) => res.data
        )
      );
      itemsData.value = await Promise.all(mangaRequests);
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <main v-if="!loading">
    <div v-if="list === 'nil'">
      <article class="prose max-w-none">
        <h1>Üzgünüz</h1>
        Veri tabanında belirtilen bilgileri sağlayan bir liste yok.
      </article>
    </div>
    <div v-else>
      <article class="prose max-w-none flex flex-row">
        <h1>{{ list.title }}</h1>
        <span class="grow" />
        <span class="flex flex-row mt-2">
          <span> {{ list.createdAt }} tarihinde </span>
          <NuxtLink
            :to="`/user/${route.params.userID}`"
            class="badge badge-neutral gap-2 badge-lg mt-1 mx-1 no-underline"
          >
            <img
              :src="userData.avatar"
              class="avatar w-5 shadow-lg rounded-full m-1"
            />{{ userData.name }}
          </NuxtLink>
          <span> tarafından oluşturuldu. </span>
          <span class="badge badge-neutral mt-1 ml-2 no-underline"
            ><Icon name="material-symbols:favorite" class="mr-1" />{{
              list.favs.length
            }}</span
          >
        </span>
      </article>
      <div class="divider -mt-6" />
      <div v-if="itemsData.length" class="flex flex-row flex-wrap">
        <SearchCard
          v-for="(manga, index) in itemsData"
          :key="manga.mal_id"
          :itemData="manga"
          :index="index"
        />
      </div>
      <div v-else>
        <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
      </div>
    </div>
  </main>
  <div v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </div>
</template>
