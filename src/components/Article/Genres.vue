<script setup>
import { RouterLink } from "vue-router";
import Tags from "../Tags.vue";

const tags = {
  "07251805-a27e-4d59-b488-f0bfbec15168": {
    tr: "Gerilim",
    id: "07251805-a27e-4d59-b488-f0bfbec15168",
  },
  "0a39b5a1-b235-4886-a747-1d05d216532d": {
    tr: "Ödüllü",
    id: "0a39b5a1-b235-4886-a747-1d05d216532d",
  },
  "33771934-028e-4cb3-8744-691e866a923e": {
    tr: "Tarihsel",
    id: "33771934-028e-4cb3-8744-691e866a923e",
  },
  "391b0423-d847-456f-aff0-8b0cfc03066b": {
    tr: "Aksiyon",
    id: "391b0423-d847-456f-aff0-8b0cfc03066b",
  },
  "3b60b75c-a2d7-4860-ab56-05f391bb889c": {
    tr: "Psikolojik",
    id: "3b60b75c-a2d7-4860-ab56-05f391bb889c",
  },
  "423e2eae-a7a2-4a8b-ac03-a8351462d71d": {
    tr: "Romantik",
    id: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
  },
  "4d32cc48-9f00-4cca-9b5a-a839f0764984": {
    tr: "Komedi",
    id: "4d32cc48-9f00-4cca-9b5a-a839f0764984",
  },
  "5fff9cde-849c-4d78-aab0-0d52b2ee1d25": {
    tr: "Hayatta Kalma",
    id: "5fff9cde-849c-4d78-aab0-0d52b2ee1d25",
  },
  "799c202e-7daa-44eb-9cf7-8a3c0441531e": {
    tr: "Dövüş Sanatları",
    id: "799c202e-7daa-44eb-9cf7-8a3c0441531e",
  },
  "87cc87cd-a395-47af-b27a-93258283bbc6": {
    tr: "Macera",
    id: "87cc87cd-a395-47af-b27a-93258283bbc6",
  },
  "ac72833b-c4e9-4878-b9db-6c8a4a99444a": {
    tr: "Askeri",
    id: "ac72833b-c4e9-4878-b9db-6c8a4a99444a",
  },
  "b9af3a63-f058-46de-a9a0-e0c13906197a": {
    tr: "Dram",
    id: "b9af3a63-f058-46de-a9a0-e0c13906197a",
  },
  "cdad7e68-1419-41dd-bdce-27753074a640": {
    tr: "Korku",
    id: "cdad7e68-1419-41dd-bdce-27753074a640",
  },
  "e5301a23-ebd9-49dd-a0cb-2add944c7fe9": {
    tr: "Yaşamdan Kesit",
    id: "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
  },
  "f8f62932-27da-4fe4-8ee1-6779a8c5edba": {
    tr: "Trajedi",
    id: "f8f62932-27da-4fe4-8ee1-6779a8c5edba",
  },
  "36fd93ea-e8b8-445e-b836-358f02b3d33d": {
    tr: "Canavarlar",
    id: "36fd93ea-e8b8-445e-b836-358f02b3d33d",
  },
  "3de8c75d-8ee3-48ff-98ee-e20a65c86451": {
    tr: "Hayvanlar",
    id: "3de8c75d-8ee3-48ff-98ee-e20a65c86451",
  },
  "5ca48985-9a9d-4bd8-be29-80dc0303db72": {
    tr: "Suç",
    id: "5ca48985-9a9d-4bd8-be29-80dc0303db72",
  },
  "a1f53773-c69a-4ce5-8cab-fffcd90b1565": {
    tr: "Büyü",
    id: "a1f53773-c69a-4ce5-8cab-fffcd90b1565",
  },
  "cdc58593-87dd-415e-bbc0-2ec27bf404cc": {
    tr: "Fantezi",
    id: "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
  },
  "eabc5b4c-6aff-42f3-b657-3e90cbd00b75": {
    tr: "Doğaüstü",
    id: "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
  },
  "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0": {
    tr: "Reenkarnasyon",
    id: "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0",
  },
  "aafb99c1-7f60-43fa-b75f-fc9502ce29c7": {
    tr: "Harem",
    id: "aafb99c1-7f60-43fa-b75f-fc9502ce29c7",
  },
  "ace04997-f6bd-436e-b261-779182193d3d": {
    tr: "Isekai",
    id: "ace04997-f6bd-436e-b261-779182193d3d",
  },
  "f4122d1c-3b44-44d0-9936-ff7502c39ad3": {
    tr: "Adaptasyon",
    id: "f4122d1c-3b44-44d0-9936-ff7502c39ad3",
  },
  "caaa44eb-cd40-4177-b930-79d3ef2afe87": {
    tr: "Okul",
    id: "caaa44eb-cd40-4177-b930-79d3ef2afe87",
  },
  "ee968100-4191-4968-93d3-f82d72be7e46": {
    tr: "Gizem",
    id: "ee968100-4191-4968-93d3-f82d72be7e46",
  },
  "39730448-9a5f-48a2-85b0-a70db87b1233": {
    tr: "İblisler",
    id: "39730448-9a5f-48a2-85b0-a70db87b1233",
  },
  "dd1f77c5-dea9-4e2b-97ae-224af09caf99": {
    tr: "Canavar Kızlar",
    id: "dd1f77c5-dea9-4e2b-97ae-224af09caf99",
  },
  "df33b754-73a3-4c54-80e6-1a74a8058539": {
    tr: "Polisiye",
    id: "df33b754-73a3-4c54-80e6-1a74a8058539",
  },
  "81183756-1453-4c81-aa9e-f6e1b63be016": {
    tr: "Samuray",
    id: "81183756-1453-4c81-aa9e-f6e1b63be016",
  },
  "292e862b-2d17-4062-90a2-0356caa4ae27": {
    tr: "Zaman Yolculuğu",
    id: "292e862b-2d17-4062-90a2-0356caa4ae27",
  },
  "9467335a-1b83-4497-9231-765337a00b96": {
    tr: "Felaket Sonrası Kurgusu (Post-Apocalyptic)",
    id: "9467335a-1b83-4497-9231-765337a00b96",
  },
  "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a": {
    tr: "Cinsiyet Değiştirme",
    id: "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a",
  },
  "85daba54-a71c-4554-8a28-9901a8b0afad": {
    tr: "Mafya",
    id: "85daba54-a71c-4554-8a28-9901a8b0afad",
  },
  "c8cbe35b-1b2b-4a3f-9c37-db84c4514856": {
    tr: "Tıbbi",
    id: "c8cbe35b-1b2b-4a3f-9c37-db84c4514856",
  },
  "da2d50ca-3018-4cc0-ac7a-6b7d472a29ea": {
    tr: "Çocuk Suçlular",
    id: "da2d50ca-3018-4cc0-ac7a-6b7d472a29ea",
  },
  "92d6d951-ca5e-429c-ac78-451071cbf064": {
    tr: "Ofis Çalışanları",
    id: "92d6d951-ca5e-429c-ac78-451071cbf064",
  },
  "256c8bd9-4904-4360-bf4f-508a76d67183": {
    tr: "Bilim Kurgu",
    id: "256c8bd9-4904-4360-bf4f-508a76d67183",
  },
  "50880a9d-5440-4732-9afb-8f457127e836": {
    tr: "Meka",
    id: "50880a9d-5440-4732-9afb-8f457127e836",
  },
  "b1e97889-25b4-4258-b28b-cd7f4d28ea9b": {
    tr: "Felsefi",
    id: "b1e97889-25b4-4258-b28b-cd7f4d28ea9b",
  },
  "e64f6742-c834-471d-8d72-dd51fc02b835": {
    tr: "Uzaylılar",
    id: "e64f6742-c834-471d-8d72-dd51fc02b835",
  },
  "7064a261-a137-4d3a-8848-2d385de3a99c": {
    tr: "Süper Kahraman",
    id: "7064a261-a137-4d3a-8848-2d385de3a99c",
  },
  "ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869": {
    tr: "Yemek",
    id: "ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869",
  },
  "f42fbf9e-188a-447b-9fdc-f19dc1e4d685": {
    tr: "Müzik",
    id: "f42fbf9e-188a-447b-9fdc-f19dc1e4d685",
  },
  "e197df38-d0e7-43b5-9b09-2842d0c326dd": {
    tr: "Web Çizgi Romanı",
    id: "e197df38-d0e7-43b5-9b09-2842d0c326dd",
  },
};
</script>
<template>
  <br />
  <article class="prose max-w-none">
    <h1>Türler</h1>
  </article>
  <br />
  <article class="prose max-w-none">
    <Tags :tags="JSON.stringify(tags)" ismanuel="true" />
    <p>
      Yukarıda yer alan türler sistemimizde bulunan bütün türlerdir.
      <RouterLink
        class="tooltip tooltip-accent"
        data-tip="Serileri Keşfet!"
        to="/explore"
        >Keşfet</RouterLink
      >
      sayfasındaki filtreleme bölümüne bu türlerin bir kısmını girerek arama
      yapabilirsiniz. Bu sayfada yer alan türlerin üzerine tıkladığınızda sizi
      Keşfet sayfasına otomatik filtreleme yapılmış şekilde yönlendirir. Böylece
      tıkladığınız türde yer alan serileri keşfedebilirsiniz. İyi okumalar!
    </p>
  </article>
</template>
