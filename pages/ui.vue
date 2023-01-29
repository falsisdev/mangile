<template>
    <navbar/>
    <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
    <article class="prose max-w-none">
        <h1>Kullanıcı Arayüzü</h1>
    </article><br>
    <article class="prose max-w-none">
        Mangile kafanızı mı karıştırdı? Hmm... bu şaşırtıcı. Kullanıcı Arayüzünü (UI) olaibldiğince anlaşılabilir yapmaya çalıştık ve anlaşılabilir olduğunu da düşünüyoruz. Ama merak etmeyin. Eğer yine de kafanızı karıştıran bir şey varsa bu sayfadan o şeyin ne olduğunu hızlıca öğrenebilirsiniz! Haydi başlayalım, bakalım Mangile Kullanıcı Arayüzü nasıl tasarlanmış...<br/><br/>
        Öncelikle solda bir menü görüyor olmanız gerekiyor. O menü "leftmenu" bileşeni olarak geçiyor ve site hakkında çoğu kısayolu içerisinde barındırıyor. Bu menü üzerinden bir çok yere hızlıca ulaşabilirsiniz. Şimdi bu menüdeki kullanıcı arayüzü nasıl tasarlanmış bir inceleyelim.<br/><br/>
        Menüdeki herhangi bir bölüme tıkladığınızca, eğer bu bölüm sayfayı yeniden yüklemiyorsa, aşağıdaki gibi butonda bir arkaplan değişikliği meydana gelir. Bu hangi sayfada olduğunuzu gösterir. Ayrıca boş bir alana tıklarsanız yok olur.
        <div class="flex flex-row">
        <img src="https://cdn.discordapp.com/attachments/775822548519616562/1068900798559420487/image.png">
        <img src="https://cdn.discordapp.com/attachments/775822548519616562/1068901292493262969/image.png">
        </div>
        Ayrıca bu butonlara tıklarken "hover" denilen ve yine buton görünümünde ufak değişiklikler meydana getiren bir olay daha var. Bunun nasıl gözüktüğü de yukarıdaki resimde mevcut.<br/>
        Şimdi bu ayrıntılardan kurtulup bazı simgelerin ve yazıların ne anlama geldiğine bakalım. Aşağıdaki tablo, site içerisinde bulunan simgeler ve anlamlarını gösterir.
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
                <td><span><font-awesome-icon icon="fa-solid fa-house"/></span></td>
                <td>Ana Sayfa/Başlangıç</td>
            </tr>
            <!-- row 2 -->
            <tr>
                <th>2</th>
                <td><span><font-awesome-icon icon="fa-solid fa-compass"/></span></td>
                <td>Keşfet</td>
            </tr>
            <!-- row 3 -->
            <tr>
                <th>3</th>
                <td><span><font-awesome-icon icon="fa-solid fa-file-circle-plus"/></span></td>
                <td>Eklenen Dosyalar/Son Yüklenen Bölümler</td>
            </tr>
            <tr>
                <th>4</th>
                <td><span><font-awesome-icon icon="fa-solid fa-folder-plus"/></span></td>
                <td>Eklenen Klasörler/Son Yüklenen Mangalar</td>
            </tr>
            <tr>
                <th>5</th>
                <td><span><font-awesome-icon icon="fa-solid fa-shuffle"/></span></td>
                <td>Rastgele İçerik/Karıştır</td>
            </tr>
            <tr>
                <th>6</th>
                <td><span><font-awesome-icon icon="fa-solid fa-users"/></span></td>
                <td>Birden fazla kullanıcıyı ilgilendiren içerik</td>
            </tr>
            <tr>
                <th>7</th>
                <td><span><font-awesome-icon icon="fa-solid fa-file-pen"/></span></td>
                <td>Bilgilendirme Metni</td>
            </tr>
            <tr>
                <th>8</th>
                <td><span><font-awesome-icon icon="fa-solid fa-phone"/></span></td>
                <td>İletişim</td>
            </tr>
            <tr>
                <th>9</th>
                <td><span><font-awesome-icon icon="fa-solid fa-book-open-reader"/></span></td>
                <td>Yasal İçerik</td>
            </tr>
            <tr>
                <th>10</th>
                <td><span><font-awesome-icon icon="fa-solid fa-info"/></span></td>
                <td>Bilgilendirme</td>
            </tr>
            <tr>
                <th>11</th>
                <td><span><font-awesome-icon icon="fa-solid fa-triangle-exclamation"/></span></td>
                <td>Uyarı Bildirimi</td>
            </tr>
            <tr>
                <th>12</th>
                <td><span><font-awesome-icon icon="fa-solid fa-user"/></span></td>
                <td>Bir kullanıcıyı ilgilendiren içerik</td>
            </tr>
            <tr>
                <th>13</th>
                <td><span><font-awesome-icon icon="fa-solid fa-gear"/></span></td>
                <td>Ayarlar</td>
            </tr>
            <tr>
                <th>14</th>
                <td><span><font-awesome-icon icon="fa-solid fa-right-from-bracket"/></span></td>
                <td>Çıkış Yap/Katıl</td>
            </tr>
            <tr>
                <th>15</th>
                <td><span><font-awesome-icon icon="fa-solid fa-clock-rotate-left"/></span></td>
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
                <td><span><font-awesome-icon icon="fa-solid fa-book-open"/></span></td>
                <td>Tek Döküman/Bölüm</td>
            </tr>
            </tbody>
        </table>
        </div>
        Umuyorum ki bu tablo ve üstte verilen bilgiler sistemimizin kullanıcı arayüzünü anlamanıza yardımcı olacaktır. Lütfen hala anlamadığınız bir durum olursa, bize <NuxtLink :to="route.query.theme ? '/contact?theme=' + route.query.theme : '/contact'">iletişim</NuxtLink> adreslerimizden ulaşmaktan çekinmeyin.<br/><br/>
        <div class="flex flex-row">
        <NuxtLink :to="route.query.theme ? '/?theme=' + route.query.theme : '/'"><button class="btn m-2">Ana Sayfaya Dön</button></NuxtLink>
        <NuxtLink :to="route.query.theme ? '/error?theme=' + route.query.theme : '/error'"><button class="btn btn-error m-2">Hata sayfasına buradan erişebilirsiniz</button></NuxtLink>
        </div>
    </article>
    </div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
</script>