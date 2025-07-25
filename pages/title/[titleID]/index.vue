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
const sortOrder = ref('desc'); // Bölüm sıralama için

const user = useLogtoUser();
const sanity = useSanity()
const listMenuItem = ref({})

const sanityUser = ref({}) // ref olarak tanımla
if (Boolean(user)) {
    const query = groq`*[_type == "auth" && logtoId == $logtoId][0]{
    ...,
    lists[]-> {
      _id,
      title
    },
}`
    sanityUser.value = await sanity.fetch(query, { logtoId: user.sub }) // sadece .value güncelle
    const lists = sanityUser.value.lists;
    const listItems = Array.isArray(toRaw(lists))
        ? toRaw(lists)
        : [toRaw(lists)]
    listMenuItem.value = toRaw(lists) ? toRaw(listItems).map((list) => ({
        title: list.title,
        id: list._id,
        icon: "material-symbols:list-alt-outline-rounded",
    })) : null
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
    });
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
    try {
        const [mangaData, imagesData] = await Promise.all([
            $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`),
            $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/pictures`),
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
                        await sleep(1000);
                        const entryData = await $fetch(
                            `https://api.jikan.moe/v4/manga/${entry.mal_id}/full`
                        );
                        tempRelations.push({
                            relation: relation.relation,
                            entry: entryData.data,
                        });
                    }
                }
            }

            relations.value = tempRelations;
        }
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

async function setFavorite() {
    try {
        if (!sanityUser.value?._id) {
            toast({
                title: 'Hata',
                description: 'Giriş yapmanız gerekiyor',
                variant: 'destructive'
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

            // Başarılı toast bildirimi
            toast({
                title: isFavorite ? 'Kaldırıldı' : 'Eklendi',
                description: isFavorite
                    ? 'En sevdiğin içeriklerden kaldırıldı'
                    : 'En sevdiğin içerikler arasına eklendi',
                variant: 'default'
            })
        } else {
            throw new Error('İşlem başarısız oldu')
        }

    } catch (err) {
        console.error("Favorite güncelleme hatası:", err)
        toast({
            title: 'Hata',
            description: 'En sevdiğin içeriklere eklenemedi',
            variant: 'destructive'
        })
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

watch([mangaID, userData], async (newID, oldID) => {
    if (newID !== oldID) {
        await fetchManga();
    }
});

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
onMounted(fetchManga);

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

const showFullSanityDesc = ref(false)
const showFullSynopsis = ref(false)
</script>
<template>
    <main>
        <div>
            <!-- Banner ve Cover -->
            <div class="relative h-96 w-full overflow-hidden" :style="{ opacity: bannerOpacity }">
                <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                <div class="absolute inset-0 bg-background z-10 opacity-50"></div>
                <img v-if="sanityData[0]?.bannerImage || manga?.images?.jpg?.large_image_url"
                    :src="sanityData[0]?.bannerImage ? builder.image(sanityData[0]?.bannerImage.asset._ref).auto('format').url() : manga?.images?.jpg?.large_image_url"
                    class="w-full h-full object-cover opacity-75" />

                <!-- Geri butonu -->
                <Button variant="secondary" class="absolute top-2 left-7 z-20 cursor-pointer" @click="goBack">
                    <Icon icon="material-symbols:arrow-back-ios-rounded" class="ml-2" />
                </Button>
            </div>

            <!-- Ana içerik -->
            <div class="container mx-auto px-4 -mt-40 relative z-20">
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Sol taraf - Kapak resmi ve temel bilgiler -->
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
                                        <Icon icon="material-symbols:star-outline-rounded"
                                            :class="['h-5 w-5', sanityUser?.favoriteTitle === mangaID ? 'fill-red-500 text-red-500' : 'text-gray-400']" />
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
                    </div>

                    <!-- Sağ taraf - Detaylı bilgiler -->
                    <div class="w-full md:w-3/4 space-y-6">
                        <!-- Başlık ve aksiyon butonları -->
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 class="text-3xl font-bold tracking-tight">{{ manga?.title }}</h1>
                                <p class="text-lg text-gray-600 dark:text-gray-400">{{ manga?.title_english ||
                                    manga?.title_japanese }}</p>
                            </div>

                            <div class="flex gap-2" v-if="Boolean(user)">
                                <Button variant="outline" class="gap-2 cursor-pointer shadow-lg">
                                    <Icon icon="mdi:playlist-plus" />
                                    Kitaplık Girdisi
                                </Button>
                                <DropdownMenu v-if="listMenuItem">
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="default" class="cursor-pointer">
                                            <Icon icon="material-symbols:list-alt-add-outline" />
                                            Listeye Ekle
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem v-for="item of listMenuItem" :key="item.id">
                                            <Icon :icon="item.icon" />
                                            {{ item.title }}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="ghost" @click="() => {
                                    setFavorite();
                                }" :disabled="isFavoriteLoading" :class="{
                                    'bg-yellow-400 text-black cursor-pointer': sanityUser?.favoriteTitles?.includes(mangaID),
                                    'cursor-pointer': !sanityUser?.favoriteTitles?.includes(mangaID)
                                }" aria-label="Favori" size="icon">
                                    <Icon v-if="!isFavoriteLoading" icon="material-symbols:heart-check-outline-rounded"
                                        class="ml-6" />
                                    <Icon name="svg-spinners:270-ring" class="text-primary" />
                                </Button>
                            </div>
                        </div>

                        <!-- Konu -->
                        <Card>
                            <CardHeader>
                                <CardTitle>Konu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea class="h-24">
                                    <p class="text-sm text-gray-700 dark:text-gray-300">
                                        {{ sanityData[0]?.description || manga?.synopsis || 'Açıklama bulunamadı' }}
                                    </p>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <!-- Notlar -->
                        <Card v-if="sanityData[0]?.notes">
                            <CardHeader>
                                <CardTitle>Notlar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea class="h-24 text-sm">
                                    <SanityContent :blocks="sanityData[0].notes" />
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <!-- Bölümler -->
                        <Card v-if="groupedChapters.length > 0" class="mb-2">
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <CardTitle>Bölümler</CardTitle>
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
                                    <!-- Gruplanmış görünüm -->
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

                                    <!-- Gruplanmamış görünüm -->
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
            </div>
        </div>
    </main>
</template>