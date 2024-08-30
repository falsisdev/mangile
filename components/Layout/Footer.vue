<template>
  <footer class="footer p-10 bg-base-100 text-base-content">
    <aside>
      <NuxtLink to="/"
        ><img
          src="https://raw.githubusercontent.com/falsisdev/mangile/beta/src/assets/mangile_sun.svg"
          class="w-20 h-20"
          title="Logo"
      /></NuxtLink>
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
      <NuxtLink to="/article/rules" class="link link-hover"
        >Site Kuralları</NuxtLink
      >
      <a class="link link-hover">Gizlilik Prensipleri</a>
      <a class="link link-hover">Güvenlik İpuçları</a>
      <a class="link link-hover">Kullanıcı Sözleşmesi</a>
      <NuxtLink to="/article/about" class="link link-hover"
        >Hakkımızda</NuxtLink
      >
      <NuxtLink to="/article/contact" class="link link-hover"
        >İletişim</NuxtLink
      >
    </nav>
  </footer>
</template>
