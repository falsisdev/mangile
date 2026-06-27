<script setup lang="ts">
// @ts-nocheck
import { Icon } from '@iconify/vue'
import { data } from "@/assets/data"
import { ref, onMounted, onUnmounted } from 'vue' // Ensure onUnmounted is imported

interface Manga {
    title: string
    type: string
    images: {
        jpg: {
            image_url: string,
            large_image_url: string
        },
        webp: {
            large_image_url: string
        }
    }
    genres: { name: string }[]
    status: string
    synopsis: string
    scored: number
    mal_id: number
}

const loading = ref(true)
const error = ref(null)
const topMangas = ref<Manga[]>([])
const currentProgress = ref(0)
const autoplayDelay = 5000

const fetchTopMangas = async () => {
    loading.value = true
    error.value = null
    try {
        // Use $fetch instead of useFetch for client-side data fetching
        const topMangaData = await $fetch("https://api.jikan.moe/v4/top/manga", {
            params: {
                limit: 15,
                sfw: true,
                filter: 'bypopularity',
                genres_exclude: "12,28,9,49,26,35,53,44,65,74"
            },
        });

        if (topMangaData?.data) {
            topMangas.value = topMangaData.data as Manga[]; // Type assertion for clarity
        } else {
            throw new Error('Popüler mangalar bulunamadı');
        }
    } catch (err: any) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
}

const truncateSynopsis = (text: string, length = 1000) => {
    if (!text) return 'Açıklama bulunamadı.';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

const updateProgressBar = (swiper: any, timeLeft: number, percentage: number) => {
    currentProgress.value = (1 - percentage) * 100;
};

onMounted(() => {
    fetchTopMangas();
})
</script>

<template>
    <Loading v-if="isLoading" class="h-[500px] w-full" type="default" what="İçerik" />

    <div v-else-if="error" class="w-full h-[500px] flex items-center justify-center">
        <p>Hata: {{ error }}</p>
        <Button @click="fetchTopMangas" variant="outline" class="ml-2">
            <Icon icon="mdi:refresh" class="h-4 w-4 mr-1" /> Yenile
        </Button>
    </div>

    <Swiper v-else :modules="[SwiperAutoplay]" :slides-per-view="1" :loop="true" :autoplay="{
        delay: autoplayDelay,
        disableOnInteraction: false,
    }" class="w-full h-[500px]" @autoplayTimeLeft="updateProgressBar">
        <SwiperSlide v-for="manga in topMangas" :key="manga.mal_id">
            <div :style="{ backgroundImage: `url('${manga?.images?.webp?.large_image_url}')` }"
                class="w-full h-full bg-cover bg-no-repeat bg-center relative">
                <div class="absolute inset-0 backdrop-blur-xs bg-black/20"></div>
                <div class="relative z-10 bg-gradient-to-r from-background to-transparent h-full">
                    <div class="h-full bg-gradient-to-t from-background to-transparent flex flex-col justify-center">
                        <div class="container mx-auto px-4 sm:px-8 py-8">
                            <div>
                                <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                                    {{ manga.title }}
                                </h1>
                                <p class="text-sm text-muted-foreground mt-2">
                                    {{ manga.type?.replaceAll('Light Novel', 'Hafif Roman').replaceAll('Novel', 'Roman')
                                    }}
                                </p>
                                <div class="mt-4 flex flex-wrap items-center gap-2">
                                    <Badge variant="default">
                                        {{ data?.malstatus[manga.status] || 'Bilinmiyor' }}
                                    </Badge>
                                    <Badge v-for="(genre, index) in manga.genres?.slice(0, 4)" :key="index"
                                        variant="secondary">
                                        {{ data?.malgenres[genre.name] }}
                                    </Badge>
                                </div>
                                <p class="text-sm mt-4">
                                    {{ truncateSynopsis(manga.synopsis) }}
                                </p>
                                <div class="flex mt-6">
                                    <Button @click="() => navigateTo(`/title/${manga.mal_id}`)" variant="outline"
                                        class="cursor-pointer shadow-lg">
                                        <Icon icon="mdi:eye" class="mr-2" /> Görüntüle
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SwiperSlide>
        <div class="absolute bottom-0 left-0 w-full h-1 bg-background z-20 overflow-hidden rounded-none">
            <div class="h-full bg-primary transition-all duration-100 ease-linear"
                :style="{ width: currentProgress + '%' }"></div>
        </div>
    </Swiper>
</template>