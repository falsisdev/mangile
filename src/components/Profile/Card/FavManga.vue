<script setup>
//import { likeManga, unlikeManga } from "../../../firebase";

const props = defineProps({
  isOwner: Boolean,
  id: String,
  cover: String,
  name: String,
  description: String,
  coverid: String,
});
</script>
<template>
  <div class="card card-compact w-64 h-64 image-full bg-base-100 rounded-auto">
    <figure>
      <img
        class="w-64"
        :src="`https://mangadex.org/covers/${id}/${cover}.512.jpg`"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <p>
        {{ description.substring(0, 150) + "..." }}
      </p>
      <div class="card-actions justify-start">
        <!--<label @click="likeSwitch()" v-if="isOwner" class="btn btn-accent"
          ><Icon icon="material-symbols:favorite" class="h-5 w-5"
        /></label>-->
        <a class="btn btn-primary" :href="`/manga/${id}`">Görüntüle</a>
      </div>
    </div>
  </div>
</template>
