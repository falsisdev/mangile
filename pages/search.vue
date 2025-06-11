<script setup>
const route = useRoute();
const q = ref(route.query.q);
const page = ref(1);
const searchData = ref(null);
const pagination = ref(null);
const type = ref(route.query.type || "manga");
const orderBy = ref(route.query.order_by || "score");
const sort = ref(route.query.sort || "desc");
const sfw = ref(route.query.sfw !== undefined ? route.query.sfw === "true" : true);

// Türler için filtre (çoklu seçim)
const genres = ref([]);

// Jikan v4 genre id ve isimleri (string)
const genreOptions = [
  { id: "1", name: "Aksiyon" },
  { id: "2", name: "Macera" },
  { id: "3", name: "Arabalar" },
  { id: "4", name: "Komedi" },
  { id: "6", name: "Şeytan" },
  { id: "7", name: "Gizem" },
  { id: "8", name: "Drama" },
  { id: "9", name: "Ecchi" },
  { id: "10", name: "Fantastik" },
  { id: "11", name: "Oyun" },
  { id: "12", name: "Tarihi" },
  { id: "13", name: "Korku" },
  { id: "15", name: "Çocuk" },
  { id: "16", name: "Büyü" },
  { id: "17", name: "Dövüş Sanatları" },
  { id: "18", name: "Mecha" },
  { id: "19", name: "Müzik" },
  { id: "20", name: "Parodi" },
  { id: "21", name: "Samuray" },
  { id: "22", name: "Romantizm" },
  { id: "23", name: "Okul" },
  { id: "24", name: "Bilim Kurgu" },
  { id: "25", name: "Shoujo" },
  { id: "27", name: "Shounen" },
  { id: "29", name: "Uzay" },
  { id: "30", name: "Doğaüstü" },
  { id: "31", name: "Süper Güçler" },
  { id: "32", name: "Vampir" },
  { id: "33", name: "Yaoi" },
  { id: "34", name: "Yuri" },
  { id: "35", name: "Harem" },
  { id: "36", name: "Yaşamdan Kesitler" },
  { id: "37", name: "Spor" },
  { id: "38", name: "Seinen" },
  { id: "39", name: "Josei" },
  { id: "42", name: "Polisiye" },
  { id: "43", name: "Psikolojik" },
  { id: "44", name: "Seinen" },
  { id: "45", name: "Askeri" },
  { id: "46", name: "Gerilim" },
];


// Sıralama seçenekleri (endpoint'e göre dinamik)
const orderByOptions = [
  { value: "score", label: "Puan" },
  { value: "popularity", label: "Popülerlik" },
  { value: "members", label: "Üye" },
  { value: "favorites", label: "Favori" },
  { value: "rank", label: "Sıra" },
  { value: "title", label: "Başlık" },
  { value: "chapters", label: "Bölüm" },
  { value: "volumes", label: "Cilt" },
  { value: "start_date", label: "Başlangıç" },
  { value: "end_date", label: "Bitiş" },
  { value: "type", label: "Tür" },
  { value: "updated_at", label: "Güncelleme" },
];

const topOrderByOptions = [
  { value: "score", label: "Puan" },
  { value: "popularity", label: "Popülerlik" },
  { value: "members", label: "Üye" },
  { value: "favorites", label: "Favori" },
  { value: "rank", label: "Sıra" },
];

// Sıralama seçeneklerini endpoint'e göre ayarla
const currentOrderByOptions = computed(() =>
  q.value ? orderByOptions : topOrderByOptions
);

// orderBy değeri endpoint'e uygun değilse düzelt
watch([q, orderBy], () => {
  const validOptions = currentOrderByOptions.value.map(opt => opt.value);
  if (!validOptions.includes(orderBy.value)) {
    orderBy.value = validOptions[0];
  }
});

// Filtre değişince sayfa 1'e çek
watch([type, orderBy, sort, sfw, q, genres], () => {
  page.value = 1;
});

// Jikan API'ya uygun filtreleme
async function fetchData() {
  let params = {
    page: page.value,
    sfw: sfw.value,
    order_by: orderBy.value,
    sort: sort.value,
  };

  // Type
  if (type.value && type.value !== "all") params.type = type.value;

  // Türler (genres) -- Jikan API'da sadece /manga endpointinde çalışır!
  if (genres.value.length > 0) params.genres = genres.value.join(",");

  // Arama
  if (q.value) params.q = q.value;

  try {
    let url = q.value || genres.value.length > 0
      ? "https://api.jikan.moe/v4/manga"
      : "https://api.jikan.moe/v4/top/manga";
    if (!q.value && url.includes("/top/")) delete params.q;
    // /top/manga endpointinde genres parametresi yok, sadece /manga'da var
    if (url.includes("/top/")) delete params.genres;
    const response = await $fetch(url, { params });
    searchData.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("API çağrısı sırasında bir hata oluştu:", error);
  }
}

watch([page, q, type, orderBy, sort, sfw, genres], fetchData, { immediate: true });
onMounted(() => {
  fetchData();
});
useSeoMeta({
  author: "Falsis",
  twitterData1: "Falsis",
  twitterLabel1: "created by",
  twitterTitle: "Mangile Serilerini Keşfet",
  title: "Keşfet",
  ogTitle: "%s",
  description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
  ogDescription:
    "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
  ogImage:
    "https://2.downloader.disk.yandex.com.tr/preview/de2d22f53d1f4649d1550c198d795dca865ceb788718bdb5d00bf0ee31592ef2/inf/DLYjw7ue4Lojy7Rl0AIfRUaPfR63jeRVbjV_fJ-qINCikiXkQw7HK4SsxTfc9mEcDvxeBjpGXWLh1Um9cXii7Q%3D%3D?uid=1129069430&filename=search.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1129069430&tknv=v2&size=1708x793",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://2.downloader.disk.yandex.com.tr/preview/de2d22f53d1f4649d1550c198d795dca865ceb788718bdb5d00bf0ee31592ef2/inf/DLYjw7ue4Lojy7Rl0AIfRUaPfR63jeRVbjV_fJ-qINCikiXkQw7HK4SsxTfc9mEcDvxeBjpGXWLh1Um9cXii7Q%3D%3D?uid=1129069430&filename=search.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1129069430&tknv=v2&size=1708x793",
});
</script>

<template>
  <main>
    <div class="flex justify-center">
      <article class="prose my-5">
        <h1 class="lg:text-5xl text-2xl">Keşfet</h1>
      </article>
    </div>
    <div class="flex justify-center lg:w-full max-w-screen lg:mx-auto mx-3 mb-2">
      <label
        class="input lg:input-md input-sm w-full rounded-lg flex items-center bg-base-100 shadow"
      >
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
        <input
          id="searchbar"
          type="search"
          class="grow bg-transparent focus:outline-none"
          placeholder="Ara..."
          v-model="q"
        />
      </label>
      <!-- Filtre butonu arama barının sağına bitişik -->
      <div class="ml-2 flex items-center">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost lg:btn-md btn-sm hover:bg-neutral border-0 focus:bg-neutral">
            <Icon name="material-symbols:tune" />
          </label>
          <div tabindex="0" class="dropdown-content z-[1] card card-compact bg-base-100 shadow-lg w-80 mt-2 p-4">
            <div class="grid grid-cols-1 gap-3">
              <div class="form-control flex flex-row items-center gap-2">
                <span class="label-text font-semibold">SFW</span>
                <input type="checkbox" class="toggle toggle-primary" v-model="sfw" />
              </div>
              <div class="form-control">
                <label class="input-group input-group-sm">
                  <span>Tür</span>
                  <select class="select select-bordered select-sm" v-model="type">
                    <option value="all">Tümü</option>
                    <option value="manga">Manga</option>
                    <option value="lightnovel">Light Novel</option>
                    <option value="novel">Novel</option>
                    <option value="manhwa">Manhwa</option>
                    <option value="manhua">Manhua</option>
                  </select>
                </label>
              </div>
              <!-- Türler (çoklu seçim) -->
              <div class="form-control">
                <span class="label-text font-semibold mb-1">Türler</span>
                <div class="flex flex-wrap gap-1 mb-2">
                  <span
                    v-for="gid in genres"
                    :key="gid"
                    class="badge badge-primary badge-sm"
                  >
                    {{ genreOptions.find(g => g.id === gid)?.name || gid }}
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-32 overflow-y-auto rounded p-2">
                  <label
                    v-for="genre in genreOptions"
                    :key="genre.id"
                    class="cursor-pointer flex items-center gap-2 px-2 py-1 rounded hover:bg-base-300 transition"
                  >
                    <input
                      type="checkbox"
                      class="checkbox checkbox-xs"
                      :value="genre.id"
                      v-model="genres"
                    />
                    <span class="text-xs">{{ genre.name }}</span>
                  </label>
                </div>
              </div>
              <div class="form-control">
                <label class="input-group input-group-sm">
                  <span>Sırala</span>
                  <select class="select select-bordered select-sm" v-model="orderBy">
                    <option
                      v-for="opt in currentOrderByOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="form-control">
                <label class="input-group input-group-sm">
                  <span>Yön</span>
                  <select class="select select-bordered select-sm" v-model="sort">
                    <option value="desc">Azalan</option>
                    <option value="asc">Artan</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    <div v-if="q">
      <article class="prose max-w-none p-5">
        <h1 v-if="!isMobileOrTablet">
          Arama Sonuçları
          <span class="flex flex-row text-sm font-normal mt-1">
            <span class="mt-[5px]">Arama Girdisi:</span>
            <span class="badge badge-neutral mt-[5px] ml-1">{{ q }}</span>
            <span class="grow" />
            <span v-if="pagination" class="mt-[5px]">
              Sayfa: {{ page }}, Öge: {{ pagination.items.count }}
            </span>
          </span>
        </h1>
        <h2 v-else>
          Arama Sonuçları
          <span class="flex flex-row text-xs">
            <span>Arama Girdisi:</span>
            <span class="badge badge-neutral badge-sm ml-1">{{ q }}</span>
            <span class="grow" />
            <span v-if="pagination">
              Sayfa: {{ page }}, Öge: {{ pagination.items.count }}
            </span>
          </span>
        </h2>
      </article>
      <br />
      <div class="flex flex-row flex-wrap justify-center">
        <DefaultCard type="search"
          v-for="manga in searchData"
          :key="manga"
          :itemData="manga"
          :index="searchData.indexOf(manga)"
        />
      </div>
      <div
        v-if="pagination"
        role="tablist"
        class="tabs tabs-boxed lg:tab-md tabs-sm justify-center bg-transparent lg:mb-0 mb-20 flex flex-row flex-wrap"
      >
        <NuxtLink
          v-for="tab in pagination.last_visible_page"
          :key="tab"
          @click.prevent="page = tab"
          role="tab"
          :class="`tab ${tab === page ? 'tab-active' : ''}`"
        >
          {{ tab }}
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <div v-if="pagination" class="flex flex-row my-2">
        <NuxtLink
          class="btn btn-ghost"
          @click.prevent="page == 1 ? null : (page -= 1)"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5" />
        </NuxtLink>
        <span class="grow" />
        <span class="label">
          <span class="label-text">Sayfa {{ page }}</span>
        </span>
        <span class="grow" />
        <NuxtLink
          class="btn btn-ghost"
          @click.prevent="
            page == pagination.last_visible_page ? null : (page += 1)
          "
        >
          <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
        </NuxtLink>
      </div>
      <div class="flex flex-row flex-wrap justify-center">
        <DefaultCard type="search"
          v-for="manga in searchData"
          :key="manga"
          :itemData="manga"
        />
      </div>
      <div v-if="pagination" class="flex flex-row my-2">
        <NuxtLink
          class="btn btn-ghost"
          @click.prevent="page == 1 ? null : (page -= 1)"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5" />
        </NuxtLink>
        <span class="grow" />
        <span class="label">
          <span class="label-text">Sayfa {{ page }}</span>
        </span>
        <span class="grow" />
        <NuxtLink
          class="btn btn-ghost"
          @click.prevent="
            page == pagination.last_visible_page ? null : (page += 1)
          "
        >
          <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
