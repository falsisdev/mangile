<script setup lang="ts">
//@ts-nocheck
import { Icon } from '@iconify/vue'
import { data } from "@/assets/data"

interface Manga {
    title: string
    type: string
    images: {
        jpg: {
            image_url: string
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

const manga = ref<Manga | null>(null)
const loading = ref(true)
const error = ref(null)
const topMangas = ref<Manga[]>([])
const translatedSynopsis = ref<string>('')

// Popüler ilk 100 mangayı çek (NSFW hariç)
const fetchTopMangas = async () => {
    try {
        const { data: topMangaData } = await useFetch(
            "https://api.jikan.moe/v4/top/manga",
            {
                params: {
                    limit: 100,
                    sfw: true,
                    filter: 'bypopularity',
                    genres_exclude: "12,28,9,49,26,35,53,44,65,74" // NSFW genre ID'leri
                },
                key: "top-mangas",
                staleTime: 1000 * 60 * 60, // 1 saat taze kalacak
                cacheTime: 1000 * 60 * 60 * 24, // 24 saat boyunca önbellekte kalacak
            }
        )

        if (topMangaData.value?.data) {
            topMangas.value = topMangaData.value.data
            fetchRandomFromTop()
        } else {
            throw new Error('Popüler mangalar bulunamadı')
        }
    } catch (err: any) {
        error.value = err.message
        loading.value = false
    }
}

// Top 100 listesinden rastgele seçim yap
const fetchRandomFromTop = async () => {
    loading.value = true
    error.value = null
    try {
        if (topMangas.value.length === 0) {
            await fetchTopMangas()
            return
        }

        // Rastgele bir manga seç
        const randomIndex = Math.floor(Math.random() * topMangas.value.length)
        const randomManga = topMangas.value[randomIndex]

        // Detayları için API'ye tekrar istek at (güncel bilgiler için)
        const { data: mangaDetails } = await useFetch(
            `https://api.jikan.moe/v4/manga/${randomManga.mal_id}`,
            {
                key: `manga-${randomManga.mal_id}`,
                staleTime: 1000 * 60 * 60, // 1 saat taze kalacak
            }
        )

        if (mangaDetails.value?.data) {
            manga.value = mangaDetails.value.data
        } else {
            throw new Error('Manga detayları alınamadı')
        }
    } catch (err: any) {
        error.value = err.message
        // 2 saniye bekle ve tekrar dene
        setTimeout(() => fetchRandomFromTop(), 2000)
    } finally {
        loading.value = false
    }
}

const getOptimizedImage = (url: string | undefined) => {
    if (!url) return 'https://wallpapers.com/images/hd/aot-the-rumbling-4xsrspbockemj57g.jpg'
    return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace('https://', ''))}&w=1200&h=600&fit=cover&q=80`
}

const translateWithBrowser = async (text: string) => {
    if (!text) return 'Açıklama bulunamadı.'

    try {
        // @ts-ignore
        if (window.navigator?.translate) {
            // @ts-ignore
            const translator = await window.navigator.translate.create()
            const result = await translator.translate(text, 'en', 'tr')
            return result
        }
        return text
    } catch (err) {
        console.error("Çeviri hatası:", err)
        return text
    }
}

watch(() => manga.value, async (newManga) => {
    if (newManga?.synopsis) {
        translatedSynopsis.value = await translateWithBrowser(newManga.synopsis)
    } else {
        translatedSynopsis.value = 'Açıklama bulunamadı.'
    }
}, { immediate: true })

onMounted(() => {
    fetchTopMangas()
})
</script>

<template>
    <div v-if="loading" class="w-full h-5/7 flex items-center justify-center">
        <Icon icon="mingcute:loading-line" class="animate-spin w-full" />
    </div>

    <div v-else-if="error" class="w-full h-5/7 flex items-center justify-center">
        <p>Hata: {{ error }}</p>
        <Button @click="fetchTopMangas" variant="outline" class="ml-2">
            <Icon icon="mdi:refresh" class="h-4 w-4 mr-1" /> Yenile
        </Button>
    </div>

    <div v-else :style="{ backgroundImage: `url('${getOptimizedImage(manga?.images?.webp?.large_image_url)}')` }"
        class="w-full bg-cover h-[500px] bg-no-repeat bg-center relative">
        <div class="absolute inset-0 backdrop-blur-xs bg-black/20"></div>
        <div class="relative z-10 bg-gradient-to-r from-background to-transparent h-full pl-5">
            <div class="h-full bg-gradient-to-t from-background to-transparent flex flex-col justify-center pr-5">
                <div class="container mx-auto px-4 py-8">
                    <div class="flex justify-between items-start">
                        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                            {{ manga?.title }}
                        </h1>
                    </div>
                    {{ manga?.type?.replaceAll('Light Novel', 'Hafif Roman').replaceAll('Novel', 'Roman') }}
                    <p class="leading-6 text-sm max-w-screen">
                        <span class="mt-2 -mb-2 flex flex-row">
                            <Badge variant="default">
                                {{ data?.malstatus[manga?.status] || 'Durum Bilinmiyor' }}
                            </Badge>
                            <Badge v-for="(genre, index) in manga?.genres?.slice(0, 4)" :key="index" variant="secondary"
                                class="ml-1">
                                {{ data?.malgenres[genre.name] }}
                            </Badge>
                        </span>
                        <br />
                        {{ translatedSynopsis || 'Açıklama bulunamadı.' }}
                    </p>
                    <span class="flex mt-2">
                        <Button @click="() => navigateTo(`/title/${manga.mal_id}`)" variant="default"
                            class="cursor-pointer mr-1">
                            <Icon icon="mdi:eye" /> Görüntüle
                        </Button>
                        <Button @click="fetchRandomFromTop" variant="outline" size="icon">
                            <Icon icon="mdi:refresh" class="h-4 w-4" />
                        </Button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>