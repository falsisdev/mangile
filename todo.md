# 📝 Yapılması Planlananlar

Mangile projesi için yapılması planlanan eylemler aşağıda listelenmiştir;

(Numaralandırma planlanan eylemin yapılma sırasına göredir, gruplandırma ise konu bazlıdır.)

### 🏠 Tüm sayfaları ilgilendiren değişiklikler

15 - Yükleme barı eklenecek. Böylece gereksiz yere `<a>` etiketi kullanılan yerlerde özel Nuxt router'ı `<NuxtLink>` etiketi kullanılabilecek. Ancak bunun için öncelikle Nuxt 3'e Loading Bileşeni (Component) eklenmeli. (Henüz yeni yayınlanan bir framework olduğundan mevcut değil.)<br>
18 - Tüm site son kontrolden geçecek, tasarımlar ve sistemler iyileştirilip tamamlanacak.<br>
19 - Domain (Alan Adı) alınacak (muhtemelen mangile.ga veya mangile.ml)
20 - Disqus yorumları eklenecek. Bu un için domain alınmalı çünkü site bağlantısı ile çalışıyor.

### 📃 Navbar ve Menüler ile ilgili değşiklikler

14 - Arama barı ve sonuçları iyileştirilecek. Arama barında henüz `enter` tuşuna basılmadan bazı mangalar gözükecek.<br>

### 🔎 Keşfet ile ilgili değişiklikler

1 - `/discover` sayfasında bulunan filtreleme tamamen düzeltilip bitirilecek.<br>
2 - `/discover` sayfasında ufak çaplı tasarım iyileştirmeleri yapılacak.<br>
3 - `/genre/[id]` sayfası `/discover` ile tam entegre edilecek, bunun sonucunda `/genre/[id]` sayfası kaldırılacak ve `/discover` sayfasında yapılan filtreleme sonucunda aranan türün keşfeti yüklenecek.<br>

### ⏳ Son Yüklenenler ile ilgili değişiklikler

4 - `/lastuploads/manga` sayfasının tasarımında ufak çaplı iyileştirmeler yapılacak.<br>
5 - cdn üzerinde yapılan büyük çaplı değişiklikler ardından `/lastuploads/episodes` sayfası eklenecek.<br>

### 📖 Manga sayfası ile ilgili değişiklikler

10 - `/manga/[id]` sayfasında 10 yıldızlı puanlama sistemi ile giriş yapan kullanıcıların mangayı puanlaması ve mangadex puan ortalaması haricinde bir de site içinde mangile puan ortalaması ortaya çıkması sağlanacak ve bu siteye entegre edilecek.<br>
13 - `Okunuyor/Okunacak/Okundu/Bırakıldı/Tekrar Okunuyor` olmak üzere mangaları otomatik ve dinamik (giriş yapan profile özel) listeleme eklenecek. Bu direkt olarak `/manga/[id]` sayfasına entegre edilecek.<br>

### ➕ Yeni eklenecek sayfalar ile ilgili değişiklikler

6 - Nuxt 3'ün otomatik desteklediği auth sistemi ve geliştirilen (post request) cdn ile basit kayıt giriş sistemi kodlanması sonucunda `/signup` ve `/login` sayfaları eklenecek ve tasarımları iyileştirilecek.<br>
7 - Giriş sisteminin sorunsuz tamamlanmasının ardından giriş yapan kullanıcı (localStorage ve cookies) için kendi profili ve diğer profillere erişme izni verilecek. Bunun üzerine `/user/[id]` sayfası açılacak. (Profil)<br>
8 - Profil sayfasının tasarım iyileştirmeleri ardından giriş yapan kullanıcının kendi profilini düzenlemesine izin verilecek. Bunun üzerine `/user/[id]/edit` dinamik sayfası eklenecek ve tasarımı iyileştirilecek.<br>
9 - Kullanıcılara rozet sistemi eklenecek. Yetkili olup olmadıkları geliştirilmiş cdn'e kaydedilecek ve yetkililere profil düzenleme (herkesin profili) izni verilecek.<br>
11 - Giriş yapan kullanıcıların kendi gizli listelerini oluşturmaları ve bu listeleri düzenlemeleri için `/list/[id]` ve `/list/[id]/edit` sayfaları eklenecek.<br>
12 - İlk başta gizli olarak yapılan listeler tüm kullanıcılara açılacak ve bu listeler yine Mangile site içinde yapılan beğeniler sonucunda beğeni sıralamasına göre liste keşfetinde beğenilmeyi bekleyecek. Bunun sonucunda `/discover/lists` sayfası eklenecek.<br>
16 - Yönetim Paneli (dashboard) eklenecek. Bunun sonucunda yalnızca yetkili rozetine sahip özel hesapların erişebileceği `/dashboard` (Bu sayfa istatistik içerir bol bol), `/dashboard/mangas/add`, `/dashboard/mangas/edit`, `/dashboard/mangas/delete` (Bunlar bölüm için geçerli) sayfaları (ve muhtemelen daha fazlası) eklenecek. Ayrıca yönetim paneli üzerinde belirli bir sayfaya sahip olmamasına rağmen direkt liste ve profil sayfalarından yalnızca yetkili hesapların erişebileceği düzenle, sil gibi aksiyon butonları eklenecek.<br>
17 - Bakım modu eklenecek. Bunun için yalnızca yetkili hesapların erişebileceği ve yönetim paneline bağlı `/dashboard/maintenance` sayfası eklenecek.<br>
