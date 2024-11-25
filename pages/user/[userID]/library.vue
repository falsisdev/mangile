<script setup>
import { data } from "@/assets/data.ts";

//0 = Okunuyor, 1 = Tamamlandı, 2 = Bekletiliyor, 3 = Bırakıldı, 4 = Planlandı, 5 = Yeniden Okunuyor
const route = useRoute();
const config = useRuntimeConfig();
const user = useLogtoUser();

const userData = ref(null);
const bookcaseData = ref([]);
const tab = ref(0);

const chars = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH";
const rand = (min = 0, max = 1000) =>
  Math.floor(Math.random() * (max - min) + min);
const randChar = (length = 24) => {
  const randchars = [];
  for (let i = 0; i < length; i++) {
    randchars.push(chars[rand(0, chars.length)]);
  }

  return randchars.join("");
};

console.log(randChar());

async function fetchData() {
  try {
    const { data: response } = await useFetch(
      `/api/users/${route.params.userID}?appSecret=${
        toRaw(config.public).m2mAppSecret
      }`
    );

    userData.value = toRaw(response.value);

    if (
      toRaw(response.value).customData.userBookcase != [] &&
      Boolean(toRaw(response.value).customData.userBookcase)
    ) {
      for (let serie of toRaw(response.value).customData.userBookcase) {
        setTimeout(async () => {
          const { data: bookCase } = await useFetch(
            `https://api.jikan.moe/v4/manga/${serie.id}`
          );

          bookcaseData.value.push(toRaw(bookCase.value).data);
        }, 750);
      }
    } else {
      bookcaseData.value = null;
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  }
}

onMounted(async () => {
  fetchData();
});

watch([userData], fetchData, { immediate: true });
</script>
<template>
  <main v-if="userData">
    <div
      class="card card-compact bg-base-100 w-full lg:rounded-2xl rounded-none"
    >
      <figure
        class="h-56 shadow-inner lg:border-2 lg:border-neutral-content lg:border-opacity-50"
      >
        <img
          class="w-full lg:h-auto h-full opacity-75 object-cover object-center shadow-inner"
          :src="
            userData.customData.userBanner ||
            'https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed'
          "
        />
      </figure>
      <div
        class="card-body border-t-2 border-t-neutral-content border-opacity-50 flex"
      >
        <h2 class="card-title justify-center">
          <div
            class="avatar absolute lg:mb-16 mb-20 bg-base-100 rounded-full border-t-2 border-t-neutral-content border-opacity-100"
          >
            <div
              class="w-24 lg:w-36 rounded-full border-8 border-base-100 hover:border-8 hover:border-base-100"
            >
              <img
                class="hover:-rotate-6 duration-500"
                :src="
                  userData.avatar ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                "
              />
            </div>
          </div>
          <span class="grow" />
          <span
            class="tooltip lg:-mt-0 -mt-2"
            data-tip="Kullanıcının profilini görüntüle"
          >
            <NuxtLink
              :to="`/user/${route.params.userID}`"
              class="btn btn-ghost"
            >
              <Icon name="material-symbols:person" class="w-5 h-5" />
              Profili Görüntüle
            </NuxtLink>
          </span>
        </h2>
        <div class="flex justify-center">
          <article class="flex flex-col prose">
            <span class="text-sm opacity-75">@{{ userData.username }}</span>
            <h1 class="-mt-2">Kütüphane</h1>
          </article>
        </div>
        <article class="prose max-w-none px-5 flex flex-row -mb-7">
          <h1>Listeler</h1>
          <span class="grow" />
          <h1>
            <Icon name="material-symbols:arrow-forward" class="h-5 w-5" />
          </h1>
        </article>
        <article
          v-if="userData.customData.userLists"
          class="prose max-w-none px-5 flex flex-row"
        >
          <span v-for="list of userData.customData.userLists" :key="list">
            <ListsCard :itemData="list" />
          </span>
        </article>
        <article v-else class="prose max-w-none px-5">
          Kullanıcı henüz listeler özelliğini kullanmaya başlamamış.
        </article>
        <article class="prose max-w-none px-5 flex flex-row -mb-7">
          <h1>Kitaplık</h1>
          <span class="grow" />
          <ul class="menu menu-xs menu-horizontal rounded-box -mt-2">
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 0 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 0"
                data-tip="Okunuyor"
              >
                <Icon name="material-symbols:play-arrow" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 1 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 1"
                data-tip="Tamamlandı"
              >
                <Icon name="material-symbols:check" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 2 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 2"
                data-tip="Beklemede"
              >
                <Icon name="material-symbols:pause" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 3 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 3"
                data-tip="Bırakıldı"
              >
                <Icon name="material-symbols:delete" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 4 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 4"
                data-tip="Planlandı"
              >
                <Icon name="material-symbols:timer" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 5 ? 'btn-secondary' : 'btn-ghost'}`"
                @click="tab = 5"
                data-tip="Yeniden Okunuyor"
              >
                <Icon name="material-symbols:refresh" class="w-5 h-5" />
              </NuxtLink>
            </li>
          </ul>
        </article>
        <article
          v-if="userData.customData.userBookcase"
          class="prose max-w-none px-5"
        >
          <div class="lg:col-start-1 lg:col-end-11">
            <article class="prose mt-5">
              <h1>
                {{ data.status[tab] }}
              </h1>
              <span class="divider -my-5" />
            </article>
            <br />
            <span class="flex flex-wrap flex-row -mx-5">
              <span
                v-for="serie of userData.customData.userBookcase.filter(
                  (x) => x.status == tab
                )"
                :key="serie"
              >
                <BookcaseCard
                  v-if="
                    [...new Set(bookcaseData)].findIndex(
                      (x) => x.mal_id == serie.id
                    ) > -1
                  "
                  :itemData="
                    [...new Set(bookcaseData)].find((x) => x.mal_id == serie.id)
                  "
                  :entryData="serie"
                  :index="
                    [...new Set(bookcaseData)].findIndex(
                      (x) => x.mal_id == serie.id
                    )
                  "
                />
              </span>
              <span
                v-if="
                  userData.customData.userBookcase.findIndex(
                    (x) => x.status == tab
                  ) == -1
                "
                class="prose max-w-none px-5"
              >
                {{ data.status[tab] }} durumunda hiç seri yok.
              </span>
            </span>
          </div>
        </article>
        <article v-else class="prose max-w-none px-5">
          Kullanıcı henüz kitaplık özelliğini kullanmaya başlamamış.
        </article>
      </div>
    </div>
  </main>
  <div v-else>
    <Icon name="mingcute:loading-line" class="animate-spin w-full h-32" />
  </div>
</template>
