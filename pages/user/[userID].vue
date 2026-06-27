<script setup>
import { Icon } from '@iconify/vue';
import imageUrlBuilder from "@sanity/image-url";

const route = useRoute();
const sanityConfig = useSanity().config;
const builder = imageUrlBuilder(sanityConfig);
const loggedUser = useLogtoUser();

const query = groq`*[logtoId == "${route.params.userID}"] {
    ...,
    userFollowers[]-> {
        logtoId,
        avatar,
        name,
    },
    userFollows[]-> {
        logtoId,
        avatar,
        name,
    }
}`;

const { data: user } = await useSanityQuery(query)

const isMe = Boolean(loggedUser) ? loggedUser.sub == route.params.userID : false

const router = useRouter();
const goBack = () => {
    router.back();
};

const isAlertDialogOpen = ref(false);
const modalTitle = ref('');
const modalUsers = ref([]);

const openFollowModal = (type) => {
    if (type === 'followers') {
        modalTitle.value = 'Takipçiler';
        modalUsers.value = user.value[0].userFollowers || [];
    } else if (type === 'following') {
        modalTitle.value = 'Takip Edilenler';
        modalUsers.value = user.value[0].userFollows || [];
    }
    isAlertDialogOpen.value = true;
};

const closeAlertDialog = () => {
    isAlertDialogOpen.value = false;
    modalTitle.value = '';
    modalUsers.value = [];
};

const userBookcase = ref({
    "reading": [],
    "completed": [],
    "onHold": [],
    "dropped": [],
    "planned": [],
    "rereading": [],
});

const selectedProgressStatus = ref('reading');

const isLoadingBookcase = ref(true);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

try {
    if (user.value && user.value[0]?.bookcase) {
        for (const status in user.value[0].bookcase) {
            if (user.value[0].bookcase[status]) {
                const items = toRaw(user.value[0].bookcase[status]);
                userBookcase.value[status] = await Promise.all(items.map(async (item, index) => {
                    await sleep(index * 500);

                    try {
                        const response = await fetch(`https://api.jikan.moe/v4/manga/${item.id}`);
                        if (!response.ok) {
                            console.error(`Jikan API'den veri çekilemedi: ${response.status} ${response.statusText}`);
                            return null;
                        }
                        const jikanData = await response.json();
                        if (jikanData.data) {
                            return {
                                myAnimeListId: jikanData.data.mal_id,
                                title: jikanData.data.title,
                                description: jikanData.data.synopsis,
                                coverImage: {
                                    asset: {
                                        _ref: jikanData.data.images?.jpg?.image_url || 'https://placehold.co/250x350/cccccc/333333?text=Resim+Yok'
                                    }
                                }
                            };
                        }
                    } catch (error) {
                        console.error("Jikan API çağrısı sırasında hata oluştu:", error);
                    }
                    return null;
                }));
                userBookcase.value[status] = userBookcase.value[status].filter(item => item !== null);
            }
        }
    }
} finally {
    isLoadingBookcase.value = false;
}

const filteredBookcase = computed(() => {
    return userBookcase.value[selectedProgressStatus.value] || [];
});

const handleSelectChange = (value) => {
    selectedProgressStatus.value = value;
};
</script>

<template>
    <main v-if="user && user[0]">
        <div class="relative h-96 w-full overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
            <div class="absolute inset-0 bg-background z-10 opacity-50"></div>
            <img :src="user[0].banner ? builder.image(user[0].banner.asset._ref).auto('format').url() :
                'https://cdn.sanity.io/images/1yge7tlr/production/71efea64a9adc5415bdbb834cb959b0e66890688-480x270.gif'"
                class="w-full h-full object-cover opacity-75" />
        </div>

        <div class="container mx-auto px-10 -mt-40 relative z-20">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="w-48">
                    <Card class="py-0 rounded-xl transition ease-in-out hover:-translate-y-1 duration-300">
                        <img :src="user[0].avatar || 'https://cdn.sanity.io/images/1yge7tlr/production/821814e4761213a1b38eb14df3946a5c34336d20-600x600.png'"
                            class="w-full rounded-xl" />
                    </Card>
                </div>
                <div class="w-full md:w-3/4 space-y-6">
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight">{{ user[0].name }}</h1>
                        <p class="text-lg text-gray-600 dark:text-gray-400">@{{ user[0].username }}</p>
                        <p>{{ user[0].bio || '' }}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button variant="secondary" class="gap-2 cursor-pointer shadow-lg"
                        @click="openFollowModal('followers')">
                        <Icon icon="mdi:account-arrow-left-outline" />
                        {{ user[0]['userFollowers'] ? user[0]['userFollowers'].length : '0' }} Takipçi
                    </Button>
                    <Button variant="secondary" class="gap-2 cursor-pointer shadow-lg"
                        @click="openFollowModal('following')">
                        <Icon icon="mdi:account-arrow-right-outline" />
                        {{ user[0]['userFollows'] ? user[0]['userFollows'].length : '0' }} Takip
                    </Button>
                    <Button variant="outline" v-if="isMe" class="gap-2 cursor-pointer shadow-lg">
                        <Icon icon="material-symbols:person-edit-outline-rounded" />
                        Profili Düzenle
                    </Button>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-10 mt-6">
            <Tabs default-value="bookcase" class="flex flex-row gap-6">
                <TabsList class="relative w-10 h-72 bg-sidebar border border-secondary">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="transform -rotate-90 origin-center flex flex-row space-x-2">
                            <TabsTrigger value="bookcase"
                                class="whitespace-nowrap bg-sidebar active:bg-sidebar border-0">Kitaplık
                            </TabsTrigger>
                            <TabsTrigger value="library"
                                class="whitespace-nowrap bg-sidebar active:bg-sidebar border-0">Kütüphane
                            </TabsTrigger>
                            <TabsTrigger value="history"
                                class="whitespace-nowrap bg-sidebar active:bg-sidebar border-0">Geçmiş
                            </TabsTrigger>
                        </div>
                    </div>
                </TabsList>

                <TabsContent value="bookcase" class="flex-1 p-4 border rounded-xl">
                    <span class="flex flex-row items-center mb-4">
                        <h3 class="text-2xl font-semibold">Kitaplık</h3>
                        <span class="grow" />
                        <Select v-model="selectedProgressStatus" @update:model-value="handleSelectChange">
                            <SelectTrigger class="w-full max-w-3xs">
                                <SelectValue placeholder="İlerleme Durumu Seç" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>İlerleme Durumları</SelectLabel>
                                    <SelectItem value="reading">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="material-symbols:play-arrow" /> Okunuyor
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="material-symbols:bookmark-added" /> Tamamlandı
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="onHold">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="material-symbols:pause" /> Beklemede
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="dropped">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="material-symbols:tab-close-inactive-rounded" /> Bırakıldı
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="planned">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="mingcute:pin-fill" /> Planlandı
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="rereading">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="material-symbols:autoplay-rounded" /> Yeniden Okunuyor
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </span>

                    <Loading v-if="isLoadingBookcase" class="py-10" type="default" what="Kitaplık İçeriği" />
                    <div v-else-if="filteredBookcase.length > 0">
                        <div class="flex flex-wrap flex-row gap-3">
                            <DefaultCard v-for="book in filteredBookcase" :key="book.myAnimeListId"
                                :cover="book.coverImage.asset._ref" :title="book.title" :id="book.mal_id"
                                :type="book.type" />
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
                        Bu kategoride henüz içerik bulunmamaktadır.
                    </div>
                </TabsContent>
                <TabsContent value="library" class="flex-1 p-4 border rounded-xl">
                    <h3 class="text-2xl font-semibold mb-4">Kütüphane</h3>
                    <p>Burada kullanıcının kütüphane bilgileri yer alacak.</p>
                </TabsContent>
                <TabsContent value="history" class="flex-1 p-4 border rounded-xl">
                    <h3 class="text-2xl font-semibold mb-4">Okuma Geçmişi</h3>
                    <p>Burada kullanıcının okuma geçmişi yer alacak.</p>
                </TabsContent>
            </Tabs>
        </div>
        <AlertDialog :open="isAlertDialogOpen" @update:open="isAlertDialogOpen = $event">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{{ modalTitle }}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div v-if="modalUsers.length > 0" class="space-y-3 max-h-[60vh] overflow-y-auto">
                        <NuxtLink :to="`/user/${followerUser.logtoId}`" v-for="followerUser in modalUsers"
                            :key="followerUser.logtoId"
                            class="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                            <img :src="followerUser.avatar" class="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold">{{ followerUser.name }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">@{{ followerUser.logtoId }}</p>
                            </div>
                        </NuxtLink>
                    </div>
                    <div v-else class="text-center text-gray-500 dark:text-gray-400">
                        Henüz {{ modalTitle.toLowerCase() }} bulunmamaktadır.
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="closeAlertDialog">Kapat</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </main>
</template>
