<template>
  <div class="basis-1/5 card w-auto h-auto bg-base-100 p-[10px] rounded-lg">
    <figure>
      <img
        class="rounded shadow-md w-64 h-72"
        :src="`https://mangadex.org/covers/${id}/${cover}.512.jpg`"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
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
