<script setup>
import { data } from '~/assets/data';
import { Icon } from '@iconify/vue';
import DefaultCard from '~/components/DefaultCard.vue';
import DetailsCard from '~/components/DetailsCard.vue';

const route = useRoute();
const router = useRouter();

const page = ref(parseInt(route.query.page) || 1);
const pagination = ref(null);
const titleData = ref(null);
const type = ref(route.query.type || "manga");
const orderBy = ref(route.query.order_by || "score");
const sort = ref(route.query.sort || "desc");
const sfw = ref(route.query.sfw !== undefined ? route.query.sfw === "true" : true);
const isLoading = ref(true);
const cardType = ref("default");
const cardComponents = {
    default: DefaultCard,
    details: DetailsCard,
};

const { isMobile, isTablet } = useDevice();
let layout = ref("default");
if (isMobile) {
  layout.value = "mobile";
} else if (isTablet) {
  layout.value = "tablet";
} else {
  layout.value = "default";
}

const genres = ref([]);
const genreOptions = data.genreIDs;
const currentOrderByOptions = data.orderOptions;

const updateUrlAndFetch = async () => {
    isLoading.value = true;
    const query = {
        page: page.value,
        type: type.value === "all" ? undefined : type.value,
        order_by: orderBy.value,
        sort: sort.value,
        sfw: sfw.value,
        genres: genres.value.length > 0 ? genres.value.join(",") : undefined,
    };

    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

    await router.replace({ query: query });

    await fetchData();
};

async function fetchData() {
    try {
        isLoading.value = true;
        titleData.value = null;

        const currentQueryParams = route.query;

        const params = {
            page: parseInt(currentQueryParams.page || '1'),
            sfw: currentQueryParams.sfw !== undefined ? currentQueryParams.sfw === "true" : true,
            order_by: currentQueryParams.order_by || "score",
            sort: currentQueryParams.sort || "desc",
            ...(currentQueryParams.type && currentQueryParams.type !== "all" && { type: currentQueryParams.type }),
            ...(currentQueryParams.genres && { genres: currentQueryParams.genres })
        };

        const response = await $fetch("https://api.jikan.moe/v4/top/manga", { params });

        titleData.value = response.data;
        pagination.value = response.pagination;

    } catch (error) {
        console.error("API hatası:", error);
    } finally {
        isLoading.value = false;
    }
}

watch(
    [page, type, orderBy, sort, sfw, genres],
    async () => {
        await updateUrlAndFetch();
    },
    { immediate: true, deep: true }
);

watch(() => route.query.page, (newPage) => {
    const newPageNum = parseInt(newPage);
    if (!isNaN(newPageNum) && newPageNum !== page.value) {
        page.value = newPageNum;
    }
}, { immediate: true });

useSeoMeta({
    title: computed(() => `Sayfa ${page.value} - Keşfet`),
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
});
</script>

<template>
    <main class="mt-20 container mx-auto px-4">
        <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
            <div class="flex items-center justify-between gap-4">
                <span>İçerikleri Keşfet</span>
                <div class="flex items-center gap-1">
                    <span v-if="layout != 'mobile'" class="text-sm text-gray-500">Kart Tipi:</span>
                    <Select v-model="cardType">
                        <SelectTrigger>
                            <SelectValue placeholder="Kart Tipi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Şatafatlı</SelectItem>
                            <SelectItem value="details">Minimal</SelectItem>
                        </SelectContent>
                    </Select>
                    <span v-if="layout != 'mobile'" class="text-sm text-gray-500">
                        Seçilen: {{ cardType === 'default' ? 'Şatafatlı' : 'Minimal' }}
                    </span>
                </div>
            </div>
        </h2>


        <Loading v-if="isLoading" class="h-64" type="default" what="Keşfet İçeriği" />

        <div v-else-if="titleData?.length" class="flex flex-row flex-wrap gap-3 justify-center">
            <NuxtLink v-for="title in titleData" :key="title.mal_id" :to="`/title/${title.mal_id}`">
                <component :is="cardComponents[cardType]" :cover="title.images?.webp?.large_image_url" :title="title.title"
                    :type="title.type?.replace('Light Novel', 'Hafif Roman')" :id="title.mal_id" />
            </NuxtLink>
        </div>

        <div v-else-if="!isLoading" class="text-center py-10">
            <p>Gösterilecek içerik bulunamadı.</p>
        </div>

        <div v-if="pagination" class="text-center mt-3 text-sm text-gray-500">
            Sayfa {{ page }} / {{ pagination.last_visible_page }}
        </div>

        <div v-if="pagination?.last_visible_page > 1" class="flex justify-center mb-10">
            <Pagination :itemsPerPage="25">
                <PaginationContent>
                    <PaginationPrevious :disabled="page === 1" @click="page > 1 && (page = page - 1)"
                        class="cursor-pointer">
                        <Icon icon="material-symbols:arrow-left-alt-rounded" /> Önceki Sayfa
                    </PaginationPrevious>

                    <template v-for="p in pagination.last_visible_page" :key="p">
                        <PaginationItem v-if="Math.abs(p - page) <= 2 || p === 1 || p === pagination.last_visible_page"
                            :value="p">
                            <PaginationButton :is-active="p === page" @click="page = p" class="cursor-pointer">
                                {{ p }}
                            </PaginationButton>
                        </PaginationItem>
                        <PaginationItem v-else-if="Math.abs(p - page) === 3" :value="p">
                            <PaginationEllipsis />
                        </PaginationItem>
                    </template>

                    <PaginationNext :disabled="page === pagination.last_visible_page"
                        @click="page < pagination.last_visible_page && (page = page + 1)" class="cursor-pointer">
                        Sonraki Sayfa
                        <Icon icon="material-symbols:arrow-right-alt-rounded" />
                    </PaginationNext>
                </PaginationContent>
            </Pagination>
        </div>
    </main>
</template>