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
    <li><NuxtLink :to="route.query.theme ? '/?theme=' + route.query.theme : '/'"><span><font-awesome-icon icon="fa-solid fa-house"></font-awesome-icon></span> Anasayfa</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/discover?page=1&theme=' + route.query.theme : '/discover'"><span><font-awesome-icon icon="fa-solid fa-compass"></font-awesome-icon></span> Keşfet</NuxtLink></li>
    <!------------------------------------>
    <div class="divider"></div> 
    <!--Başlık 2-->
    <li class="menu-title">
      <span>İçerikler</span>
    </li>
    <!--{Başlık 2}-->
    <!------------------------------------>
    <li><a :href="route.query.theme ? '/lastuploads/episodes?theme=' + route.query.theme : '/lastuploads/episodes'"><span><font-awesome-icon icon="fa-solid fa-file-circle-plus" /></span> Son Yüklenen Bölümler</a></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/lastuploads/manga?theme=' + route.query.theme : '/lastuploads/manga'"><span><font-awesome-icon icon="fa-solid fa-folder-plus" /></span> Son Yüklenen Mangalar</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/manga/random?theme=' + route.query.theme : '/manga/random'"><span><font-awesome-icon icon="fa-solid fa-shuffle"> Rastgele Manga</font-awesome-icon></span> Rastgele Manga</NuxtLink></li>
    <!------------------------------------>
    <div class="divider"></div>
    <!--Başlık 3-->
    <li class="menu-title">
      <span>Mühim Sayfalar</span>
    </li>
    <!--{Başlık 3}-->
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/ui?theme=' + route.query.theme : '/ui'"><span><font-awesome-icon icon="fa-solid fa-users" /></span> Kullanıcı Arayüzü</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/about?theme=' + route.query.theme : '/about'"><span><font-awesome-icon icon="fa-solid fa-file-pen" /></span> Hakkımızda</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/contact?theme=' + route.query.theme : '/contact'"><span><font-awesome-icon icon="fa-solid fa-phone" /></span> İletişim</NuxtLink></li>
    <!------------------------------------>
    <li><NuxtLink :to="route.query.theme ? '/terms?theme=' + route.query.theme : '/terms'"><span><font-awesome-icon icon="fa-solid fa-book-open-reader" /></span> Hizmet Şartları</NuxtLink></li>
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