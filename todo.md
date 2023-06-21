# 📝 Yapılması Planlananlar

Mangile projesi için yapılması planlanan eylemler aşağıda listelenmiştir;

(Numaralandırma planlanan eylemin yapılma sırasına göredir, gruplandırma ise konu bazlıdır.)

Planlananların Tahmini Ortalama Tamamlama Süresi: 63 günden az.

### 🏠 Tüm sayfaları ilgilendiren değişiklikler

12 - Tüm site son kontrolden geçecek, tasarımlar ve sistemler iyileştirilip tamamlanacak. (Ortalama 1-2 Gün)<br>
13 - Domain (Alan Adı) alınacak (muhtemelen mangile.ga veya mangile.ml)<br>
14 - Disqus yorumları eklenecek. Bunun için domain alınmalı çünkü site bağlantısı ile çalışıyor.<br>

### 📃 Navbar ve Menüler ile ilgili değşiklikler

9 - Arama barı ve sonuçları iyileştirilecek. Arama barında henüz `enter` tuşuna basılmadan bazı mangalar gözükecek. (Ortalama 6-7 Gün)<br>

### 🔎 Keşfet ile ilgili değişiklikler

✅

### ⏳ Son Yüklenenler ile ilgili değişiklikler

✅

### 📖 Manga sayfası ile ilgili değişiklikler

5 - `/manga/[id]` sayfasında 10 yıldızlı puanlama sistemi ile giriş yapan kullanıcıların mangayı puanlaması ve mangadex puan ortalaması haricinde bir de site içinde mangile puan ortalaması ortaya çıkması sağlanacak ve bu siteye entegre edilecek. (Ortalama 4-5 Gün)<br>
8 - `Okunuyor/Okunacak/Okundu/Bırakıldı/Tekrar Okunuyor` olmak üzere mangaları otomatik ve dinamik (giriş yapan profile özel) listeleme eklenecek. Bu direkt olarak `/manga/[id]` sayfasına entegre edilecek. (Ortalama 6-7 Gün)<br>

### ➕ Yeni eklenecek sayfalar ile ilgili değişiklikler

1 - Nuxt 3'ün otomatik desteklediği auth sistemi ve geliştirilen (post request) cdn ile basit kayıt giriş sistemi kodlanması sonucunda `/signup` ve `/login` sayfaları eklenecek ve tasarımları iyileştirilecek. (Ortalama 11-12 Gün)<br>
2 - Giriş sisteminin sorunsuz tamamlanmasının ardından giriş yapan kullanıcı (localStorage ve cookies) için kendi profili ve diğer profillere erişme izni verilecek. Bunun üzerine `/user/[id]` sayfası açılacak. (Profil) (Ortalama 1-2 Gün)<br>
3 - Profil sayfasının tasarım iyileştirmeleri ardından giriş yapan kullanıcının kendi profilini düzenlemesine izin verilecek. Bunun üzerine `/user/[id]/edit` dinamik sayfası eklenecek ve tasarımı iyileştirilecek. (Ortalama 5-6 Gün)<br>
4 - Kullanıcılara rozet sistemi eklenecek. Yetkili olup olmadıkları geliştirilmiş cdn'e kaydedilecek ve yetkililere profil düzenleme (herkesin profili) izni verilecek. (Ortalama 2-3 Gün)<br>
6 - Giriş yapan kullanıcıların kendi gizli listelerini oluşturmaları ve bu listeleri düzenlemeleri için `/list/[id]` ve `/list/[id]/edit` sayfaları eklenecek. (Ortalama 5-6 Gün)<br>
7 - İlk başta gizli olarak yapılan listeler tüm kullanıcılara açılacak ve bu listeler yine Mangile site içinde yapılan beğeniler sonucunda beğeni sıralamasına göre liste keşfetinde beğenilmeyi bekleyecek. Bunun sonucunda `/discover/lists` sayfası eklenecek. (Ortalama 7-8 Gün)<br>
10 - Yönetim Paneli (dashboard) eklenecek. Bunun sonucunda yalnızca yetkili rozetine sahip özel hesapların erişebileceği `/dashboard` (Bu sayfa istatistik içerir bol bol), `/dashboard/mangas/add`, `/dashboard/mangas/edit`, `/dashboard/mangas/delete` (Bunlar bölüm için geçerli) sayfaları (ve muhtemelen daha fazlası) eklenecek. Ayrıca yönetim paneli üzerinde belirli bir sayfaya sahip olmamasına rağmen direkt liste ve profil sayfalarından yalnızca yetkili hesapların erişebileceği düzenle, sil gibi aksiyon butonları eklenecek. (Ortalama 13-14 Gün)<br>
11 - Bakım modu eklenecek. Bunun için yalnızca yetkili hesapların erişebileceği ve yönetim paneline bağlı `/dashboard/maintenance` sayfası eklenecek. (Ortalama 2-3 Gün)<br>
