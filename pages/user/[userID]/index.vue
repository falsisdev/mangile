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
        class="h-72 shadow-inner lg:border-2 lg:border-neutral-content lg:border-opacity-50"
      >
        <img
          class="w-full lg:h-auto h-full opacity-75 object-cover object-center shadow-inner"
          :src="
            userData.customData.userBanner ||
            'https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed'
          "
        />
        <span
          v-if="userData.profile['gender']"
          class="absolute top-0 start-0 bg-base-100 rounded-br-lg p-1 tooltip tooltip-bottom lg:border-2 lg:border-l-0 lg:border-t-0 lg:border-neutral-content lg:border-opacity-75"
          :data-tip="`Kullanıcı Cinsiyetini '${userData.profile['gender']
            .replaceAll('male', 'Eril')
            .replaceAll('female', 'Dişil')}' olarak belirtmiş`"
        >
          <Icon
            :name="`material-symbols:${userData.profile['gender']}`"
            class="h-5 w-5 -my-1 mx-1"
          />
        </span>
        <button
          class="btn lg:btn-md btn-sm bg-base-100 hover:bg-base-100 border-2 border-t-0 border-r-0 border-neutral-content border-opacity-50 hover:border-neutral-content hover:border-opacity-50 shadow-none absolute top-0 rounded-bl-2xl rounded-r-none rounded-t-none no-animation end-0 lg:text-md text-xs"
        >
          <span
            class="flex tooltip tooltip-bottom"
            :data-tip="`Kullanıcı ${userData.customData['userFollows'] ? userData.customData['userFollows'].length : 0} Kişiyi Takip Ediyor`"
          >
            <Icon name="material-symbols:person-add" class="w-5 h-5 mr-1" />
            <span class="mt-[3px]">
              {{
                userData.customData["userFollows"]
                  ? userData.customData["userFollows"].length
                  : 0
              }}
              Takip
            </span>
          </span>
          <span
            class="flex mx-2 tooltip tooltip-bottom"
            :data-tip="`Kullanıcının ${userData.customData['userFollowers'] ? userData.customData['userFollowers'].length : 0} Takipçisi Var`"
          >
            <Icon
              name="material-symbols:supervisor-account"
              class="w-5 h-5 mr-1"
            />
            <span class="mt-[3px]">
              {{
                userData.customData["userFollowers"]
                  ? userData.customData["userFollowers"].length
                  : 0
              }}
              Takipçi
            </span>
          </span>
        </button>
      </figure>
      <div
        class="card-body border-t-2 border-t-neutral-content border-opacity-50"
      >
        <h2 class="card-title">
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
          <div
            class="lg:ml-40 ml-24 -mt-4 lg:-mt-0 lg:-my-2 prose flex flex-col"
          >
            <span class="text-xs -mb-2">@{{ userData.username }}</span>
            <h1>{{ userData.name ? userData.name : userData.username }}</h1>
          </div>
          <span class="grow" />
          <span
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Kullanıcının kütüphanesini görüntüle"
          >
            <NuxtLink class="btn btn-ghost">
              <Icon name="mdi:library" class="w-5 h-5" />
              Kütüphane
            </NuxtLink>
          </span>
          <span
            v-if="Boolean(user) && user.sub == route.params.userID"
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Profili Düzenle"
          >
            <NuxtLink class="btn btn-primary">
              <Icon name="material-symbols:person-edit" class="w-5 h-5" />
            </NuxtLink>
          </span>
        </h2>
        <p class="lg:ml-40 -mt-3">
          {{
            userData.customData.userAbout ? userData.customData.userAbout : ""
          }}
        </p>
      </div>
      <div v-if="favManga">
        <article class="prose my-5">
          <h1>
            {{ userData.name ? userData.name : userData.username }}'in Favori
            Serisi
          </h1>
        </article>
        <div
          class="card lg:card-side lg:h-72 lg:m-0 m-5 bg-base-100 shadow-lg p-3 rounded-lg shadow-base-300 mt-5"
        >
          <figure class="w-full lg:h-auto h-72">
            <img
              class="w-full lg:h-full rounded shadow-md"
              :src="favManga.data.images.jpg.large_image_url"
            />
          </figure>
          <div class="card-body">
            <span class="flex flex-col">
              <h2 class="card-title">{{ favManga.data.title }}</h2>
              <span class="text-md text-neutral-content">{{
                favManga.data["type"]
                  .replaceAll("Light Novel", "Hafif Roman")
                  .replaceAll("Novel", "Roman")
              }}</span>
            </span>
            <span class="flex flex-row flex-wrap">
              <span
                class="badge badge-accent gap-2 mr-1 mt-1 tooltip tooltip-accent"
                :data-tip="data['malstatus'][String(favManga.data.status)]"
                >{{ data["malstatus"][String(favManga.data.status)] }}</span
              >
              <span
                v-for="genre of favManga.data.genres"
                :key="genre"
                class="badge badge-neutral gap-2 my-1 mr-1 tooltip"
                :data-tip="data.malgenres[String(genre.name)]"
                >{{ data.malgenres[String(genre.name)] }}</span
              >
              <br /><br />
            </span>
            <p class="max-h-64 overflow-auto text-sm lg:text-md">
              {{ favManga.data.synopsis }}
            </p>
            <div class="flex justify-end">
              <NuxtLink
                class="btn btn-ghost flex flex-row mx-1 tooltip"
                data-tip="MyAnimeList sayfasını görüntüle"
                :href="favManga.data.url"
                ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
              /></NuxtLink>
              <NuxtLink
                class="btn btn-primary flex flex-row tooltip"
                data-tip="Mangile sayfasını görüntüle"
                :href="`/title/${favManga.data.mal_id}`"
                ><Icon
                  name="material-symbols:visibility-rounded"
                  class="h-4 w-4"
                />Görüntüle</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div v-else>
    <p>Yükleniyor...</p>
  </div>
</template>
