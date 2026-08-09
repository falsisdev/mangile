<script setup lang="ts">
import { PortableText } from "@portabletext/vue";

const breadcrumbs = useBreadcrumbs();
const config = useRuntimeConfig();
const route = useRoute();

const { data: serie, status } = await useLazyAsyncData(
  "title-" + route.params.titleID,
  async () => {
    try {
      return await $fetch(
        `${config.public.backend.baseUrl}/api/manga/${route.params.titleID}`,
      );
    } catch (e) {
      return await $fetch(
        `${config.public.backend.baseUrl}/api/lightNovel/${route.params.titleID}`,
      );
    }
  },
  {
    transform: (title: any) => {
      return {
        id: title.id,
        title: title.sanity_title,
        type: title.type
          ?.replaceAll("manga", "Manga")
          .replaceAll("lightNovel", "Hafif Roman"),
        description: title.sanity_description,
        banner: title.sanity_banner,
        cover: title.sanity_cover,
        tags: title.sanity_tags,
        anilistID: title.anilist_id,
        anilistTitle: title.anilist_title,
        anilistScore: Number(title.anilist_score) / 10 || 0,
        anilistBanner: title.anilist_banner,
        anilistCover: title.anilist_cover,
        anilistDescription: title.anilist_description,
        anilistRelations: title.anilist_relations,
        malID: title.mal_id,
        malStatus: title.mal_status,
        malScore: title.mal_score,
        malAuthors: title.mal_authors,
        malURL: title.mal_url,
        notes: title.notes,
        chapters: title.chapters || [],
      };
    },
  },
);

const breadcrumbsList = computed(() => [
  { label: "Ana Sayfa", to: "/" },
  { label: "Seriler" },
  { label: serie.value?.title || serie.value?.anilistTitle || "Yükleniyor..." },
]);

const customComponents = {
  marks: {
    link: ({ value }, { slots }) =>
      h(
        "a",
        {
          href: value?.href,
          class: "text-primary hover:underline font-semibold",
          target: "_blank",
        },
        slots.default?.(),
      ),
  },
};

watchEffect(() => {
  breadcrumbs.value = breadcrumbsList.value;
});

const bannerOpacity = ref(1);
const isMobile = ref(false);

function handleScroll() {
  if (!isMobile.value) {
    bannerOpacity.value = 1;
    return;
  }
  const scrollY = window.scrollY;
  bannerOpacity.value = Math.max(0, 1 - scrollY / 120);
}

function checkDevice() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  checkDevice();
  window.addEventListener("resize", checkDevice);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkDevice);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <UContainer class="space-y-8 relative">
    <div v-if="status === 'pending'" class="space-y-8">
      <USkeleton class="h-64 md:h-96 w-full rounded-3xl" />
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <USkeleton
            class="h-72 w-full rounded-2xl mx-auto max-w-[240px] md:max-w-none"
          />
          <USkeleton class="h-10 w-full rounded-xl" />
        </div>
        <div class="md:col-span-3 space-y-4">
          <USkeleton class="h-10 w-2/3" />
          <div class="flex gap-2">
            <USkeleton class="h-6 w-16" v-for="i in 3" :key="i" />
          </div>
          <USkeleton class="h-24 w-full" />
        </div>
      </div>
    </div>

    <div v-else-if="serie" class="space-y-6">
      <div
        class="relative h-64 md:h-96 w-full overflow-hidden rounded-3xl transition-opacity duration-150 ease-out"
        :style="{ opacity: bannerOpacity }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-default via-default/40 to-transparent z-10"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-b from-default/20 via-transparent to-transparent z-10"
        ></div>
        <img
          :src="serie.banner || serie.anilistBanner || serie.cover || serie.anilistCover"
          class="w-full h-full object-cover select-none"
          alt="Banner"
        />
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-20 -mt-24 md:-mt-24 px-4 md:px-8"
      >
        <div class="flex flex-col items-center md:items-stretch space-y-4">
          <div
            class="w-48 md:w-full aspect-[2/3] rounded-2xl overflow-hidden bg-muted"
          >
            <img
              :src="serie.cover || serie.anilistCover"
              class="w-full h-full object-cover"
              :alt="serie.title"
            />
          </div>

          <div class="w-full space-y-2 max-w-[240px] md:max-w-none">
            <UButton
              v-if="serie.malURL"
              :to="serie.malURL"
              target="_blank"
              color="neutral"
              variant="subtle"
              block
              icon="i-lucide-external-link"
            >
              MyAnimeList'te Gör
            </UButton>

            <div class="grid grid-cols-2 gap-2 text-center pt-2">
              <div class="p-3 rounded-2xl bg-primary/10">
                <span class="text-xs text-muted-foreground block mb-0.5"
                  >AniList Skoru</span
                >
                <div
                  class="flex items-center justify-center gap-1 font-bold text-emerald-500"
                >
                  <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
                  {{ serie.anilistScore ? serie.anilistScore.toFixed(1) : "-" }}
                </div>
              </div>
              <div class="p-3 rounded-2xl bg-primary/10">
                <span class="text-xs text-muted-foreground block mb-0.5"
                  >MAL Skoru</span
                >
                <div
                  class="flex items-center justify-center gap-1 font-bold text-amber-500"
                >
                  <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
                  {{ serie.malScore || "-" }}
                </div>
              </div>
            </div>

            <div class="text-xs space-y-2 pt-2 text-muted-foreground">
              <p v-if="serie.malStatus">
                <b class="text-foreground">Durum:</b>
                {{
                  serie["malStatus"].replaceAll("Publishing", "Yayınlanıyor").replaceAll("Finished", "Tamamlandı").replaceAll("On Hiatus", "Ara Verildi").replaceAll("Not yet published", "Henüz Yayınlanmadı")
                }}
              </p>
              <p v-if="serie.malAuthors?.length">
                <b class="text-foreground">Yazar:</b>
                {{
                  serie.malAuthors
                    .map((a: any) => a.name)
                    .join(" ")
                    .replaceAll(", ", " ")
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 space-y-6">
          <div class="space-y-2 text-center md:text-left">
            <div
              class="flex flex-wrap items-center justify-center md:justify-start gap-2"
            >
              <UBadge color="primary" variant="solid" size="md">{{
                serie.type || "Manga"
              }}</UBadge>
              <UBadge
                v-for="tag in serie.tags"
                :key="tag"
                color="primary"
                variant="subtle"
                size="md"
              >
                {{ tag }}
              </UBadge>
            </div>
            <h1 class="text-3xl md:text-5xl font-black tracking-tight mt-1">
              {{ serie.title }}
            </h1>
            <h2
              v-if="serie.anilistTitle && serie.anilistTitle !== serie.title"
              class="text-lg text-muted-foreground font-medium"
            >
              {{ serie.anilistTitle }}
            </h2>
          </div>

          <UDivider />

          <div class="space-y-2">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <UIcon name="i-lucide-book-open" /> Özet
            </h3>
            <p class="text-sm p-4 rounded-2xl bg-primary/10">
              {{
                serie.description ||
                serie.anilistDescription ||
                "Bu seri için henüz bir açıklama eklenmemiş."
              }}
            </p>
          </div>

          <div v-if="serie.notes && serie.notes.length" class="space-y-2">
            <h3
              class="text-lg font-bold text-amber-500 flex items-center gap-2"
            >
              <UIcon name="i-lucide-sticky-note" /> Editör Notları
            </h3>
            <div
              class="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm prose dark:prose-invert prose-amber max-w-none"
            >
              <PortableText
                :value="serie.notes"
                :components="customComponents"
              />
            </div>
          </div>

          <div class="space-y-4 pt-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-black flex items-center gap-2">
                <UIcon name="i-lucide-layers" /> Bölümler
                <span class="text-sm font-normal text-muted-foreground"
                  >({{ serie.chapters?.length || 0 }} Bölüm)</span
                >
              </h3>
            </div>

            <div
              v-if="serie.chapters && serie.chapters.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              <UCard
                v-for="chapter in serie.chapters"
                :key="chapter.id"
                class="transition-all cursor-pointer group"
              >
                <NuxtLink
                  :to="`/chapter/${chapter._key}/${serie['type'].toLowerCase().replaceAll('hafif roman', 'novel')}`"
                  class="flex items-center justify-between -m-3"
                >
                  <div class="truncate pr-2">
                    <p
                      class="font-bold group-hover:text-primary transition-colors truncate"
                    >
                      {{
                        chapter.title ||
                        `Bölüm ${chapter.chapter_number || chapter.id}`
                      }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ chapter.source.name || "Bilinmeyen Çevirmen" }}
                    </p>
                  </div>
                  <UButton
                    size="xs"
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-chevron-right"
                    square
                  />
                </NuxtLink>
              </UCard>
            </div>

            <div v-else class="text-center py-12 rounded-2xl bg-primary/10">
              <UIcon
                name="i-lucide-folder-open"
                class="w-8 h-8 text-muted-foreground mb-2"
              />
              <p class="text-sm text-muted-foreground">
                Henüz bu seriye ait bir bölüm yüklenmemiş.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>
