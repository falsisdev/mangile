<script setup>
import UserMust from "../../components/Home/UserMust.vue";
import MenuProfile from "../../components/Profile/Menu.vue";
//////////////////////////////////////////////////////////
const directsearch = () => {
  window.location.href = `/search?q=${
    document.getElementById("searchbar").value
  }`;
};
const search = () => {
  var input = document.getElementById("searchbar");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      window.location.href = `/search?q=${
        document.getElementById("searchbar").value
      }`;
    }
  });
};
</script>
<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <RouterLink
        :to="'/'"
        class="btn btn-ghost no-animation hover:bg-[transparent] bg-base-100 normal-case font-bold text-[20px]"
        ><img
          width="60"
          src="https://firebasestorage.googleapis.com/v0/b/mangile-2229f.appspot.com/o/assets%2Fimages%2Fmangile_logo.png?alt=media&token=0c80a04f-0611-425f-bad4-7d7339751aaa"
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
                <Suspense>
                  <UserMust />
                </Suspense>
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
          <div class="input-group input-group-sm mt-2">
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
</template>
