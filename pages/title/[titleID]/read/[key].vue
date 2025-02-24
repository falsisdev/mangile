<script setup>
import imageUrlBuilder from "@sanity/image-url";

const route = useRoute();
const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

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
const chapter = ref(null);
const images = ref([]);

const mangaID = ref(route.params.titleID);
const manga = ref([]);

const selectedChapterKey = ref(route.params.key);

const handleChapterChange = (event) => {
  const selectedKey = event.target.value;
  if (selectedKey) {
    navigateTo(`/title/${route.params.titleID}/read/${selectedKey}`);
  }
};

const getCurrentScanChapters = () => {
  return sanityData.value[0]['chapters'].filter(chap => chap.source._id === chapter.value.source._id);
};

async function fetchManga() {
  try {
    const mangaData = await Promise.resolve(
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`)
    );

    manga.value = mangaData.data;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
}

const transformLinksToImages = (content) => {
  return content.map(block => {
    if (block._type === 'block' && block.children) {
      block.children = block.children.map(child => {
        if (child._type === 'span' && child.marks.length > 0) {
          const linkMark = block.markDefs.find(mark => mark._key === child.marks[0]);
          if (linkMark && linkMark._type === 'link') {
            return {
              _type: 'image',
              src: linkMark.href,
              alt: child.text
            };
          }
        }
        return child;
      });
    }
    return block;
  });
};

watchEffect(() => {
  if (preSanityData.value) {
    const fetchedData = toRaw(preSanityData.value);
    sanityData.value = fetchedData;

    if (fetchedData.length > 0) {
      fetchedData[0]["chapters"].forEach((x) =>
        x._key == route.params.key ? (chapter.value = x) : ""
      );
      if (sanityData.value[0]._type == "manga") {
        for (let image of chapter.value.pages) {
          images.value.push(
            builder.image(image.asset._ref).auto("format").url()
          );
        }
      }
      if (sanityData.value[0]._type == "lightNovel") {
        chapter.value.content = transformLinksToImages(chapter.value.content);
      }
    }
  }
});

watchEffect(() => {
  if (manga.value?.title && chapter.value) {
    useSeoMeta({
      author: "Falsis",
      twitterData1: "Falsis",
      twitterLabel1: "created by",
      twitterTitle:
        chapter.value.chapterNumber +
        " | " +
        chapter.value.title +
        " -- " +
        sanityData.value[0].title,
      title:
        chapter.value.chapterNumber +
        " | " +
        chapter.value.title +
        " -- " +
        sanityData.value[0].title,
      ogTitle: "%s",
      description:
        sanityData.value[0].title + " " + chapter.value.title + " Oku",
      ogDescription:
        sanityData.value[0].title + " " + chapter.value.title + " Oku",
      ogImage: manga.value.images.jpg.large_image_url,
      twitterCard: "summary_large_image",
      twitterImage: manga.value.images.jpg.large_image_url,
    });
  }
});

watch([mangaID], async (newID, oldID) => {
  if (newID !== oldID) {
    await fetchManga();
  }
});
onMounted(fetchManga);

const getNextChapterKey = () => {
  const currentIndex = sanityData.value[0]['chapters'].indexOf(chapter.value);
  const currentScan = chapter.value.source._id;
  let nextChapter = null;

  // Önce aynı scan'e sahip sonraki bölümü bul
  for (let i = currentIndex + 1; i < sanityData.value[0]['chapters'].length; i++) {
    if (sanityData.value[0]['chapters'][i].source._id === currentScan) {
      nextChapter = sanityData.value[0]['chapters'][i];
      break;
    }
  }

  // Eğer aynı scan'e sahip bölüm yoksa sıradaki bölümü al
  if (!nextChapter && currentIndex + 1 < sanityData.value[0]['chapters'].length) {
    const nextChapterCandidate = sanityData.value[0]['chapters'][currentIndex + 1];
    if (nextChapterCandidate.chapterNumber === chapter.value.chapterNumber + 1) {
      nextChapter = nextChapterCandidate;
    }
  }

  return nextChapter ? nextChapter._key : '';
};

const getPreviousChapterKey = () => {
  const currentIndex = sanityData.value[0]['chapters'].indexOf(chapter.value);
  const currentScan = chapter.value.source._id;
  let previousChapter = null;

  // Önce aynı scan'e sahip önceki bölümü bul
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (sanityData.value[0]['chapters'][i].source._id === currentScan) {
      previousChapter = sanityData.value[0]['chapters'][i];
      break;
    }
  }

  // Eğer aynı scan'e sahip bölüm yoksa önceki sıradaki bölümü al
  if (!previousChapter && currentIndex - 1 >= 0) {
    const previousChapterCandidate = sanityData.value[0]['chapters'][currentIndex - 1];
    if (previousChapterCandidate.chapterNumber === chapter.value.chapterNumber - 1) {
      previousChapter = previousChapterCandidate;
    }
  }

  return previousChapter ? previousChapter._key : '';
};

const currentPage = ref(1);
</script>
<template>
  <main v-if="chapter && manga" class="lg:m-0 mx-5">
    <div class="lg:pt-0 pt-5">
      <article class="prose max-w-none flex flex-col">
        <h1 class="flex flex-col">
          <span class="text-3xl">{{ sanityData[0].title }}</span>
          <span class="flex flex-row">
            <span class="text-2xl mt-1">
              <span class="kbd kbd-md -mt-1"
                ><span
                  class="tooltip"
                  :data-tip="`Bölüm ${chapter.chapterNumber}`"
                  >{{ chapter.chapterNumber }}</span
                ></span
              >
              - {{ chapter.title }}</span
            >
            <span class="grow" />
          </span>
        </h1>
        <span class="flex flex-row -mt-5">
          <NuxtLink
            :to="`/title/${route.params.titleID}`"
            class="btn btn-primary"
          >
            <Icon name="material-symbols:book-rounded" />
          </NuxtLink>
          <NuxtLink
            :to="getPreviousChapterKey() ? `/title/${route.params.titleID}/read/${getPreviousChapterKey()}` : ''"
            :class="`btn ${!isMobileOrTablet ? 'btn-ghost' : 'btn-neutral'} mx-1 ${!getPreviousChapterKey() ? 'btn-disabled' : ''}`"
            ><Icon name="material-symbols:arrow-back" /> {{ !isMobileOrTablet ? 'Önceki Bölüm' : '' }}</NuxtLink
          >
          <span class="grow" />
          <NuxtLink
            :to="getNextChapterKey() ? `/title/${route.params.titleID}/read/${getNextChapterKey()}` : ''"
            :class="`btn ${!isMobileOrTablet ? 'btn-ghost' : 'btn-neutral'} mx-1 ${!getNextChapterKey() ? 'btn-disabled' : ''}`"
            >{{ !isMobileOrTablet ? 'Sonraki Bölüm' : '' }} <Icon name="material-symbols:arrow-forward"
          /></NuxtLink>
        </span>
      </article>
      <article class="prose max-w-none mt-5 lg:flex lg:flex-row">
        <h3 class="text-lg mt-3">
          Bu bölüm <NuxtLink :to="`/scan/${chapter.source._id}`">{{ chapter.source.name }}</NuxtLink> tarafından çevrilmiştir
        </h3>
        <span v-if="!isMobileOrTablet" class="grow" />
        <select v-model="selectedChapterKey" @change="handleChapterChange" class="select select-bordered">
          <option v-for="chap in getCurrentScanChapters()" :key="chap._key" :value="chap._key">
            {{ chap.chapterNumber }} - {{ chap.title }}
          </option>
        </select>
      </article>
      <div class="divider" />
      <article
        v-if="sanityData[0]._type == 'lightNovel'"
        class="prose max-w-none lg:mb-0 mb-20"
      >
        <SanityContent :blocks="chapter.content" v-slot="{ block }">
          <template v-if="block._type === 'image'">
            <NuxtImg :src="block.src" :alt="block.alt" class="w-full h-full" v-slot="{ src, isLoaded, imgAttrs }">
              <img v-if="isLoaded" :src="src" v-bind="imgAttrs" />
              <div v-else class="skeleton bg-gray-300 dark:bg-gray-700 w-full h-full"></div>
            </NuxtImg>
          </template>
          <template v-else>
            <component :is="block._type" v-bind="block" />
          </template>
        </SanityContent>
      </article>
      <div v-else-if="sanityData[0]._type == 'manga' && manga.type != 'Manhwa'">
        <div
          role="alert"
          class="alert alert-info lg:text-md text-sm lg:mt-2 px-5 text-start flex"
        >
          <Icon
            v-if="!isMobileOrTablet"
            name="material-symbols:info"
            class="w-5 h-5 lg:-mr-2"
          />
          <span
            >Bilgi: Mangalar Türkçe kitapların aksine soldan sağa değil sağdan
            sola okunur. Yakınlaştırmak için çift tıklamanız yeterlidir.</span
          >
        </div>
        <div class="text-center -mb-2 mt-2">
          Sayfa: {{ currentPage }} / {{ [...new Set(images)].length }}
        </div>
        <swiper
          class="mt-5"
          dir="rtl"
          :autoHeight="true"
          :pagination="{
            clickable: true,
            type: 'progressbar',
          }"
          :zoom="{ maxRatio: 3 }"
          :modules="[SwiperPagination, SwiperZoom]"
          @slideChange="(swiper) => { currentPage = swiper.activeIndex + 1; }"
        >
          <swiper-slide v-for="item of [...new Set(images)]" v-bind:key="item">
            <div class="swiper-zoom-container">
              <NuxtImg
                :src="item"
                class="w-full h-full"
                v-slot="{ src, isLoaded, imgAttrs}"
              >
                <img
                v-if="isLoaded"
                  :src="src"
                  v-bind="imgAttrs"
                />

                <div
                  v-else
                  class="skeleton bg-gray-300 dark:bg-gray-700 w-full h-full"></div>
              </NuxtImg>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div v-else-if="manga.type == 'Manhwa'">
        <div
          role="alert"
          class="alert alert-info lg:text-md text-sm lg:mt-2 px-5 text-start flex mb-2"
        >
          <Icon
            v-if="!isMobileOrTablet"
            name="material-symbols:info"
            class="w-5 h-5 lg:-mr-2"
          />
          <span
            >Bilgi: Bu seri bir Manhwa olduğundan Webtoon tipi okunuşa sahiptir.
            Tüm sayfayı yukarıdan aşağıya doğru kaydırarak okuyunuz.</span
          >
        </div>
        <div
          v-for="item of [...new Set(images)]"
          :key="item"
          class="flex justify-center"
        >
          <NuxtImg :src="item" class="w-full h-full" v-slot="{ src, isLoaded, imgAttrs }">
            <img v-if="isLoaded" :src="src" v-bind="imgAttrs" />
            <div v-else class="skeleton bg-gray-300 dark:bg-gray-700 w-full h-full"></div>
          </NuxtImg>
        </div>
      </div>
      <div class="divider" />
      <article class="prose max-w-none mb-5">
        <h3 class="text-lg">
          Bu bölüm <NuxtLink :to="`/scan/${chapter.source._id}`">{{ chapter.source.name }}</NuxtLink> tarafından çevrilmiştir
        </h3>
      </article>
      <span class="flex flex-row">
        <NuxtLink
          :to="`/title/${route.params.titleID}`"
          class="btn btn-primary"
        >
          <Icon name="material-symbols:book-rounded" />
        </NuxtLink>
        <NuxtLink
          :to="getPreviousChapterKey() ? `/title/${route.params.titleID}/read/${getPreviousChapterKey()}` : ''"
          :class="`btn ${!isMobileOrTablet ? 'btn-ghost' : 'btn-neutral'} mx-1 ${!getPreviousChapterKey() ? 'btn-disabled' : ''}`"
          ><Icon name="material-symbols:arrow-back" /> {{ !isMobileOrTablet ? 'Önceki Bölüm' : '' }}</NuxtLink
        >
        <span class="grow" />
        <NuxtLink
          :to="getNextChapterKey() ? `/title/${route.params.titleID}/read/${getNextChapterKey()}` : ''"
          :class="`btn ${!isMobileOrTablet ? 'btn-ghost' : 'btn-neutral'} mx-1 ${!getNextChapterKey() ? 'btn-disabled' : ''}`"
          >{{ !isMobileOrTablet ? 'Sonraki Bölüm' : '' }} <Icon name="material-symbols:arrow-forward"
        /></NuxtLink>
      </span>
    </div>
    <DisqusComments :identifier="route.fullPath" :shortname="$config.public.disqusShortname" />
    <br v-if="isMobileOrTablet" />
    <br v-if="isMobileOrTablet" />
  </main>
  <main v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </main>
</template>
