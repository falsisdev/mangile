<template>
  <div
    class="basis-1/4 card card-compact card-side bg-base-200 mx-2 shadow-lg border border-base-100 rounded-lg"
  >
    <figure>
      <img
        class="rounded shadow-md w-full h-48"
        :src="`https://mangadex.org/covers/${id}/${cover}.512.jpg`"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <p>{{ name }} mangasını görüntüle</p>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-primary" :href="`/manga/${id}`">Oku!</a>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  id: String,
  cover: String,
  name: String,
});
</script>
