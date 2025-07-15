<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const sanity = useSanity();

const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);

const isFav = ref(false);
const user = useLogtoUser();

const likesModal = ref(null);

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

function favList() {
  if (isFav.value) {
    alert("Favoriden kaldırma işlemi Sanity backend ile entegre edilmeli.");
  } else {
    alert("Favorileme işlemi Sanity backend ile entegre edilmeli.");
  }
}

function handleLikeClick() {
  if (user?.sub === list.value?.user?._id) {
    // Liste sahibi ise modal aç
    if (likesModal.value) {
      likesModal.value.showModal();
    }
  } else {
    // Değilse favori işlemini yap
    favList();
  }
}

function closeModal() {
  if (likesModal.value) {
    likesModal.value.close();
  }
}

onMounted(fetchData);
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <Icon name="mingcute:loading-line" class="animate-spin w-32 h-32" />
  </div>

  <main v-else-if="list !== null">
    <div v-if="list === 'nil'">
      <article class="prose max-w-none">
        <h1>Üzgünüz</h1>
        Veri tabanında belirtilen bilgileri sağlayan bir liste yok.
      </article>
    </div>
    <div v-else>
      <article class="prose max-w-none lg:flex lg:flex-row lg:mx-0 mx-2 items-center">
        <span>
          <h1 class="-mb-1">{{ list.title }}</h1>
          <span class="lg:flex lg:flex-row lg:mb-6 mt-2">
            <span> {{ new Date(list.createdAt).toLocaleDateString() }} tarihinde </span>
            <NuxtLink
              v-if="list.user"
              :to="`/user/${list.user.logtoId}`"
              class="lg:badge lg:badge-neutral lg:badge-lg lg:mt-1 mt-2 mx-1 no-underline flex items-center gap-2"
            >
              <img
                :src="list.user.avatar || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'"
                class="avatar w-5 shadow-lg rounded-full"
              />
              {{ list.user.name || list.user.username }}
            </NuxtLink>
            <span v-if="list.user"> tarafından oluşturuldu. </span>
          </span>
        </span>
        <span class="grow" />
        <span>
          <button class="btn btn-ghost lg:mt-5" @click="handleLikeClick">
            <Icon :name="isFav ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" />
            {{ list.likes?.length || 0 }}
          </button>
        </span>
      </article>

      <dialog ref="likesModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Beğenenler</h2>
          <ul class="menu rounded-box -ml-5 max-h-60 overflow-y-auto">
            <li v-for="userLike in list.likes" :key="userLike._id" class="mb-1">
              <NuxtLink
                :to="`/user/${userLike._id}`"
                class="flex items-center gap-2"
              >
                <img
                  :src="userLike.avatar || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'"
                  class="avatar w-5 shadow-lg rounded-full"
                />
                {{ userLike.name || userLike.username }}
              </NuxtLink>
            </li>
          </ul>
          <div class="modal-action">
            <button class="btn btn-ghost" @click="closeModal">Kapat</button>
          </div>
        </div>
      </dialog>

      <div class="divider lg:-mt-6" />

      <div v-if="itemsData.length > 0" class="flex flex-row flex-wrap ">
        <DefaultCard
          v-for="title of itemsData"
          :key="title.mal_id || title.id"
          :itemData="title"
          type="search"
        />
      </div>
      <div v-else>
        <p>Bu listede içerik bulunmamaktadır.</p>
      </div>
    </div>
  </main>

  <div v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </div>
</template>
