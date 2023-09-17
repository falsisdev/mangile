<script setup>
import { RouterLink } from "vue-router";

const informations = [
  {
    name: "Çerezler ve Site Verileri",
    reason:
      "Çerezler hesabınızın bilgilerinin kullanmış olduğunuz web tarayıcısının çerez depolamasına kaydedilmesine olanak sağlayan basit bir sistemdir. Çerezlere verilen izin ile Mangile giriş bilgilerinizi tarayıcınıza kaydeder. Böylece daha sonra Mangile'a tekrar girdiğinizde hesabınıza tekrar giriş yapmanız gerekmez. Mangile web tarayıcısının çerezlerini okur ve hesabı otomatik olarak açar. Ayrıca çerezler sadece hesap giriş sisteminde değil geçmiş kayıt sisteminde de rol oynar. Çerezler bazı güvenlik sorunlarına yol açabilir ancak bu sorunların Mangile ile herhangi bir alakası yoktur. Eğer web tarayıcınızı doğru ve güvenli bir şekilde kullanırsanız hesap verileriniz sizin ve bizim aramızda sır olarak kalmaya devam eder. Tekrar hatırlatmak isteriz ki Mangile, sizin profil bilgilerinizi hiçbir şekilde sızdırmamaya özen gösterir.",
  },
  {
    name: "E-Posta Adresi",
    reason:
      "Hesabınıza kayıt olurken ve giriş yaparken kullanılan e-posta adresinin toplanmasının tek sebebi giriş sisteminin sorunsuz, doğru ve düzgün çalışması içindir. E-posta adresiniz başka hiçbir sebep için kullanılmaz. Size e-posta gönderilmez ve e-postalarınız görüntülenemez.",
  },
];
</script>
<template>
  <br />
  <article class="prose max-w-none">
    <h1>Gizlilik Prensipleri</h1>
  </article>
  <br />
  <article class="prose max-w-none">
    <p>
      Mangile'ın amacı kullanıcıların bilgilerini toplamak değildir. Dolayısıyla
      kullanıcılar aracılığıyla toplanan bilgiler spesifik bir amaç için
      kullanılmaz. Aşağıda kullanıcılardan toplanan veya toplanabilecek olan
      bilgiler ve kullanım amaçlarına dair bir tablo yer almaktadır:
    </p>
    <table class="table w-full">
      <thead>
        <tr>
          <th></th>
          <th>Toplanan Bilgi</th>
          <th>Bilginin İşlenme ve Kullanılma sebebi (muhtemel veya kesin)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of informations" :key="item">
          <th>{{ parseInt(informations.indexOf(item) + 1) }}</th>
          <td>
            <span>{{ item.name }}</span>
          </td>
          <td>{{ item.reason }}</td>
        </tr>
      </tbody>
    </table>
    <p>
      Büyük web sitelerinde bu tarz tablolar oldukça uzun olur ancak göründüğü
      gibi bu tablo Mangile için fazlasıyla kısa. Çünkü tabloda belirtilen
      veriler harici herhangi bir veri toplanmaz, depolanmaz ve çeşitli kurum,
      kuruluş veya şahıslara pazarlama, reklam vb. amaçlarla satılmaz veya
      verilmez. Bilgileriniz tamamen siz ve Mangile arasında bir sır olarak
      saklanır.
      <br />
      Eğer kişisel bilgilerinizin ihlale uğradığını, satıldığını, çalındığını
      veya Mangile taraflı bir sorun yüzünden kullanılamaz hale geldiğini
      düşünüyorsanız lütfen bize
      <RouterLink to="/article/contact">iletişim</RouterLink> adreslerimizden
      ulaşın. Tercihimiz e-posta göndermeniz olur. İyi eğlenceler dileriz.
    </p>
  </article>
</template>
