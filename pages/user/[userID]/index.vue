<script setup>
import { data } from "@/assets/data.ts";
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(useSanity().config);

const urlFor = (source) => {
  return builder.image(source).url();
};

const route = useRoute();
const config = useRuntimeConfig();
const user = useLogtoUser();
const { isMobileOrTablet } = useDevice();
const sanity = useSanity()

const query = groq`*[_type == "auth" && logtoId == $logtoId][0] {
  ...,
  userFollows[]-> {
    logtoId,
    name,
    username,
    avatar,
  },
  userFollowers[]-> {
    logtoId,
    name,
    username,
    avatar,
  }
}`
const sanityUser = await sanity.fetch(query, { logtoId: route.params.userID })

const favManga = ref(null);
const loading = ref(true);

async function fetchData() {
  try {
    if (Boolean(sanityUser.favoriteTitle)) {
      const { data: favMangaData } = await useFetch(
        `https://api.jikan.moe/v4/manga/${sanityUser.favoriteTitle}`
      );

      favManga.value = toRaw(favMangaData.value);
    } else {
      favManga.value = null;
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  fetchData();
});

watch([favManga], fetchData, { immediate: true });
</script>
<template>
    <div v-if="loading" class="lg:col-start-2 lg:col-end-11 lg:m-5 flex items-center justify-center min-h-screen">
      <Icon name="mingcute:loading-line" class="animate-spin w-full lg:h-32 h-16" />
    </div>
  <main v-else-if="sanityUser">
    <div
      class="card card-sm bg-base-100 w-full lg:rounded-2xl rounded-none"
    >
      <figure
        class="lg:h-72 h-48 shadow-inner lg:border-2 lg:border-neutral-content lg:border-opacity-50"
      >
        <img
          class="w-full lg:h-auto h-full opacity-75 object-cover object-center shadow-inner"
          :src="
            sanityUser.banner ? urlFor(sanityUser.banner) : 'https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed'
          "
        />
        <span
          v-if="sanityUser['gender']"
          class="absolute top-0 start-0 bg-base-100 rounded-br-lg p-1 tooltip tooltip-bottom lg:border-2 lg:border-l-0 lg:border-t-0 lg:border-neutral-content lg:border-opacity-75"
          :data-tip="`Kullanıcı Cinsiyetini '${sanityUser['gender']
            .replaceAll('male', 'Eril')
            .replaceAll('female', 'Dişil')}' olarak belirtmiş`"
        >
          <Icon
            :name="`material-symbols:${sanityUser['gender']}`"
            class="h-5 w-5 -my-1 mx-1"
          />
        </span>
        <button
          class="btn lg:btn-md btn-sm bg-base-100 hover:bg-base-100 border-2 border-t-0 border-r-0 border-neutral-content border-opacity-50 hover:border-neutral-content hover:border-opacity-50 shadow-none absolute top-0 rounded-bl-2xl rounded-r-none rounded-t-none no-animation end-0 lg:text-md text-xs"
        >
          <span
            class="flex lg:tooltip tooltip-bottom"
            :data-tip="`Kullanıcı ${sanityUser['userFollows'] ? sanityUser['userFollows'].length : 0} Kişiyi Takip Ediyor`"
          >
            <Icon name="material-symbols:person-add" class="w-5 h-5 mr-1" />
            <span class="mt-[3px]">
              {{
                sanityUser["userFollows"]
                  ? sanityUser["userFollows"].length
                  : 0
              }}
              Takip
            </span>
          </span>
          <span
            class="flex mx-2 lg:tooltip tooltip-bottom"
            :data-tip="`Kullanıcının ${sanityUser['userFollowers'] ? sanityUser['userFollowers'].length : 0} Takipçisi Var`"
          >
            <Icon
              name="material-symbols:supervisor-account"
              class="w-5 h-5 mr-1"
            />
            <span class="mt-[3px]">
              {{
                sanityUser["userFollowers"]
                  ? sanityUser["userFollowers"].length
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
                  sanityUser.avatar ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                "
              />
            </div>
          </div>
          <div
            class="lg:ml-40 ml-24 -mt-4 lg:-mt-0 lg:-my-2 prose flex flex-col"
          >
            <span class="text-xs -mb-2">@{{ sanityUser.username }}</span>
            <h1>{{ sanityUser.name ? sanityUser.name : sanityUser.username }}</h1>
          </div>
          <span class="grow" />
          <span
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Kullanıcının kütüphanesini görüntüle"
          >
            <NuxtLink
              :to="`/user/${route.params.userID}/library`"
              class="btn btn-soft btn-secondary"
            >
              <Icon name="mdi:library" class="w-5 h-5" />
              <span v-if="!isMobileOrTablet">Kütüphane</span>
            </NuxtLink>
          </span>
          <span
            v-if="Boolean(user) && user.sub == route.params.userID"
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Profili Düzenle"
          >
            <NuxtLink class="btn btn-soft">
              <Icon name="material-symbols:person-edit" class="w-5 h-5" />
            </NuxtLink>
          </span>
        </h2>
        <p class="lg:ml-40">
          {{
            sanityUser.bio || ""
          }}
        </p>
      </div>
      <div class="divider"/>
      <div v-if="favManga">
        <article class="prose my-5 mx-2">
          <h1 class="text-3xl">
            En Sevdiği Seri
          </h1>
        </article>
        <div
          :class="`card card-xs lg:card-side lg:h-64 lg:m-0 m-5 bg-base-100 lg:p-3 lg:rounded-lg mt-5 ${isMobileOrTablet ? 'image-full' : ''}`"
        >
          <figure class="h-56 w-36">
            <img
              class="w-48 h-56 rounded shadow-md"
              :src="favManga.data.images.jpg.large_image_url"
            />
          </figure>
          <div class="card-body w-84 h-56 ml-2">
            <span class="flex flex-col">
              <h2 v-if="!isMobileOrTablet" class="card-title">{{ favManga.data.title }}</h2>
              <h3 v-else class="card-title text-lg font-extrabold">{{ favManga.data.title }}</h3>
              <span class="text-xs text-neutral-content">{{
                favManga.data["type"]
                  .replaceAll("Light Novel", "Hafif Roman")
                  .replaceAll("Novel", "Roman")
              }}</span>
            </span>
            <span class="flex flex-row flex-wrap">
              <span
                class="badge badge-accent badge-soft badge-xs gap-2 mr-1 mt-1"
                >{{ data["malstatus"][String(favManga.data.status)] }}</span
              >
              <span
                v-for="genre of favManga.data.genres"
                :key="genre"
                class="badge badge-soft badge-xs gap-2 my-1 mr-1"
                >{{ data.malgenres[String(genre.name)] }}</span
              >
              <br /><br v-if="!isMobileOrTablet" />
            </span>
            <p class="max-h-64 overflow-auto text-xs">
              {{ favManga.data.synopsis }}
            </p>
            <div class="flex justify-end">
              <NuxtLink
                class="btn btn-ghost lg:btn-md btn-sm flex flex-row mx-1 tooltip"
                data-tip="MyAnimeList sayfasını görüntüle"
                :href="favManga.data.url"
                ><Icon name="simple-icons:myanimelist" class="h-6 w-6"
              /></NuxtLink>
              <NuxtLink
                class="btn btn-primary btn-soft lg:btn-md btn-sm flex flex-row tooltip"
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
        <div
          class="hero w-full h-[320px] rounded-lg"
          style="background-image: url('https://cdn.sanity.io/images/1yge7tlr/production/71efea64a9adc5415bdbb834cb959b0e66890688-480x270.gif');"
        >
          <div class="hero-overlay w-full h-[320px] bg-base-300 opacity-85"></div>
          <div class="hero-content text-neutral-content text-center">
            <div>
              <h1 class="mb-5 text-6xl font-bold">Kütüphane</h1>
              <p class="mb-5 max-w-2xl">
                Mangile kullanıcılarına sunulmuş derin bir kütüphane! Favori serilerini listelere ayır, okuduklarını takip et, binlerce manga arasından kendi kitaplığını oluştur. Aradığın her şey tek bir yerde, üstelik kullanıcı dostu ve tamamen ücretsiz! Şimdi keşfet, kendi manga evrenini kur!
              </p>
              <NuxtLink
              :to="`/user/${route.params.userID}/library`"
              class="btn btn-soft btn-secondary"
            >
              <Icon name="mdi:library" class="w-5 h-5" />
              <span v-if="!isMobileOrTablet">Kütüphane</span>
            </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </div>
</template>
