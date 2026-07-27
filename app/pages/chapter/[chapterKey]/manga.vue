<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const chapterKey = computed(() => route.params.chapterKey as string);

interface ChapterResponse {
  title: string;
  type: string;
  myAnimeListId: number;
  chapter: {
    title: string;
    pages: {
      url: string;
    }[];
  };
  chapterKeys: string[];
}

const { data: chapterData, pending } = await useFetch<ChapterResponse>(
  () =>
    `${config.public.backend.baseUrl}/api/chapter?filterType=manga&key=${chapterKey.value}`,
  {
    lazy: true,
    server: false,
    watch: [chapterKey],
  },
);

interface Page {
  url: string;
}

const images = computed<Page[]>(() => chapterData.value?.chapter?.pages ?? []);

type ReadingMode = "paged" | "webtoon";

const readingMode = ref<ReadingMode>("paged");
const currentPage = ref(1);
const controlsVisible = ref(true);
let controlsTimeout: ReturnType<typeof setTimeout> | null = null;
const webtoonWrapper = ref<HTMLElement | null>(null);

const totalPages = computed(() => images.value.length);
const currentImage = computed(
  () => images.value[currentPage.value - 1]?.url ?? null,
);

const currentChapterIndex = computed(
  () =>
    chapterData.value?.chapterKeys.findIndex(
      (key) => key === chapterKey.value,
    ) ?? -1,
);

const previousChapterKey = computed(() => {
  const keys = chapterData.value?.chapterKeys;
  const index = currentChapterIndex.value;

  if (!keys || index <= 0) return null;

  return keys[index - 1];
});

const nextChapterKey = computed(() => {
  const keys = chapterData.value?.chapterKeys;
  const index = currentChapterIndex.value;

  if (!keys || index === -1 || index >= keys.length - 1) return null;

  return keys[index + 1];
});

const goToPreviousChapter = () => {
  if (!previousChapterKey.value) return;

  navigateTo(`/chapter/${previousChapterKey.value}/manga`);
};

const goToNextChapter = () => {
  if (!nextChapterKey.value) return;

  navigateTo(`/chapter/${nextChapterKey.value}/manga`);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    if (readingMode.value === "webtoon") {
      scrollToPage(page);
    }
  }
};

const handlePageSelect = (event: Event) => {
  goToPage(Number((event.target as HTMLSelectElement).value));
};
const handleSliderInput = (event: Event) => {
  goToPage(Number((event.target as HTMLInputElement).value));
};

const handlePagedClick = (event: MouseEvent) => {
  const { clientX, currentTarget } = event;
  const { offsetWidth } = currentTarget as HTMLElement;
  const clickPosition = clientX / offsetWidth;

  if (clickPosition < 0.2) prevPage();
  else if (clickPosition > 0.8) nextPage();
  else toggleControls();
};

const toggleControls = () => {
  controlsVisible.value = !controlsVisible.value;
  if (controlsVisible.value) {
    resetControlsTimeout();
  } else if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }
};

const showControls = () => {
  controlsVisible.value = true;
  resetControlsTimeout();
};

const hideControls = () => {
  if (controlsTimeout) clearTimeout(controlsTimeout);
  controlsVisible.value = false;
};

const resetControlsTimeout = () => {
  if (controlsTimeout) clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    controlsVisible.value = false;
  }, 3000);
};

const toggleReadingMode = () => {
  readingMode.value = readingMode.value === "paged" ? "webtoon" : "paged";
  nextTick(() => {
    if (readingMode.value === "webtoon") {
      scrollToPage(currentPage.value);
    }
  });
};

const scrollToPage = (page: number) => {
  const pageElement = webtoonWrapper.value?.querySelector(
    `[data-page-index="${page}"]`,
  ) as HTMLElement;
  if (pageElement) {
    webtoonWrapper.value?.scrollTo({
      top: pageElement.offsetTop - 20,
      behavior: "smooth",
    });
  }
};

const updatePageOnScroll = () => {
  if (!webtoonWrapper.value) return;
  const { scrollTop, scrollHeight, clientHeight } = webtoonWrapper.value;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    if (currentPage.value !== totalPages.value)
      currentPage.value = totalPages.value;
    return;
  }

  const pageElements = Array.from(
    webtoonWrapper.value.querySelectorAll(".webtoon-page"),
  );
  let mostVisiblePage = 1;
  let maxVisibility = 0;

  for (const el of pageElements) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = webtoonWrapper.value.clientHeight;
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );
    const visibility = visibleHeight / rect.height;

    if (visibility > maxVisibility) {
      maxVisibility = visibility;
      mostVisiblePage = parseInt(el.getAttribute("data-page-index")!, 10);
    }
  }
  if (currentPage.value !== mostVisiblePage)
    currentPage.value = mostVisiblePage;
  showControls();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (readingMode.value === "paged") {
    if (event.key === "ArrowRight") nextPage();
    else if (event.key === "ArrowLeft") prevPage();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  resetControlsTimeout();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (controlsTimeout) clearTimeout(controlsTimeout);
});

watch(chapterKey, () => {
  currentPage.value = 1;
});

useHead(() => ({
  title: `Okunuyor: Bölüm ${
    chapterData.value?.chapter?.title ?? ""
  } - Sayfa ${currentPage.value}`,
}));

definePageMeta({
  isLayouted: false,
});
</script>
<template>
  <div
    v-if="chapterData?.chapter && !pending"
    class="reader-container"
    @mousemove="showControls"
    @mouseleave="hideControls"
  >
    <div
      v-if="readingMode === 'paged'"
      class="image-wrapper"
      @click="handlePagedClick"
    >
      <transition name="page-fade" mode="out-in">
        <img
          v-if="currentImage"
          :key="currentImage"
          :src="currentImage"
          alt="Manga Page"
          class="manga-page"
        />
      </transition>
    </div>

    <!-- Webtoon Modu -->
    <div
      v-else
      ref="webtoonWrapper"
      class="webtoon-wrapper"
      @scroll="updatePageOnScroll"
    >
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image.url"
        alt="Manga Page Part"
        class="webtoon-page"
        :data-page-index="index + 1"
      />
    </div>

    <!-- Kontrol Arayüzü -->
    <transition name="fade">
      <div v-show="controlsVisible" class="controls-overlay">
        <!-- Üst Bar -->
        <div class="top-bar">
          <NuxtLink
            :to="`/title/${chapterData?.myAnimeListId}`"
            class="close-button"
            >×</NuxtLink
          >
          <div class="chapter-info">
            <span class="chapter-title">{{ chapterData?.title }}</span>
            <br />
            <span class="chapter-key"
              >Bölüm {{ chapterData?.chapter?.chapterNumber }} -
              {{ chapterData?.chapter?.source.name }}</span
            >
          </div>
          <div class="page-counter">{{ currentPage }} / {{ totalPages }}</div>
        </div>

        <!-- Alt Bar -->
        <div class="bottom-bar">
          <button class="mode-toggle" @click="toggleReadingMode">
            Aktif Mod: {{ readingMode === "paged" ? "Sayfalı" : "Webtoon" }}
          </button>
          <select
            :value="currentPage"
            class="page-select"
            @change="handlePageSelect"
          >
            <option v-for="page in totalPages" :key="page" :value="page">
              Sayfa {{ page }}
            </option>
          </select>
          <input
            :value="currentPage"
            type="range"
            :min="1"
            :max="totalPages"
            class="page-slider"
            @input="handleSliderInput"
          />
          <UButton
            class="mode-toggle"
            :disabled="!previousChapterKey"
            @click="goToPreviousChapter"
          >
            <Icon name="i-lucide-arrow-left" /> Önceki Bölüm
          </UButton>

          <UButton
            class="mode-toggle"
            :disabled="!nextChapterKey"
            @click="goToNextChapter"
          >
            Sonraki Bölüm <Icon name="i-lucide-arrow-right" />
          </UButton>
        </div>
      </div>
    </transition>
  </div>
  <div v-else-if="!pending">
    <UEmpty
      icon="i-lucide-x"
      title="Bölüm Bulunamadı"
      description="Görünüşe göre sistemde kayıtlı böyle bir bölüm yok"
    />
  </div>
  <div v-else>
    <USkeleton />
  </div>
</template>
<style scoped>
.reader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.manga-page {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.webtoon-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  text-align: center;
  scroll-behavior: smooth;
}
.webtoon-page {
  display: block;
  max-width: 100%;
  width: auto;
  margin: 0 auto;
}
@media (min-width: 800px) {
  .webtoon-page {
    max-width: 800px;
  }
}

.controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 25%,
    transparent 75%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
  color: white;
}
.top-bar,
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  pointer-events: all;
  gap: 1rem;
}

.close-button {
  background: rgba(30, 30, 30, 0.7);
  font-size: 2rem;
  line-height: 1;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-decoration: none;
  color: white;
  transition: background 0.2s;
}
.close-button:hover {
  background: rgba(0, 0, 0, 0.9);
}

.chapter-info {
  text-align: center;
}
.chapter-title {
  font-weight: bold;
}
.chapter-key {
  font-size: 0.9rem;
  opacity: 0.8;
}

.mode-toggle {
  background: rgba(30, 30, 30, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.mode-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
}
.mode-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-select {
  background: rgba(30, 30, 30, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem;
  border-radius: 8px;
  max-width: 120px;
  cursor: pointer;
}
.page-select option {
  background-color: #333;
}
.page-slider {
  width: 100%;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
