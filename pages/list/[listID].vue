<script setup>
import { Icon } from '@iconify/vue';
import { toast } from 'vue-sonner';

const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);
const isFav = ref(false);
const isFavLoading = ref(false);
const user = useLogtoUser();

const showLikesModal = ref(false);
const showMessageModalState = ref(false);
const messageModalTitle = ref('');
const messageModalContent = ref('');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sanity = useSanity();
const route = useRoute();
const router = useRouter();

async function fetchData() {
    loading.value = true;
    try {
        // GÜNCELLEME: 'likes' referanslarını çözerken logtoId verisini de projeksiyona ekledik.
        const query = groq`
          *[_type == "lists" && _id == $listID][0]{
            ...,
            user->{_id, logtoId, name, avatar, username},
            "likes": likes[]->{
              _id,
              name,
              avatar,
              username,
              logtoId
            }
          }
        `;

        const rawClient = sanity.client || sanity;
        const sanityList = await rawClient.withConfig({ useCdn: false }).fetch(query, { listID: route.params.listID });
        list.value = sanityList;

        // Beğeni durumunu veritabanından gelen güncel 'likes' dizisi üzerinden kontrol ediyoruz.
        if (user?.sub && Array.isArray(list.value?.likes)) {
            isFav.value = list.value.likes.some(u => u.logtoId === user.sub);
        } else {
            isFav.value = false;
        }

        if (list.value?.items?.length) {
            const sortedItems = [...list.value.items]
                .sort((a, b) => {
                    const idxA = a.item && a.item[1] !== undefined ? a.item[1] : 0;
                    const idxB = b.item && b.item[1] !== undefined ? b.item[1] : 0;
                    return idxA - idxB;
                })
                .map((item) => ({ id: item.item[0], index: item.item[1] }));

            const fetchedMangaData = [];
            for (const item of sortedItems) {
                try {
                    await delay(1000);
                    const res = await fetch(`https://api.jikan.moe/v4/manga/${item.id}`);
                    if (!res.ok) {
                        fetchedMangaData.push({ mal_id: item.id, error: `Manga yüklenemedi` });
                    } else {
                        const json = await res.json();
                        fetchedMangaData.push(json.data);
                    }
                } catch (e) {
                    fetchedMangaData.push({ mal_id: item.id, error: `Hata oluştu` });
                }
            }
            itemsData.value = fetchedMangaData;
        }
    } catch (err) {
        console.error("Veri çekme hatası:", err);
        toast.error("Hata", { description: "Liste yüklenirken bir hata oluştu." });
    } finally {
        loading.value = false;
    }
}

async function favList() {
    if (!user?.sub) {
        toast.error("Hata", { description: "Giriş yapmanız gerekmektedir." });
        return;
    }

    isFavLoading.value = true;
    try {
        const action = isFav.value ? 'remove' : 'add';
        const response = await $fetch('/api/user/list-like', {
            method: 'POST',
            body: { listId: list.value._id, logtoId: user.sub, action: action }
        });

        if (response.success) {
            isFav.value = !isFav.value;
            // Güncel likes dizisini backend'den gelen yanıtla senkronize ediyoruz.
            list.value.likes = response.likes;
            toast.success(action === 'add' ? "Beğenildi" : "Beğenmekten vazgeçildi");
        } else {
            throw new Error(response.message || "İşlem başarısız.");
        }
    } catch (error) {
        toast.error("Hata", { description: "Beğeni güncellenemedi." });
    } finally {
        isFavLoading.value = false;
    }
}

function handleLikeClick() {
    if (user?.sub === list.value?.user?.logtoId) {
        showLikesModal.value = true;
    } else {
        favList();
    }
}

onMounted(fetchData);

useSeoMeta({
    title: () => list.value?.title ? `${list.value.title}` : "Liste",
    ogTitle: () => list.value?.title ? `${list.value.title}` : "Liste",
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
    ogDescription: "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
});
</script>

<template>
    <main class="container px-4 py-8 mt-20">
        <div v-if="list" class="mb-8">
            <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div class="w-full">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
                        {{ list.title || "Liste Başlığı" }}
                    </h2>

                    <div class="mt-4 flex items-center gap-4">
                        <NuxtLink :to="`/user/${list.user?.logtoId}`" class="flex items-center gap-2 hover:underline">
                            <img :src="list.user?.avatar || 'https://placehold.co/32x32/cccccc/ffffff?text=AV'"
                                :alt="list.user?.name || 'Kullanici'" class="w-8 h-8 rounded-full object-cover">
                            <span>{{ list.user?.name || "Kullanici" }}</span>
                        </NuxtLink>

                        <span class="text-muted-foreground text-sm">
                            {{ new Date(list._createdAt).toLocaleDateString() }}
                        </span>

                        <Button @click="handleLikeClick" :disabled="isFavLoading" class="flex items-center gap-1 text-sm cursor-pointer disabled:opacity-50" variant="ghost">
                            <Icon v-if="isFavLoading" icon="svg-spinners:270-ring" class="w-4 h-4" />
                            <Icon v-else :icon="isFav ? 'mdi:heart' : 'mdi:heart-outline'" />
                            <span>{{ list.likes?.length || '?' }}</span>
                        </Button>
                    </div>
                </div>

                <div v-if="user?.sub === list.user?.logtoId" class="flex gap-2 whitespace-nowrap">
                    <Button variant="outline" @click="goToEdit">
                        <Icon icon="mdi:pencil" class="mr-2" />
                        Düzenle
                    </Button>
                </div>
            </div>

            <p v-if="list.description" class="mt-4 text-muted-foreground">
                {{ list.description }}
            </p>
        </div>

        <Loading v-if="loading" class="w-full h-96" type="default" what="Liste İçeriği" />

        <div v-else-if="itemsData.length > 0" class="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
            <div v-for="(item, index) in itemsData" :key="item.mal_id || `error-${index}`"
                class="flex gap-4 items-start">
                <template v-if="item.error">
                    <div
                        class="border rounded-lg p-4 flex flex-col items-center justify-center w-56 h-[380px] bg-sidebar text-primary shadow-md">
                        <Icon icon="mdi:alert-circle-outline" class="w-12 h-12 mb-2 text-red-400" />
                        <p class="text-center text-sm font-semibold mb-3">{{ item.error }}</p>
                        <Button @click="fetchData" variant="default" size="sm">Tekrar Dene</Button>
                    </div>
                </template>
                <template v-else>
                    <DefaultCard
                        :cover="item.images?.webp?.large_image_url || 'https://placehold.co/192x272/e0e0e0/505050?text=No+Image'"
                        :title="item.title || 'Baslik Yok'"
                        :type="item.type?.replace('Light Novel', 'Hafif Roman').replace('Novel', 'Roman') || 'Tur Yok'"
                        :id="item.mal_id" class="flex-1" />
                </template>
            </div>
        </div>

        <div v-else class="w-full text-center py-12">
            <Icon icon="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto text-yellow-500" />
            <p class="mt-4 text-lg text-muted-foreground">Listede gösterilecek içerik bulunamadı.</p>
        </div>

        <!-- Beğenenler Modalı -->
        <Dialog v-model:open="showLikesModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bu listeyi beğenenler</DialogTitle>
                    <DialogDescription>Bu listeyi beğenen kullanıcıları görüyorsunuz.</DialogDescription>
                </DialogHeader>

                <div v-if="list?.likes?.length" class="mt-4 space-y-3 max-h-60 overflow-y-auto">
                    <NuxtLink v-for="like in list.likes" :key="like._id" :to="`/user/${like.logtoId}`"
                        class="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                        <img :src="like.avatar || 'https://placehold.co/40x40/cccccc/ffffff?text=AV'" :alt="like.name"
                            class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="font-medium">{{ like.name }}</p>
                            <p class="text-sm text-muted-foreground">@{{ like.username }}</p>
                        </div>
                    </NuxtLink>
                </div>

                <div v-else class="mt-4 text-center py-6 text-muted-foreground">
                    Henüz kimse bu listeyi beğenmemiş.
                </div>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button type="button" variant="secondary" @click="closeLikesModal">
                            Kapat
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Mesaj Modalı -->
        <Dialog v-model:open="showMessageModalState">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ messageModalTitle }}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p>{{ messageModalContent }}</p>
                </DialogDescription>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button type="button" variant="secondary" @click="closeMessageModal">
                            Kapat
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </main>
</template>