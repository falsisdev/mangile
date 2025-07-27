<script setup>
import { toRaw } from 'vue';
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
const { data: user } = useSanityQuery(query)

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

            <Button variant="secondary" class="absolute top-2 left-7 z-20 cursor-pointer" @click="goBack">
                <Icon icon="material-symbols:arrow-back-ios-rounded" class="ml-2" />
            </Button>
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
                        {{ user[0]['userFollowers'].length }} Takipçi
                    </Button>
                    <Button variant="secondary" class="gap-2 cursor-pointer shadow-lg"
                        @click="openFollowModal('following')">
                        <Icon icon="mdi:account-arrow-right-outline" />
                        {{ user[0]['userFollows'].length }} Takip
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
                    <span class="flex flex-row">
                        <h3 class="text-2xl font-semibold mb-4">Kitaplık</h3>
                        <span class="grow" />
                        <Select>
                            <SelectTrigger class="w-full max-w-3xs">
                                <SelectValue placeholder="İlerleme Durumu Seç" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>İlerleme Durumları</SelectLabel>
                                    <SelectItem value="reading">
                                        <Icon icon="material-symbols:play-arrow" /> Okunuyor
                                    </SelectItem>
                                    <SelectItem value=" completed">
                                        <Icon icon="material-symbols:bookmark-added" /> Tamamlandı
                                    </SelectItem>
                                    <SelectItem value="onHold">
                                        <Icon icon="material-symbols:pause" /> Beklemede
                                    </SelectItem>
                                    <SelectItem value="dropped">
                                        <Icon icon="material-symbols:tab-close-inactive-rounded" /> Bırakıldı
                                    </SelectItem>
                                    <SelectItem value="planned">
                                        <Icon icon="mingcute:pin-fill" /> Planlandı
                                    </SelectItem>
                                    <SelectItem value="rereading">
                                        <Icon icon="material-symbols:autoplay-rounded" /> Yeniden Okunuyor
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </span>
                    Burada kullanıcının kitaplığı yer alacak.
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

        <!-- Follower/Following AlertDialog -->
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
