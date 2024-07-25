<template>
  <div v-if="route.query.connected" class="toast toast-bottom toast-end z-10">
    <div class="alert alert-success">
      <span>Profil Sunucuya Başarıyla Bağlandı</span>
    </div>
  </div>
  <br />
  <article class="prose max-w-none px-5 pt-5">
    <h1>Öne Çıkanlar</h1>
  </article>
  <br />
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
    <swiper-slide v-for="item of highlights" v-bind:key="item"
      ><div
        class="card lg:card-side w-auto h-auto bg-base-100 p-[10px] rounded-lg"
      >
        <figure>
          <img
            class="w-64 h-72 rounded shadow-md"
            :src="item.image + '.512.jpg'"
            alt="Cover"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <div class="dropdown dropdown-hover dropdown-top flex justify-end">
            <a class="btn btn-primary" :href="`/manga/${item.url}`">Oku!</a>
          </div>
        </div>
      </div></swiper-slide
    >
  </swiper>

  <div class="divider"></div>

  <!--editörün seçimi-->
  <article class="prose max-w-none px-5">
    <h1>Editörün Seçimi</h1>
  </article>
  <div class="divider"></div>
  <div
    class="hero max-h-screen"
    :style="`background-image: url(${editorschoice.bigbg});`"
  >
    <div class="hero-overlay bg-opacity-90 bg-base-200"></div>
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img :src="editorschoice.cover" class="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-5xl font-bold">{{ editorschoice.name }}</h1>
        <p class="py-6">{{ editorschoice.description }}</p>
        <div class="dropdown dropdown-hover dropdown-top dropdown-start">
          <a
            class="btn btn-primary"
            href="/manga/8211bac6-a392-4e37-b3b6-dac0f4512d24"
            >Devam Et!</a
          >
          <div
            class="card w-96 dropdown-content bg-base-100 shadow-xl image-full"
          >
            <figure><img :src="editorschoice.bg" alt="Cover" /></figure>
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
  <div
    class="hero max-h-screen"
    :style="`background-image: url(${highlyrecommended.bigbg});`"
  >
    <div class="hero-overlay bg-opacity-90 bg-base-200"></div>
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img
        :src="highlyrecommended.cover"
        class="max-w-sm rounded-lg shadow-2xl"
      />
      <div>
        <h1 class="text-5xl font-bold">{{ highlyrecommended.name }}</h1>
        <p class="py-6">{{ highlyrecommended.description }}</p>
        <div>
          <a
            class="btn btn-primary"
            href="/manga/b35f67b6-bfb9-4cbd-86f0-621f37e6cb41"
            >Devam Et!</a
          >
        </div>
      </div>
    </div>
  </div>
  <!--şiddetle önerilen-->
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
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Scrollbar, FreeMode, Pagination } from "swiper/modules";
import { useRoute } from "vue-router";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const route = useRoute();
    const highlights = [
      {
        name: "Kimi no na wa.",
        description:
          "Hikaye, Japonya'da bin yıl sonra ilk kez bir kuyruklu yıldızın düşmesinden bir ay sonra geçiyor. Kırsal kesimde yaşayan liseli bir kız olan Mitsuha, taşradaki hayattan bıktığı için şehirde yaşamak istemektedir. Sonra Taki var. Arkadaşlarıyla birlikte Tokyo'da yaşayan ve bir İtalyan restoranında y...",
        image:
          "https://mangadex.org/covers/c071276e-abd4-4711-8b14-544431eb152a/fc610180-01ea-48bf-9ec7-b84e07d4a390.jpg",
        url: "c071276e-abd4-4711-8b14-544431eb152a",
      },
      {
        name: "Mushoku Tensei Isekai Ittara Honki Dasu",
        description:
          "Tanımadığı birini trafik kazasından kurtarırken ölen 34 yaşındaki bir NEET büyülü bir dünyaya Rudeus Greyrat isminde yeni doğmuş bir bebek olarak reenkarne olur. Geçmiş hayatından ona kalan bilgisi, tecrübesi ve pişmanlıklarıyla beraber daha önce yaptığı yanlışları yapmadan dolu dolu bir hayat ya...",
        image:
          "https://mangadex.org/covers/bd6d0982-0091-4945-ad70-c028ed3c0917/aa74e056-16b4-42e8-8526-976fdb5c8a38.jpg",
        url: "bd6d0982-0091-4945-ad70-c028ed3c0917",
      },
      {
        name: "Chainsaw Man",
        description:
          "Denji’nin babası ölünce büyük bir borç üstüne kalır ve bunu ödeyebilmesinin hiçbir yolu yoktur. Ancak kurtardığı Pochita isimli iblis köpek sayesinde iblis avcılığı yaparak borcunu azar azar kapatır. Pochita’nın testere güçleri iblislere karşı işe yarıyordur. Denji öldüğünde Pochita kendini feda ...",
        image:
          "https://mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/351cac60-4f6f-4548-95be-3189c9705c76.png",
        url: "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b",
      },
      {
        name: "Oshi no Ko",
        description:
          "Hikaye güzel bir kızla, onun mükemmel sahte gülümsemesiyle ve onu bu yüzden bencilce seven insanlarla başlıyor. Gösteriş dünyasının ışıltılı dünyasının perde arkasında neler oluyor? Sevdiğiniz idolünüz uğruna ne kadar ileri gidersiniz? Reenkarnasyonun gerçek olduğunu öğrenseydiniz ne yapardınız?",
        image:
          "https://mangadex.org/covers/296cbc31-af1a-4b5b-a34b-fee2b4cad542/9db21e39-9095-4643-a93b-67af791676b2.jpg",
        url: "296cbc31-af1a-4b5b-a34b-fee2b4cad542",
      },
      {
        name: "Monster",
        description:
          "Monster, önde gelen bir hastanede gelecek vaat eden bir kariyere sahip ünlü bir cerrah olan parlak Dr. Kenzo Tenma'nın sürükleyici hikayesini anlatıyor. Tenma, ciddi şekilde yaralanmış genç bir çocuğun hayatını kurtarmak için itibarını ve gelecek vaat eden kariyerini riske atar. Onun haberi olmadan, bu çocuğun kaderinde korkunç bir kader var.",
        image:
          "https://mangadex.org/covers/d9e30523-9d65-469e-92a2-302995770950/0b815f57-43ad-4782-a56f-bf9d0d034147.jpg",
        url: "d9e30523-9d65-469e-92a2-302995770950",
      },
      {
        name: "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e: 2-nensei-hen",
        description:
          "Advanced Nurturing Lisesi'nde ikinci bahar Ayanokoji ve Class D'yi karşılıyor. Sadece onları değil, eşsiz birinci sınıf öğrencilerini de özel sınavlar bekliyor. Kazuomi Hōsen ve Ryuen. Ryuen'in ortaokul yıllarında aralarındaki kötü şöhreti paylaşan ikili...",
        image:
          "https://mangadex.org/covers/22c844da-1122-4ab3-b726-e7d4b7114254/bbf7ae70-f518-470d-8e9c-4b232b6e2925.jpg",
        url: "22c844da-1122-4ab3-b726-e7d4b7114254",
      },
      {
        name: "Pluto",
        description:
          "Birisi - ya da bir şey - dünyanın en güçlü yedi robotunu arka arkaya yok ediyor; herhangi bir provokasyon olmaksızın onları vahşice dağıtmak. Yedi kişiden biri ve Avrupa Federasyonu için bir dedektif olan Gesicht, katili yakalamak için bir göreve çıkar… ve onu rüyalarında rahatsız eden belirsiz a...",
        image:
          "https://mangadex.org/covers/e171c073-4415-499b-85bc-ea93825127ac/1e9f777a-71eb-4f93-8a35-6dc0205b391f.jpg",
        url: "e171c073-4415-499b-85bc-ea93825127ac",
      },
      {
        name: "Tokyo Ghoul",
        description:
          "Tokyo'nun gölgeleri arasında gizlenen, 'ghoul' olarak bilinen ve gece çöktüğünde insanlardan beslenerek açlıklarını gideren ürkütücü varlıklar vardır. Şüphelenmeyen bir üniversite birinci sınıf öğrencisi olan Ken Kaneki, randevusunun etinden sonra bir hortlak olduğu ortaya çıkınca kendini insanl...",
        image:
          "https://mangadex.org/covers/6a1d1cb1-ecd5-40d9-89ff-9d88e40b136b/98c90b96-db95-4c15-a407-eb70a3b6cf96.jpg",
        url: "6a1d1cb1-ecd5-40d9-89ff-9d88e40b136b",
      },
      {
        name: "20th Century Boys",
        description:
          "20. yüzyılın sonunda yok olma tehlikesiyle karşı karşıya kalan insanlık, onlar olmasaydı yeni milenyuma giremezdi. 1969'da gençliklerinde bir sembol yarattılar. 1997'de, yaklaşan felaket yavaş yavaş ortaya çıkmaya başladığında, bu sembol geri döner. Bu, dünyayı kurtarmaya çalışan bir grup çocuğun...",
        image:
          "https://mangadex.org/covers/ad06790a-01e3-400c-a449-0ec152d6756a/b86017fe-3ec9-41d8-904c-c5f8031eb7de.jpg",
        url: "ad06790a-01e3-400c-a449-0ec152d6756a",
      },
      {
        name: "Akatsuki no Yona",
        description:
          "Yona, bir prensesin olması gerektiği gibi lüks ve tasasız bir hayat yaşayan Kouka Krallığı'nın tek prensesidir. Her şeye sahip: en iyi kıyafetler ve kozmetikler, en ilahi tatlılar, baba olarak sevgi dolu bir imparator ve herhangi bir kızın sahip olmayı umabileceği en ateşli kuzen Soo-won. Şimdi k...",
        image:
          "https://mangadex.org/covers/3bb0279f-a01d-4aa4-93e4-305800f4b83e/d23b20af-524c-409e-b743-8660e9cae03a.jpg",
        url: "3bb0279f-a01d-4aa4-93e4-305800f4b83e",
      },
    ];
    const editorschoice = {
      name: "Re:Zero kara Hajimeru Isekai Seikatsu - Daiyonshou - Seiiki to Gouyoku no Majou",
      cover:
        "https://mangadex.org/covers/8211bac6-a392-4e37-b3b6-dac0f4512d24/a028d0be-c055-4553-9079-9c8299b4e022.jpg",
      bigbg: "https://giffiles.alphacoders.com/132/132658.gif",
      bg: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ae67dbcc-91f7-4369-a654-3159c9f4a09f/dffygtb-27fa2b7a-440a-4e91-9203-4e26d4f6e6cf.jpg/v1/fill/w_1280,h_720,q_75,strp/high_quality_re_zero_4k_wallpaper_by_sdugoten_dffygtb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvYWU2N2RiY2MtOTFmNy00MzY5LWE2NTQtMzE1OWM5ZjRhMDlmXC9kZmZ5Z3RiLTI3ZmEyYjdhLTQ0MGEtNGU5MS05MjAzLTRlMjZkNGY2ZTZjZi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.gTSRYaWR-AtGRyj_OnfqMnx6NMhwD6ek3LV41zLQacM",
      description:
        "Marketten çıkan Subaru Natsuki, insanların ve yarı insanların yaşadığı kalabalık bir kasabayla karşılaşır. Ejderhaları ve arabaları ulaşım aracı olarak kullanan kasabanın, onun aşina olduğu günümüz Japonya'sı olmadığı açıktır. Ancak günlerini çizgi romanlara ve oyunlara dalarak geçiren biri olarak Subaru, kendisinin bu yeni fantezi dünyasında üstün büyülü güçlere sahip bir kahraman olduğunu varsayıyor. Ne yazık ki durum böyle değildir ve bir grup haydutla karşılaştığında işler hızla ters gider. Neyse ki, çalınan nişanını ararken Satella adında gümüş saçlı bir güzel onu kurtarmaya gelir. Subaru, nezaketinin karşılığında aramaya yardım etmeyi teklif eder ve bu da sonunda onları bir ganimet dükkanına götürür.",
      shortdesc:
        "Natsuki Subaru, beyaz balinayı ve 'Tembellik' ölümcül günahının başpiskoposunu yener ve Emilia ile yeniden bir araya gelir. Acı dolu bir ayrılığın ardından barışan ikiliyi yeni bir çalkantı beklemektedir...",
    };
    const highlyrecommended = {
      name: "Tomodachi Game",
      cover:
        "https://mangadex.org/covers/b35f67b6-bfb9-4cbd-86f0-621f37e6cb41/ce7d5868-a35a-4a0e-91cb-5cada3cc0108.jpg",
      bigbg: "https://media.tenor.com/7_9U0vnY2o0AAAAC/tomodachi-game.gif",
      description:
        "Katagiri Yuichi, arkadaşların paradan daha önemli olduğuna inanıyor ama aynı zamanda yeterli paraya sahip olmamanın zorluklarını da biliyor. Lise gezisine çıkabilmek için para biriktirmek için çok çalışıyor çünkü en iyi dört arkadaşına hep birlikte gideceklerine dair söz verdi. Ancak sınıfın parasının tamamı toplandıktan sonra çalınır! Yuichi'nin iki arkadaşı Sawaragi Shiho ve Shibe Makoto'ya şüphe düşer.",
    };
    return {
      highlights,
      editorschoice,
      highlyrecommended,
      route,
      modules: [Autoplay, Scrollbar, FreeMode, Pagination],
    };
  },
};
</script>
