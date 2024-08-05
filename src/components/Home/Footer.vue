<script setup>
import { RouterLink } from "vue-router";
//////////////////////////////////////////////////////////
import logo from "../../assets/mangile_sun.svg";
//////////////////////////////////////////////////////////
</script>
<template>
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
</template>
