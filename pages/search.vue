<script setup>
/*
 * Query Parametreleri
 * q: arama ifadesi
 * page: sayfa numarası
 * type: manga
 * sfw: yetişkin içeriği engelleyici
 * order_by: sıralama tipi
 * sort: sıralama yönü
 */
const route = useRoute();
const q = ref(route.query.q);
const page = ref(1);
const searchData = ref(null);
const pagination = ref(null);

async function fetchData() {
  if (q.value) {
    try {
      const response = await $fetch(`https://api.jikan.moe/v4/manga`, {
        params: {
          q: q.value,
          page: page.value,
          type: "manga",
          sfw: true,
          order_by: "score",
          sort: "desc",
        },
      });
      searchData.value = response.data;
      pagination.value = response.pagination;
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu:", error);
    }
  } else {
    try {
      const response = await $fetch(`https://api.jikan.moe/v4/top/manga`, {
        params: {
          page: page.value,
          type: "manga",
          sfw: true,
        },
      });
      searchData.value = response.data;
      pagination.value = response.pagination;
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu:", error);
    }
  }
}

watch([page, q], fetchData, { immediate: true });
onMounted(() => {
  fetchData;
});
</script>

<template>
  <main>
    <div class="flex justify-center my-5">
      <article class="prose">
        <h1 class="text-5xl">Keşfet</h1>
      </article>
    </div>
    <label class="input input-bordered flex items-center gap-2 mx-5">
      <input
        id="searchbar"
        v-model="q"
        type="text"
        class="grow"
        placeholder="Ara..."
      />
      <span class="flex">
        <span class="dropdown dropdown-end dropdown-bottom">
          <button class="btn btn-ghost btn-xs">
            <Icon name="material-symbols:filter-list" class="h-5 w-5" />
          </button>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 border border-base-200 rounded-box z-[1] w-72 shadow"
          >
            <span>
              MAL Skoru:
              <input
                type="range"
                min="0"
                max="10"
                value="0"
                class="range range-xs mt-1"
                step="1"
              />
              <div class="flex w-full justify-between px-2 text-xs">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </span>
            <span class="mt-2">
              Durum:
              <select class="select select-bordered w-full max-w-xs mt-1">
                <option disabled selected>Durum Seçin</option>
                <option>Yayınlanıyor</option>
                <option>Tamamlandı</option>
                <option>Beklemede</option>
                <option>Durduruldu</option>
                <option>Gelecek</option>
              </select>
            </span>
            <span class="form-control mt-2">
              <label class="label cursor-pointer">
                <span class="label-text">Güvenli İçerik</span>
                <input type="checkbox" class="toggle" checked />
              </label>
            </span>
            <span class="mt-2">
              Türler:
              <span class="mt-1 flex flex-row">
                <span class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text mr-2">Aksiyon</span>
                    <input
                      type="checkbox"
                      checked
                      class="checkbox checkbox-xs mr-2"
                    />
                    <span class="label-text mr-2">Macera</span>
                    <input
                      type="checkbox"
                      checked
                      class="checkbox checkbox-xs mr-2"
                    />
                    <span class="label-text mr-2">Bilim Kurgu</span>
                    <input
                      type="checkbox"
                      checked
                      class="checkbox checkbox-xs mr-2"
                    />
                  </label>
                </span>
              </span>
            </span>
          </ul>
        </span>
        <div class="divider divider-horizontal -mx-1" />
        <Icon name="material-symbols:search" class="h-5 w-5 ml-2 mt-[1px]" />
      </span>
    </label>
    <div v-if="q">
      <article class="prose max-w-none p-5">
        <h1>
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
      </article>
      <br />
      <div class="flex flex-row flex-wrap justify-center">
        <SearchCard
          v-for="manga in searchData"
          :key="manga.mal_id"
          :itemData="manga"
          :index="searchData.indexOf(manga)"
        />
      </div>
      <div
        v-if="pagination"
        role="tablist"
        class="tabs tabs-boxed justify-center bg-transparent"
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
        <span class="grow" />
        <span class="label">
          <span class="label-text">Sayfa:</span>
        </span>
        <select class="select select-sm justify-center">
          x
          <option
            v-for="tab in pagination.last_visible_page"
            :key="tab"
            @click.prevent="page = tab"
          >
            {{ tab }}
          </option>
        </select>
      </div>
      <div class="flex flex-row flex-wrap justify-center">
        <SearchCard
          v-for="manga in searchData"
          :key="manga.mal_id"
          :itemData="manga"
          :index="searchData.indexOf(manga)"
        />
      </div>
    </div>
  </main>
</template>
