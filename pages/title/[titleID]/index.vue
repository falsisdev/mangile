<script setup>
import { data } from "@/assets/data.ts"
import { Icon } from "@iconify/vue"
import { toRaw } from "vue";
import imageUrlBuilder from "@sanity/image-url";
import { toast } from 'vue-sonner'

const route = useRoute();
const sanityConfig = useSanity().config;
const builder = imageUrlBuilder(sanityConfig);
const { isMobileOrTablet, isMobile } = useDevice();

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
const groupedChapters = ref([]);
const unGroupedChapters = ref([]);
const scans = ref([]);
const userData = ref(null);
const dbStyle = ref(1); //1 düzenli liste görünümü, 0 düzensiz liste görünümü
const sortOrder = ref('asc'); // Bölüm sıralama için

const user = useLogtoUser();
const sanity = useSanity()

const sanityUser = ref({})
const isFavoriteLoading = ref(false)
const isLoadingRelations = ref(true); // İlişkili seriler için yükleme durumu
const isListUpdating = ref({}); // Listelere ekleme/çıkarma yükleme durumu

if (Boolean(user)) {
    // items alanını da çekmek için query'i güncelliyoruz
    const query = groq`*[_type == "auth" && logtoId == $logtoId][0]{
    ...,
    lists[]-> {
      _id,
      title,
      items
    },
}`
    // CDN Caching (Önbellek) sorununu çözmek için withConfig({ useCdn: false }) ekliyoruz.
    // Bu sayede sayfadan gidip gelince eski (cachelenmiş) veri değil, anlık veri gelir.
    const rawClient = sanity.client || sanity;
    sanityUser.value = await rawClient.withConfig({ useCdn: false }).fetch(query, { logtoId: user.sub })
}

// Yeni Ekleme ve Çıkarma Fonksiyonu - Backend API kullanacak şekilde güncellendi
async function toggleTitleInList(listId) {
    if (!sanityUser.value?._id) {
        toast.error('Hata', {
            description: 'Giriş yapmanız gerekiyor'
        });
        return;
    }

    isListUpdating.value[listId] = true;
    try {
        const currentMangaId = Number(route.params.titleID);
        const targetList = sanityUser.value.lists.find((l) => l._id === listId);
        
        if (!targetList) throw new Error("Liste bulunamadı");
        if (!targetList.items) targetList.items = [];

        const existingItemIndex = targetList.items.findIndex((i) => i.item && Number(i.item[0]) === currentMangaId);
        const isAdding = existingItemIndex === -1;

        // Backend API'ye gönderilecek veriler (titleID olarak güncellendi)
        const bodyData = {
            listId: listId,
            titleID: currentMangaId,
            action: isAdding ? 'add' : 'remove',
            itemKey: isAdding ? null : targetList.items[existingItemIndex]._key
        };

        // Kendi Nuxt 3 API rotamıza istek atıyoruz
        const response = await $fetch('/api/user/list', {
            method: 'POST',
            body: bodyData
        });

        if (response.success) {
            if (isAdding) {
                // Sunucudan dönen sıralanmış items listesi ile reaktif veriyi güncelliyoruz
                targetList.items = response.items;
                sanityUser.value = { ...sanityUser.value }; // Arayüzün (yeşil tik) güncellenmesini garanti altına alıyoruz

                toast.success('Eklendi', {
                    description: `${targetList.title} listesine başarıyla eklendi.`
                });
            } else {
                // Sildiğimiz item'ı listeden filtreleyip re-index edilmiş yeni listeyi uyguluyoruz
                targetList.items = response.items;
                sanityUser.value = { ...sanityUser.value }; // Arayüzün (yeşil tik) güncellenmesini garanti altına alıyoruz

                toast.info('Kaldırıldı', {
                    description: `${targetList.title} listesinden çıkarıldı.`
                });
            }
        } else {
            throw new Error(response.message || 'İşlem başarısız oldu');
        }

    } catch (error) {
        console.error("Liste güncelleme hatası:", error);
        toast.error('Hata', {
            description: 'İşlem sırasında bir hata oluştu.'
        });
    } finally {
        isListUpdating.value[listId] = false;
    }
}

const groupChaptersBySource = (chapters) => {
    const groupedChapters = {};
    chapters.forEach((chapter) => {
        const sourceId = chapter.source?._id || 'unknown';
        if (!groupedChapters[sourceId]) {
            groupedChapters[sourceId] = {
                source: chapter.source,
                chapters: []
            };
        }
        groupedChapters[sourceId].chapters.push(chapter);
    });

    return Object.values(groupedChapters).map(group => ({
        ...group,
        chapters: group.chapters.sort((a, b) =>
            sortOrder.value === 'asc'
                ? a.chapterNumber - b.chapterNumber
                : b.chapterNumber - a.chapterNumber
        )
    }));
};

const groupChaptersByNumberAndSource = (chapters) => {
    const groupedChapters = {};
    chapters.forEach((chapter) => {
        const key = `${chapter.chapterNumber}-${chapter.source._id}`;
        if (!groupedChapters[key]) {
            groupedChapters[key] = [];
        }
        groupedChapters[key].push(chapter);
    }
    );
    return Object.values(groupedChapters).sort((a, b) =>
        sortOrder.value === 'asc'
            ? a[0].chapterNumber - b[0].chapterNumber
            : b[0].chapterNumber - a[0].chapterNumber
    );
};

watchEffect(() => {
    if (preSanityData.value) {
        const fetchedData = toRaw(preSanityData.value);
        sanityData.value = fetchedData;

        if (fetchedData.length > 0) {
            if (dbStyle.value === 1) {
                groupedChapters.value = groupChaptersBySource(fetchedData[0].chapters);
            } else {
                groupedChapters.value = groupChaptersByNumberAndSource(fetchedData[0].chapters);
            }
            unGroupedChapters.value = fetchedData[0].chapters;
            fetchedData[0]["chapters"].forEach((x) => fetchedData[0].chapters.forEach((x) => {
                if (x.source) scans.value.push(x.source.name)
            }));
        }
    }
});

const mangaID = ref(route.params.titleID);
const manga = ref([]);
const images = ref([]);
const recommendations = ref([]);
const relations = ref([]);
const warning = ref([]);

// Jikan API'sinden önerileri çek
const recommendationsData = await $fetch(
    `https://api.jikan.moe/v4/manga/${mangaID.value}/recommendations`
);
recommendations.value = recommendationsData.data;

function moveElementToIndex(arr, value, targetIndex) {
    const currentIndex = arr.findIndex(
        (el) => el.jpg.large_image_url === value.jpg.large_image_url
    );
    if (currentIndex === -1 || currentIndex === targetIndex) {
        return arr;
    }
    const [removedElement] = arr.splice(currentIndex, 1);
    arr.splice(targetIndex, 0, removedElement);
    return arr;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Yeniden deneme mekanizmalı fetch fonksiyonu
async function retryFetch(url, options = {}, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429) { // Too Many Requests
                console.warn(`Jikan API'den 429 hatası alındı. ${delay / 1000} saniye bekleniyor...`);
                await sleep(delay);
                delay *= 2; // Gecikmeyi artır (üstel geri çekilme)
                continue;
            }
            if (!response.ok) {
                throw new Error(`HTTP hatası! Durum: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Fetch hatası (Deneme ${i + 1}/${retries}):`, error);
            if (i < retries - 1) {
                console.log(`${delay / 1000} saniye bekleniyor...`);
                await sleep(delay);
                delay *= 2;
            } else {
                throw error; // Son denemeden sonra hala hata varsa fırlat
            }
        }
    }
}


function formatDate(dateString) {
    if (!dateString) return 'Bilinmiyor';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchManga() {
    isLoadingRelations.value = true; // İlişki çekme başlamadan önce true yap
    try {
        const [mangaData, imagesData] = await Promise.all([
            retryFetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`),
            retryFetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/pictures`),
        ]);

        manga.value = mangaData.data;
        images.value = moveElementToIndex(
            imagesData.data,
            imagesData.data.find(
                (x) => x.jpg.large_image_url == manga.value.images.jpg.large_image_url
            ),
            0
        );

        manga.value.themes?.forEach((x) => {
            if (data.warnmessages[x.mal_id]) {
                warning.value.push(data.warnmessages[x.mal_id]);
            }
        });

        if (manga.value.relations) {
            const tempRelations = [];

            for (let relation of manga.value.relations) {
                for (let entry of relation.entry) {
                    if (
                        entry.type === "manga" &&
                        !tempRelations.some((e) => e.entry.mal_id === entry.mal_id)
                    ) {
                        // Her ilişkili manga isteği arasına gecikme koy
                        await sleep(1000); // 1 saniye bekle
                        try {
                            const entryData = await retryFetch(
                                `https://api.jikan.moe/v4/manga/${entry.mal_id}/full`
                            );
                            tempRelations.push({
                                relation: relation.relation,
                                entry: entryData.data,
                            });
                        } catch (relationError) {
                            console.error(`İlişkili manga (${entry.mal_id}) çekme hatası:`, relationError);
                            // Hata durumunda bile diğer ilişkilere devam et
                        }
                    }
                }
            }

            relations.value = tempRelations;
        }
    } catch (error) {
        console.error("Ana veri çekme hatası:", error);
        toast.error('Hata', {
            description: 'Manga bilgileri yüklenirken bir sorun oluştu.'
        })
    } finally {
        isLoadingRelations.value = false; // İlişki çekme bittikten sonra (hata olsa bile) false yap
    }
}

async function setFavorite() {
    isFavoriteLoading.value = true
    try {
        if (!sanityUser.value?._id) {
            toast.error('Hata', {
                description: 'Giriş yapmanız gerekiyor'
            })
            return
        }

        const currentFavorites = sanityUser.value.favoriteTitles || []
        const isFavorite = currentFavorites.includes(route.params.titleID)

        const { success, favorites } = await $fetch('/api/user/favorite', {
            method: 'POST',
            body: {
                id: sanityUser.value._id,
                favoriteTitle: route.params.titleID
            }
        })

        if (success) {
            sanityUser.value.favoriteTitles = favorites

            if (isFavorite) {
                toast.info('Kaldırıldı', {
                    description: 'En sevdiğin içeriklerden kaldırıldı'
                });
            } else {
                toast.success('Eklendi', {
                    description: 'En sevdiğin içerikler arasına eklendi'
                });
            }
        } else {
            throw new Error('İşlem başarısız oldu')
        }

    } catch (err) {
        console.error("Favorite güncelleme hatası:", err)
        toast.error('Hata', {
            description: 'En sevdiğin içeriklere eklenemedi'
        })
    } finally {
        isFavoriteLoading.value = false
    }
}

watchEffect(() => {
    if (manga.value?.title) {
        useSeoMeta({
            author: "Falsis",
            twitterData1: "Falsis",
            twitterLabel1: "created by",
            twitterTitle: manga.value.title,
            title: manga.value.title,
            ogTitle: "%s",
            description: manga.value.title,
            ogDescription: `${manga.value.title} adlı mangaya ait bilgilere, bölümlere ve benzeri bir çok veriye ulaş ve manganın Türkçe bölümlerine Mangile'da eriş!`,
            ogImage: sanityData.value[0]?.bannerImage || manga.value.images.jpg.large_image_url,
            twitterCard: "summary_large_image",
            twitterImage: sanityData.value[0]?.bannerImage || manga.value.images.jpg.large_image_url,
            ogImageHeight: 200,
            ogImageWidth: 400,
        });
    }
});

// mangaID değiştiğinde veya userData değiştiğinde fetchManga'yı tetikle
watch([mangaID, userData], async ([newMangaID, newUserData], [oldMangaID, oldUserData]) => {
    // Sadece mangaID veya userData gerçekten değiştiğinde fetchManga'yı çağır
    if (newMangaID !== oldMangaID || newUserData !== oldUserData) {
        await fetchManga();
    }
}, { immediate: true }); // Sayfa ilk yüklendiğinde de çalışması için immediate: true ekledik.

watch([dbStyle, sortOrder], () => {
    if (preSanityData.value) {
        const fetchedData = toRaw(preSanityData.value);
        if (fetchedData.length > 0) {
            if (dbStyle.value === 1) {
                groupedChapters.value = groupChaptersBySource(fetchedData[0].chapters);
            } else {
                groupedChapters.value = groupChaptersByNumberAndSource(fetchedData[0].chapters);
            }
        }
    }
});

onMounted(() => {
    const dbStyleCookie = useCookie("dbStyle", {
        sameSite: "None",
        secure: true,
    });

    if (dbStyleCookie.value == 0) dbStyle.value = 0;
});

const bannerOpacity = ref(1);

function handleScroll() {
    if (!isMobileOrTablet) return;
    const bannerHeight = 384;
    const scrollY = window.scrollY;
    bannerOpacity.value = Math.max(0, 1 - scrollY / 75);
}

onMounted(() => {
    if (isMobileOrTablet) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
});
onUnmounted(() => {
    if (isMobileOrTablet) {
        window.removeEventListener('scroll', handleScroll);
    }
});

function goBack() {
    window.history.length > 1 ? window.history.back() : navigateTo('/');
}

const firstChapter = computed(() => {
    if (unGroupedChapters.value && unGroupedChapters.value.length > 0) {
        const sorted = [...unGroupedChapters.value].sort((a, b) => a.chapterNumber - b.chapterNumber);
        return sorted[0];
    }
    return null;
});

const lastChapter = computed(() => {
    if (unGroupedChapters.value && unGroupedChapters.value.length > 0) {
        const sorted = [...unGroupedChapters.value].sort((a, b) => b.chapterNumber - a.chapterNumber);
        return sorted[0];
    }
    return null;
});

const isSingleChapter = computed(() => {
    return firstChapter.value && lastChapter.value && firstChapter.value._key === lastChapter.value._key;
});
</script>

<template>
    <main>
        <div>
            <div class="relative h-96 w-full overflow-hidden" :style="{ opacity: bannerOpacity }">
                <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                <div class="absolute inset-0 bg-background z-10 opacity-50"></div>
                <img v-if="sanityData[0]?.bannerImage || manga?.images?.jpg?.large_image_url"
                    :src="sanityData[0]?.bannerImage ? builder.image(sanityData[0]?.bannerImage.asset._ref).auto('format').url() : manga?.images?.jpg?.large_image_url"
                    class="w-full h-full object-cover opacity-75" />
            </div>

            <div class="container mx-auto px-4 -mt-40 relative z-20">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="w-72 mb-3">
                        <Card class="pt-0">
                            <CardHeader v-if="sanityData[0]?.coverImage || manga?.images?.jpg?.large_image_url"
                                class="p-0">
                                <img :src="sanityData[0]?.coverImage ? builder.image(sanityData[0]?.coverImage.asset._ref).auto('format').url() : manga?.images?.jpg?.large_image_url"
                                    class="w-full rounded-t-lg" />
                            </CardHeader>
                            <CardContent class="-mt-2">
                                <div class="flex items-center justify-between">
                                    <Badge variant="secondary">
                                        {{ manga?.type?.replaceAll('Light', "Hafif").replaceAll("Novel", "Roman") }}
                                    </Badge>
                                    <div class="flex items-center gap-1">
                                        <Icon icon="material-symbols:star-outline-rounded" class="h-5 w-5" />
                                        <span class="text-sm font-medium">
                                            {{ manga?.score || 'N/A' }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-1 mt-1">
                                    <Badge v-for="genre in manga?.genres" :key="genre.mal_id" variant="outline">
                                        {{ data.malgenres[genre.name] }}
                                    </Badge>
                                </div>
                                <Separator class="my-2" />

                                <div class="text-sm space-y-1">
                                    <p v-if="manga?.authors?.[0]">
                                        <span class="font-medium">Yazar:</span> {{ manga.authors[0].name }}
                                    </p>
                                    <p>
                                        <span class="font-medium">Yayın Tarihi:</span> {{
                                            formatDate(manga?.published?.from) || manga?.published?.prop?.from?.year ||
                                            manga?.year || 'Bilinmiyor' }}
                                    </p>
                                    <p v-if="manga?.serializations?.[0]">
                                        <span class="font-medium">Yayıncı:</span> {{ manga.serializations[0].name }}
                                    </p>
                                    <p>
                                        <span class="font-medium">Durum:</span> {{ data.malstatus[manga?.status] }}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <span class="flex flex-col mt-2 items-start">
                            <Button variant="default" class="gap-2 cursor-pointer shadow-lg w-full justify-start"
                                size="lg" v-if="firstChapter"
                                @click="navigateTo(`/title/${route.params.titleID}/chapter/${firstChapter._key}`)">
                                <Icon icon="material-symbols:lab-profile-outline-rounded" class="h-10 w-10" />
                                <span class="flex flex-col text-left">
                                    <span class="text-md font-semibold">
                                        {{ isSingleChapter ? 'Tek Bölüm' : 'İlk Bölüm' }}
                                    </span>
                                    <span class="text-xs opacity-75 truncat">
                                        {{ (firstChapter.title || `Bölüm ${firstChapter.chapterNumber}`).length >= 40 ?
                                            (firstChapter.title || `Bölüm ${firstChapter.chapterNumber}`).slice(0, 40) +
                                            '...' :
                                            (firstChapter.title || `Bölüm ${firstChapter.chapterNumber}`) }}
                                    </span>
                                </span>
                            </Button>
                            <Button variant="secondary" class="gap-2 cursor-pointer shadow-lg w-full mt-2 justify-start"
                                size="lg" v-if="!isSingleChapter && lastChapter"
                                @click="navigateTo(`/title/${route.params.titleID}/chapter/${lastChapter._key}`)">
                                <Icon icon="material-symbols:lab-profile-outline-rounded" class="h-10 w-10" />
                                <span class="flex flex-col text-left">
                                    <span class="text-md font-semibold">
                                        Son Bölüm
                                    </span>
                                    <span class="text-xs opacity-75 truncate">
                                        {{ (lastChapter.title || `Bölüm ${lastChapter.chapterNumber}`).length >= 40 ?
                                            (lastChapter.title || `Bölüm ${lastChapter.chapterNumber}`).slice(0, 40) +
                                            '...' :
                                            (lastChapter.title || `Bölüm ${lastChapter.chapterNumber}`) }}
                                    </span>
                                </span>
                            </Button>
                        </span>
                    </div>

                    <div class="w-full md:w-3/4 space-y-6">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 class="text-3xl font-bold tracking-tight">{{ manga?.title }}</h1>
                                <p class="text-lg text-gray-600 dark:text-gray-400">{{ manga?.title_english ||
                                    manga?.title_japanese }}</p>
                            </div>

                            <div class="flex gap-2" v-if="Boolean(user)">
                                <Button variant="outline" class="gap-2 cursor-pointer shadow-lg">
                                    <Icon icon="material-symbols:sync" />
                                    İzleyici
                                </Button>
                                <DropdownMenu v-if="sanityUser?.lists?.length > 0">
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="default" class="cursor-pointer">
                                            <Icon icon="material-symbols:list-alt-add-outline" />
                                            Listeye Ekle
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div v-for="item of sanityUser.lists" :key="item._id">
                                            <DropdownMenuItem class="cursor-pointer flex justify-between items-center min-w-[160px]" @click.prevent="toggleTitleInList(item._id)">
                                                <div class="flex items-center gap-2">
                                                    <Icon icon="material-symbols:list-alt-outline-rounded" />
                                                    {{ item.title }}
                                                </div>
                                                <Icon v-if="isListUpdating[item._id]" icon="svg-spinners:270-ring" class="ml-2 text-primary" />
                                                <Icon v-else-if="item.items?.some(i => i.item?.[0] == Number(mangaID))" icon="material-symbols:check-circle-rounded" class="ml-2 text-green-500" />
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="ghost" @click="setFavorite()" :disabled="isFavoriteLoading" :class="{
                                    'mr-3': true,
                                    'bg-yellow-400 text-black cursor-pointer': sanityUser?.favoriteTitles?.includes(mangaID),
                                    'cursor-pointer': !sanityUser?.favoriteTitles?.includes(mangaID)
                                }" aria-label="Favori" size="icon">
                                    <Icon v-if="!isFavoriteLoading"
                                        icon="material-symbols:heart-check-outline-rounded" />
                                    <Icon v-else icon="svg-spinners:270-ring" class="text-primary" />
                                </Button>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle class="text-xl">Konu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea class="h-24">
                                    <p class="text-sm text-gray-700 dark:text-gray-300">
                                        {{ sanityData[0]?.description || manga?.synopsis || 'Açıklama bulunamadı' }}
                                    </p>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card v-if="sanityData[0]?.notes">
                            <CardHeader>
                                <CardTitle class="text-xl">Notlar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea class="h-24 text-sm">
                                    <SanityContent :blocks="sanityData[0].notes" />
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card v-if="groupedChapters.length > 0" class="mb-2">
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <CardTitle class="text-xl">Bölümler</CardTitle>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-gray-500">Sıralama:</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger as-child>
                                                <Button variant="ghost" size="sm">
                                                    <span>{{ sortOrder === 'desc' ? 'En Yeni' : 'En Eski' }}</span>
                                                    <Icon icon="mdi:chevron-down" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem @click="sortOrder = 'desc'">En Yeni</DropdownMenuItem>
                                                <DropdownMenuItem @click="sortOrder = 'asc'">En Eski</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <span class="text-sm text-gray-500">Düzen:</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger as-child>
                                                <Button variant="ghost" size="sm">
                                                    <span>{{ dbStyle === 1 ? 'Gruplanmış' : 'Gruplanmamış' }}</span>
                                                    <Icon icon="mdi:chevron-down" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem @click="dbStyle = 1">Gruplanmış</DropdownMenuItem>
                                                <DropdownMenuItem @click="dbStyle = 0">Gruplanmamış</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div class="space-y-3">
                                    <template v-if="dbStyle === 1">
                                        <div v-for="group in groupedChapters" :key="group.source?._id || 'unknown'"
                                            class="space-y-2">
                                            <div class="flex items-center gap-2">
                                                <div class="font-medium">{{ group.source?.name || 'Bilinmeyen Kaynak' }}
                                                </div>
                                                <Separator class="flex-1" />
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                <NuxtLink v-for="chapter in group.chapters" :key="chapter._key"
                                                    :to="`/title/${route.params.titleID}/chapter/${chapter._key}`"
                                                    class="flex items-center justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300">
                                                    <div class="flex flex-row items-center gap-3">
                                                        <Button variant="outline"
                                                            class="w-10 h-10 rounded-lg flex items-center justify-center">
                                                            <span class="font-medium">{{ chapter.chapterNumber }}</span>
                                                        </Button>
                                                        <div>
                                                            <p>{{ chapter.title || `Bölüm
                                                                ${chapter.chapterNumber}` }}</p>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div>
                                            <div v-for="chapterGroup in groupedChapters" :key="chapterGroup[0]._id"
                                                class="flex items-center justify-between p-3 rounded-md">
                                                <div class="flex items-center gap-3">
                                                    <Button variant="outline"
                                                        class="w-10 h-10 rounded-md flex items-center justify-center">
                                                        <span class="font-medium">{{ chapterGroup[0].chapterNumber
                                                        }}</span>
                                                    </Button>
                                                    <div>
                                                        <p>{{ chapterGroup[0].title || `Bölüm
                                                            ${chapterGroup[0].chapterNumber}` }}</p>
                                                        <p class="text-sm text-gray-500">{{ chapterGroup[0].source?.name
                                                        }}</p>
                                                    </div>
                                                </div>
                                                <NuxtLink
                                                    :to="`/title/${route.params.titleID}/chapter/${chapterGroup[0]?._key}`">
                                                    <Button variant="outline" class="cursor-pointer">
                                                        Oku
                                                    </Button>
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Separator class="my-4" />
                <div class="mb-5">
                    <h1 class="text-2xl font-semibold mb-4">Bağlantılı Seriler</h1>
                    <Loading v-if="isLoadingRelations" class="h-48" type="default" what="Bağlantılı Seriler İçeriği" />
                    <swiper v-else-if="relations.length > 0" :slides-per-view="2" :space-between="10" :modules="[SwiperAutoplay]" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 6,
                            spaceBetween: 40,
                        },
                        '1280': {
                            slidesPerView: 7,
                        },
                    }">
                        <swiper-slide v-for="relationItem in relations" :key="relationItem.entry.mal_id">
                            <DefaultCard :id="relationItem.entry.mal_id"
                                :cover="relationItem.entry.images.jpg.large_image_url" :title="relationItem.entry.title"
                                :type="relationItem.entry['type'].replaceAll('Light', 'Hafif').replaceAll('Novel', 'Roman')"
                                :badgeContent="relationItem['relation'].replaceAll('Other', 'Diğer').replaceAll('Adaptation', 'Adaptasyon').replaceAll('Sequel', 'Devam Serisi').replaceAll('Prequel', 'Önceki Seri').replaceAll('Side Story', 'Yan Öykü').replaceAll('Alternative Version', 'Alternatif Yorum').replaceAll('Parent Story', 'Ana Öykü').replaceAll('Character', 'Karakter')"
                                :badgeTooltip="relationItem.relation" />
                        </swiper-slide>
                    </swiper>
                    <p v-else class="text-center text-gray-500">Bağlantılı seri bulunamadı.</p>
                </div>
            </div>
        </div>
    </main>
</template>