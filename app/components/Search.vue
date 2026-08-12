<script setup lang="ts">
import { ref, computed, watch } from "vue";

const searchTerm = ref("");
const debouncedSearch = ref("");
const config = useRuntimeConfig();

const isOpen = ref(false);

interface MangaCard {
  mal_id: number;
  anilist_title: string;
  anilist_type: string;
  anilist_cover_image: string;
}

let debounceTimeout: ReturnType<typeof setTimeout>;
watch(searchTerm, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearch.value = newVal.trim();
  }, 500);
});

watch(isOpen, (newVal) => {
  if (!newVal) {
    searchTerm.value = "";
    debouncedSearch.value = "";
  }
});

const { data: titles, status } = await useLazyFetch<MangaCard[]>(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: "searchTitles",
    query: computed(() => ({
      filterType: "SCORE_DESC",
      limit: 12,
      query: debouncedSearch.value || undefined,
    })),
    transform: (data: any) => {
      const list = Array.isArray(data) ? data : data?.data || [];
      return list.map((title: any) => ({
        id: title.mal_id,
        label: title.anilist_title,
        suffix:
          "(" +
          title.mal_year +
          ") | " +
          title["mal_type"]
            .replaceAll("MANGA", "Manga")
            .replaceAll("NOVEL", "Hafif Roman")
            .replaceAll("ONE_SHOT", "One-Shot"),
        avatar: { src: title.anilist_cover_image, loading: "lazy" as const },
      }));
    },
  },
);

const groups = computed(() => [
  {
    id: "titles",
    label: searchTerm.value
      ? `Aranıyor: “${searchTerm.value}”...`
      : "Öne Çıkanlar",
    items: titles.value || [],
    ignoreFilter: true,
  },
]);

function onSelect(item: any) {
  if (item && item.id) {
    navigateTo(`/title/${item.id}`);
    isOpen.value = false;
  }
}

const openSearch = () => {
  isOpen.value = true;
};
</script>

<template>
  <UButton
    icon="i-lucide-search"
    color="neutral"
    variant="ghost"
    aria-label="Ara"
    @click="openSearch"
  />

  <UModal v-model:open="isOpen">
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="İçerikleri ara..."
        class="h-80"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
