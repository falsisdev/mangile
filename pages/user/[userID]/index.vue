<script setup>
//0 = Normal kullanıcı, >= 1 Bölüm Yönetim İzni, >= 2 Kişi Yönetim İzni, >= 3 Üst Düzey Yönetici
const route = useRoute();
const config = useRuntimeConfig();
const user = useLogtoUser();

const { data: userData } = await useFetch(`/api/users/${route.params.userID}`, {
  query: {
    appSecret: config.m2mAppSecret,
  },
});
</script>
<template>
  <main>
    <div class="card card-compact bg-base-100 w-full">
      <figure
        class="h-72 shadow-inner border-2 border-neutral-content border-opacity-50"
      >
        <img
          class="w-full opacity-75 object-cover object-center shadow-inner"
          :src="
            userData.customData.userBanner ||
            'https://repository-images.githubusercontent.com/594437407/d05e79b3-b261-4969-bfab-990bcb25d5ed'
          "
        />
        <span
          class="absolute top-0 end-0 bg-base-100 rounded-bl-lg p-1 tooltip tooltip-bottom border-2 border-r-0 border-t-0 border-neutral-content border-opacity-75"
          :data-tip="`Kullanıcı Cinsiyetini '${userData.profile['gender']
            .replaceAll('male', 'Eril')
            .replaceAll('female', 'Dişil')}' olarak belirtmiş`"
        >
          <Icon
            :name="`material-symbols:${userData.profile['gender']}`"
            class="h-5 w-5 -my-1 mx-1"
          />
        </span>
        <button
          class="btn bg-base-100 hover:bg-base-100 border-2 border-b-0 border-r-0 border-neutral-content border-opacity-50 hover:border-neutral-content hover:border-opacity-50 shadow-none absolute bottom-[100px] rounded-tl-2xl rounded-r-none rounded-b-none no-animation end-0"
        >
          <span
            class="flex tooltip"
            :data-tip="`Kullanıcı ${userData.customData['userFollows'].length} Kişiyi Takip Ediyor`"
          >
            <Icon name="material-symbols:person-add" class="w-5 h-5 mr-1" />
            <span class="mt-[3px]">
              {{ userData.customData["userFollows"].length }} Takip
            </span>
          </span>
          <span
            class="flex mx-2 tooltip"
            :data-tip="`Kullanıcının ${userData.customData['userFollowers'].length} Takipçisi Var`"
          >
            <Icon
              name="material-symbols:supervisor-account"
              class="w-5 h-5 mr-1"
            />
            <span class="mt-[3px]">
              {{ userData.customData["userFollowers"].length }} Takipçi
            </span>
          </span>
        </button>
      </figure>
      <div
        class="card-body border-t-2 border-t-neutral-content border-opacity-50"
      >
        <h2 class="card-title">
          <div
            class="avatar absolute lg:mb-16 bg-base-100 rounded-full border-t-2 border-t-neutral-content border-opacity-100"
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
          <div class="lg:ml-40 lg:-my-2 prose flex flex-col">
            <span class="text-xs -mb-2">@{{ userData.username }}</span>
            <h1>{{ userData.name }}</h1>
          </div>
          <span class="grow" />
          <span class="tooltip" data-tip="Kullanıcının kütüphanesini görüntüle">
            <NuxtLink class="btn btn-ghost">
              <Icon name="mdi:library" class="w-5 h-5" />
              Kütüphane
            </NuxtLink>
          </span>
          <span
            v-if="Boolean(user) && user.sub == route.params.userID"
            class="tooltip"
            data-tip="Profili Düzenle"
          >
            <NuxtLink class="btn btn-primary">
              <Icon name="material-symbols:person-edit" class="w-5 h-5" />
            </NuxtLink>
          </span>
        </h2>
        <p class="lg:ml-40 -mt-3">{{ userData.customData.userAbout }}</p>
      </div>
    </div>
  </main>
</template>
