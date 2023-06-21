<template>
  <div class="col-span-1 col-start-1 col-end-2">
  <!--Sol Menü-->
  <ul class="menu w-64 p-2 h-full flex flex-col">
    <div class="divider"></div> 
    <!--Başlık 1-->
    <li class="menu-title">
      <span>Baş Sayfalar</span>
    </li>
    <!--{Başlık 1}-->
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/?theme=' + route.query.theme : '/'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-house"></font-awesome-icon></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialHome/></span> Anasayfa</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/discover?page=1&theme=' + route.query.theme : '/discover'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-compass"></font-awesome-icon></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialExplore/></span> Keşfet</NuxtLink></li>
    <!------------------------------------>
    <div class="divider"></div> 
    <!--Başlık 2-->
    <li class="menu-title">
      <span>İçerikler</span>
    </li>
    <!--{Başlık 2}-->
    <!------------------------------------>
    <li><a :href="route.query.theme ? '/lastuploads/episodes?theme=' + route.query.theme : '/lastuploads/episodes'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-file-circle-plus" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialFile/></span> Son Yüklenen Bölümler</a></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/lastuploads/manga?theme=' + route.query.theme : '/lastuploads/manga'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-folder-plus" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialFolder/></span> Son Yüklenen Mangalar</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/manga/random?theme=' + route.query.theme : '/manga/random'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-shuffle"></font-awesome-icon></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialShuffle/></span> Rastgele Manga</NuxtLink></li>
    <!------------------------------------>
    <div class="divider"></div>
    <!--Başlık 3-->
    <li class="menu-title">
      <span>Mühim Sayfalar</span>
    </li>
    <!--{Başlık 3}-->
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/ui?theme=' + route.query.theme : '/ui'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-users" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialPeople/></span> Kullanıcı Arayüzü</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/about?theme=' + route.query.theme : '/about'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-file-pen" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialAbout/></span> Hakkımızda</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/contact?theme=' + route.query.theme : '/contact'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-phone" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialPhone/></span> İletişim</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/terms?theme=' + route.query.theme : '/terms'"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-book-open-reader" /></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialTerms/></span> Hizmet Şartları</NuxtLink></li>
    <!------------------------------------>
    <div class="divider"></div>
    <!--Footer-->
    <li>
    <footer class="footer items-center p-4 bg-neutral text-neutral-content">
    <div class="items-center grid-flow-col">
      <img src="https://media.discordapp.net/attachments/775822548519616562/1043106785617260554/mangile_sun.png?width=384&height=384" width="32" height="32"/><br/>
      <p>Telif Hakkı © 2022 FalsisDev - Some rights reserved</p>
    </div> 
  </footer>
  </li>
  <!--{Footer}-->
  </ul>
  </div>
  <!--{Sol Menü}-->
</template>
<script setup>
const route = useRoute()
</script>