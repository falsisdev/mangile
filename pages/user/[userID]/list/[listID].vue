<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const userData = ref(null);
const list = ref(null);
const itemsData = ref([]);
const loading = ref(true);
const user = useLogtoUser();

const likedUsers = ref([]);
const isFav = ref(null);
const loggedUserData = ref(null);

async function fetchData(retry = 3) {
  loading.value = true;
  try {
    const { data: response } = await useFetch(
      `/api/users/${route.params.userID}?appSecret=${config.public.m2mAppSecret}`
    );

    const { data: ress } = await useFetch(
      `/api/users/${user.sub}?appSecret=${config.public.m2mAppSecret}`
    );

    if (!response.value) {
      if (retry > 0) {
        setTimeout(() => fetchData(retry - 1), 1000); // 1 saniye sonra tekrar dene
      }
      return;
    }

    userData.value = response.value;
    loggedUserData.value = ress.value;
    const userLists = userData.value.customData?.userLists ?? [];

    isFav.value = loggedUserData.value.customData.userFavLists.includes(
      route.params.userID + "/" + route.params.listID
    );

    const selectedList = userLists.find(
      (item) => item.key === route.params.listID
    );
    list.value = selectedList || "nil";

    if (list.value != "nil" && list.value.favs?.length) {
      for (let item of list.value.favs) {
        const { data: res } = await useFetch(
          `/api/users/${item}?appSecret=${config.public.m2mAppSecret}`
        );

        likedUsers.value.push(res.value);
      }
    }
    if (list.value !== "nil" && list.value.items?.length) {
      const sortedItems = list.value.items.sort((a, b) => a.index - b.index);
      const mangaRequests = sortedItems.map((manga) =>
        $fetch(`https://api.jikan.moe/v4/manga/${manga.id}`).then(
          (res) => res.data
        )
      );
      itemsData.value = await Promise.all(mangaRequests);
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  } finally {
    loading.value = false;
  }
}

async function favList() {
  if (isFav.value) {
    //favoriyi kaldır
  } else {
    //favorile
  }
}

onMounted(fetchData);
</script>

<template>
  <main v-if="!loading && list !== null">
    <div v-if="list === 'nil'">
      <article class="prose max-w-none">
        <h1>Üzgünüz</h1>
        Veri tabanında belirtilen bilgileri sağlayan bir liste yok.
      </article>
    </div>
    <div v-else>
      <article class="prose max-w-none flex flex-row">
        <span>
          <h1 class="-mb-1">{{ list.title }}</h1>
          <span class="flex flex-row mb-6 mt-2">
            <span> {{ list.createdAt }} tarihinde </span>
            <NuxtLink
              :to="`/user/${route.params.userID}`"
              class="badge badge-neutral badge-lg mt-1 mx-1 no-underline"
            >
              <img
                :src="userData.avatar"
                class="avatar w-5 shadow-lg rounded-full m-1"
              />{{ userData.name }}
            </NuxtLink>
            <span> tarafından oluşturuldu. </span>
          </span>
        </span>
        <span class="grow" />
        <span>
          <button
            v-if="Boolean(user) && user.sub == route.params.userID"
            onclick="likesModal.showModal()"
            class="btn btn-ghost mt-5"
          >
            <Icon
              :name="
                isFav
                  ? 'material-symbols:favorite'
                  : 'material-symbols:favorite-outline'
              "
            />{{ list.favs.length }}
          </button>
          <button
            @click="favList()"
            v-else-if="Boolean(user) && user.sub != route.params.userID"
            class="btn btn-ghost mt-5"
          >
            <Icon
              :name="
                isFav
                  ? 'material-symbols:favorite'
                  : 'material-symbols:favorite-outline'
              "
            />{{ list.favs.length }}
          </button>
          <button
            v-else
            onclick="likesModal.showModal()"
            class="btn btn-ghost mt-5"
          >
            <Icon name="material-symbols:favorite" />{{ list.favs.length }}
          </button>
        </span>
      </article>
      <dialog id="likesModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <span class="flex flex-row">
            <h2 class="text-lg font-bold">Beğenenler</h2>
            <span class="grow" />
            <span class="opacity-50 text-sm"
              >{{ list.favs.length }} Kullanıcı</span
            >
          </span>
          <ul class="menu rounded-box -ml-5">
            <li v-for="u of likedUsers" :key="u">
              <NuxtLink :to="`/user/${u.id}`">
                <img
                  :src="
                    u.avatar ||
                    'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                  "
                  class="avatar w-5 shadow-lg rounded-full m-1"
                />
                {{ u.name || u.username }}
              </NuxtLink>
            </li>
          </ul>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">
                <Icon name="material-symbols:cancel" class="h-5 w-5" /> Kapat
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div class="divider -mt-6" />
      <div v-if="itemsData.length" class="flex flex-row flex-wrap">
        <SearchCard v-for="title of itemsData" :key="title" :itemData="title" />
      </div>
      <div v-else>
        <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
      </div>
    </div>
  </main>
  <div v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </div>
</template>
