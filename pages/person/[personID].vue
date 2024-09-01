<script setup>
const route = useRoute();

const personID = ref(route.params.personID);

const { data: personData } = await useFetch(
  `https://api.jikan.moe/v4/people/${personID.value}/full`
);

const person = personData.value.data;
</script>
<template>
  <main class="lg:grid lg:grid-cols-11">
    <div class="lg:mx-0 mx-5 lg:col-start-1 lg:col-end-12">
      <div
        v-if="person['manga'] == []"
        role="alert"
        class="alert alert-warning lg:text-md text-sm lg:mx-5 lg:mt-2 px-5 text-start flex"
      >
        <Icon name="material-symbols:warning" class="w-5 h-5 lg:-mr-2" />
        <span
          >UYARI: Görünüşe göre bu kişi hiçbir manga yapımında görev
          almamış</span
        >
      </div>
    </div>
    <div
      v-if="person"
      class="card lg:card-side bg-base-100 lg:col-start-1 lg:col-end-11 lg:m-5 lg:grid lg:grid-cols-12"
    >
      <article class="prose lg:flex lg:flex-col lg:col-start-1 lg:col-end-5">
        <figure>
          <img
            class="rounded shadow-md w-72 h-auto"
            :src="
              person.images.jpg.image_url ==
              'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
                ? 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                : person.images.jpg.image_url
            "
          />
        </figure>
      </article>
      <div class="card-body lg:col-start-5 lg:col-end-12">
        <article class="prose">
          <span class="card-title lg:-my-7 -mt-12 -my-10">
            <h1 class="flex flex-col">
              <span>
                {{ person.name }}
              </span>
              <span class="text-gray-400 lg:text-xl text-lg mx-1">
                {{ person.given_name }} {{ person.family_name }}
              </span>
            </h1>
          </span>
          <span>
            <span class="badge badge-accent badge-sm lg:badge-md gap-2 mr-1"
              >{{ person.favorites }} takipçi</span
            >
            <br /><br />
          </span>
        </article>
      </div>
    </div>
    <span v-if="person.manga != []" class="lg:col-start-1 lg:col-end-12">
      <article class="prose max-w-none mx-2">
        <h1>Görev Aldıkları</h1>
      </article>
      <br />
      <PersonMangaCard :itemData="person.manga" />
    </span>
  </main>
</template>
