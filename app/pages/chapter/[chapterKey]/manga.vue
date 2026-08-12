<script setup lang="ts">
import { useStorage } from "@vueuse/core";

const route = useRoute();
const config = useRuntimeConfig();
const colorMode = useColorMode();
const chapterKey = computed(() => route.params.chapterKey as string);

interface ChapterResponse {
  title: string;
  type: string;
  myAnimeListId: number;
  chapter?: {
    title?: string;
    chapterNumber?: number | string;
    source?: {
      name?: string;
    };
    pages?: {
      url: string;
    }[];
  };
  chapterKeys?: string[];
}

const {
  data: chapterData,
  pending,
  error,
} = await useFetch<ChapterResponse>(
  () =>
    `${config.public.backend.baseUrl}/api/chapter?filterType=manga&key=${chapterKey.value}`,
  {
    lazy: true,
    server: false,
    watch: [chapterKey],
    retry: 3,
    retryDelay: 1000,
  },
);

interface Page {
  url: string;
}

const images = computed<Page[]>(() => chapterData.value?.chapter?.pages ?? []);

type ReadingMode = "paged" | "webtoon" | "continuous";

const settings = reactive({
  readingMode: useStorage<ReadingMode>(
    "manga-reading-mode",
    "paged",
  ) as Ref<ReadingMode>,
  autoScroll: useStorage("manga-auto-scroll", false),
  scrollSpeed: useStorage("manga-scroll-speed", 3),
  brightness: useStorage("manga-brightness", 100),
  contrast: useStorage("manga-contrast", 100),
});

const currentPage = ref(1);
const controlsVisible = ref(true);
const showSettings = ref(false);
let controlsTimeout: ReturnType<typeof setTimeout> | null = null;
let autoScrollInterval: ReturnType<typeof setInterval> | null = null;
const webtoonWrapper = ref<HTMLElement | null>(null);

const totalPages = computed(() => images.value.length);
const currentImage = computed(
  () => images.value[currentPage.value - 1]?.url ?? null,
);
const readingPercentage = computed(() =>
  totalPages.value > 0
    ? Math.round((currentPage.value / totalPages.value) * 100)
    : 0,
);

const currentChapterIndex = computed(() => {
  const keys = chapterData.value?.chapterKeys ?? [];
  return keys.findIndex((key) => key === chapterKey.value);
});

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

const hasPreviousChapter = computed(() => !!previousChapterKey.value);
const hasNextChapter = computed(() => !!nextChapterKey.value);

const goToPreviousChapter = () => {
  if (!previousChapterKey.value) return;
  navigateTo(`/chapter/${previousChapterKey.value}/manga`);
};

const goToNextChapter = () => {
  if (!nextChapterKey.value) return;
  navigateTo(`/chapter/${nextChapterKey.value}/manga`);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  } else if (hasNextChapter.value) {
    goToNextChapter();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  } else if (hasPreviousChapter.value) {
    goToPreviousChapter();
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    if (["webtoon", "continuous"].includes(settings.readingMode)) {
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
  if (showSettings.value) return;
  const { clientX, currentTarget } = event;
  const { offsetWidth } = currentTarget as HTMLElement;
  const clickPosition = clientX / offsetWidth;

  if (clickPosition < 0.25) prevPage();
  else if (clickPosition > 0.75) nextPage();
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
    if (!showSettings.value) controlsVisible.value = false;
  }, 4000);
};

const toggleReadingMode = () => {
  const modes: ReadingMode[] = ["paged", "webtoon", "continuous"];
  const currentIndex = modes.indexOf(settings.readingMode);
  settings.readingMode = modes[(currentIndex + 1) % modes.length];
  nextTick(() => {
    if (["webtoon", "continuous"].includes(settings.readingMode)) {
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
      top: pageElement.offsetTop - 10,
      behavior: "smooth",
    });
  }
};

const updatePageOnScroll = () => {
  if (!webtoonWrapper.value) return;
  const { scrollTop, scrollHeight, clientHeight } = webtoonWrapper.value;

  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (currentPage.value !== totalPages.value) {
      currentPage.value = totalPages.value;
    }
    return;
  }

  const pageElements = Array.from(
    webtoonWrapper.value.querySelectorAll("[data-page-index]"),
  );
  let mostVisiblePage = currentPage.value;
  let maxVisibility = 0;

  for (const el of pageElements) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = webtoonWrapper.value.clientHeight;
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );
    const visibility = visibleHeight / (rect.height || 1);

    if (visibility > maxVisibility) {
      maxVisibility = visibility;
      mostVisiblePage = parseInt(el.getAttribute("data-page-index") || "1", 10);
    }
  }
  if (currentPage.value !== mostVisiblePage) {
    currentPage.value = mostVisiblePage;
  }
  showControls();
};

const startAutoScroll = () => {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  autoScrollInterval = setInterval(() => {
    if (webtoonWrapper.value) {
      webtoonWrapper.value.scrollTop += settings.scrollSpeed;
    }
  }, 50);
};

const stopAutoScroll = () => {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement
  )
    return;

  switch (event.key) {
    case "ArrowRight":
      event.preventDefault();
      nextPage();
      break;
    case "ArrowLeft":
      event.preventDefault();
      prevPage();
      break;
    case "a":
    case "A":
      event.preventDefault();
      settings.autoScroll = !settings.autoScroll;
      break;
    case " ":
      event.preventDefault();
      toggleControls();
      break;
    case "Escape":
      showSettings.value = false;
      break;
  }
};

watch(
  () => settings.autoScroll,
  (newVal) => {
    if (newVal) startAutoScroll();
    else stopAutoScroll();
  },
);

watch(
  () => settings.readingMode,
  () => {
    if (settings.autoScroll) {
      stopAutoScroll();
      settings.autoScroll = false;
    }
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  resetControlsTimeout();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (controlsTimeout) clearTimeout(controlsTimeout);
  stopAutoScroll();
});

watch(chapterKey, () => {
  currentPage.value = 1;
  settings.autoScroll = false;
});

useHead(() => ({
  title: `Okunuyor: Bölüm ${
    chapterData.value?.chapter?.title ?? ""
  } - Sayfa ${currentPage.value}/${totalPages.value}`,
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
      v-if="settings.readingMode === 'paged'"
      class="image-wrapper"
      @click="handlePagedClick"
    >
      <transition name="page-fade" mode="out-in">
        <div v-if="currentImage" :key="currentImage" class="image-container">
          <img
            :src="currentImage"
            :alt="`Sayfa ${currentPage}`"
            class="manga-page"
            :style="{
              filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
            }"
            loading="lazy"
            decoding="async"
          />
        </div>
      </transition>
    </div>

    <div
      v-else-if="settings.readingMode === 'webtoon'"
      ref="webtoonWrapper"
      class="webtoon-wrapper"
      @scroll="updatePageOnScroll"
    >
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image.url"
        :alt="`Sayfa ${index + 1}`"
        class="webtoon-page"
        :data-page-index="index + 1"
        :style="{
          filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
        }"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div
      v-else
      ref="webtoonWrapper"
      class="continuous-wrapper"
      @scroll="updatePageOnScroll"
    >
      <div class="continuous-container">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image.url"
          :alt="`Sayfa ${index + 1}`"
          class="continuous-page"
          :data-page-index="index + 1"
          :style="{
            filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
          }"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>

    <div
      class="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-primary to-primary/50 z-50"
      :style="{ width: readingPercentage + '%' }"
    ></div>

    <transition name="fade">
      <div
        v-show="controlsVisible"
        class="controls-overlay"
        @click.self="toggleControls"
      >
        <div class="top-bar">
          <UButton
            :to="`/title/${chapterData?.myAnimeListId}`"
            variant="ghost"
            size="lg"
            icon="i-lucide-x"
            square
          />
          <div class="chapter-info hidden sm:block">
            <p class="font-bold text-white truncate">
              {{ chapterData?.title }}
            </p>
            <p class="text-xs text-gray-300">
              Bölüm
              {{ chapterData?.chapter?.chapterNumber ?? chapterData?.title }} ·
              {{ chapterData?.chapter?.source?.name ?? "Bilinmeyen" }}
            </p>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-white font-bold text-sm"
              >{{ currentPage }} / {{ totalPages }}</span
            >
            <span class="text-gray-400 text-xs">%{{ readingPercentage }}</span>
          </div>
        </div>

        <div class="bottom-bar">
          <div class="flex items-center gap-2 flex-1">
            <UButton
              :disabled="!hasPreviousChapter"
              @click="goToPreviousChapter"
              icon="i-lucide-skip-back"
              size="sm"
              color="gray"
              variant="soft"
            />
            <UButton
              :disabled="currentPage <= 1"
              @click="prevPage"
              icon="i-lucide-chevron-left"
              size="sm"
              color="gray"
              variant="soft"
            />
            <input
              :value="currentPage"
              type="range"
              :min="1"
              :max="totalPages"
              class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              @input="handleSliderInput"
            />
            <UButton
              :disabled="currentPage >= totalPages"
              @click="nextPage"
              icon="i-lucide-chevron-right"
              size="sm"
              color="gray"
              variant="soft"
            />
            <UButton
              :disabled="!hasNextChapter"
              @click="goToNextChapter"
              icon="i-lucide-skip-forward"
              size="sm"
              color="gray"
              variant="soft"
            />
          </div>
          <UButton
            @click="showSettings = !showSettings"
            :icon="showSettings ? 'i-lucide-x' : 'i-lucide-settings'"
            size="sm"
            color="gray"
            variant="soft"
          />
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="showSettings" class="settings-panel">
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-white text-sm font-medium"
                    >Okuma Modu</label
                  >
                  <UButton
                    @click="toggleReadingMode"
                    size="xs"
                    color="primary"
                    variant="soft"
                  >
                    {{
                      settings.readingMode === "paged"
                        ? "Sayfalı"
                        : settings.readingMode === "webtoon"
                          ? "Webtoon"
                          : "Sürekli"
                    }}
                  </UButton>
                </div>
              </div>

              <div v-if="settings.readingMode !== 'paged'">
                <label class="text-white text-sm font-medium block mb-2"
                  >Otomatik Kaydırma</label
                >
                <UToggle v-model="settings.autoScroll" />
              </div>

              <div
                v-if="settings.autoScroll && settings.readingMode !== 'paged'"
              >
                <label class="text-white text-sm font-medium block mb-2"
                  >Kaydırma Hızı: {{ settings.scrollSpeed }}</label
                >
                <input
                  v-model.number="settings.scrollSpeed"
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label class="text-white text-sm font-medium block mb-2"
                  >Parlaklık: {{ settings.brightness }}%</label
                >
                <input
                  v-model.number="settings.brightness"
                  type="range"
                  min="50"
                  max="150"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label class="text-white text-sm font-medium block mb-2"
                  >Kontrast: {{ settings.contrast }}%</label
                >
                <input
                  v-model.number="settings.contrast"
                  type="range"
                  min="50"
                  max="150"
                  class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label class="text-white text-sm font-medium block mb-2"
                  >Sayfa Seç</label
                >
                <select
                  :value="currentPage"
                  class="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
                  @change="handlePageSelect"
                >
                  <option v-for="page in totalPages" :key="page" :value="page">
                    Sayfa {{ page }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </transition>
  </div>
  <div v-else-if="!pending">
    <div class="min-h-screen flex items-center justify-center">
      <UEmpty
        icon="i-lucide-alert-circle"
        title="Bölüm Bulunamadı"
        description="Lütfen tekrar deneyiniz veya sayfaya dönüp başka bir bölüm seçiniz."
      >
        <template #action>
          <UButton to="/" variant="soft">Geri Dön</UButton>
        </template>
      </UEmpty>
    </div>
  </div>
  <div
    v-else
    class="reader-container bg-default flex items-center justify-center"
  >
    <div class="space-y-4 text-center">
      <USkeleton class="h-96 w-96 rounded-lg" />
      <p class="text-white text-sm">Bölüm yükleniyor...</p>
    </div>
  </div>
</template>

<style scoped>
.reader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-background);
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
  overflow: auto;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.manga-page {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

.webtoon-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
  scroll-behavior: smooth;
}

.webtoon-page {
  display: block;
  max-width: 100%;
  width: auto;
  margin: 0 auto;
  height: auto;
  user-select: none;
}

.continuous-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.continuous-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5px;
}

.continuous-page {
  width: 100%;
  max-width: 100vw;
  height: auto;
  display: block;
  user-select: none;
}

@media (min-width: 640px) {
  .webtoon-page,
  .continuous-page {
    max-width: 600px;
    width: 100%;
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
    rgba(0, 0, 0, 0.8) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.8) 100%
  );
  pointer-events: none;
  z-index: 40;
}

.top-bar,
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  pointer-events: auto;
  gap: 0.75rem;
}

.chapter-info {
  flex: 1;
  text-align: left;
}

.settings-panel {
  position: absolute;
  bottom: 4.5rem;
  right: 1rem;
  left: auto;
  width: 320px;
  background: var(--color-background) / 90%;
  border: 1px solid var(--color-primary) / 50%;
  border-radius: 12px;
  padding: 1.25rem;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  z-index: 50;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

@media (max-width: 640px) {
  .settings-panel {
    width: calc(100vw - 2rem);
    right: 1rem;
    left: 1rem;
  }
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--text-color-default)
  );
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
  transition: opacity 0.2s ease-in-out;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
