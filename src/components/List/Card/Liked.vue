<script setup>
const props = defineProps({
  id: String,
  cover: String,
  name: String,
  userid: String,
  description: String,
  coverid: String,
});
</script>
<template>
  <div class="card card-compact w-64 h-104 image-full bg-base-100 rounded-auto">
    <figure>
      <img
        class="w-64 opacity-75"
        :src="`https://mangadex.org/covers/${coverid}/${cover}${
          cover == 'e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3' ? '' : '.512'
        }.jpg`"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title font-bold">{{ name }}</h2>
      <p>{{ description }}</p>
      <div class="card-actions">
        <a class="btn btn-primary" :href="`/user/${userid}/list/${id}`"
          >Görüntüle</a
        >
      </div>
    </div>
  </div>
</template>
