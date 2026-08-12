<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const colorMode = useColorMode();
const chapterKey = computed(() => route.params.chapterKey as string);

interface ChapterResponse {
  title: string;
  type: string;
  myAnimeListId: number;
  chapter: {
    title: string;
    content: any; // PortableText array
  };
  chapterKeys: string[];
}

const { data: chapterData, pending } = await useFetch<ChapterResponse>(
  () =>
    `${config.public.backend.baseUrl}/api/chapter?filterType=lightNovel&key=${chapterKey.value}`,
  {
    lazy: true,
    server: false,
    watch: [chapterKey],
  },
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
  if (previousChapterKey.value)
    navigateTo(`/chapter/${previousChapterKey.value}/novel`);
};

const goToNextChapter = () => {
  if (nextChapterKey.value)
    navigateTo(`/chapter/${nextChapterKey.value}/novel`);
};

const goToSelectedChapter = (selectedKey: string) => {
  if (selectedKey && selectedKey !== chapterKey.value) {
    navigateTo(`/chapter/${selectedKey}/novel`);
  }
};

// Select menüsü için bölüm seçenekleri
const chapterOptions = computed(() => {
  if (!chapterData.value?.chapterKeys) return [];
  return chapterData.value.chapterKeys.map((key, index) => ({
    label: `Bölüm ${index + 1}`,
    value: key,
  }));
});

// --- OKUMA AYARLARI VE ARAYÜZ (UI) DURUMLARI ---
const fontSize = useState<number>("novel-font-size", () => 18);
const readingProgress = ref(0);
const showBackToTop = ref(false);

const changeFontSize = (step: number) => {
  const newSize = fontSize.value + step * 2;
  if (newSize >= 14 && newSize <= 30) {
    fontSize.value = newSize;
  }
};

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400;
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  readingProgress.value = (winScroll / height) * 100;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goHome = () => {
  void navigateTo("/");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const getSanityImageUrl = (ref: string) => {
  if (!ref) return "";
  const projectId = config.public.sanity?.projectId;
  const dataset = config.public.sanity?.dataset || "production";

  const [, id, dimensions, format] = ref.split("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
};

const renderedContent = computed(() => {
  if (!chapterData.value?.chapter?.content) return "";

  return chapterData.value.chapter.content
    .map((block: any) => {
      if (block._type === "image") {
        const imageUrl =
          block.asset?.url ||
          (block.asset?._ref ? getSanityImageUrl(block.asset._ref) : "");
        if (!imageUrl) return "";

        const caption = block.caption || block.alt || "";

        return `<figure class="my-10 flex flex-col items-center">
          <img src="${imageUrl}" alt="${caption}" loading="lazy" class="rounded-xl shadow-xl max-w-full h-auto max-h-[80vh] object-contain border border-gray-200 dark:border-gray-800" />
          ${caption ? `<figcaption class="text-sm text-gray-500 mt-3 italic">${caption}</figcaption>` : ""}
        </figure>`;
      }

      if (block._type !== "block") return "";

      let htmlContent = block.children
        .map((child: any) => {
          let text = child.text;
          let tagsOpen = "";
          let tagsClose = "";

          if (child.marks && child.marks.length > 0) {
            child.marks.forEach((mark: string) => {
              if (mark === "strong") {
                tagsOpen += '<strong class="font-bold">';
                tagsClose = "</strong>" + tagsClose;
              } else if (mark === "em") {
                tagsOpen += '<em class="italic">';
                tagsClose = "</em>" + tagsClose;
              } else if (block.markDefs) {
                const def = block.markDefs.find((m: any) => m._key === mark);
                if (def && def._type === "link") {
                  if (def.href.match(/\.(jpeg|jpg|gif|png|webp)(?:\?.*)?$/i)) {
                    tagsOpen += `<figure class="my-10 flex flex-col items-center">
                              <img src="${def.href}" alt="${text}" loading="lazy" class="rounded-xl shadow-xl max-w-full h-auto max-h-[80vh] object-contain border border-gray-200 dark:border-gray-800" />
                              <figcaption class="text-sm text-gray-500 mt-3 italic">${text}</figcaption>
                            </figure><span class="hidden">`;
                    tagsClose = `</span>` + tagsClose;
                  } else {
                    tagsOpen += `<a href="${def.href}" class="text-primary hover:underline font-medium" target="_blank" rel="noopener">`;
                    tagsClose = `</a>` + tagsClose;
                  }
                }
              }
            });
          }
          return tagsOpen + text.replace(/\n/g, "<br/>") + tagsClose;
        })
        .join("");

      const style = block.style || "normal";
      if (style === "h1")
        return `<h1 class="text-4xl font-bold mt-10 mb-6">${htmlContent}</h1>`;
      if (style === "h2")
        return `<h2 class="text-3xl font-bold mt-8 mb-4">${htmlContent}</h2>`;
      if (style === "h3")
        return `<h3 class="text-2xl font-bold mt-6 mb-4">${htmlContent}</h3>`;
      if (style === "h4")
        return `<h4 class="text-xl font-bold mt-4 mb-2">${htmlContent}</h4>`;

      return `<p class="mb-6 leading-relaxed">${htmlContent}</p>`;
    })
    .join("");
});

useHead(() => ({
  title: pending.value
    ? "Yükleniyor..."
    : `Okunuyor: ${chapterData.value?.chapter?.title ?? ""}`,
}));

definePageMeta({
  isLayouted: false,
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <div
      class="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
      :style="{ width: readingProgress + '%' }"
    ></div>

    <header
      class="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <UContainer class="h-16 flex items-center justify-between max-w-4xl">
        <div class="flex items-center gap-3">
          <UButton
            :disabled="!previousChapterKey"
            @click="goToPreviousChapter"
            icon="i-lucide-arrow-left"
            size="lg"
            color="neutral"
            variant="soft"
            class="w-full sm:w-auto justify-center rounded-xl"
          >
          </UButton>
          <UButton :to="`/title/${chapterData?.myAnimeListId}`" variant="ghost"
            ><Icon name="i-lucide-book-open" class="w-5 h-5"
          /></UButton>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <UButtonGroup
            size="sm"
            orientation="horizontal"
            class="bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
          >
            <UButton
              icon="i-lucide-a-arrow-down"
              color="neutral"
              variant="ghost"
              @click="changeFontSize(-1)"
              title="Yazıyı Küçült"
            />
            <UButton
              icon="i-lucide-a-arrow-up"
              color="neutral"
              variant="ghost"
              @click="changeFontSize(1)"
              title="Yazıyı Büyüt"
            />
          </UButtonGroup>

          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="soft"
            class="rounded-full"
            @click="toggleTheme"
            aria-label="Tema Değiştir"
          />
          <UButton
            :disabled="!nextChapterKey"
            @click="goToNextChapter"
            trailing-icon="i-lucide-arrow-right"
            size="lg"
            color="neutral"
            variant="soft"
            class="w-full sm:w-auto justify-center"
          >
          </UButton>
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-3xl py-10">
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-10 w-3/4 mx-auto mb-10" />
        <div class="space-y-4">
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-5/6" />
        </div>
        <USkeleton class="h-72 w-full rounded-xl my-8" />
        <div class="space-y-4">
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-4/5" />
        </div>
      </div>

      <div v-else-if="!chapterData?.chapter" class="text-center">
        <UEmpty
          icon="i-lucide-file-x-2"
          title="Bölüm Bulunamadı"
          description="Görünüşe göre sistemde kayıtlı böyle bir bölüm yok veya bağlantı koptu."
        >
          <template #action>
            <UButton color="primary" @click="goHome">Ana Sayfaya Dön</UButton>
          </template>
        </UEmpty>
      </div>
      <article
        v-else
        class="transition-all duration-200 text-gray-800 dark:text-gray-200"
        :style="{ fontSize: fontSize + 'px' }"
      >
        <h1 class="text-center font-bold text-3xl md:text-4xl leading-tight">
          {{ chapterData.chapter.title }}
        </h1>

        <div v-html="renderedContent"></div>
      </article>
      <div
        v-if="!pending && chapterData?.chapter"
        class="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <UButton
          :disabled="!previousChapterKey"
          @click="goToPreviousChapter"
          icon="i-lucide-arrow-left"
          size="lg"
          color="neutral"
          variant="soft"
          class="w-full sm:w-auto justify-center rounded-xl"
        >
          Önceki Bölüm
        </UButton>

        <span
          class="text-sm text-gray-500 font-medium text-center line-clamp-1 px-4"
        >
          {{ chapterData.chapter.title }}
        </span>

        <UButton
          :disabled="!nextChapterKey"
          @click="goToNextChapter"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          color="neutral"
          variant="soft"
          class="w-full sm:w-auto justify-center"
        >
          Sonraki Bölüm
        </UButton>
      </div>
    </UContainer>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-16 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-16 opacity-0"
    >
      <UButton
        v-if="showBackToTop"
        icon="i-lucide-arrow-up"
        size="xl"
        color="primary"
        variant="soft"
        class="fixed bottom-20 right-20 rounded-lg shadow-xl z-50"
        @click="scrollToTop"
        aria-label="Başa Dön"
      />
    </Transition>
  </div>
</template>
