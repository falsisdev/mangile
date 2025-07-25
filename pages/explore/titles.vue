<script setup>
import { data } from '~/assets/data';
import { Icon } from '@iconify/vue';

const route = useRoute();
const page = ref(parseInt(route.query.page) || 1);
const pagination = ref(null);
const titleData = ref(null);
const type = ref(route.query.type || "manga");
const orderBy = ref(route.query.order_by || "score");
const sort = ref(route.query.sort || "desc");
const sfw = ref(route.query.sfw !== undefined ? route.query.sfw === "true" : true);
const isLoading = ref(true);

// Türler için filtre
const genres = ref([]);
const genreOptions = data.genreIDs;
const currentOrderByOptions = data.orderOptions;

// Sayfa değişikliklerini izle
watch(() => route.query.page, (newPage) => {
    if (newPage && parseInt(newPage) !== page.value) {
        page.value = parseInt(newPage);
    }
});

// Diğer filtre değişiklikleri
watch([type, orderBy, sort, sfw, genres], () => {
    page.value = 1;
});

async function fetchData() {
    try {
        isLoading.value = true;
        titleData.value = null;

        const params = {
            page: page.value,
            sfw: sfw.value,
            order_by: orderBy.value,
            sort: sort.value,
            ...(type.value && type.value !== "all" && { type: type.value }),
            ...(genres.value.length > 0 && { genres: genres.value.join(",") })
        };

        const { data: responseData, pagination: responsePagination } = await $fetch(
            "https://api.jikan.moe/v4/top/manga",
            { params }
        );

        titleData.value = responseData;
        pagination.value = responsePagination;

        // URL'i güncelle (yeniden yükleme yapmadan)
        const query = { ...route.query, page: page.value };
        await navigateTo({ query }, { replace: true, preventScrollReset: true });

    } catch (error) {
        console.error("API hatası:", error);
        // Hata durumunda kullanıcıyı bilgilendir
    } finally {
        isLoading.value = false;
    }
}

// İlk yükleme ve değişiklikler için izleyici
watch([page, type, orderBy, sort, sfw, genres], fetchData, { immediate: true });

useSeoMeta({
    title: `Sayfa ${page.value} - Keşfet`,
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
});
</script>

<template>
    <main class="mt-20 container mx-auto px-4">
        <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
            İçerikleri Keşfet
        </h2>

        <!-- Yükleniyor durumu -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
            <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-primary" />
        </div>

        <!-- İçerik -->
        <div v-else-if="titleData?.length" class="flex flex-row flex-wrap gap-3">
            <NuxtLink v-for="title in titleData" :key="title.mal_id" :to="`/manga/${title.mal_id}`">
                <DefaultCard :cover="title.images?.webp?.large_image_url" :title="title.title"
                    :type="title.type?.replace('Light Novel', 'Hafif Roman')" :id="title.mal_id" />
            </NuxtLink>
        </div>

        <!-- Veri yoksa -->
        <div v-else-if="!isLoading" class="text-center py-10">
            <p>Gösterilecek içerik bulunamadı.</p>
        </div>

        <!-- Sayfalama bilgisi -->
        <div v-if="pagination" class="text-center mt-3 text-sm text-gray-500">
            Sayfa {{ page }} / {{ pagination.last_visible_page }}
        </div>

        <!-- Sayfalama kontrolleri -->
        <div v-if="pagination?.last_visible_page > 1" class="flex justify-center mb-10">
            <Pagination>
                <PaginationContent>
                    <PaginationPrevious :disabled="page === 1" @click="page > 1 && (page = page - 1)"
                        class="cursor-pointer">
                        <Icon icon="material-symbols:arrow-left-alt-rounded" /> Önceki Sayfa
                    </PaginationPrevious>

                    <template v-for="p in pagination.last_visible_page" :key="p">
                        <PaginationItem v-if="Math.abs(p - page) <= 2 || p === 1 || p === pagination.last_visible_page">
                            <PaginationButton :is-active="p === page" @click="page = p" class="cursor-pointer">
                                {{ p }}
                            </PaginationButton>
                        </PaginationItem>
                        <PaginationItem v-else-if="Math.abs(p - page) === 3">
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