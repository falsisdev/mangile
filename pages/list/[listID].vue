<script setup>
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const sanity = useSanity();

// Liste verileri
const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);
const isFav = ref(false);
const user = useLogtoUser();
const likesModal = ref(null);

// Liste verilerini çek
async function fetchData() {
    loading.value = true;
    try {
        const query = groq`
      *[_type == "lists" && _id == $listID][0]{
        ...,
        user->{logtoId, name, avatar, username},
        likes[]->{
          _id,
          name,
          avatar,
          username
        }
      }
    `;

        const sanityList = await sanity.fetch(query, { listID: route.params.listID });
        list.value = sanityList;

        if (user?.sub && list.value?.likes) {
            isFav.value = list.value.likes.some(u => u._id === user.sub);
        } else {
            isFav.value = false;
        }

        if (list.value?.items?.length) {
            const sortedItems = [...list.value.items]
                .sort((a, b) => a.item[1] - b.item[1])
                .map((item) => ({ id: item.item[0], index: item.item[1] }));

            const mangaRequests = sortedItems.map(async (item) => {
                try {
                    const res = await fetch(`https://api.jikan.moe/v4/manga/${item.id}`);
                    const json = await res.json();
                    return json.data;
                } catch (e) {
                    console.error(`Manga ID ${item.id} fetch hatası:`, e);
                    return null;
                }
            });

            itemsData.value = (await Promise.all(mangaRequests)).filter(Boolean);
        } else {
            itemsData.value = [];
        }
    } catch (err) {
        console.error("Fetch Hatası:", err);
    } finally {
        loading.value = false;
    }
}

// Favori işlemleri
function favList() {
    if (isFav.value) {
        alert("Favoriden kaldırma işlemi Sanity backend ile entegre edilmeli.");
    } else {
        alert("Favorileme işlemi Sanity backend ile entegre edilmeli.");
    }
}

function handleLikeClick() {
    if (user?.sub === list.value?.user?._id) {
        if (likesModal.value) {
            likesModal.value.showModal();
        }
    } else {
        favList();
    }
}

function closeModal() {
    if (likesModal.value) {
        likesModal.value.close();
    }
}

onMounted(fetchData);

// SEO Ayarları
useSeoMeta({
    title: () => list.value?.title ? `${list.value.title}` : "Liste",
    ogTitle: () => list.value?.title ? `${list.value.title}` : "Liste",
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
    ogDescription: "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
});
</script>

<template>
    <main class="container px-4 py-8 mt-20"">
            <!-- Liste Başlık ve Bilgiler -->
            <div v-if="list" class="mb-8">
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div class="w-screen">
                <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
                    {{ list.title || "Liste Başlığı" }}
                </h2>

                <div class="mt-4 flex items-center gap-4">
                    <NuxtLink :to="`/profil/${list.user.logtoId}`" class="flex items-center gap-2 hover:underline">
                        <img :src="list.user?.avatar || '/default-avatar.jpg'" :alt="list.user?.name || 'Kullanıcı'"
                            class="w-8 h-8 rounded-full object-cover">
                        <span>{{ list.user?.name || "Kullanıcı" }}</span>
                    </NuxtLink>

                    <span class="text-muted-foreground text-sm">
                        {{ new Date(list._createdAt).toLocaleDateString() }}
                    </span>

                    <button @click="handleLikeClick" class="flex items-center gap-1 text-sm"
                        :class="isFav ? 'text-red-500' : 'text-muted-foreground'">
                        <Icon :icon="isFav ? 'mdi:heart' : 'mdi:heart-outline'" />
                        <span>{{ list.likes?.length || 0 }}</span>
                    </button>
                </div>
            </div>

            <div v-if="user?.sub === list.user?._id" class="flex gap-2">
                <Button variant="outline">
                    <Icon icon="mdi:pencil" class="mr-2" />
                    Düzenle
                </Button>
            </div>
        </div>

        <!-- Liste Açıklaması -->
        <p v-if="list.description" class="mt-4 text-muted-foreground">
            {{ list.description }}
        </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="w-full h-96 flex items-center justify-center">
            <Icon name="svg-spinners:180-ring" class="w-12 h-12 text-primary" />
        </div>

        <!-- İçerik -->
        <div v-else-if="itemsData.length > 0" class="flex flex-row gap-6">
            <!-- Sıralı Liste -->
            <div v-for="(item, index) in itemsData" :key="item.mal_id" class="flex gap-4 items-start">
                <DefaultCard :cover="item.images?.webp?.large_image_url" :title="item.title || 'Başlık Yok'"
                    :type="item.type?.replace('Light Novel', 'Hafif Roman').replace('Novel', 'Roman') || 'Tür Yok'"
                    :id="item.mal_id" class="flex-1" />
            </div>
        </div>

        <div v-else class="w-full text-center py-10">
            <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto text-yellow-500" />
            <p class="mt-4 text-lg">Listede gösterilecek içerik bulunamadı</p>
        </div>

        <!-- Beğenenler Modal -->
        <dialog ref="likesModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Bu listeyi beğenenler</h3>

                <div v-if="list?.likes?.length" class="mt-4 space-y-3">
                    <NuxtLink v-for="like in list.likes" :key="like._id" :to="`/profil/${like.username || like._id}`"
                        class="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                        <img :src="like.avatar || '/default-avatar.jpg'" :alt="like.name"
                            class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="font-medium">{{ like.name }}</p>
                            <p class="text-sm text-muted-foreground">@{{ like.username }}</p>
                        </div>
                    </NuxtLink>
                </div>

                <div v-else class="mt-4 text-center py-6 text-muted-foreground">
                    Henüz kimse bu listeyi beğenmemiş
                </div>

                <div class="modal-action">
                    <button @click="closeModal" class="btn">Kapat</button>
                </div>
            </div>
        </dialog>
    </main>
</template>