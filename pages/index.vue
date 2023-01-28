<template>
  <navbar/>
  <div class="grid grid-rows-1 grid-cols-6"><!--grid-->
  <leftmenu/>
  <div class="col-span-2 col-start-2 col-end-6 p-5 pl-20"><!--page view-->
  <alert/>
  <br>
  <!--öne çıkanlar-->
  <article class="prose max-w-none px-5 pt-5">
    <h1>Öne Çıkanlar</h1>
  </article>
  <div class="divider"></div>
  <div class="flex flex-row flex-wrap">
  <div v-for="item of highlights" v-bind:key="item" class="card w-auto h-auto lg:card-side bg-base-100 p-[10px] shadow-lg rounded-lg">
    <figure><img class="rounded shadow-md w-64 h-72" :src="item.image + '.512.jpg'" alt="Cover"/></figure>
    <div class="card-body">
      <h2 class="card-title">{{ item.name }}</h2>
      <p>{{ item.description }}</p>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-secondary" :href="`/manga/${item.url}`">Oku!</a>
      <div class="card w-72 dropdown-content bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </div>
      </div>
      </div>
    </div>
  </div>
  </div>
  <!--öne çıkanlar-->
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
        <a class="btn btn-secondary" href='/manga/e78a489b-6632-4d61-b00b-5206f5b8b22b'>Devam Et!</a>
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
        <a class="btn btn-secondary" href='/manga/8211bac6-a392-4e37-b3b6-dac0f4512d24'>Devam Et!</a>
      </div>
      </div>
    </div>
  </div>
  <!--şiddetle önerilen-->
  </div><!--page view-->
  </div><!--grid-->
  </template>
  <script setup>
  function redirecg(url) {
    window.location.href = url
  }
  const highlights = [{
    "name": "Monster",
    "description": "Monster, ünlü bir hastanede gelecek vaat eden bir kariyere sahip ünlü bir cerrah olan Kenzo Tenma'nın kendini geliştirme hikayesini ele alıyor. Tenma, ciddi şekilde yaralanmış genç bir çocuğun hayatını kurtarmak için itibarını ve gelecek vaat eden kariyerini riske atar. Bu çocuğun kaderinde korku...",
    "image": "https://mangadex.org/covers/d9e30523-9d65-469e-92a2-302995770950/0b815f57-43ad-4782-a56f-bf9d0d034147.jpg",
    "url": "d9e30523-9d65-469e-92a2-302995770950"
  },
  {
    "name": "Mushoku Tensei Isekai Ittara Honki Dasu",
    "description": "Tanımadığı birini trafik kazasından kurtarırken ölen 34 yaşındaki bir NEET büyülü bir dünyaya Rudeus Greyrat isminde yeni doğmuş bir bebek olarak reenkarne olur. Geçmiş hayatından ona kalan bilgisi, tecrübesi ve pişmanlıklarıyla beraber daha önce yaptığı yanlışları yapmadan dolu dolu bir hayat ya...",
    "image": "https://mangadex.org/covers/bd6d0982-0091-4945-ad70-c028ed3c0917/8e717825-6634-4f00-8df6-678f00d97c12.jpg",
    "url": "bd6d0982-0091-4945-ad70-c028ed3c0917"
  },
  {
    "name": "Chainsaw Man",
    "description": "Denji’nin babası ölünce büyük bir borç üstüne kalır ve bunu ödeyebilmesinin hiçbir yolu yoktur. Ancak kurtardığı Pochita isimli iblis köpek sayesinde iblis avcılığı yaparak borcunu azar azar kapatır. Pochita’nın testere güçleri iblislere karşı işe yarıyordur. Denji öldüğünde Pochita kendini feda ...",
    "image": "https://mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/351cac60-4f6f-4548-95be-3189c9705c76.png",
    "url": "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b"
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
  </script>