<script setup>
import { data } from "@/assets/data.ts";
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(useSanity().config);

const urlFor = (source) => {
  return builder.image(source).url();
};

const route = useRoute();
const config = useRuntimeConfig();
const user = useLogtoUser();
const { isMobileOrTablet } = useDevice();

const sanity = useSanity()

const query = groq`*[_type == "auth" && logtoId == $logtoId][0] {
  ...,
    "lists": lists->{
      _id,
      createdAt,
      items,
      title,
      likes
    }
}`

const sanityUser = await sanity.fetch(query, { logtoId: route.params.userID })

const bookcaseData = ref([]);
const tab = ref(0);
const loading = ref(true);

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

async function fetchData() {
  try {
    const bookcaseSections = Object.values(sanityUser.bookcase).flat(); // completed, reading, vs.

    if (bookcaseSections.length > 0) {
      const results = await Promise.all(
        bookcaseSections.map(async (serie) => {
          if (!serie?.id) return null;

          try {
            const { data: res } = await useFetch(`https://api.jikan.moe/v4/manga/${serie.id}`);
            return res.value?.data || null;
          } catch (err) {
            console.error("Manga fetch hatası:", serie.id, err);
            return null;
          }
        })
      );
      bookcaseData.value = results.filter(Boolean);
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
  } finally {
    loading.value = false;
  }
}


onMounted(async () => {
  await fetchData();
});
</script>
<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <Icon name="mingcute:loading-line" class="animate-spin w-32 h-32" />
  </div>
  <main v-else-if="sanityUser">
    <div
      class="card card-sm bg-base-100 w-full lg:rounded-2xl rounded-none"
    >
      <figure
        class="h-56 shadow-inner lg:border-2 lg:border-neutral-content lg:border-opacity-50"
      >
        <img
          class="w-full lg:h-auto h-full opacity-75 object-cover object-center shadow-inner"
          :src="
            sanityUser.banner ? urlFor(sanityUser.banner) :
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
                  sanityUser.avatar ||
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
            <span class="text-sm opacity-75">@{{ sanityUser.username }}</span>
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
        <div v-if="sanityUser.lists">
          <swiper :slidesPerView="isMobileOrTablet ? 1 : 4">
            <swiper-slide
              v-for="item in sanityUser['lists'].isArray ? sanityUser['lists'] : [sanityUser['lists']]"
              :key="item._key"
            >
              <ListsCard :itemData="item" />
            </swiper-slide>
          </swiper>
        </div>
        <article v-else class="prose max-w-none px-5">
          Kullanıcı henüz listeler özelliğini kullanmaya başlamamış.
        </article>
        <article class="prose max-w-none px-5 flex lg:flex-row flex-col -mb-7">
          <h1>Kitaplık</h1>
          <span v-if="!isMobileOrTablet" class="grow" />
          <ul class="menu menu-xs menu-horizontal rounded-box lg:-mt-2 -mt-10">
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 0 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 0"
                data-tip="Okunuyor"
              >
                <Icon name="material-symbols:play-arrow" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 1 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 1"
                data-tip="Tamamlandı"
              >
                <Icon name="material-symbols:check" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 2 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 2"
                data-tip="Beklemede"
              >
                <Icon name="material-symbols:pause" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 3 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 3"
                data-tip="Bırakıldı"
              >
                <Icon name="material-symbols:delete" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 4 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 4"
                data-tip="Planlandı"
              >
                <Icon name="material-symbols:timer" class="w-5 h-5" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="`tooltip flex place-items-center btn btn-sm ${tab == 5 ? 'btn-soft btn-accent' : 'btn-ghost'}`"
                @click="tab = 5"
                data-tip="Yeniden Okunuyor"
              >
                <Icon name="material-symbols:refresh" class="w-5 h-5" />
              </NuxtLink>
            </li>
          </ul>
        </article>
        <article
          v-if="sanityUser.bookcase"
          class="prose max-w-none px-5"
        >
          <div class="lg:col-start-1 lg:col-end-11">
            <article class="prose mt-5 -mb-5">
              <h1>
                {{ data.status[tab] }}
              </h1>
              <span class="divider -my-5" />
            </article>
            <br />
            <span class="flex flex-wrap flex-row -mx-5">
              <span
                v-for="serie of sanityUser.bookcase[data.statusSanity[tab]]"
                :key="serie"
                class="w-full sm:w-1/2 lg:w-1/4 flex"
              >
                <BookcaseCard
                  v-if="
                    [...new Set(bookcaseData)].findIndex(
                      (x) => x.id == serie.id
                    ) > -1
                  "
                  :itemData="
                    [...new Set(bookcaseData)].find((x) => x.id == serie.id)
                  "
                  :entryData="serie"
                  :index="
                    [...new Set(bookcaseData)].findIndex(
                      (x) => x.id == serie.id
                    )
                  "
                />
              </span>
              <span
                v-if="!sanityUser.bookcase[data.statusSanity[tab]]"
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
