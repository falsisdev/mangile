<script setup>
const props = defineProps({
  id: String,
  cover: String,
  name: String,
  url: String,
});
</script>
<template>
  <div class="basis-1/5 card w-auto h-auto bg-base-100 p-[10px] rounded-lg">
    <figure>
      <img
        class="rounded shadow-md w-64 h-72"
        :src="
          cover ==
          'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
            ? 'https://previews.123rf.com/images/apoev/apoev1709/apoev170900088/85467744-ic%C3%B4ne-de-profil-par-d%C3%A9faut-avatar-anime-girl-gris-photo-manga-placeholder.jpg'
            : cover
        "
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-ghost" :href="url" target="_blank"
          ><Icon icon="material-symbols:open-in-new" class="h-4 w-4" /> Git</a
        >
      </div>
    </div>
  </div>
</template>
