<script setup>
import { useRoute, RouterLink } from "vue-router";
import { getUserByID, getUser } from "../../firebase";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const route = useRoute();

let id = route.params.id;
let loggeduser;

const user = await getUserByID(id);
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
} else {
  loggeduser = null;
}
</script>
<template>
  <div class="col-span-2 col-start-2 col-end-6 my-5 ml-10">
    <div class="card card-side bg-base-100 border border-base-200">
      <figure class="w-48 h-48 rounded-full m-5">
        <label class="swap swap-rotate text-9xl">
          <input type="checkbox" />
          <img class="swap-off" :src="user.pfp" alt="Profil Fotoğrafı" />
          <Icon
            v-if="user['roles'].includes('owner')"
            class="swap-on w-48 h-48"
            icon="material-symbols:mode-heat"
          />
          <Icon
            v-else-if="user['roles'].includes('mod')"
            class="swap-on w-48 h-48"
            icon="material-symbols:shield"
          />
          <Icon
            v-else-if="user['roles'].includes('vip')"
            class="swap-on w-48 h-48"
            icon="material-symbols:star"
          />
          <Icon
            v-else-if="user['roles'].includes('fansubmod')"
            class="swap-on w-48 h-48"
            icon="material-symbols:translate"
          />
          <Icon
            v-else-if="user['roles'].includes('uploader')"
            class="swap-on w-48 h-48"
            icon="material-symbols:upload-rounded"
          />
          <Icon
            v-else
            class="swap-on w-48 h-48"
            icon="material-symbols:person"
          />
        </label>
      </figure>
      <div class="card-body m-5">
        <h1 class="card-title">{{ user.username }}</h1>
        <p>
          Mangile veritabanında yer alan <b>{{ user.username }}</b> adlı
          kullanıcının hesabı.
          <br />
          Görüntülenen kullanıcının en yüksek rolü:
          {{
            user["roles"].includes("owner")
              ? "Mangile Sahibi"
              : user["roles"].includes("mod")
              ? "Moderatör"
              : user["roles"].includes("vip")
              ? "Özel Üye"
              : user["roles"].includes("fansubmod")
              ? "Çeviri Ekibi Yetkilisi"
              : user["roles"].includes("uploader")
              ? "Bölüm Yükleme Görevlisi"
              : "Kullanıcı"
          }}. En yüksek rolün rozetini profil fotoğrafına tıklayarak
          görebilirsiniz.
        </p>
        <div class="card-actions justify-end">
          <RouterLink
            class="btn btn-primary"
            v-if="cookies.get('email') == user.email"
            :to="`/user/${id}/library`"
          >
            <Icon class="h-4 w-4" icon="material-symbols:visibility-rounded" />
            Kütüphaneni Görüntüle
          </RouterLink>
          <span v-else-if="cookies.get('email')">
            <RouterLink
              class="btn btn-primary"
              v-if="loggeduser['roles'].includes('mod')"
              :to="`/user/${id}/library`"
            >
              <Icon class="h-4 w-4" icon="material-symbols:checkbook" />
              Kullanıcının Kütüphanesini Denetle
            </RouterLink>
          </span>
          <RouterLink class="btn btn-primary" v-else>
            <Icon
              class="h-4 w-4"
              icon="material-symbols:visibility-lock-rounded"
              :to="`/user/${id}/library`"
            />
            Kullanıcının Kütüphanesini Görüntüle
          </RouterLink>
          <span v-if="cookies.get('email')">
            <RouterLink
              class="btn btn-secondary"
              v-if="user.email == cookies.get('email')"
              :to="`/user/${id}/edit`"
            >
              <Icon class="h-4 w-4" icon="material-symbols:edit" />
              Bilgilerini Düzenle
            </RouterLink>
            <RouterLink
              class="btn btn-secondary"
              v-else-if="loggeduser['roles'].includes('mod')"
              :to="`/user/${id}/edit`"
            >
              <Icon class="h-4 w-4" icon="material-symbols:ink-pen" />
              Kullanıcı Bilgilerini Düzenle
            </RouterLink>
          </span>
        </div>
      </div>
    </div>
    <div
      class="hero max-h-screen rounded-lg h-full w-full my-5"
      :style="`background-image: url('https://media.tenor.com/RHVsVPzvszYAAAAd/chainsawman-manga.gif');`"
    >
      <div
        class="hero-overlay bg-base-200 bg-opacity-95 rounded-lg h-full w-full"
      ></div>
      <div class="hero-content flex-col lg:flex-row-reverse rounded-lg mx-10">
        <img :src="user.pfp" class="max-w-sm rounded-lg shadow-2xl my-10" />
        <div>
          <h1 class="text-5xl font-bold">{{ user.username }}'in Kütüphanesi</h1>
          <p class="py-6">
            Mangile, kullanıcılara geniş bir kütüphane imkânı sunuyor. Kütüphane
            içerisinde kullanıcılara özel kitaplık bölümü ve listelerin
            düzenlenebileceği listeler bölümü bulunuyor. {{ user.username }}'in
            kütüphanesi de bunlardan biri!
          </p>
          <div>
            <RouterLink class="btn btn-accent" :to="`/user/${id}/library`"
              ><Icon class="h-4 w-4" icon="material-symbols:library-books" />
              {{ user.username }}'in kütüphanesi</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
