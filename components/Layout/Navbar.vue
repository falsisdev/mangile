<script setup>
import { data } from "@/assets/data.ts";

const user = useLogtoUser();

const search = () => {
  var input = document.getElementById("searchbar");
  input.addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      await navigateTo(
        `/search?q=${document.getElementById("searchbar").value}`
      );
    }
  });
};

const themeSelect = () => {
  const themeCookie = useCookie("theme", {
    sameSite: "None",
    secure: true,
  });
  const form = document.getElementById("themeSelector");
  const option = form.options[form.selectedIndex];
  themeCookie.value = option.id;
};

const save = () => {
  themeSelect();
  reloadNuxtApp();
};
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
</script>
<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <NuxtLink
        :to="'/'"
        class="btn btn-ghost no-animation hover:bg-[transparent] bg-base-100 normal-case font-bold text-[20px]"
        ><img
          width="60"
          src="https://firebasestorage.googleapis.com/v0/b/mangile-2229f.appspot.com/o/assets%2Fimages%2Fmangile_logo.png?alt=media&token=0c80a04f-0611-425f-bad4-7d7339751aaa"
          title="logo"
        />
      </NuxtLink>
    </div>
    <div class="flex-none hidden lg:block">
      <ul class="menu menu-horizontal">
        <ul class="menu lg:menu-horizontal rounded-box">
          <li>
            <NuxtLink to="/">
              <Icon name="material-symbols:home" class="h-5 w-5" />
              <span class="text-sm/6">Anasayfa</span>
            </NuxtLink>
          </li>
          <li class="tab-index-0">
            <NuxtLink to="/search">
              <Icon name="material-symbols:explore" class="h-5 w-5" />
              <span class="text-sm/6">Keşfet</span>
            </NuxtLink>
          </li>
          <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
            <li class="tab-index-0">
              <a>
                <Icon
                  name="material-symbols:collections-bookmark"
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
                  ><Icon name="material-symbols:update" class="w-5 h-5" />
                  Güncellemeler</span
                >
                <ul>
                  <li>
                    <NuxtLink to="/lastuploads/manga" class="text-sm/6"
                      ><Icon
                        name="material-symbols:drive-folder-upload"
                        class="h-5 w-5"
                      />Son Eklenen Seriler</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/lastuploads/chapters" class="text-sm/6"
                      ><Icon
                        name="material-symbols:restore-page-rounded"
                        class="h-5 w-5"
                      />Son Eklenen Bölümler</NuxtLink
                    >
                  </li>
                  <li>
                    <a class="text-sm/6"
                      ><Icon
                        name="material-symbols:add-notes"
                        class="h-5 w-5"
                      />Güncelleme Notları</a
                    >
                  </li>
                </ul>
              </li>
              <li>
                <span class="hover:bg-base-100 text-sm/6">
                  <Icon
                    name="material-symbols:local-library"
                    class="h-5 w-5" /><span class="flex flex-row"
                    >Kütüphane</span
                  ><span
                    class="tooltip tooltip-accent"
                    data-tip="Kullanıcı girişi gerektiriyor!"
                    ><Icon
                      name="material-symbols:person-alert"
                      class="badge badge-accent" /></span
                ></span>
                <ul>
                  <li>
                    <NuxtLink
                      :to="Boolean(user) ? `/user/${user.sub}/library` : ''"
                      class="text-sm/6"
                      ><Icon
                        name="material-symbols:library-books-rounded"
                        class="h-5 w-5"
                      />Kütüphane</NuxtLink
                    >
                  </li>
                  <li>
                    <a class="text-sm/6"
                      ><Icon
                        name="material-symbols:history"
                        class="h-5 w-5"
                      />Okuma Geçmişi</a
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
                  name="material-symbols:supervised-user-circle"
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
                  ><Icon name="material-symbols:info" class="w-5 h-5" />
                  Bilgilendirme</span
                >
                <ul>
                  <li>
                    <NuxtLink to="/article/rules" class="text-sm/6"
                      ><Icon
                        name="material-symbols:warning"
                        class="h-5 w-5"
                      />Site Kuralları</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/article/about" class="text-sm/6"
                      ><Icon
                        name="material-symbols:person-pin-rounded"
                        class="h-5 w-5"
                      />Hakkımızda</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/article/contact" class="text-sm/6"
                      ><Icon
                        name="material-symbols:phone-enabled"
                        class="h-5 w-5"
                      />İletişim</NuxtLink
                    >
                  </li>
                </ul>
              </li>
              <li>
                <span class="hover:bg-base-100 text-sm/6"
                  ><Icon
                    name="material-symbols:approval-delegation"
                    class="h-5 w-5"
                  />Yasal</span
                >
                <ul>
                  <li>
                    <NuxtLink to="/article/privacy" class="text-sm/6"
                      ><Icon
                        name="material-symbols:privacy-tip"
                        class="h-5 w-5"
                      />Gizlilik Prensipleri</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/article/security" class="text-sm/6"
                      ><Icon
                        name="material-symbols:verified-user"
                        class="h-5 w-5"
                      />Güvenlik İpuçları</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/article/terms" class="text-sm/6"
                      ><Icon
                        name="material-symbols:contract"
                        class="h-5 w-5"
                      />Kullanıcı Sözleşmesi</NuxtLink
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </ul>
        <label
          class="input input-bordered input-sm rounded-full flex items-center mt-3"
        >
          <input
            id="searchbar"
            type="text"
            placeholder="Ara..."
            @keyup="search()"
          />
          <Icon name="material-symbols:search" class="h-4 w-4" />
        </label>
        <div class="dropdown dropdown-end" v-if="Boolean(user)">
          <label
            tabindex="0"
            class="w-10 btn btn-circle btn-ghost hover:bg-transparent hover:-rotate-6 duration-500 avatar mx-2 mt-1"
          >
            <div class="rounded-full">
              <img
                :src="
                  user.picture ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                "
                title="Profil Fotoğrafı"
              />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 p-2 drop-shadow-lg border-2 border-base-200 menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50"
          >
            <span class="divide-y divide-base-content divide-opacity-25">
              <li>
                <b>
                  <span class="avatar w-5">
                    <div class="rounded-full">
                      <img
                        :src="
                          user.picture ||
                          'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                        "
                      />
                    </div>
                  </span>
                  {{ user.name || user.username }}</b
                >
              </li>
              <li>
                <NuxtLink :href="`/user/${user.sub}`">
                  <Icon name="material-symbols:person" /> Profil</NuxtLink
                >
              </li>
            </span>
            <li>
              <NuxtLink :to="`/user/${user.sub}/library`">
                <Icon name="mdi:library" />
                Kütüphane</NuxtLink
              >
            </li>
            <li>
              <a onclick="listcreate.showModal()">
                <Icon name="material-symbols:list-alt-add" /> Liste Oluştur
              </a>
            </li>
            <li>
              <a onclick="settings.showModal()">
                <Icon name="material-symbols:settings" /> Ayarlar
              </a>
            </li>
            <li>
              <a href="/sign-out">
                <Icon name="material-symbols:logout" /> Çıkış Yap
              </a>
            </li>
          </ul>
          <dialog id="settings" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button
                  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
              </form>
              <div>
                <article class="prose max-w-none mb-2">
                  <h1 class="mb-2">Ayarlar</h1>
                  Mangile ayarlarına hoşgeldiniz. Sistemle ilgili mevcut
                  özelleştirme ve ayarlar aşağıdadır.
                </article>
                Uygulanmasını istediğiniz temayı seçin:
                <br />
                <select
                  id="themeSelector"
                  class="select select-bordered select-sm w-full max-w-xs my-2"
                >
                  <option disabled selected>Tema Seçin</option>
                  <option
                    v-for="theme of data.themeselect"
                    :key="theme"
                    :id="theme.id"
                  >
                    {{ theme.title }} ({{
                      theme["scheme"]
                        .replaceAll("dark", "Karanlık")
                        .replaceAll("light", "Aydınlık")
                    }})
                    {{
                      theme.status
                        ? `[${theme["status"]
                            .replaceAll("recommended", "Önerilen")
                            .replaceAll("default", "Varsayılan")
                            .replaceAll("amoled", "Amoled")
                            .replaceAll("high-contrast", "Yüksek Karşıtlık")}]`
                        : ""
                    }}
                  </option>
                </select>
                <br />
                Tema Önizlemeleri:
                <div class="flex flex-row max-w-full overflow-x-auto">
                  <div
                    v-for="theme of data.themeselect"
                    :key="theme"
                    :data-theme="theme.id"
                    class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
                  >
                    <div class="font-bold">{{ theme.title }}</div>
                    <div class="flex flex-row gap-1">
                      <div
                        class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                      >
                        <div class="text-primary-content text-sm font-bold">
                          A
                        </div>
                      </div>
                      <div
                        class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                      >
                        <div class="text-secondary-content text-sm font-bold">
                          J
                        </div>
                      </div>
                      <div
                        class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                      >
                        <div class="text-accent-content text-sm font-bold">
                          W
                        </div>
                      </div>
                      <div
                        class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                      >
                        <div class="text-neutral-content text-sm font-bold">
                          R
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div class="modal-action m-2">
                  <label for="settingsModal" class="btn" @click="save()"
                    >Değişiklikleri Kaydet</label
                  >
                </div>
              </div>
            </div>
          </dialog>
          <dialog id="listcreate" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button
                  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
              </form>
              <!--<ListCreate id="userid" />-->
            </div>
          </dialog>
        </div>
        <a v-else href="/sign-in">
          <button class="btn btn-ghost btn-sm mt-3">
            <Icon name="material-symbols:login" /> Giriş Yap
          </button></a
        >
      </ul>
    </div>
  </div>
</template>
