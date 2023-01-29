<template>
    <navbar/>
    <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
    <article class="prose max-w-none">
        <h1>Hakkımızda</h1>
    </article><br>
    <article class="prose max-w-none">
        <p>
        Merhaba, ben Falsis! Sitenin yapımcısıyım. Bu sayfada sen, değerli okuyucuya, bu web sitesinin nasıl kurulduğunu açıklayacağım. Arkana yaslan.
        </p>
        <h2>Neden "Mangile"?</h2>
        <p>
        Herkesin merak ettiği sorulardan biri, Mangile ismi nereden geliyor? Neden bu web sitesinin ismi Mangile?<br/>
        Bilmem, salladım.<br/>
        Açıkçası bu web sitesinin yapımına başlamadan önce <a class="link link-primary" href="https://github.com/Ani-Plus/website">Ani-Plus</a> isimli ufak çaplı, kullanıcıların ücretsiz anime izlemelerini sağlayan bir proje üzerinde çalışıyordum. Hala çalışıyor olsam muhtemelen iyi yerlere gelirdi ama, tutmayacağını düşünüp bıraktım. Ardından <a href="https://mangadex.org" class="link link-primary">MangaDex</a> isimli yabancı manga sitesinden manga okurken, kendi kendime dedim ki; "Ben neden bunun gibi türkçe bir site yapmıyorum ki?". Tabi hemen işe koyulmadım. Benim bu sonuçta nerde hemen işe koyulmak. Önce siteyi yapacak bir araç bulmam lazımdı. Hiç de zor olmadı tabii... Bu fikir aklıma geldiğinde <a href="https://nuxt.com" class="link link-success">Nuxt</a> henüz 2. versiyonundaydı ve çok ağır, hantal, yavaş bir framework idi. Ben de bir süre bekledim ve 1 ay kadar sonra rc (beta) sürümünden stabil sürüme geçiş yapan Nuxt 3'ü kullanmaya başladım. Biraz alıştıktan sonra hem <a href="https://vuejs.org" class="link link-success">Vue 3</a> hem <a href="https://vitejs.dev/" class="link link-warning">Vite</a> kullanan bu framework'ü Mangile için kullanmaya başladım. Daha sonra bir UI kütüphanesi kullanmam gerekti. Ben de bir süre <a href="https://next.vuetifyjs.com/en/" class="link link-accent">Vuetify</a> mı kullansam diye düşünürken, Material 3'ün henüz web için yayınlanmadığını hatırlayıp <a href="http://tailwindcss.com/" class="link link-primary">TailwindCSS</a> kullanmaya karar verdim. Tabiki bu yeterli değil. Şimdi bana "Ya kardeşim nesi yeterli değil, bal gibi şey işte." diyebilirsiniz ama ben çok tembel biriyimdir. Bana hazır componentler lazım ki kendim uzun uzun kod yazmaklar uğraşmayayım. Zaman falan kazanırız ya... Bu fikirden sonra da <a href="https://daisyui.com" class="link link-info">DaisyUI</a> kullanmakta karar kıldım.<br/><br/>
        Şimdi bazılarınızın "Ne anlatıyorsun be adam?! Ben ne anlayayım bu tür saçmalıklardan! Sadede gel sadede..." dediğine eminim. O zaman devam edelim:
        </p>
        <img class="shadow-lg rounded-lg" src="https://wallpaperaccess.com/full/4355954.jpg"/>
        <h3>Peki ya... Ben kimim?</h3>
        <p>
        Kimlik bilgilerimi size sızdıracağımı falan düşünmeyin. Kısaca kendimden bahsedeyim:
        Ben Falsis, Falsis Kremlin. Gerçek adım Kerem. İzmir, Türkiye'de yaşıyorum. Bu yazıyı yazarken 9. sınıfa giden bir lise öğrencisinden ibaretim. Yazılıma 5. sınıfta babamın çok meraklılığıyla başladım. Aslında babam başladı, 1 hafta sonra bıraktı gerçi ama... Ben devam ettim. Bu siteyi yapana kadar devam ettim. Hala daha devam ediyorum. Yeni şeyler öğrenmeyi seviyorum, tabiki ilgi çekici olmak şartıyla. Araştırmak hobimdir, ayrıca boş zamanımda Pes 2017 falan oynarım. 
        Benimle ilgili daha fazla bilgi istiyorsan seni meraklı okuyucu, <a href="https://falsis.ga" class="link link-primary">buraya</a> bakabilirsin.
        </p>
        <p>
            İşte böyle dostum! Bizimle iletişime geçmek için <NuxtLink :to="route.query.theme ? '/contact?theme=' + route.query.theme : '/contact'" class="link">iletişim</NuxtLink> sayfasına bakabilirsin. Sitenin Kullanıcı Arayüzü (UI) ile ilgili kafan karışıksa, <NuxtLink :to="route.query.theme ? '/ui?theme=' + route.query.theme : '/ui'" class="link">şuradan</NuxtLink> sitedeki işaretlerin ne anlama geldiğine bakabilirsin. İyi okumalar, sayanora!
        </p>
        <img class="shadow-lg rounded-lg" src="https://www.pixelstalk.net/wp-content/uploads/images6/Manga-Wallpaper-Free-Download.jpg"/>
    </article>
    </div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
</script>