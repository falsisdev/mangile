<template>
  <!--LEFT MENU-->
  <div class="col-span-1 col-start-1 col-end-2">
  <ul class="menu shadow-lg w-64 p-2 h-full flex flex-col">
    <div class="divider"></div> 
    <li class="menu-title">
      <span>Baş Sayfalar</span>
    </li>
    <li><NuxtLink to="/"><span><font-awesome-icon icon="fa-solid fa-house"></font-awesome-icon></span> Anasayfa</NuxtLink></li>
    <li><a href="/discover"><span><font-awesome-icon icon="fa-solid fa-compass"></font-awesome-icon></span> Keşfet</a></li>
    <div class="divider"></div> 
    <li class="menu-title">
      <span>İçerikler</span>
    </li>
    <li><a><span><font-awesome-icon icon="fa-solid fa-file-circle-plus" /></span> Son Yüklenen Bölümler</a></li>
    <li><a href="/lastuploads/manga"><span><font-awesome-icon icon="fa-solid fa-folder-plus" /></span> Son Yüklenen Mangalar</a></li>
    <li><a href="/manga/random"><span><font-awesome-icon icon="fa-solid fa-shuffle"> Rastgele Manga</font-awesome-icon></span> Rastgele Manga</a></li>
    <div class="divider"></div>
    <li class="menu-title">
      <span>Mühim Sayfalar</span>
    </li>
    <li><NuxtLink to="/ui"><span><font-awesome-icon icon="fa-solid fa-users" /></span> Kullanıcı Arayüzü</NuxtLink></li>
    <li><NuxtLink to="/about"><span><font-awesome-icon icon="fa-solid fa-file-pen" /></span> Hakkımızda</NuxtLink></li>
    <li><NuxtLink to="/contact"><span><font-awesome-icon icon="fa-solid fa-phone" /></span> İletişim</NuxtLink></li>
    <li><NuxtLink to="/terms"><span><font-awesome-icon icon="fa-solid fa-book-open-reader" /></span> Hizmet Şartları</NuxtLink></li>
    <div class="divider"></div>
    <li>
    <footer class="footer items-center p-4 bg-neutral text-neutral-content">
    <div class="items-center grid-flow-col">
      <img src="https://media.discordapp.net/attachments/775822548519616562/1043106785617260554/mangile_sun.png?width=384&height=384" width="32" height="32"/><br/>
      <p>Telif Hakkı © 2022 FalsisDev - Some rights reserved</p>
    </div> 
  </footer>
  </li>
  </ul>
  </div>
  <!--LEFT MENU-->
</template>