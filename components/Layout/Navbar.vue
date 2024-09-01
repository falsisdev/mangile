<script setup>
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
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
let isLogged = false;
const logout = () => {
  alert("çalışıyor");
};
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
                      :to="loggeduser ? `/user/userid/library` : ''"
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
        <label class="input input-bordered input-sm flex items-center mt-3">
          <input
            id="searchbar"
            type="text"
            placeholder="Ara..."
            @keyup="search()"
          />
          <Icon name="material-symbols:search" class="h-4 w-4" />
        </label>
        <div class="dropdown dropdown-end" v-if="isLogged">
          <label
            tabindex="0"
            class="btn btn-ghost btn-circle avatar btn-md mx-2"
          >
            <div class="w-10 rounded-full">
              <img
                src="https://media.discordapp.net/attachments/775822548519616562/1133357825700139088/RDT_20230725_0000086929169197605575505.jpg?ex=66cd0d7a&is=66cbbbfa&hm=28398039ad91160087129b657d0a65d76305ce493cd69bbbb4b718cc1c63d285&=&format=webp&width=312&height=468"
                title="Profil Fotoğrafı"
              />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50"
          >
            <li>
              <b>Kullanıcı Adı</b>
            </li>
            <li>
              <NuxtLink to="`/user/userid`">
                <Icon name="material-symbols:person" /> Profil</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="`/user/userid/library`">
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
              <a onclick="settings.showModal()">
                <Icon name="material-symbols:settings" /> Ayarlar
              </a>
            </li>
            <li>
              <button @click="logout()">
                <Icon name="material-symbols:logout" /> Çıkış Yap
              </button>
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
              <!--<Settings />-->
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
        <NuxtLink v-else to="/auth/login">
          <button class="btn btn-ghost btn-sm mt-3">
            <Icon name="material-symbols:login" /> Giriş Yap
          </button></NuxtLink
        >
      </ul>
    </div>
  </div>
</template>
