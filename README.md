# Mangile
<img src="https://cdn.sanity.io/images/1yge7tlr/production/5da7fab2f4103d1f13847fdfc879637b6e40d8a7-426x240.gif">

**Dinamik, etkili ve kullanışlı manga/webtoon/roman okuma, takip etme ve paylaşma sistemi.**

Mangile, tüm Türkçe manga, webtoon ve roman çevirilerini tek bir çatı altında toplayarak kullanıcıya tek bir kaynaktan tamamen düzenli ve kafa karışıklığını önleyerek sunmayı amaçlayan bir projedir.

**Website (rc):** [mangile.vercel.app](https://mangile.vercel.app)
[Gitlab (rc)](https://gitlab.com/falsis/mangile), [GitHub (rc)](https://github.com/falsisdev/mangile)
Not: Proje hala geliştirme aşamasındadır, web sitesinde çeşitli hatalar bulunabilir.

---

## 📖 Proje Hakkında

Mangile, serileri resmi yayın sıralamasına göre ve sorunsuz bir şekilde sunarak takip etmeyi kolaylaştırır. Böylece çevirmen ve çevir ekiplerinin kimi zaman kendi çevirme işlemlerini kolaylaştırmak kimi zaman kendi web sitelerine daha kolay yüklemek amacıyla resmi yayınlanma sıralamasını ve düzenini görmezden gelerek rastgele ve/veya düzensiz şekilde bölümleri paylaşmasının kullanıcılarda yarattığı kafa karışıklığının önüne geçmek amaçlanır.

Kullanıcıların serilere yorum yapabileceği, paylaşabileceği, yeni seriler talep edebileceği; serileri, listeleri, bölümleri ve hatta sayfaları favorilerine ekleyebilecekleri; kendi listelerini oluşturup diledikleri gibi düzenleyebilecekleri ve okuma durumlarını çeşitli izleyiciler ile senkronize edip takip edebilecekleri bir nevi bir sosyal medya platformu oluşturmak misyon olarak belirlenmiştir.

Mangile ayrıca hem masaüstü hem de mobil cihazlarda rahatça kullanılabilen kullanıcı dostu bir okuyucuya sahiptir. Sistem bu okuyucuyu manga, webtoon ve romanlar için sunar.

## ✨ Özellikler

- **Okuyucu:** Manga, webtoon ve romanlar için özel okuyucu.
- **Profil İşlemleri:** Profili düzenleme, silme, kullanıcıları takip edip takip edilebilme.
- **İzleyici Senkronizasyonu:** Serileri MAL, Anilist, Kitsu, Simkl gibi çeşitli izleyicilerle senkronize etme.
- **Liste İşlemleri:** Özel listeler oluşturma, listeye seri ekleme, düzenleme, kaldırma ve listeyi silme.
- **Yorumlar:** Disqus entegrasyonu ile serilere yorum yapabilme.
- **Bildirimler:** Gelişmiş websocket bildirim sistemi.
- **SEO & Meta:** Gelişmiş SEO ve meta etiket desteği.

## 🛠️ Geliştirme Aşaması

Projenin güncel geliştirme aşaması aşağıdaki tabloda gösterilmektedir:

| Özellik                | Aşama 1 | Aşama 2 | Aşama 3 | Aşama 4 |
| ---------------------- | :-----: | :-----: | :-----: | :-----: |
| **Manhwa Okuyucu** |    ✅    |    ✅    |    ✅    |    ✅    |
| **Roman Okuyucu** |    ✅    |    ✅    |    ✅    |    ✅    |
| **Manga Okuyucu** |    ✅    |    ✅    |    ✅    |    ✅    |
| **Profil İşlemleri** |         |        |    ✅    |    ✅    |
| **İzleyici Senkronizasyonu** |         |        |    ✅    |    ✅    |
| **Liste İşlemleri** |         |  ✅       |    ✅    |    ✅    |
| **Yorumlar** |         |         |         |    ✅    |
| **Bildirimler** |         |         |         |    ✅    |
| **Gelişmiş SEO & Meta**|         |         |         |    ✅    |

- **Aşama 1:** İçerikleri sorunsuz bir şekilde okuyabilirsiniz.
- **Aşama 2:** Liste Görüntüleme aktiftir, düzenleme ve silme gibi işlemler geliştirme aşamasındadır.

Not: Kitaplık İşlemleri kaldırılacaktır. Yerine izleyici senkronizasyonu eklenecektir.

Yeni güncellemeler için projenin "releases" ve "projects" bölümlerini takip edebilirsiniz.

## 💻 Kullanılan Teknolojiler

- **Vue 3**
- **Nuxt 3**
- **Tailwind 4**
- **Shadcn-Vue**
- **TypeScript**
- **Sanity**
- **Logto**
- **Swiperjs**
- **Jikan API v4**

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi hale getirecektir! Katkıda bulunmak isterseniz, lütfen bir "issue" açın veya "pull request" gönderin.

1.  Projeyi "Fork" edin.
2.  Kendi branch'inizi oluşturun (`git checkout -b ozellik/yeni-ozellik`).
3.  Değişikliklerinizi "Commit" edin (`git commit -m 'feat: Yeni bir özellik eklendi'`).
4.  Branch'inizi "Push" edin (`git push origin ozellik/yeni-ozellik`).
5.  Bir "Pull Request" açın.
