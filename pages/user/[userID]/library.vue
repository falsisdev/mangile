<script setup>
import { data } from "@/assets/data.ts";

//0 = Normal kullanıcı, >= 1 Bölüm Yönetim İzni, >= 2 Kişi Yönetim İzni, >= 3 Üst Düzey Yönetici
const route = useRoute();
const config = useRuntimeConfig();
const user = useLogtoUser();

const userData = ref(null);
const favManga = ref(null);

async function fetchData() {
  try {
    const { data: response } = await useFetch(
      `/api/users/${route.params.userID}?appSecret=${
        toRaw(config.public).m2mAppSecret
      }`
    );

    userData.value = toRaw(response.value);

    if (Boolean(toRaw(response.value).customData.userFavoriteTitle)) {
      const { data: favMangaData } = await useFetch(
        `https://api.jikan.moe/v4/manga/${userData.value.customData.userFavoriteTitle}`
      );

      favManga.value = toRaw(favMangaData.value);
    } else {
      favManga.value = null;
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  }
}

onMounted(async () => {
  fetchData();
});

watch([userData, favManga], fetchData, { immediate: true });
</script>
<template>
  <main v-if="userData">
    <div
      class="card card-compact bg-base-100 w-full lg:rounded-2xl rounded-none"
    >
      <figure
        class="h-56 shadow-inner lg:border-2 lg:border-neutral-content lg:border-opacity-50"
      >
        <img
          class="w-full lg:h-auto h-full opacity-75 object-cover object-center shadow-inner"
          :src="
            userData.customData.userBanner ||
            'https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed'
          "
        />
      </figure>
      <div
        class="card-body border-t-2 border-t-neutral-content border-opacity-50 flex"
      >
        <h2 class="card-title justify-center">
          <div
            class="avatar absolute lg:mb-16 mb-20 bg-base-100 rounded-full border-t-2 border-t-neutral-content border-opacity-100"
          >
            <div
              class="w-24 lg:w-36 rounded-full border-8 border-base-100 hover:border-8 hover:border-base-100"
            >
              <img
                class="hover:-rotate-6 duration-500"
                :src="
                  userData.avatar ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                "
              />
            </div>
          </div>
          <span class="grow" />
          <span
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Kullanıcının profilini görüntüle"
          >
            <NuxtLink
              :to="`/user/${route.params.userID}`"
              class="btn btn-ghost"
            >
              <Icon name="material-symbols:person" class="w-5 h-5" />
              Profili Görüntüle
            </NuxtLink>
          </span>
        </h2>
        <div class="flex justify-center">
          <article class="flex flex-col prose">
            <span class="text-sm opacity-75">@{{ userData.username }}</span>
            <h1 class="-mt-2">Kütüphane</h1>
          </article>
        </div>
        <article class="prose max-w-none px-5 flex flex-row -mb-7">
          <h1>Listeler</h1>
          <span class="grow" />
          <h1>
            <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
          </h1>
        </article>
        <article class="prose max-w-none px-5">
          Bu özellik henüz desteklenmemektedir.
        </article>
        <article class="prose max-w-none px-5 flex flex-row -mb-7">
          <h1>Kitaplık</h1>
          <span class="grow" />
          <ul class="menu menu-xs menu-horizontal rounded-box -mt-2">
            <li>
              <NuxtLink class="tooltip" data-tip="Okunuyor">
                <Icon name="material-symbols:play-arrow" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="tooltip" data-tip="Tamamlandı">
                <Icon name="material-symbols:check" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="tooltip" data-tip="Beklemede">
                <Icon name="material-symbols:pause" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="tooltip" data-tip="Bırakıldı">
                <Icon name="material-symbols:delete" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="tooltip" data-tip="Planlandı">
                <Icon name="material-symbols:timer" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="tooltip" data-tip="Yeniden Okunuyor">
                <Icon name="material-symbols:refresh" class="w-5 h-5 mt-1" />
              </NuxtLink>
            </li>
          </ul>
        </article>
        <article class="prose max-w-none px-5">
          Bu özellik henüz desteklenmemektedir.
        </article>
      </div>
    </div>
  </main>
  <div v-else>
    <Icon name="mdi-light:loading" class="animate-spin w-full h-64" />
  </div>
</template>
