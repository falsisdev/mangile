<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import logo from "./assets/mangile_sun.svg";
import { useCookies } from "vue3-cookies";
import { getUser } from "../src/firebase";
import MenuProfile from "./components/MenuProfile.vue";

const router = useRouter();
const route = useRoute();
const { cookies } = useCookies();

useTitle("Mangile");
function back() {
  router.back();
}
function forward() {
  router.forward();
}
function search() {
  var input = document.getElementById("searchbar");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      window.location.href = `/search?q=${
        document.getElementById("searchbar").value
      }`;
    }
  });
}

function directsearch() {
  window.location.href = `/search?q=${
    document.getElementById("searchbar").value
  }`;
}
</script>
<template>
  <!--<Icon
      icon="material-symbols:menu"
      id="my-drawer-3"
      type="checkbox"
      class="drawer-toggle"
    />-->
  <div
    class="grid grid-cols-10"
    :data-theme="
      cookies.get('theme') == null ? 'dracula' : cookies.get('theme')
    "
  >
    <div class="mx-20 my-5 col-span-8 col-start-2 col-end-10">
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <RouterLink
            :to="'/'"
            class="btn btn-ghost no-animation hover:bg-[transparent] bg-base-100 normal-case font-bold text-[20px]"
            ><img
              width="60"
              src="https://cdn.discordapp.com/attachments/775822548519616562/1043105098236166194/mangile_full.png"
              title="logo"
            />
            <span class="mb-2">Mangile</span></RouterLink
          >
        </div>
        <div class="flex-none hidden lg:block">
          <ul class="menu menu-horizontal">
            <ul class="menu lg:menu-horizontal rounded-box">
              <li>
                <RouterLink to="/">
                  <Icon icon="material-symbols:home" class="h-5 w-5" />
                  <span class="text-sm/6">Anasayfa</span>
                </RouterLink>
              </li>
              <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
                <li class="tab-index-0">
                  <a>
                    <Icon
                      icon="material-symbols:collections-bookmark"
                      class="h-5 w-5"
                    />
                    <span class="text-sm/6">Veritabanı</span>
                  </a>
                </li>
                <ul
                  class="dropdown-content z-50 menu xl:menu-horizontal lg:min-w-max bg-base-100 border border-base-200 rounded-box"
                >
                  <li>
                    <span class="hover:bg-base-100 text-sm/6"
                      ><Icon icon="material-symbols:update" class="w-5 h-5" />
                      Güncellemeler</span
                    >
                    <ul>
                      <li>
                        <RouterLink to="/lastuploads/manga" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:drive-folder-upload"
                            class="h-5 w-5"
                          />Son Eklenen Seriler</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/lastuploads/chapters" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:restore-page-rounded"
                            class="h-5 w-5"
                          />Son Eklenen Bölümler</RouterLink
                        >
                      </li>
                      <li>
                        <a class="text-sm/6"
                          ><Icon
                            icon="material-symbols:add-notes"
                            class="h-5 w-5"
                          />Güncelleme Notları</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span class="hover:bg-base-100 text-sm/6">
                      <Icon
                        icon="material-symbols:local-library"
                        class="h-5 w-5" /><span class="flex flex-row"
                        >Kütüphane</span
                      ><span
                        class="tooltip tooltip-accent"
                        data-tip="Kullanıcı girişi gerektiriyor!"
                        ><Icon
                          icon="material-symbols:person-alert"
                          class="badge badge-accent" /></span
                    ></span>
                    <ul>
                      <li>
                        <a class="text-sm/6"
                          ><Icon
                            icon="material-symbols:library-books-rounded"
                            class="h-5 w-5"
                          />Kitaplık</a
                        >
                      </li>
                      <li>
                        <a class="text-sm/6"
                          ><Icon
                            icon="material-symbols:list-alt"
                            class="h-5 w-5"
                          />Listelerin</a
                        >
                      </li>
                      <li>
                        <a class="text-sm/6"
                          ><Icon
                            icon="material-symbols:history"
                            class="h-5 w-5"
                          />Okuma Geçmişi</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
                <li class="tab-index-0">
                  <a>
                    <Icon
                      icon="material-symbols:menu-book-rounded"
                      class="h-5 w-5"
                    />
                    <span class="text-sm/6">Seriler</span>
                  </a>
                </li>
                <ul
                  class="dropdown-content z-50 menu xl:menu-horizontal lg:min-w-max bg-base-100 border border-base-200 rounded-box"
                >
                  <li>
                    <span class="hover:bg-base-100 text-sm/6"
                      ><Icon
                        icon="material-symbols:settings-account-box"
                        class="h-5 w-5"
                      />Gelişmiş</span
                    >
                    <ul>
                      <li>
                        <RouterLink to="/explore" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:map"
                            class="h-5 w-5"
                          />Keşfet</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/genres" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:type-specimen"
                            class="h-5 w-5"
                          />Türler</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/manga/random" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:shuffle"
                            class="w-5 h-5"
                          />Rastgele Manga</RouterLink
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="dropdown dropdown-hover dropdown-end dropdown-bottom">
                <li class="tab-index-0">
                  <a>
                    <Icon
                      icon="material-symbols:supervised-user-circle"
                      class="h-5 w-5"
                    />
                    <span class="text-sm/6">Mangile</span>
                  </a>
                </li>
                <ul
                  class="dropdown-content z-50 menu xl:menu-horizontal lg:min-w-max bg-base-100 border border-base-200 rounded-box"
                >
                  <li>
                    <span class="hover:bg-base-100 text-sm/6"
                      ><Icon icon="material-symbols:info" class="w-5 h-5" />
                      Bilgilendirme</span
                    >
                    <ul>
                      <li>
                        <RouterLink to="/article/ui" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:tv-signin"
                            class="h-5 w-5"
                          />Kullanıcı Arayüzü</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/rules" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:warning"
                            class="h-5 w-5"
                          />Site Kuralları</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/about" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:person-pin-rounded"
                            class="h-5 w-5"
                          />Hakkımızda</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/contact" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:phone-enabled"
                            class="h-5 w-5"
                          />İletişim</RouterLink
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span class="hover:bg-base-100 text-sm/6"
                      ><Icon
                        icon="material-symbols:approval-delegation"
                        class="h-5 w-5"
                      />Yasal</span
                    >
                    <ul>
                      <li>
                        <RouterLink to="/article/privacy" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:privacy-tip"
                            class="h-5 w-5"
                          />Gizlilik Prensipleri</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/security" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:verified-user"
                            class="h-5 w-5"
                          />Güvenlik İpuçları</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/article/terms" class="text-sm/6"
                          ><Icon
                            icon="material-symbols:contract"
                            class="h-5 w-5"
                          />Kullanıcı Sözleşmesi</RouterLink
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </ul>
            <div class="form-control">
              <div class="input-group input-group-sm mt-3">
                <input
                  id="searchbar"
                  type="text"
                  placeholder="Ara..."
                  class="input input-sm"
                  @keyup="search()"
                />
                <button
                  title="Ara"
                  class="btn btn-square btn-sm"
                  @click="directsearch()"
                >
                  <Icon icon="material-symbols:search" class="h-5 w-5" />
                </button>
              </div>
            </div>
            <Suspense>
              <MenuProfile />
            </Suspense>
          </ul>
        </div>
      </div>
      <span class="flex flex-row">
        <button @click="back()" class="btn btn-ghost btn-sm">
          <Icon icon="material-symbols:arrow-back" class="h-5 w-5" />
        </button>
        <div class="grow"></div>
        <button @click="forward()" class="btn btn-ghost btn-sm">
          <Icon icon="material-symbols:arrow-forward" class="h-5 w-5" />
        </button>
      </span>
      <router-view v-slot="{ Component }">
        <suspense timeout="0">
          <template #default>
            <component :is="Component"></component>
          </template>
          <template #fallback>
            <div
              class="flex flex-row text-align-center align-items-center justify-center"
            >
              <span class="loading loading-spinner loading-lg"></span>
              <h2 class="text-3xl mb-1">
                <b class="m-3">Yükleniyor...</b>
              </h2>
            </div>
          </template>
        </suspense>
      </router-view>
      <div class="divider" />
      <footer class="footer p-10 bg-base-100 text-base-content">
        <aside>
          <RouterLink to="/"
            ><img :src="logo" class="w-20 h-20" title="Logo"
          /></RouterLink>
          <p><b>Mangile</b><br />2022'den beri hizmetinizdeyiz!</p>
        </aside>
        <nav>
          <header class="footer-title">Veritabanı</header>
          <a class="link link-hover">Son Eklenen Seriler</a>
          <a class="link link-hover">Son Eklenen Bölümler</a>
          <a class="link link-hover">Güncelleme Notları</a>
        </nav>
        <nav>
          <header class="footer-title">Seriler</header>
          <a class="link link-hover">Keşfet</a>
          <a class="link link-hover">Türler</a>
          <a class="link link-hover">Yazarlar ve Çizerler</a>
          <a class="link link-hover">Karakterler</a>
        </nav>
        <nav>
          <header class="footer-title">Mangile</header>
          <RouterLink to="/article/rules" class="link link-hover"
            >Site Kuralları</RouterLink
          >
          <a class="link link-hover">Gizlilik Prensipleri</a>
          <a class="link link-hover">Güvenlik İpuçları</a>
          <a class="link link-hover">Kullanıcı Sözleşmesi</a>
          <RouterLink to="/article/about" class="link link-hover"
            >Hakkımızda</RouterLink
          >
          <RouterLink to="/article/contact" class="link link-hover"
            >İletişim</RouterLink
          >
        </nav>
      </footer>
    </div>
  </div>
</template>
