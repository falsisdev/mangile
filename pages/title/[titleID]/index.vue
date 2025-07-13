<script setup>
import { data } from "@/assets/data.ts"

const route = useRoute();
const { isMobileOrTablet, isMobile } = useDevice();

const theme = useCookie("theme").value == null ? "sunset" : useCookie("theme")

const query = groq`*[myAnimeListId == ${route.params.titleID}] {
  ...,
  chapters[] {
    ...,
    source-> {
      _id,
      name,
      url,
      description
    }
  }
}`;
const { data: preSanityData } = useSanityQuery(query);

const sanityData = ref([]);
const groupedChapters = ref([]);
const unGroupedChapters = ref([]);
const scans = ref([]);
const userData = ref(null);
const dbStyle = ref(1); //1 düzenli liste görünümü, 0 düzensiz liste görünümü

const config = useRuntimeConfig();
const user = useLogtoUser();

const groupChaptersByNumber = (chapters) => {
  const groupedChapters = {};
  chapters.forEach((chapter) => {
    const { chapterNumber } = chapter;
    if (!groupedChapters[chapterNumber]) {
      groupedChapters[chapterNumber] = [];
    }
    groupedChapters[chapterNumber].push(chapter);
  });
  return Object.keys(groupedChapters)
    .map(Number)
    .sort((a, b) => a - b)
    .map(key => groupedChapters[key]);
};

const groupChaptersByNumberAndSource = (chapters) => {
  const groupedChapters = {};
  chapters.forEach((chapter) => {
    const key = `${chapter.chapterNumber}-${chapter.source._id}`;
    if (!groupedChapters[key]) {
      groupedChapters[key] = [];
    }
    groupedChapters[key].push(chapter);
  });
  return Object.values(groupedChapters);
};

watchEffect(() => {
  if (preSanityData.value) {
    const fetchedData = toRaw(preSanityData.value);
    sanityData.value = fetchedData;

    if (fetchedData.length > 0) {
      if (dbStyle.value === 1) {
        groupedChapters.value = groupChaptersByNumber(fetchedData[0].chapters);
      } else {
        groupedChapters.value = groupChaptersByNumberAndSource(fetchedData[0].chapters);
      }
      unGroupedChapters.value = fetchedData[0].chapters;
      fetchedData[0]["chapters"].forEach((x) => fetchedData[0].chapters.forEach((x) => {
        if(x.source) scans.value.push(x.source.name)
      }));
    }
  }
});

const mangaID = ref(route.params.titleID); //ref içinde çünkü watcher kullanılıyor
const manga = ref([]); //manganın <template> içerisinde kullanılacak bütün MAL verileri bu ref'in içerisine kaydolacak
const images = ref([]);
const recommendations = ref([]);
const relations = ref([]);
const warning = ref([]);

const recommendationsData = await $fetch(
  `https://api.jikan.moe/v4/manga/${mangaID.value}/recommendations`
);
recommendations.value = recommendationsData.data;

function moveElementToIndex(arr, value, targetIndex) {
  const currentIndex = arr.findIndex(
    (el) => el.jpg.large_image_url === value.jpg.large_image_url
  );
  if (currentIndex === -1 || currentIndex === targetIndex) {
    return arr;
  }
  const [removedElement] = arr.splice(currentIndex, 1);
  arr.splice(targetIndex, 0, removedElement);
  return arr;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


//fonksiyon içinde çünkü watcher ile izlenmesi gerekiyor
async function fetchManga() {
  try {
    const [mangaData, imagesData] = await Promise.all([
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`),
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/pictures`),
    ]);

    manga.value = mangaData.data;
    images.value = moveElementToIndex(
      imagesData.data,
      imagesData.data.find(
        (x) => x.jpg.large_image_url == manga.value.images.jpg.large_image_url
      ),
      0
    );

    manga.value.themes?.forEach((x) => {
      if (data.warnmessages[x.mal_id]) {
        warning.value.push(data.warnmessages[x.mal_id]);
      }
    });

    if (manga.value.relations) {
      const tempRelations = [];

      for (let relation of manga.value.relations) {
        for (let entry of relation.entry) {
          if (
            entry.type === "manga" &&
            !tempRelations.some((e) => e.entry.mal_id === entry.mal_id)
          ) {
            await sleep(1000);
            const entryData = await $fetch(
              `https://api.jikan.moe/v4/manga/${entry.mal_id}/full`
            );
            tempRelations.push({
              relation: relation.relation,
              entry: entryData.data,
            });
          }
        }
      }

      relations.value = tempRelations;
    }

    if (Boolean(user)) {
      await sleep(1000);
      const { data: response } = await useFetch(
        `/api/users/${user.sub}?appSecret=${toRaw(config.public).m2mAppSecret}`
      );

      userData.value = toRaw(response.value);
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
}

async function setFavorite() {
  try {
    let customData = userData.value.customData;

    if (toRaw(customData).userFavoriteTitle !== route.params.titleID) {
      toRaw(customData).userFavoriteTitle = null;
      toRaw(customData).userFavoriteTitle = route.params.titleID;
    } else {
      toRaw(customData).userFavoriteTitle = null;
    }
    const { data: resp } = await useFetch(
      `/api/users/${user.sub}?appSecret=${toRaw(config.public).m2mAppSecret}`,
      {
        method: "PATCH",
        body: {
          customData,
        },
      }
    );
  } catch (err) {
    console.error("Patch Hatası:", err);
  }
}
watchEffect(() => {
  if (manga.value?.title) {
    useSeoMeta({
      author: "Falsis",
      twitterData1: "Falsis",
      twitterLabel1: "created by",
      twitterTitle: manga.value.title,
      title: manga.value.title,
      ogTitle: "%s",
      description: manga.value.title,
      ogDescription: `${manga.value.title} adlı mangaya ait bilgilere, bölümlere ve benzeri bir çok veriye ulaş ve manganın Türkçe bölümlerine Mangile'da eriş!`,
      ogImage: manga.value.images.jpg.large_image_url,
      twitterCard: "summary_large_image",
      twitterImage: manga.value.images.jpg.large_image_url,
      ogImageHeight: 200,
      ogImageWidth: 400,
    });
  }
});

watch([mangaID, userData], async (newID, oldID) => {
  if (newID !== oldID) {
    await fetchManga();
  }
});

watch(dbStyle, (newStyle, oldStyle) => {
  if (newStyle !== oldStyle) {
    const dbStyleCookie = useCookie("dbStyle", {
      sameSite: "None",
      secure: true,
    });
    dbStyleCookie.value = newStyle;
  }
});
onMounted(() => {
  const dbStyleCookie = useCookie("dbStyle", {
    sameSite: "None",
    secure: true,
  });

  if (dbStyleCookie.value == 0) dbStyle.value = 0;
});
onMounted(fetchManga); //sayfa ilk yüklendiğinde fetch'le

// Yeni: scroll ile banner opacity kontrolü için
const bannerOpacity = ref(1);

function handleScroll() {
  if (!isMobileOrTablet) return;
  const bannerHeight = 384; // h-96 = 384px
  const scrollY = window.scrollY;
  // 0-75px arası yumuşak geçiş, daha fazlasında tamamen kaybolsun
  bannerOpacity.value = Math.max(0, 1 - scrollY / 75);
}

onMounted(() => {
  if (isMobileOrTablet) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});
onUnmounted(() => {
  if (isMobileOrTablet) {
    window.removeEventListener('scroll', handleScroll);
  }
});

// Geri tuşu fonksiyonu
function goBack() {
  window.history.length > 1 ? window.history.back() : navigateTo('/');
}

// "Devamını Göster/Daralt" için reaktif değişkenler
const showFullSanityDesc = ref(false)
const showFullSynopsis = ref(false)
</script>
<template>
  <main class="lg:grid lg:grid-cols-11">
    <!-- Mobil Banner Başlangıcı -->
    <div
      v-if="isMobileOrTablet"
      class="relative max-w-screen h-36 overflow-x-hidden select-none"
      style="position: sticky; top: 0; z-index: 30;"
    >
      <!-- Banner arkaplanı -->
      <div
        class="absolute top-0 left-0 w-full h-full z-0 transition-all duration-300"
        :style="[
          images && images[1] && images[1].jpg
            ? `background-image: url('${images[1].jpg.large_image_url}');`
            : (manga && manga.images && manga.images.jpg
                ? `background-image: url('${manga.images.jpg.large_image_url}');`
                : ''),
          'background-size: cover; background-position: center;',
          'opacity: 0.7;',
          `filter: brightness(0.5);`,
          `opacity: ${bannerOpacity}`,
        ]"
      ></div>
      <!-- Banner alt fade -->
      <div
        class="absolute bottom-0 left-0 w-full h-24 z-10 pointer-events-none"
        :style="`background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${data['themes'][theme]['base-100']} 100%); opacity: ${bannerOpacity};`"
      ></div>
      <!-- Üst bar: geri ve favori -->
      <div
        class="absolute top-0 left-0 w-full flex flex-row justify-between items-center px-3 pt-3 z-20"
        :style="`opacity: ${bannerOpacity}; transition: opacity 0.2s;`"
      >
        <button
          @click="goBack"
          class="btn btn-ghost bg-black/40 hover:bg-black/60 text-white"
          aria-label="Geri"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-7 h-7" />
        </button>
        <button
          v-if="Boolean(user)"
          @click="setFavorite()"
          class="btn btn-ghost bg-black/40 hover:bg-black/60 text-white"
          aria-label="Favori"
        >
          <Icon
            name="material-symbols:award-star"
            class="w-7 h-7"
            :class="{
              'text-gray-400 animate-pulse': !userData || !userData.customData,
              'text-yellow-400': userData && userData.customData && userData.customData.userFavoriteTitle == route.params.titleID,
              'text-white': userData && userData.customData && userData.customData.userFavoriteTitle != route.params.titleID
            }"
          />
        </button>
      </div>
    </div>
    <!-- Mobil Banner Sonu -->
    <div v-if="isMobileOrTablet"
        class="relative flex flex-row items-end justify-center gap-x-4 w-full h-full z-10"
        style="height: 22rem; overflow-x:hidden; align-items: flex-start;"
      >
        <div class="flex flex-col items-center ml-2 mt-4">
          <div class="shadow-xl rounded-xl overflow-hidden mb-2 flex-shrink-0 w-36 h-56">
            <NuxtImg
              v-if="manga && manga.images && manga.images.jpg"
              :src="manga.images.jpg.large_image_url"
              class="object-cover w-36 h-56"
              alt="Manga Cover"
            />
          </div>
        </div>
        <!-- Başlık/Yazar/Badge/Tarih -->
        <div class="flex flex-col items-start justify-center place-self-start max-w-[60vw] min-w-0 mt-4 overflow-x-hidden">
          <span v-if="manga.authors" class="card-title">
            <h1 class="flex flex-col">
              <span class="flex flex-col relative">
                <span
                  class="text-2xl font-extrabold mx-1 whitespace-nowrap overflow-hidden"
                  style="max-width:100vw;overflow-x:hidden;"
                >
                  <span
                    class="marquee-container"
                    style="max-width: 40vw; overflow-x:hidden;"
                  >
                    <span
                      :class="`inline-block ${manga['title'] && manga['title'].length >= 32 ? 'animate-marquee' : ''}`"
                      style="min-width: 100%;"
                    >
                      {{ manga.title }}
                    </span>
                  </span>
                </span>
              </span>
              <span class="text-xs mx-1 opacity-75 text-gray-400">
                <span
                  v-for="author of manga.authors"
                  :key="author"
                  class="mr-1"
                >
                  {{ author["name"].split(", ").sort().join(", ") 
                  }}{{
                    manga["authors"].length >= 2 &&
                    manga["authors"].length - 1 != manga["authors"].indexOf(author)
                      ? manga["authors"].length - 2 == manga["authors"].indexOf(author)
                        ? " ve "
                        : ", "
                      : ""
                  }}
                </span>
              </span>
            </h1>
          </span>
          <!-- Mobil/tablet için badge ve yayınlanma tarihi -->
          <span v-if="isMobileOrTablet" class="mt-2 text-[0.80rem]">
            <span
              v-if="manga.status"
              class="badge badge-accent badge-soft lg:badge-sm badge-xs mr-1"
              >{{ data["malstatus"][String(manga.status)] }}</span
            >
            <br/>
            <span
              v-for="genre of manga.genres"
              :key="genre"
              class="badge badge-neutral lg:badge-sm badge-xs gap-2 my-1 mr-1"
              >{{ data.malgenres[String(genre.name)] }}</span
            >
            <br />
            <span v-if="manga.published" class="text-xs">
              {{
                `${manga["published"].prop.from.day} ${
                  data.months[parseInt(manga["published"].prop.from.month) - 1]
                } ${manga["published"].prop.from.year}'den ${
                  manga["published"].prop.to.day
                    ? manga["published"].prop.to.day
                    : ""
                } ${
                  manga["published"].prop.to.month
                    ? data.months[parseInt(manga["published"].prop.to.month) - 1]
                    : ""
                } ${
                  manga["published"].prop.to.year
                    ? manga["published"].prop.to.year
                    : ""
                }${
                  manga.published.prop.to.year
                    ? "'e kadar yayınlandı"
                    : " günümüze kadar yayınını sürdürüyor"
                }`
              }}
            </span>
          </span>
        </div>
      </div>
    <div
      v-if="manga && manga.images && manga.images.jpg"
      class="card lg:card-side lg:card-normal card-sm bg-base-100 lg:col-start-1 lg:col-end-11 lg:m-5 lg:grid lg:grid-cols-12 text-xs"
      :class="isMobileOrTablet ? '-mt-24' : ''"
      :style="isMobileOrTablet ? 'overflow-x:auto;max-width:100vw;' : ''"
    >
      <article class="prose lg:flex lg:flex-col lg:col-start-1 lg:col-end-5" :style="isMobileOrTablet ? 'overflow-x:auto;max-width:100vw;' : ''">
        <!-- Mobilde swiper yukarı taşındı, desktop'ta eski yerinde -->
        <div v-if="isMobileOrTablet" class="hidden"></div>
          <div
            v-if="isMobileOrTablet && manga.score && manga.rank && manga.popularity && manga.favorites"
            class="flex flex-row w-full justify-between gap-2 px-1"
          >
            <div class="flex flex-col items-center justify-center rounded-lg px-1 py-1 min-w-0 flex-1">
              <span class="text-xs font-bold">{{ manga.score }}</span>
              <span class="text-[0.65rem] text-gray-400">Ortalama Puan</span>
            </div>
            <div class="flex flex-col items-center justify-centerrounded-lg px-1 py-1 min-w-0 flex-1">
              <span class="text-xs font-bold">#{{ manga.rank }}</span>
              <span class="text-[0.65rem] text-gray-400">Genel Sıralama </span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-lg px-1 py-1 min-w-0 flex-1">
              <span class="text-xs font-bold">#{{ manga.popularity }}</span>
              <span class="text-[0.65rem] text-gray-400">Popülerite Sırası</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-lg px-1 py-1 min-w-0 flex-1">
              <span class="text-xs font-bold">{{ manga.favorites }}</span>
              <span class="text-[0.65rem] text-gray-400">Favorileme</span>
            </div>
          </div>
        <swiper
          v-if="!isMobileOrTablet"
          :spaceBetween="0"
          :centeredSlides="true"
          :loop="true"
          class="lg:w-[287px] w-72 max-w-full lg:max-h-[600px] lg:-mt-5 lg:mb-5"
          :style="isMobileOrTablet ? 'overflow-x:auto;max-width:100vw;' : ''"
        >
          <swiper-slide
            v-for="image of images"
            :key="image"
            class="flex justify-center items-center max-w-full max-h-[600px]"
          >
            <figure>
              <NuxtImg
                class="rounded shadow-md w-auto h-auto max-w-full max-h-[400px] object-contain"
                :src="image.jpg.large_image_url"
              />
            </figure>
          </swiper-slide>
        </swiper>
        <span v-if="!isMobileOrTablet" class="-mt-2">
          <h1>Başlıklar</h1>
          <div class="w-72 -m-2 -mt-5">
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Tür/Dil</th>
                  <th>Ad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="title of manga['titles']" :key="title">
                  <th>
                    <Icon
                      v-if="title.type != 'Default' || title.type != 'Synonym'"
                      :name="`flag:${data.titletypes[title['type']][1]}-4x3`"
                    />
                  </th>
                  <td>{{ data.titletypes[title["type"]][0] }}</td>
                  <td>{{ title["title"] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
        <span v-if="!isMobileOrTablet" class="-mt-2">
          <h1>Sanatçılar</h1>
          <div class="w-72 -m-2 -mt-5">
            <table class="table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="author of manga['authors']" :key="author">
                  <td
                    v-for="item of author['name'].split(', ').sort()"
                    :key="item"
                  >
                    {{ item }}
                  </td>
                  <td>
                    <NuxtLink
                      class="btn btn-xs btn-ghost"
                      :to="`/person/${author.mal_id}`"
                    >
                      Görüntüle
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
      </article>
      <div class="card-body lg:col-start-5 lg:col-end-12" :style="isMobileOrTablet ? 'overflow-x:hidden;max-width:100vw;' : ''">
        <article class="prose" :style="isMobileOrTablet ? 'overflow-x:hidden;max-width:100vw;' : ''">
          <span v-if="!isMobileOrTablet">
            <span v-if="manga.authors" class="card-title lg:-my-7 -mt-10 -mb-10">
              <h1 class="flex flex-col lg:-mb-0 -mb-1">
                <span class="lg:text-sm mx-1 text-xs lg:opacity-100 opacity-75 text-gray-400 flex flex-row lg:mx-1 -mb-2">
                  <span
                    v-for="author of manga.authors"
                    :key="author"
                    class="mr-1"
                  >
                    {{ author["name"].split(", ").sort().join(" ")
                    }}{{
                      manga["authors"].length >= 2 &&
                      manga["authors"].length - 1 !=
                        manga["authors"].indexOf(author)
                        ? manga["authors"].length - 2 == 
                          manga["authors"].indexOf(author)
                          ? " ve "
                          : ", "
                        : ""
                    }}
                  </span>
                  <span class="-ml-1">'dan</span>
                </span>
                <span class="flex flex-col relative">
                  <span
                    class="lg:text-3xl text-2xl mx-1 whitespace-nowrap overflow-hidden"
                  >
                    <span
                      :class="`inline-block ${manga['title'].length >= 32 ? 'animate-marquee' : ''} lg:w-[35rem] w-80`"
                    >
                      {{ manga.title }}
                    </span>
                  </span>
                </span>
                <span
                  v-if="
                    manga['title'].toLowerCase() !=
                    manga['title_japanese'].toLowerCase()
                  "
                  class="text-gray-400 lg:text-xl text-sm mx-1 lg:opacity-100 opacity-75 lg:-mt-0 -mt-1 lg:mb-0 mb-11"
                >
                  {{ manga.title_japanese }}
                </span>
                <span class="lg:mb-7"/>
              </h1>
            </span>
          </span>
          <span>
            <span v-if="!isMobileOrTablet">
            <span
              v-if="manga.status"
              class="badge badge-accent badge-soft lg:badge-sm badge-xs mr-1"
              >{{ data["malstatus"][String(manga.status)] }}</span
            >
            <span
              v-for="genre of manga.genres"
              :key="genre"
              class="badge badge-neutral lg:badge-sm badge-xs gap-2 my-1 mr-1"
              >{{ data.malgenres[String(genre.name)] }}</span
            >
            <br />
            <span v-if="manga.published" class="text-sm lg:text-md">
              {{
                `${manga["published"].prop.from.day} ${
                  data.months[parseInt(manga["published"].prop.from.month) - 1]
                } ${manga["published"].prop.from.year}'den ${
                  manga["published"].prop.to.day
                    ? manga["published"].prop.to.day
                    : ""
                } ${
                  manga["published"].prop.to.month
                    ? data.months[
                        parseInt(manga["published"].prop.to.month) - 1
                      ]
                    : ""
                } ${
                  manga["published"].prop.to.year
                    ? manga["published"].prop.to.year
                    : ""
                }${
                  manga.published.prop.to.year
                    ? "'e kadar yayınlandı"
                    : " günümüze kadar yayınını sürdürüyor"
                }`
              }}
            </span>
            <br class="lg:mb-0 mb-2" />
           <button
          v-if="Boolean(user)"
          @click="setFavorite()"
          class="btn btn-ghost text-white tooltip tooltip-right"
          data-tip="Favoriye Ekle/Kaldır"
          aria-label="Favori"
        >
          <Icon
            name="material-symbols:award-star"
            class="w-12 h-12"
            :class="{
              'text-gray-400 animate-pulse': !userData || !userData.customData,
              'text-yellow-200': userData && userData.customData && userData.customData.userFavoriteTitle == route.params.titleID,
              'text-white': userData && userData.customData && userData.customData.userFavoriteTitle != route.params.titleID
            }"
          />
        </button>
            <span class="divider py-3 -mt-0 lg:-mb-0 -mb-1" />
            </span>
            <span v-if="sanityData != String([])" class="text-sm lg:text-md">
              <span v-if="!showFullSanityDesc">
                {{
                  sanityData[0].description.length > 1000
                    ? sanityData[0].description.slice(0, 1000) + "..."
                    : sanityData[0].description
                }}
                <button
                  v-if="sanityData[0].description.length > 1000"
                  class="ml-1"
                  @click="showFullSanityDesc = true"
                  style="font-size:0.95em"
                >
                  Devamını Göster
                </button>
              </span>
              <span v-else>
                {{ sanityData[0].description }}
                <button
                  class="ml-1"
                  @click="showFullSanityDesc = false"
                  style="font-size:0.95em"
                >
                  Daralt
                </button>
              </span>
            </span>
            <!-- Sanity description yoksa, synopsis için göster/daralt -->
            <span
              v-else-if="manga.synopsis"
              class="text-sm lg:text-md"
            >
              <span v-if="!showFullSynopsis">
                {{ manga.synopsis.length > 1000
                    ? manga.synopsis.slice(0, 1000) + "..."
                    : manga.synopsis }}
                <button
                  v-if="manga.synopsis.length > 1000"
                  class="ml-1"
                  @click="showFullSynopsis = true"
                  style="font-size:0.95em"
                >
                  Devamını Göster
                </button>
              </span>
              <span v-else>
                {{ manga.synopsis }}
                <button
                  class="ml-1"
                  @click="showFullSynopsis = false"
                  style="font-size:0.95em"
                >
                  Daralt
                </button>
              </span>
            </span>
            <!-- Mobilde synopsis için "devamını göster/daralt" -->
            <span
              v-else-if="manga.synopsis && isMobileOrTablet"
              class="text-sm lg:text-md"
            >
              <span v-if="!showFullSynopsis">
                {{ manga.synopsis.length > 300
                    ? manga.synopsis.slice(0, 300) + "..."
                    : manga.synopsis }}
                <button
                  v-if="manga.synopsis.length > 300"
                  class="ml-1"
                  @click="showFullSynopsis = true"
                  style="font-size:0.95em"
                >
                  Devamını Göster
                </button>
              </span>
              <span v-else>
                {{ manga.synopsis }}
                <button
                  class="ml-1"
                  @click="showFullSynopsis = false"
                  style="font-size:0.95em"
                >
                  Daralt
                </button>
              </span>
            </span>
            <span v-else-if="manga.synopsis" class="text-sm lg:text-md">{{
              manga.synopsis
            }}</span>
            <br /><br />
            <div v-if="sanityData != String([])">
              <span
                v-if="sanityData[0].notes"
                class="collapse collapse-arrow -mx-2 -mt-5 lg:border lg:border-base-200 lg:mb-5 mb-3"
              >
                <input type="checkbox" class="lg:text-xl text-lg peer" />
                <div class="collapse-title lg:text-xl text-lg">
                  <Icon
                    name="material-symbols:clinical-notes"
                    class="h-5 w-5"
                  />
                  Notlar
                </div>
                <div class="collapse-content text-sm lg:text-md -mt-4">
                  <SanityContent :blocks="sanityData[0].notes" />
                </div>
              </span>
            </div>
            <div class="flex flex-row">
              <article class="prose">
                <h1 class="lg:text-3xl text-2xl">Veri Tabanı</h1>
              </article>
              <span class="grow" />
              <button
                @click.prevent="dbStyle = 1"
                :class="`btn btn-ghost lg:btn-sm btn-xs mt-2 lg:tooltip ${dbStyle ? 'btn-primary btn-active' : ''}`"
                data-tip="Düzenli görünüm"
              >
                <Icon
                  name="material-symbols:format-list-numbered"
                  class="h-5 w-5"
                />
              </button>
              <button
                @click.prevent="dbStyle = 0"
                :class="`btn btn-ghost lg:btn-sm btn-xs mt-2 lg:tooltip ${dbStyle ? '' : 'btn-primary btn-active'}`"
                data-tip="Dağınık görünüm"
              >
                <Icon
                  name="material-symbols:format-list-bulleted"
                  class="h-5 w-5"
                />
              </button>
            </div>
            <span class="divider" />
            <ul class="menu lg:menu-md menu-xs rounded-lg w-full lg:w-full border border-base-200">
              <li>
                <details>
                  <summary>
                    <Icon name="mdi:book-open-blank-variant" class="h-5 w-5" />
                    Bölümler
                  </summary>
                  <ul v-if="sanityData != String([])" class="-ml-1 -my-2">
                    <li v-for="chapter of groupedChapters" :key="chapter"> 
                      <details v-if="dbStyle">
                        <summary>
                          <Icon name="mdi:file-document" class="h-6 w-6 mt-[0.7]" />
                          Bölüm
                          {{
                            chapter[0]
                              ? chapter[0].chapterNumber
                              : chapter.chapterNumber
                          }}
                        </summary>
                        <ul class="-ml-2 -my-2">
                          <li v-for="ch of chapter" :key="ch">
                            <details v-if="[...new Set(scans)].length != 1">
                              <summary>
                                <NuxtLink class="no-underline flex flex-row">
                                  <Icon
                                    name="mdi:file-document-arrow-right"
                                    class="h-5 w-5 mr-1 mt-1"
                                  />
                                 <b>{{ ch.source.name }}</b>
                                </NuxtLink>
                              </summary>
                              <ul>
                                <li>
                                  <NuxtLink
                                    :to="`/title/${route.params.titleID}/read/${ch._key}`"
                                    class="no-underline flex flex-row"
                                  >
                                    <Icon
                                      name="mdi:file-document-arrow-right"
                                      class="h-5 w-5"
                                    />
                                    {{ ch.title }}
                                  </NuxtLink>
                                </li>
                              </ul>
                            </details>
                            <NuxtLink
                              v-else
                              :to="`/title/${route.params.titleID}/read/${ch._key}`"
                              class="no-underline flex flex-row"
                            >
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              {{ ch.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </details>
                      <span v-else>
                        <span v-for="ch of chapter" :key="ch">
                          <span v-if="!isMobileOrTablet">
                            <NuxtLink
                              :to="`/title/${route.params.titleID}/read/${ch._key}`"
                              class="no-underline flex flex-row"
                            >
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-7 w-7 mr-1 mt-1"
                              />
                              {{ ch.title }}
                              <NuxtLink :to="`/scan/${ch.source._id}`"><b class="ml-1">({{ ch.source.name }})</b> </NuxtLink>
                            </NuxtLink>
                          </span>
                          <span v-else>
                            <NuxtLink
                              :to="`/title/${route.params.titleID}/read/${ch._key}`"
                              class="no-underline flex flex-col"
                            >
                            <span class="flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="mt-[5px] mr-1"
                              />
                              {{ ch.title }}
                            </span>
                             <NuxtLink :to="`/scan/${ch.source._id}`"><b class="ml-1">({{ ch.source.name }})</b> </NuxtLink>
                            </NuxtLink>
                          </span>
                        </span>
                      </span>
                    </li>
                  </ul>
                  <span v-else class="mx-3 prose">
                    <span class="mt-2 text-sm">
                      Üzgünüz. Görünüşe göre bu seride hiç bölüm yüklenmemiş.
                    </span>
                  </span>
                </details>
              </li>
              <li v-if="sanityData != String([])">
                <details>
                  <summary>
                    <Icon name="mdi:file-document-edit" class="h-5 w-5" />
                    Çeviri Ekipleri
                  </summary>
                  <ul class="-ml-1">
                    <li v-for="scan in new Set(scans)" :key="scan">
                      <details>
                        <summary>
                          <NuxtLink class="no-underline flex flex-row">
                            <Icon
                              name="mdi:file-document-arrow-right"
                              class="h-7 w-7 mr-1 mt-1"
                            />
                            {{ scan }}
                          </NuxtLink>
                        </summary>
                        <ul class="-ml-2">
                          <li
                            v-for="chapter of unGroupedChapters.filter(
                              (x) => x.source.name == scan
                            )"
                            :key="chapter"
                          >
                            <NuxtLink
                              :to="`/title/${route.params.titleID}/read/${chapter._key}`"
                              class="no-underline flex flex-row"
                            >
                              <Icon name="mdi:file-document" class="h-5 w-5" />
                              {{ chapter.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <NuxtLink class="no-underline flex flex-row">
                  <Icon
                    name="material-symbols:type-specimen"
                    class="h-5 w-5 mr-1"
                  />
                  {{
                    manga.type == "Light Novel"
                      ? "Hafif Roman"
                      : manga.type == "Novel"
                        ? "Roman"
                        : manga.type
                  }}
                </NuxtLink>
              </li>
              <li v-for="link of manga.external" :key="link">
                <NuxtLink :to="link.url" class="no-underline flex flex-row">
                  <Icon
                    :name="
                      link['url'].includes('twitter')
                        ? 'mdi:twitter'
                        : link['name']
                            .replaceAll('Official Site', 'mdi:web')
                            .replaceAll('Wikipedia', 'mdi:wikipedia')
                    "
                    class="h-5 w-5 mr-1"
                  />
                  {{
                    link["name"]
                      .replaceAll("Official Site", "Resmi Genel Ağ Adresi")
                      .replaceAll("Wikipedia", "Vikipedi")
                  }}
                </NuxtLink>
              </li>
              <li v-for="link of manga.serializations" :key="link">
                <NuxtLink :to="link.url" class="no-underline flex flex-row">
                  <Icon name="mdi:library" class="h-5 w-5 mr-1" />
                  {{
                    link["name"]
                      .replaceAll("Weekly", "Haftalık")
                      .replaceAll("Monthly", "Aylık")
                  }}
                </NuxtLink>
              </li>
            </ul>
          </span>
        </article>
      </div>
      <div
        v-if="!isMobileOrTablet &&
          manga.score &&
          manga.scored_by &&
          manga.rank &&
          manga.popularity &&
          manga.members &&
          manga.favorites
        "
        class="lg:col-start-12 lg:col-end-12"
      >
        <div class="stats">
          <span class="flex flex-col">
            <span v-if="!isMobileOrTablet" class="ml-1">
            </span>
            <span class="flex lg:flex-col flex-row flex-wrap -mt-2">
              <article class="prose text-center">
                <h2 class="lg:m-0 mx-5">MAL İstatistikleri</h2>
              </article>
              <div class="stat">
                <div class="stat-figure">
                  <Icon name="material-symbols:star" class="w-8 h-8" />
                </div>
                <div class="stat-title">Puan Ortalaması</div>
                <div class="stat-value">{{ manga.score }}</div>
                <div class="stat-desc">puan ortalamasına sahip</div>
              </div>
              <div class="stat">
                <div class="stat-figure">
                  <Icon name="mdi:account-star" class="w-8 h-8" />
                </div>
                <div class="stat-title">Kamuoyu</div>
                <div class="stat-value">{{ manga.scored_by }}</div>
                <div class="stat-desc">kişi tarafından puanlandı</div>
              </div>
              <div class="stat">
                <div class="stat-figure">
                  <Icon name="material-symbols:tag" class="w-8 h-8" />
                </div>
                <div class="stat-title">Sıralama</div>
                <div class="stat-value">{{ manga.rank }}.</div>
                <div class="stat-desc">sırada</div>
              </div>
              <div class="stat">
                <div class="stat-figure">
                  <Icon
                    name="material-symbols:auto-awesome-rounded"
                    class="w-8 h-8"
                  />
                </div>
                <div class="stat-title">Popülerlik</div>
                <div class="stat-value">{{ manga.popularity }}.</div>
                <div class="stat-desc">aktif en popüler manga</div>
              </div>
              <div class="stat">
                <div class="stat-figure">
                  <Icon name="mdi:account-group" class="w-8 h-8" />
                </div>
                <div class="stat-title">Üye</div>
                <div class="stat-value">{{ manga.members }}</div>
                <div class="stat-desc">kişinin kitaplığında</div>
              </div>
              <div class="stat">
                <div class="stat-figure">
                  <Icon name="material-symbols:favorite" class="w-8 h-8" />
                </div>
                <div class="stat-title">Favori</div>
                <div class="stat-value">{{ manga.favorites }}</div>
                <div class="stat-desc">
                  <div class="stat-desc">kişinin favori mangası</div>
                </div>
              </div>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="relations[0] && manga && manga.images && manga.images.jpg"
      class="lg:col-start-1 lg:col-end-11 px-5"
    >
      <article class="prose max-w-none lg:px-5 lg:-mb-0 -mb-5">
        <h1 class="lg:text-3xl text-2xl lg:flex lg:flex-row">Bağlantılı Seriler</h1>
        <span v-if="isMobile" class="divider -my-2"/>
      </article>
      <span
        v-for="relation of manga.relations"
        :key="relation"
        class="lg:my-5 lg:flex lg:flex-row"
      >
        <span
          v-if="
            relations.filter((x) => x.relation == relation.relation).length != 0
          "
          class="lg:flex lg:items-center"
        >
          <article
            v-if="!isMobileOrTablet"
            class="prose rotate-180 lg:-mr-5"
            style="text-orientation: sideways; writing-mode: vertical-lr"
          >
            <h1>
              {{
                relation["relation"]
                  .replaceAll("Other", "Diğer")
                  .replaceAll("Adaptation", "Adaptasyon")
                  .replaceAll("Sequel", "Devam Serisi")
                  .replaceAll("Prequel", "Önceki Seri")
                  .replaceAll("Side Story", "Yan Öykü")
                  .replaceAll("Alternative Version", "Alternatif Yorum")
                  .replaceAll("Parent Story", "Ana Öykü")
                  .replaceAll("Character", "Karakter")
              }}
            </h1>
          </article>
        </span>
        <br v-if="isMobileOrTablet" />
        <span
          v-if="!isMobile"
          class="divider divider-horizontal lg:ml-2"
        />
        <span class="flex flex-row flex-wrap">
          <RelationCard
            v-for="entry of relations.filter(
              (x) => x.relation == relation.relation
            )"
            :key="entry.entry.mal_id"
            :itemData="entry.entry"
            :relationName="isMobileOrTablet ? relation.relation : ''"
            :index="relations.indexOf(entry)"
          />
        </span>
      </span>
    </div>
    <div v-else class="lg:col-start-2 lg:col-end-11 lg:m-5 flex items-center justify-center min-h-screen">
      <Icon name="mingcute:loading-line" class="animate-spin w-full lg:h-32 h-16" />
    </div>
    <span class="divider" />
    <div
      v-if="recommendations[0]"
      class="lg:col-start-1 lg:col-end-12 lg:mt-0 mt-2"
    >
      <article class="prose max-w-none px-5">
        <h1 class="flex flex-row">İlginizi çekebilir</h1>
      </article>
      <Recommendations class="my-5" :itemData="recommendations" />
    </div>
  </main>
</template>
<style>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 10s linear infinite;
  animation-delay: 0.5s;
}

.marquee-container {
  overflow-x: hidden;
  width: 100%;
  display: block;
  max-width: 100vw;
}

/* Sadece mobilde overflow-x gizle, masaüstünde kaldır */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
@media (min-width: 1024px) {
  html, body {
    overflow-x: unset !important;
    max-width: unset !important;
  }
}

/* Banner fade için ekstra stil */
@media (max-width: 1023px) {
  .mobile-banner-fade {
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, #18181b 100%);
    height: 6rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;
  }
}
</style>
