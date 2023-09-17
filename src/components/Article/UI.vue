<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <br />
  <article class="prose max-w-none">
    <h1>Kullanıcı Arayüzü</h1>
  </article>
  <br />
  <article class="prose max-w-none">
    Mangile kafanızı mı karıştırdı? Hmm... bu şaşırtıcı. Kullanıcı Arayüzünü
    (UI) olabildiğince anlaşılabilir yapmaya çalıştık ve anlaşılabilir olduğunu
    da düşünüyoruz. Ama merak etmeyin. Eğer yine de kafanızı karıştıran bir şey
    varsa bu sayfadan o şeyin ne olduğunu hızlıca öğrenebilirsiniz! Haydi
    başlayalım, bakalım Mangile Kullanıcı Arayüzü nasıl tasarlanmış...<br /><br />
    Öncelikle yukarıda bir menü görüyor olmanız gerekiyor. O menü "navbar"
    olarak adlandırılan bir bileşen ve site hakkında çoğu kısayolu içerisinde
    barındırıyor. Bu menü üzerinden bir çok yere hızlıca ulaşabilirsiniz. Şimdi
    bu menüdeki kullanıcı arayüzü nasıl tasarlanmış bir inceleyelim.<br /><br />
    Menüdeki butonlara tıklarken "hover" denilen ve yine buton görünümünde ufak
    değişiklikler meydana getiren bir olay daha var. Bunun nasıl gözüktüğü
    aşağıdaki görselde mevcut.<br />
    <img
      src="https://cdn.discordapp.com/attachments/775822548519616562/1148966985489719406/image.png"
    />
    Şimdi bu ayrıntılardan kurtulup bazı simgelerin ve yazıların ne anlama
    geldiğine bakalım. Aşağıdaki tablo, site içerisinde bulunan simgeler ve
    anlamlarını gösterir.
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Simge</th>
            <th>Anlamı</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr>
            <th>1</th>
            <td>
              <span><Icon icon="material-symbols:home" class="h-5 w-5" /></span>
            </td>
            <td>Ana Sayfa/Başlangıç</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <th>2</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-compass" /></span>
            </td>
            <td>Keşfet</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <th>3</th>
            <td>
              <span
                ><font-awesome-icon icon="fa-solid fa-file-circle-plus"
              /></span>
            </td>
            <td>Eklenen Dosyalar/Son Yüklenen Bölümler</td>
          </tr>
          <tr>
            <th>4</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-folder-plus" /></span>
            </td>
            <td>Eklenen Klasörler/Son Yüklenen Mangalar</td>
          </tr>
          <tr>
            <th>5</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-shuffle" /></span>
            </td>
            <td>Rastgele İçerik/Karıştır</td>
          </tr>
          <tr>
            <th>6</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-users" /></span>
            </td>
            <td>Birden fazla kullanıcıyı ilgilendiren içerik</td>
          </tr>
          <tr>
            <th>7</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-file-pen" /></span>
            </td>
            <td>Bilgilendirme Metni</td>
          </tr>
          <tr>
            <th>8</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-phone" /></span>
            </td>
            <td>İletişim</td>
          </tr>
          <tr>
            <th>9</th>
            <td>
              <span
                ><font-awesome-icon icon="fa-solid fa-book-open-reader"
              /></span>
            </td>
            <td>Yasal İçerik</td>
          </tr>
          <tr>
            <th>10</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-info" /></span>
            </td>
            <td>Bilgilendirme</td>
          </tr>
          <tr>
            <th>11</th>
            <td>
              <span
                ><font-awesome-icon icon="fa-solid fa-triangle-exclamation"
              /></span>
            </td>
            <td>Uyarı Bildirimi</td>
          </tr>
          <tr>
            <th>12</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-user" /></span>
            </td>
            <td>Bir kullanıcıyı ilgilendiren içerik</td>
          </tr>
          <tr>
            <th>13</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-gear" /></span>
            </td>
            <td>Ayarlar</td>
          </tr>
          <tr>
            <th>14</th>
            <td>
              <span
                ><font-awesome-icon icon="fa-solid fa-right-from-bracket"
              /></span>
            </td>
            <td>Çıkış Yap/Katıl</td>
          </tr>
          <tr>
            <th>15</th>
            <td>
              <span
                ><font-awesome-icon icon="fa-solid fa-clock-rotate-left"
              /></span>
            </td>
            <td>Belirli bir zaman belirtme</td>
          </tr>
          <tr>
            <th>16</th>
            <td></td>
            <td><span class="badge badge-accent">Önemli İçerik</span></td>
          </tr>
          <tr>
            <th>17</th>
            <td></td>
            <td><span class="badge badge-error">Tehlikeli İçerik</span></td>
          </tr>
          <tr>
            <th>18</th>
            <td>
              <span><font-awesome-icon icon="fa-solid fa-book-open" /></span>
            </td>
            <td>Tek Döküman/Bölüm</td>
          </tr>
        </tbody>
      </table>
    </div>
    Umuyorum ki bu tablo ve üstte verilen bilgiler sistemimizin kullanıcı
    arayüzünü anlamanıza yardımcı olacaktır. Lütfen hala anlamadığınız bir durum
    olursa, bize <RouterLink to="/contact">iletişim</RouterLink> adreslerimizden
    ulaşmaktan çekinmeyin.<br /><br />
    <div class="flex flex-row">
      <RouterLink to="/error"
        ><button class="btn btn-error m-2">
          Hata sayfasına buradan erişebilirsiniz
        </button></RouterLink
      >
    </div>
  </article>
</template>
