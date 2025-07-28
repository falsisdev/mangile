<script setup>
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const sanity = useSanity();

// List data and state variables
const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);
const isFav = ref(false);
const user = useLogtoUser();
const likesModal = ref(null);
const messageModal = ref(null); // New ref for the generic message modal

// Function to fetch list data and associated manga items
async function fetchData() {
    loading.value = true; // Set loading to true at the start of data fetching
    try {
        // Sanity query to fetch list details, user info, and likes
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

        // Fetch list data from Sanity
        const sanityList = await sanity.fetch(query, { listID: route.params.listID });
        list.value = sanityList;

        // Determine if the current user has favorited this list
        if (user?.sub && list.value?.likes) {
            isFav.value = list.value.likes.some(u => u._id === user.sub);
        } else {
            isFav.value = false;
        }

        // If the list has items, fetch their details from Jikan API
        if (list.value?.items?.length) {
            // Sort items by their index for consistent display order
            const sortedItems = [...list.value.items]
                .sort((a, b) => a.item[1] - b.item[1])
                .map((item) => ({ id: item.item[0], index: item.item[1] }));

            // Prepare an array of promises for fetching each manga's data
            const mangaRequests = sortedItems.map(async (item) => {
                try {
                    const res = await fetch(`https://api.jikan.moe/v4/manga/${item.id}`);
                    // Check if the response was successful (HTTP status 200-299)
                    if (!res.ok) {
                        console.error(`Jikan API error for Manga ID ${item.id}: ${res.status} ${res.statusText}`);
                        // Return an error object instead of null for failed fetches
                        return { mal_id: item.id, error: `Failed to load manga (ID: ${item.id})` };
                    }
                    const json = await res.json();
                    return json.data;
                } catch (e) {
                    // Catch network errors or other exceptions during fetch
                    console.error(`Manga ID ${item.id} fetch hatası:`, e);
                    return { mal_id: item.id, error: `Error fetching manga (ID: ${item.id})` };
                }
            });

            // Wait for all manga requests to complete and populate itemsData
            // No need for .filter(Boolean) anymore as error objects are returned
            itemsData.value = await Promise.all(mangaRequests);
        } else {
            itemsData.value = []; // No items in the list
        }
    } catch (err) {
        console.error("Fetch Hatası:", err); // Log any errors during the main fetch process
    } finally {
        loading.value = false; // Set loading to false once all data (or errors) are processed
    }
}

// Function to handle favoriting/unfavoriting a list
// This function now uses a custom modal instead of alert()
function favList() {
    if (isFav.value) {
        showMessageModal("Favoriden Kaldırma", "Favoriden kaldırma işlemi Sanity backend ile entegre edilmeli.");
    } else {
        showMessageModal("Favorileme", "Favorileme işlemi Sanity backend ile entegre edilmeli.");
    }
}

// Handles click on the like button. Opens likes modal if user is owner, otherwise calls favList.
function handleLikeClick() {
    if (user?.sub === list.value?.user?._id) {
        if (likesModal.value) {
            likesModal.value.showModal(); // Show modal if the current user owns the list
        }
    } else {
        favList(); // Otherwise, attempt to favorite/unfavorite the list
    }
}

// Closes the likes modal
function closeModal() {
    if (likesModal.value) {
        likesModal.value.close();
    }
}

// Functions for the new generic message modal
function showMessageModal(title, content) {
    if (messageModal.value) {
        // Set the title and content of the modal dynamically
        document.getElementById('messageModalTitle').innerText = title;
        document.getElementById('messageModalContent').innerText = content;
        messageModal.value.showModal();
    }
}

function closeMessageModal() {
    if (messageModal.value) {
        messageModal.value.close();
    }
}

// Fetch data when the component is mounted
onMounted(fetchData);

// SEO settings for the page
useSeoMeta({
    title: () => list.value?.title ? `${list.value.title}` : "Liste",
    ogTitle: () => list.value?.title ? `${list.value.title}` : "Liste",
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
    ogDescription: "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
});
</script>

<template>
    <main class="container px-4 py-8 mt-20">
        <!-- List Title and Information Section -->
        <div v-if="list" class="mb-8">
            <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div class="w-screen">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
                        {{ list.title || "Liste Başlığı" }}
                    </h2>

                    <div class="mt-4 flex items-center gap-4">
                        <!-- User Profile Link (currently commented out) -->
                        <NuxtLink :to="`${'' /*'/user/' + list.user.logtoId*/}`"
                            class="flex items-center gap-2 hover:underline">
                            <img :src="list.user?.avatar || 'https://placehold.co/32x32/cccccc/ffffff?text=AV'"
                                :alt="list.user?.name || 'Kullanıcı'" class="w-8 h-8 rounded-full object-cover">
                            <span>{{ list.user?.name || "Kullanıcı" }}</span>
                        </NuxtLink>

                        <!-- List Creation Date -->
                        <span class="text-muted-foreground text-sm">
                            {{ new Date(list._createdAt).toLocaleDateString() }}
                        </span>

                        <!-- Like Button and Count -->
                        <button @click="handleLikeClick" class="flex items-center gap-1 text-sm"
                            :class="isFav ? 'text-red-500' : 'text-muted-foreground'">
                            <Icon :icon="isFav ? 'mdi:heart' : 'mdi:heart-outline'" />
                            <span>{{ list.likes?.length || 0 }}</span>
                        </button>
                    </div>
                </div>

                <!-- Edit Button (visible only to list owner) -->
                <div v-if="user?.sub === list.user?._id" class="flex gap-2">
                    <Button variant="outline">
                        <Icon icon="mdi:pencil" class="mr-2" />
                        Düzenle
                    </Button>
                </div>
            </div>

            <!-- List Description -->
            <p v-if="list.description" class="mt-4 text-muted-foreground">
                {{ list.description }}
            </p>
        </div>

        <!-- Loading State Indicator -->
        <div v-if="loading" class="w-full h-96 flex items-center justify-center">
            <Icon name="svg-spinners:180-ring" class="w-12 h-12 text-primary" />
        </div>

        <!-- Content Display Section -->
        <div v-else-if="itemsData.length > 0" class="flex flex-row flex-wrap gap-6 justify-center md:justify-start">
            <!-- Iterates through itemsData to display each manga or an error card -->
            <div v-for="(item, index) in itemsData" :key="item.mal_id || `error-${index}`"
                class="flex gap-4 items-start">
                <template v-if="item.error">
                    <div
                        class="border rounded-lg p-4 flex flex-col items-center justify-center w-56 h-[400px] bg-sidebar text-primary shadow-md">
                        <Icon icon="mdi:alert-circle-outline" class="w-12 h-12 mb-2 text-red-400" />
                        <p class="text-center text-sm font-semibold">{{ item.error }}</p>
                        <p class="text-xs mt-1">ID: {{ item.mal_id }}</p>
                        <Button @click="fetchData" variant="default">
                            Tekrar Dene
                        </Button>
                    </div>
                </template>
                <template v-else>
                    <DefaultCard
                        :cover="item.images?.webp?.large_image_url || 'https://placehold.co/192x272/e0e0e0/505050?text=No+Image'"
                        :title="item.title || 'Başlık Yok'"
                        :type="item.type?.replace('Light Novel', 'Hafif Roman').replace('Novel', 'Roman') || 'Tür Yok'"
                        :id="item.mal_id" class="flex-1" />
                </template>
            </div>
        </div>


        <!-- No Content Found Message -->
        <div v-else class="w-full text-center py-10">
            <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto text-yellow-500" />
            <p class="mt-4 text-lg">Listede gösterilecek içerik bulunamadı</p>
        </div>

        <!-- Beğenenler Modal (Likes Modal) -->
        <dialog ref="likesModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Bu listeyi beğenenler</h3>

                <div v-if="list?.likes?.length" class="mt-4 space-y-3">
                    <NuxtLink v-for="like in list.likes" :key="like._id"
                        :to="`${''/*'/profil/' + like.username || like._id*/}`"
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
                    Henüz kimse bu listeyi beğenmemiş
                </div>

                <div class="modal-action">
                    <button @click="closeModal" class="btn">Kapat</button>
                </div>
            </div>
        </dialog>

        <!-- Generic Message Modal (for alerts) -->
        <dialog ref="messageModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg" id="messageModalTitle"></h3>
                <p class="py-4" id="messageModalContent"></p>
                <div class="modal-action">
                    <button @click="closeMessageModal" class="btn">Kapat</button>
                </div>
            </div>
        </dialog>
    </main>
</template>
