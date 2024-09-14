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
</script>
<template>
  <main>
    <div class="btm-nav w-screen bg-base-100 z-50 drop-shadow-lg">
      <div>
        <div class="mb-24 w-full z-40">
          <span
            class="w-full input input-sm rounded-none flex items-center !outline-none !border-0"
          >
            <input
              id="searchbar"
              type="text"
              placeholder="Ara..."
              @keyup="search()"
            />
            <span class="grow" />
            <Icon name="material-symbols:search" class="h-4 w-4" />
          </span>
        </div>
        <div class="btm-nav btm-nav-md rounded-none z-50">
          <button>
            <NuxtLink to="/" class="flex flex-col items-center">
              <Icon name="material-symbols:home" class="h-5 w-5" />
            </NuxtLink>
          </button>
          <button>
            <NuxtLink to="/search" class="flex flex-col items-center">
              <Icon name="material-symbols:explore" class="h-5 w-5" />
            </NuxtLink>
          </button>
          <button class="dropdown dropdown-hover dropdown-top dropdown-end">
            <NuxtLink class="flex flex-col items-center">
              <Icon name="material-symbols:database" class="h-5 w-5" />
            </NuxtLink>
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
                    <a class="text-sm/6"
                      ><Icon
                        name="material-symbols:add-notes"
                        class="h-5 w-5"
                      />Güncelleme Notları</a
                    >
                  </li>
                  <li>
                    <a
                      href="https://github.com/falsisdev/mangile"
                      target="_blank"
                      class="text-sm/6"
                      ><Icon name="simple-icons:github" class="h-5 w-5" />GitHub
                      Deposu</a
                    >
                  </li>
                </ul>
              </li>
              <li>
                <span class="hover:bg-base-100 text-sm/6">
                  <Icon
                    name="material-symbols:manage-accounts"
                    class="h-5 w-5" /><span class="flex flex-row"
                    >Kullanıcı</span
                  ><span
                    class="tooltip tooltip-secondary badge badge-secondary"
                    data-tip="Kullanıcı girişi gerektiriyor!"
                    ><Icon name="material-symbols:person-alert" /></span
                ></span>
                <ul>
                  <li>
                    <NuxtLink
                      :to="Boolean(user) ? `/user/${user.sub}/library` : ''"
                      class="text-sm/6"
                      ><Icon
                        name="material-symbols:local-library"
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
          </button>
          <button class="dropdown dropdown-hover dropdown-end dropdown-top">
            <NuxtLink class="flex flex-col items-center">
              <Icon
                name="material-symbols:supervised-user-circle"
                class="h-5 w-5"
              />
            </NuxtLink>
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
          </button>
          <button>
            <a onclick="settings.showModal()"
              ><Icon name="material-symbols:settings" />
            </a>
          </button>
          <button
            class="dropdown dropdown-end dropdown-top"
            v-if="Boolean(user)"
          >
            <label
              tabindex="0"
              class="btn btn-ghost btn-circle avatar btn-md mx-2"
            >
              <div class="w-10 rounded-full">
                <img
                  :src="
                    user.picture ||
                    'https://media.discordapp.net/attachments/775822548519616562/1274408624768417915/mangile_6FCE43F.png?ex=66d73d05&is=66d5eb85&hm=b0e1936e88485a4f1643a152edb224d695dc9e8cc4a129e26deafedf8a8a5d7e&'
                  "
                  title="Profil Fotoğrafı"
                />
              </div>
            </label>
            <ul
              tabindex="0"
              class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50"
            >
              <li>
                <b>{{ user.name ? user.name : user.username }}</b>
              </li>
              <li>
                <NuxtLink :to="`/user/${user.sub}`">
                  <Icon name="material-symbols:person" /> Profil</NuxtLink
                >
              </li>
              <li>
                <NuxtLink :to="`/user/${user.sub}/library`">
                  <Icon name="material-symbols:library-books" />
                  Kütüphane</NuxtLink
                >
              </li>
              <li>
                <a onclick="listcreate.showModal()">
                  <Icon name="material-symbols:list-alt-add" /> Liste Oluştur
                </a>
              </li>
              <li>
                <a href="/sign-out">
                  <Icon name="material-symbols:logout" /> Çıkış Yap
                </a>
              </li>
            </ul>
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
          </button>
          <button v-else>
            <a class="flex flex-col items-center" href="/sign-in">
              <Icon name="material-symbols:login" class="w-5 h-5" />
            </a>
          </button>
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
        </div>
      </div>
    </div>
  </main>
</template>
