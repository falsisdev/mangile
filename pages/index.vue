<template>
  <div class="col-span-2 col-start-2 col-end-8 my-5 ml-10"><!--page view-->
  <alert/>
  <br>
  <article class="prose max-w-none px-5 pt-5">
    <h1>Öne Çıkanlar</h1>
  </article><br/>
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
    :loop="true"
    :scrollbar="{
      hide: true,
    }"
    :freeMode="false"
    :modules="modules"
  >
    <swiper-slide v-for="item of highlights" v-bind:key="item"><div class="card lg:card-side w-auto h-auto bg-base-100 p-[10px] rounded-lg">
    <figure><img class=" w-64 h-72 rounded shadow-md" :src="item.image + '.512.jpg'" alt="Cover"/></figure>
    <div class="card-body">
      <h2 class="card-title">{{ item.name }}</h2>
      <p>{{ item.description }}</p>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-primary" :href="route.query.theme ? `/manga/${item.url}?theme=` + route.query.theme : `/manga/${item.url}`">Oku!</a>
      </div>
    </div>
  </div></swiper-slide>
  </swiper>

  <div class="divider"></div>
  <!--editörün seçimi-->
  <article class="prose max-w-none px-5">
    <h1>Editörün Seçimi</h1>
  </article>
  <div class="divider"></div>
  <div class="hero max-h-screen" :style="`background-image: url(${editorschoice.bigbg});`">
    <div class="hero-overlay bg-opacity-90"></div>
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img :src="editorschoice.cover" class="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-5xl font-bold">{{ editorschoice.name }}</h1>
        <p class="py-6">{{ editorschoice.description }}</p>
        <div class="dropdown dropdown-hover dropdown-top dropdown-start">
        <a class="btn btn-primary" :href='route.query.theme ? `/manga/e78a489b-6632-4d61-b00b-5206f5b8b22b?theme=` + route.query.theme : `/manga/e78a489b-6632-4d61-b00b-5206f5b8b22b`'>Devam Et!</a>
        <div class="card w-96 dropdown-content bg-base-100 shadow-xl image-full">
        <figure><img :src="editorschoice.bg" alt="Cover"/></figure>
        <div class="card-body">
          <h2 class="card-title">{{ editorschoice.name }}</h2>
          <p>{{ editorschoice.shortdesc }}</p>
        </div>
      </div>
      </div>
      </div>
    </div>
  </div>
  <!--editörün seçimi-->
  <div class="divider"></div>
  <!--şiddetle önerilen-->
  <article class="prose max-w-none px-5">
    <h1>Şiddetle Önerilen</h1>
  </article>
  <div class="divider"></div>
  <div class="hero max-h-screen" :style="`background-image: url(${highlyrecommended.bigbg});`">
    <div class="hero-overlay bg-opacity-90"></div>
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img :src="highlyrecommended.cover" class="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-5xl font-bold">{{ highlyrecommended.name }}</h1>
        <p class="py-6">{{ highlyrecommended.description }}</p>
        <div>
        <a class="btn btn-primary" :href='route.query.theme ? `/manga/8211bac6-a392-4e37-b3b6-dac0f4512d24?theme=` + route.query.theme : `/manga/8211bac6-a392-4e37-b3b6-dac0f4512d24`'>Devam Et!</a>
      </div>
      </div>
    </div>
  </div>
  <!--şiddetle önerilen-->
  </div><!--page view-->
  </template>
  <style scoped>
.swiper {
  width: 100%;
  height: 17%;
}

.swiper-slide {
  background: transparent;
}

.swiper-slide img {
  display: block;
  object-fit: cover;
}

  </style>
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Scrollbar, FreeMode, Pagination  } from 'swiper';

  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      const runtimeConfig = useRuntimeConfig();
      const route = useRoute()
      useHead({
        title: "Anasayfa"
      })
        function redirect(url) {
          window.location.href = url
        }
        const highlights = [{
          "name": "Vinland Saga",
          "description": "Çocukken Thorfinn, büyük Leif Ericson'un ayaklarının dibine oturdu ve çok batıdaki bir diyarın vahşi hikayeleriyle heyecanlandı. Ancak gençlik fantezileri, bir paralı asker baskını ile paramparça oldu. Ailesini öldüren Vikingler tarafından büyütülen Thorfinn, sonsuza dek grubun lideri Askeladd'ı ...",
          "image": "https://mangadex.org/covers/5d1fc77e-706a-4fc5-bea8-486c9be0145d/af345d2b-42c6-4c65-8a81-922086255795.jpg",
          "url": "5d1fc77e-706a-4fc5-bea8-486c9be0145d"
        },
        {
          "name": "Mushoku Tensei Isekai Ittara Honki Dasu",
          "description": "Tanımadığı birini trafik kazasından kurtarırken ölen 34 yaşındaki bir NEET büyülü bir dünyaya Rudeus Greyrat isminde yeni doğmuş bir bebek olarak reenkarne olur. Geçmiş hayatından ona kalan bilgisi, tecrübesi ve pişmanlıklarıyla beraber daha önce yaptığı yanlışları yapmadan dolu dolu bir hayat ya...",
          "image": "https://mangadex.org/covers/bd6d0982-0091-4945-ad70-c028ed3c0917/aa74e056-16b4-42e8-8526-976fdb5c8a38.jpg",
          "url": "bd6d0982-0091-4945-ad70-c028ed3c0917"
        },
        {
          "name": "Chainsaw Man",
          "description": "Denji’nin babası ölünce büyük bir borç üstüne kalır ve bunu ödeyebilmesinin hiçbir yolu yoktur. Ancak kurtardığı Pochita isimli iblis köpek sayesinde iblis avcılığı yaparak borcunu azar azar kapatır. Pochita’nın testere güçleri iblislere karşı işe yarıyordur. Denji öldüğünde Pochita kendini feda ...",
          "image": "https://mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/351cac60-4f6f-4548-95be-3189c9705c76.png",
          "url": "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b"
        },
        {
          "name": "Fumetsu no Anata e",
          "description": "Ölümsüz bir varlık yeryüzüne gönderildi ve tundranın ortasında yalnız yaşayan bir çocukla karşılaştı. Varlık, ölmekte olan şeylerin şeklini alabilir, ancak yalnızca 'itici güç' bir öncekinden daha güçlüyse... Sonsuz yaşarken varlık, ne tür deneyimler ve karşılaşmalarla karşılaşacaktır?",
          "image": "https://mangadex.org/covers/34e45b02-b5c8-4a4b-a21a-7b5059391dc8/cb213ae2-8e24-4498-9678-9b508a683d8b.jpg",
          "url": "34e45b02-b5c8-4a4b-a21a-7b5059391dc8"
        },
        {
          "name": "Monster",
           "description": "Monster, önde gelen bir hastanede gelecek vaat eden bir kariyere sahip ünlü bir cerrah olan parlak Dr. Kenzo Tenma'nın sürükleyici hikayesini anlatıyor. Tenma, ciddi şekilde yaralanmış genç bir çocuğun hayatını kurtarmak için itibarını ve gelecek vaat eden kariyerini riske atar. Onun haberi olmadan, bu çocuğun kaderinde korkunç bir kader var.",
           "image": "https://mangadex.org/covers/d9e30523-9d65-469e-92a2-302995770950/0b815f57-43ad-4782-a56f-bf9d0d034147.jpg",
           "url": "d9e30523-9d65-469e-92a2-302995770950"
        },
        {
          "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e: 2-nensei-hen",
          "description": "Advanced Nurturing Lisesi'nde ikinci bahar Ayanokoji ve Class D'yi karşılıyor. Sadece onları değil, eşsiz birinci sınıf öğrencilerini de özel sınavlar bekliyor. Kazuomi Hōsen ve Ryuen. Ryuen'in ortaokul yıllarında aralarındaki kötü şöhreti paylaşan ikili...",
          "image": "https://mangadex.org/covers/22c844da-1122-4ab3-b726-e7d4b7114254/bbf7ae70-f518-470d-8e9c-4b232b6e2925.jpg",
          "url": "22c844da-1122-4ab3-b726-e7d4b7114254"
        },
        {
          "name": "Pluto",
          "description": "Birisi - ya da bir şey - dünyanın en güçlü yedi robotunu arka arkaya yok ediyor; herhangi bir provokasyon olmaksızın onları vahşice dağıtmak. Yedi kişiden biri ve Avrupa Federasyonu için bir dedektif olan Gesicht, katili yakalamak için bir göreve çıkar… ve onu rüyalarında rahatsız eden belirsiz a...",
          "image": "https://mangadex.org/covers/e171c073-4415-499b-85bc-ea93825127ac/1e9f777a-71eb-4f93-8a35-6dc0205b391f.jpg",
          "url": "e171c073-4415-499b-85bc-ea93825127ac"
        },
        {
          "name": "Tokyo Ghoul",
          "description": "Tokyo'nun gölgeleri arasında gizlenen, 'ghoul' olarak bilinen ve gece çöktüğünde insanlardan beslenerek açlıklarını gideren ürkütücü varlıklar vardır. Şüphelenmeyen bir üniversite birinci sınıf öğrencisi olan Ken Kaneki, randevusunun etinden sonra bir hortlak olduğu ortaya çıkınca kendini insanl...",
          "image": "https://mangadex.org/covers/6a1d1cb1-ecd5-40d9-89ff-9d88e40b136b/98c90b96-db95-4c15-a407-eb70a3b6cf96.jpg",
          "url": "6a1d1cb1-ecd5-40d9-89ff-9d88e40b136b"
        },
        {
          "name": "20th Century Boys",
          "description": "20. yüzyılın sonunda yok olma tehlikesiyle karşı karşıya kalan insanlık, onlar olmasaydı yeni milenyuma giremezdi. 1969'da gençliklerinde bir sembol yarattılar. 1997'de, yaklaşan felaket yavaş yavaş ortaya çıkmaya başladığında, bu sembol geri döner. Bu, dünyayı kurtarmaya çalışan bir grup çocuğun...",
          "image": "https://mangadex.org/covers/ad06790a-01e3-400c-a449-0ec152d6756a/b86017fe-3ec9-41d8-904c-c5f8031eb7de.jpg",
          "url": "ad06790a-01e3-400c-a449-0ec152d6756a"
        },
        {
          "name": "Akatsuki no Yona",
          "description": "Yona, bir prensesin olması gerektiği gibi lüks ve tasasız bir hayat yaşayan Kouka Krallığı'nın tek prensesidir. Her şeye sahip: en iyi kıyafetler ve kozmetikler, en ilahi tatlılar, baba olarak sevgi dolu bir imparator ve herhangi bir kızın sahip olmayı umabileceği en ateşli kuzen Soo-won. Şimdi k...",
          "image": "https://mangadex.org/covers/3bb0279f-a01d-4aa4-93e4-305800f4b83e/d23b20af-524c-409e-b743-8660e9cae03a.jpg",
          "url": "3bb0279f-a01d-4aa4-93e4-305800f4b83e"
        }]
        const editorschoice = {
          "name": "Tensei Shitara Slime Datta Ken",
          "cover": "https://mangadex.org/covers/e78a489b-6632-4d61-b00b-5206f5b8b22b/7224be5b-c89a-47c7-b91a-5f616f7318fd.jpg",
          "bigbg": "https://mangadex.org/covers/e78a489b-6632-4d61-b00b-5206f5b8b22b/5050f112-017a-4343-8c17-17b1ccb2bd70.jpg",
          "bg": "https://i.pinimg.com/originals/da/63/80/da6380840ef3f438de14c7a5fef0395d.jpg",
          "description": "Sıradan Mikami Satoru, bir slasher tarafından bıçaklandıktan sonra kendini ölürken buldu. Yetersiz 37 yıllık yaşamının sonu olmalıydı ama gizemli bir ses duyduktan sonra kendini sağır ve kör buldu. Bir balçıkta reenkarne olmuştu! Mikami Satoru, zayıf ama ünlü slime olmaktan şikayet ederken ve aynı zamanda slime hayatının tadını çıkarırken, Felaket seviyesindeki canavar 'Storm Dragon Veldora' ile tanıştı ve kaderi değişmeye başladı.",
          "shortdesc": "Sıradan Mikami Satoru, bir slasher tarafından bıçaklandıktan sonra kendini ölürken buldu. Yetersiz 37 yıllık yaşamının sonu olmalıydı ama gizemli bir ses duyduktan sonra kendini sağır ve kör buldu. Bir balçıkta reenkarne olmuştu! Mikami Satoru, zayıf ama ünlü slime olmaktan şikayet ederken ve ayn..."
        }
        const highlyrecommended = {
          "name": "Re:Zero kara Hajimeru Isekai Seikatsu - Daiyonshou - Seiiki to Gouyoku no Majou",
          "cover": "https://mangadex.org/covers/8211bac6-a392-4e37-b3b6-dac0f4512d24/e62c2f68-b1b7-4b70-836d-f7e8bfcaaafa.jpg",
          "bigbg": "https://mangadex.org/covers/8211bac6-a392-4e37-b3b6-dac0f4512d24/838d7c62-a722-49c7-b44c-a63b378f4b89.jpg",
          "description": "Natsuki Subaru, beyaz balinayı ve 'Tembel' ölümcül günahın başpiskoposunu yener ve Emilia ile yeniden bir araya gelir. Acı bir ayrılığın üstesinden gelen ikili barışmıştır ama onları yeni bir kargaşa beklemektedir..."
        }
        return {
          runtimeConfig,
          route,
          redirect,
          highlights,
          editorschoice,
          highlyrecommended,
          modules: [Autoplay, Scrollbar, FreeMode, Pagination]
        }
    },
  }
  </script>