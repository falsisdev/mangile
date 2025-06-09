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
};
</script>
<template>
  <main>
    <!-- Spacer yüksekliğini arama barı + dock yüksekliğine göre ayarla -->
    <div style="height:88px;"></div>
    <!-- Arama barı: ortada -->
    <div class="w-screen fixed left-0 bottom-[48px] z-60 mb-2">
      <span
        class="flex items-center w-full bg-base-100 rounded-none border-t border-base-200 px-3 py-2"
        style="height:40px;"
      >
        <input
          id="searchbar"
          type="text"
          placeholder="Ara..."
          @keyup="search()"
          class="flex-1 bg-transparent outline-none border-none text-sm px-2 py-1"
          style="min-width:0;"
        />
        <span class="grow" />
        <Icon class="size-[1.25em] text-base-content/70" name="material-symbols:search" />
      </span>
    </div>
  </main>
  <div
    class="dock dock-lg w-screen fixed left-0 bottom-0 z-50"
    style="pointer-events:auto;"
  >
    <NuxtLink to="/">
      <Icon class="size-[1.2em]" name="material-symbols:home"/>
      <span class="dock-label flex justify-center items-center w-full text-center"></span>
    </NuxtLink>
    <NuxtLink to="/search">
      <Icon class="size-[1.2em]" name="material-symbols:explore"/>
      <span class="dock-label flex justify-center items-center w-full text-center"></span>
    </NuxtLink>
    <button class="dropdown dropdown-top dropdown-start">
      <Icon class="size-[1.2em]" name="material-symbols:database" />
      <span class="dock-label flex justify-center items-center w-full text-center"></span>
      <ul
        class="dropdown-content z-[100] menu bg-base-100 border border-base-200 rounded-box w-56 mb-8"
      >
        <li>
          <span class="hover:bg-base-100 text-xs"
            ><Icon class="size-[1.2em]" name="material-symbols:update" />
            Güncellemeler</span
          >
          <ul>
            <li>
              <a class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:add-notes"
                  
                />Güncelleme Notları</a
              >
            </li>
            <li>
              <a
                href="https://github.com/falsisdev/mangile"
                target="_blank"
                class="text-xs"
                ><Icon class="size-[1.2em]" name="simple-icons:github"  />GitHub
                Deposu</a
              >
            </li>
          </ul>
        </li>
        <li>
          <span class="hover:bg-base-100 text-xs">
            <Icon class="size-[1.2em]"
              name="material-symbols:manage-accounts"
               /><span class="flex flex-row"
              >Kullanıcı</span
            ><span
              class="badge badge-warning badge-sm text-xs"
              ><Icon name="material-symbols:person-alert" class="w-3 h-3 mt-[2px] mr-1"/> Giriş gerekli</span
          ></span>
          <ul>
            <li>
              <NuxtLink
                :to="Boolean(user) ? `/user/${user.sub}/library` : ''"
                class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:local-library"
                  
                />Kütüphane</NuxtLink
              >
            </li>
            <li>
              <a class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:history"
                  
                />Okuma Geçmişi</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </button>
    <button class="dropdown dropdown-hover dropdown-end dropdown-top">
      <Icon class="size-[1.2em]" name="material-symbols:supervised-user-circle"/>
      <span class="dock-label flex justify-center items-center w-full text-center"></span>
      <ul
        class="dropdown-content z-[100] menu bg-base-100 border border-base-200 rounded-box w-56 mb-8"
      >
        <li>
          <span class="hover:bg-base-100 text-xs"
            ><Icon class="size-[1.2em]" name="material-symbols:info"  />
            Bilgilendirme</span
          >
          <ul>
            <li>
              <NuxtLink to="/articles/about" class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:person-pin-rounded"
                  
                />Hakkımızda</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="mailto: falsis@proton.me" class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:phone-enabled"
                  
                />İletişim</NuxtLink
              >
            </li>
          </ul>
        </li>
        <li>
          <span class="hover:bg-base-100 text-xs"
            ><Icon class="size-[1.2em]"
              name="material-symbols:approval-delegation"
              
            />Yasal</span
          >
          <ul>
            <li>
              <NuxtLink to="" class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:privacy-tip"
                  
                />Gizlilik Prensipleri</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="" class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:verified-user"
                  
                />Güvenlik İpuçları</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/articles/terms" class="text-xs"
                ><Icon class="size-[1.2em]"
                  name="material-symbols:contract"
                  
                />Kullanıcı Sözleşmesi</NuxtLink
              >
            </li>
          </ul>
        </li>
      </ul>
    </button>
      <a onclick="settings.showModal()">
        <Icon class="size-[1.2em]" name="material-symbols:settings" />
        <span class="dock-label flex justify-center items-center w-full text-center"></span>
      </a>
    <button
      class="dropdown dropdown-end dropdown-top"
      v-if="Boolean(user)"
    >
      <label
        tabindex="0"
        class="btn btn-ghost btn-circle avatar"
      >
        <div class="w-5 h-5 rounded-full">
          <img
            :src="
              user.picture ||
              'https://media.discordapp.net/attachments/775822548519616562/1274408624768417915/mangile_6FCE43F.png?ex=66d73d05&is=66d5eb85&hm=b0e1936e88485a4f1643a152edb224d695dc9e8cc4a129e26deafedf8a8a5d7e&'
            "
            title="Profil Fotoğrafı"
          />
          <span class="dock-label flex justify-center items-center w-full text-center"></span>
        </div>
      </label>
      <ul
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-56 z-50 mb-8 border border-base-200"
      >
        <li>
          <b>{{ user.name ? user.name : user.username }}</b>
        </li>
        <li>
          <NuxtLink :to="`/user/${user.sub}`" class="text-xs">
            <Icon class="size-[1.2em]" name="material-symbols:person" /> Profil</NuxtLink
          >
        </li>
        <li>
          <NuxtLink :to="`/user/${user.sub}/library`" class="text-xs">
            <Icon class="size-[1.2em]" name="material-symbols:library-books" />
            Kütüphane</NuxtLink
          >
        </li>
        <li>
          <a onclick="listcreate.showModal()" class="text-xs">
            <Icon class="size-[1.2em]" name="material-symbols:list-alt-add" /> Liste Oluştur
          </a>
        </li>
        <li>
          <a href="/sign-out" class="text-xs">
            <Icon class="size-[1.2em]" name="material-symbols:logout" /> Çıkış Yap
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
        <Icon class="size-[1.2em]" name="material-symbols:login" />
        <span class="dock-label flex justify-center items-center w-full text-center"></span>
      </a>
    </button>
  </div>
  <dialog id="settings" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <form method="dialog">
        <button
          class="btn btn-xs btn-circle btn-ghost absolute right-4 top-4"
        >
          ✕
        </button>
      </form>
      <div class="text-xs">
        <article class="prose max-w-none mb-2 text-xs">
          <h2 class="mb-2">Ayarlar</h2>
          Mangile ayarlarına hoşgeldiniz. Sistemle ilgili mevcut
          özelleştirme ve ayarlar aşağıdadır.
        </article>
        Uygulanmasını istediğiniz temayı seçin:
        <br />
        <select
          id="themeSelector"
          class="select select-bordered select-xs my-2 text-xs"
          @change="save()"
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
      </div>
    </div>
  </dialog>
</template>
