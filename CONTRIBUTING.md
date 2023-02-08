# Projeye Nasıl Katkım Sağlarım?
Mangile, geliştirici prensipleri sebebiyle açık kaynak bir şekilde geliştirilen ve eğer diğer geliştiricilerin de isterse katkı sağlayabileceği bir projedir. Eğer Mangile'ın çalışma prensibini anlıyorsanız ve teknolejileri kullanabiliyorsanız, bize dilediğinizce destek olabilirsiniz.

## 🤔 Katkı Sağlamak için Ne Yapmalıyım?
Projeye katkı sağlamak için yapmanız gereken fazla bir şey yok aslında. Tek yapmanız gereken şuanda okuudğunuz GitHub deposunda bulunan "Pull Requests" bölümünden bize Pull Request göndermek ve kabul edilmesini beklemek.

## 📩 Pull Request Nasıl Gönderilir?
Eğer GitHub üzerinden bir Pull Request göndermeyi bilmiyorsanız, [buradaki](https://medium.com/@noteCe/github-ile-fork-ve-pull-request-be6077342834) bağlantıdan Türkçe bir şekilde öğrenebilirsiniz.

## 😜 Troll Pull Request'ler
Lütfen bu özelliği insanlara zarar verecek veya şaka yaptığını ve komik olduğunu düşünecek şekilde kullanmayın. Troll Pull Request'ler kabul edilmez ve kullanıcı depodan yasaklanır.

### Katkılarınızı bekliyoruz.

# ⚠️ Hangi dosyanın nerede olduğuyla ilgili bilgilendirme.
Projeye katkı sağlamak için gereken Vue 3, Nuxt 3 teknolojilerini ve tailwind'in kullanımını bilme şartlarını karşıladınız. Fakat yine de projede hangi dosyanın nerede olduğunu anlamanız çok uzun sürecektir. Bunun için size her dosyayla ilgili bilgilendirme yapacağım.

1. `/nuxt.config.ts`

Bildiğiniz üzere dosya içinde tüm Nuxt yapılandırması yer alıyor. Şimdi yapılandırmalara bakalım.

```ts
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
      ],
    app: {
      head: {
        link: [ { rel: "https://unpkg.com/vue-simple-markdown/dist/vue-simple-markdown.css" }, { rel: "icon", href: "https://media.discordapp.net/attachments/775822548519616562/1043106785617260554/mangile_sun.png?size=4096"}],
        script: [ { src: "https://unpkg.com/vue-simple-markdown" }]
      }
    },
    runtimeConfig: {
      public: {
        token: process.env.token,
        theme: "dracula"
      }
    },
})
```

`@nuxtjs/tailwindcss` modülü tüm kullanıcı arayüzü için tailwind kütüphanesini entegre ediyor. @nuxt/content ise ileride kullanılması için orada durmalı.
`app` kısmında favicon ve vue-simple-markdown cdni içe aktarılmış.
`runtimeConfig` kısmında ise token ve theme tanımlı. Token env'den çekiliyor ve gizli. Theme ise default olarak dracula şeklinde ayarlanmış. Sayfalara göre değiştirilebiliyor.

2. `/tailwind.config.js`

Burada ise tüm kullanıcı arayüzü yapılanırması bulunuyor.

```js
export const plugins = [require("@tailwindcss/typography"), require("daisyui")];
export const daisyui = {
  styled: true,
  themes: [
    ...
  ],
  base: true,
  utils: true,
  logs: true,
  rtl: false,
  prefix: "",
};
```

`plugins` kısmında elementleri şekillendirmek için typography içe aktarılmış. Ayrıca yine tüm kullanıcı arayüzünde kullanılan daisyui da burada içe aktarılıyor. Alttaki kısım ise daisyui yapılandırması. Temalar kısmında özel ve otomatik temalar ayarlanmış. Buradaki isimler ile sayfalardaki temalar ayarlanıyor. Ayrıca herhangi bir class prefici atanmamış.

3. `/pages` klasörü

Bütün endpointler buradaki sayfaları yükler. İsimleri sayfaların endpointlerini belirler. `/pages/index.vue` ana sayfa, diğerleri ise diğer sayfalardır.

```html
<div :data-theme="route.query.preview ? route.query.preview == 'none' ? runtimeConfig.public.theme : route.query.preview : route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
```

Neredeyse tüm sayfada yer alan bu kısımda preview ve diğer tema ayarlanmalar atanmış. Ayrıca sayfanın 6 kısımdan oluşan gridi de ayarlı. Componentler ise üstünde ve altında bulunuyor.

Script tagi useHead() sayfa başlığını belirlemek için var.

4. `/components` klasörü

Burada sol menü, navbar ve alert bulunuyor. Navbarda bir çok ayar ayarlanmış. Örneğin;

```ts
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Mangile` : 'Mangile';
    }
  })
```

Burada titleChunk ayarlanmış. Yani pages klasöründe tüm sayfalara verilen başlıkların hepsinin yanına | Mangile ekliyor. Başlık yok ise sadece Mangile yazıyor.

Ayrıca temalar da bu sayfa üzerinden ayarlanıyor.

```ts
function preview(){
  window.location.href = `/?preview=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`
}
function theme(){
  window.location.href = `/?theme=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`
  localStorage.setItem("theme", `${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`)
}
```

Eğer önizleme tuşuna basıldıysa preview(), tema ayarla tuşuna basıldıysa theme() tetikleniyor.

```ts
localStorage.setItem("theme", `${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`)
```

Bu kodun üst kısmında sayfayı tema ayarlı bir şekilde yönlendirirken bu kodda localstorage'a ayarlanan temayı kaydediyor. Aynı şeyi önizlemede yapmıyor. Temalar value'lere göre çekiliyor, kod bu yüzden bu kadar uzun.

```ts
function search() {
var input = document.getElementById("searchbar");
input.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
  event.preventDefault();
  window.location.href = route.query.theme ? `/search?q=${document.getElementById("searchbar").value}&theme=${route.query.theme}` : `/search?q=${document.getElementById("searchbar").value}`
}
}); 
}
function directsearch() {
  window.location.href = route.query.theme ? `/search?q=${document.getElementById("searchbar").value}&theme=${route.query.theme}` : `/search?q=${document.getElementById("searchbar").value}`
}
```

Yukarıdaki fonksiyon içinde bir event listener bulunuyor. Bu listener enter tuşuna basılıp basılmadığını dinliyor ve basıldığında arama sayfasına yönlendiriyor. Alttaki ise arama barının sağındaki butona basıldığında tetikleniyor. O da aynı şekilde arama sayfasına yönlendiriyor.

5. `/plugins` Klasörü

Burada eklentiler bulunuyor. Bir göz atalım.

`/plugins/fontawesome.js` dosyası hazır ve web iconları yüklemek için bulunan font awesome eklentisini yüklüyor.

`/plugins/mounted.ts` dosyasını ise kendim yazdım. Buna bir bakalım.

```ts
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        var searchParams = new URLSearchParams(window.location.search);
        document.body.clientWidth < 1100 ? window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : ''
        if(localStorage.getItem("theme")) {
            if(localStorage.getItem("theme") != 'none') {
                if(!searchParams.get("theme")) {
                if(!searchParams.get("preview")) {
                searchParams.set("theme", String(localStorage.getItem("theme")))
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);
                window.location.reload();
                }
                }
            }
        }
        /*
        if(!localStorage.getItem("username") && !localStorage.getItem("password")) {
            if(!window.location.pathname.endsWith("/signup")) window.location.href = '/signup'
        }
        */
     })
})
```

nuxtApp.hook kısmında app:mounted ayarlanmış. Bu demektir ki sayfa yüklendiği zaman bu kod tetiklenecek. searchParams ile queryler çekiliyor. Onun altında bulunan kodda ise ekranı 1100pxden küçük olan cihazlar siteden engelleniyor çünkü site responsive değil.

if kısmında ise eğer localstorage'da theme varsa bu temayı sayfaya query olarak atıyor ve sayfayı yenden yüklüyor. Ancak bunu preview querysi varsa yani mod önizleme modu ise yapmıyor. Ayrıca localstorage'da theme yoksa hiçbr şey yapmıyor.

Alttaki yorum satırı henüz kodlanmamış kayıt sistemi için. Yakında ekleyeceğim.

6. `/error.vue`

Burası eğer bir hata varsa açılan sayfa. İçi diğer pages klasöründeki sayfalardan farksız.

### Katkılarınızı bekliyoruz.