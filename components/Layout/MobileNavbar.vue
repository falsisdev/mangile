<script setup>
const user = useLogtoUser()
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
  <main class="pt-2 px-2">
    <label class="input input-bordered input-sm flex items-center mb-2">
      <input
        id="searchbar"
        type="text"
        placeholder="Ara..."
        @keyup="search()"
      />
      <span class="grow" />
      <Icon name="material-symbols:search" class="h-4 w-4" />
    </label>
    <div
      class="btm-nav btm-nav-md w-screen bg-base-100 z-50 border border-base-100 drop-shadow-lg"
    >
      <button>
        <NuxtLink to="/" class="flex flex-col items-center">
          <Icon name="material-symbols:home" class="h-5 w-5" />
          <span class="text-sm/6">Ana Sayfa</span>
        </NuxtLink>
      </button>
      <button>
        <NuxtLink to="/search" class="flex flex-col items-center">
          <Icon name="material-symbols:explore" class="h-5 w-5" />
          <span class="text-sm/6">Keşfet</span>
        </NuxtLink>
      </button>
      <button class="dropdown dropdown-hover dropdown-top dropdown-end">
        <NuxtLink class="flex flex-col items-center">
          <Icon name="material-symbols:collections-bookmark" class="h-5 w-5" />
          <span class="text-sm/6">Veri Tabanı</span>
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
                class="h-5 w-5" /><span class="flex flex-row">Kütüphane</span
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
                  ><Icon name="material-symbols:history" class="h-5 w-5" />Okuma
                  Geçmişi</a
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
          <span class="text-sm/6">Mangile</span>
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
                  ><Icon name="material-symbols:warning" class="h-5 w-5" />Site
                  Kuralları</NuxtLink
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
      <button class="dropdown dropdown-end dropdown-top" v-if="Boolean(user)">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar btn-md mx-2">
          <div class="w-10 rounded-full">
            <img
              :src="user.picture || 'https://media.discordapp.net/attachments/775822548519616562/1274408624768417915/mangile_6FCE43F.png?ex=66d73d05&is=66d5eb85&hm=b0e1936e88485a4f1643a152edb224d695dc9e8cc4a129e26deafedf8a8a5d7e&'"
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
      </button>
      <button v-else>
        <a class="flex flex-col items-center" href="/sign-in">
          <Icon name="material-symbols:login" class="w-5 h-5" />
          <span class="text-sm/6">Giriş Yap</span></a
        >
      </button>
    </div>
  </main>
</template>
