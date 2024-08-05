<script setup>
import { removeMangaFromList } from "../../../firebase";
const props = defineProps({
  isOwner: Boolean,
  id: String,
  cover: String,
  name: String,
});

const removelist = async () => {
  await removeMangaFromList(props.userid, props.id, props.listid);
  window.location.reload();
};
</script>
<template>
  <div class="card card-side w-96 h-64 bg-base-100 rounded-auto">
    <figure>
      <img
        class="w-48 h-64"
        :src="`https://mangadex.org/covers/${id}/${cover}.512.jpg`"
      />
    </figure>
    <div class="card-body">
      <span class="card-title font-bold mt-5">{{ name }}</span>
      <span>
        Butona tıkladığınızda herhangi bir dönüt almıyorsanız lütfen
        <a href="#top">buraya</a> tıklayın.
      </span>
      <div class="card-actions justify-start">
        <label :for="id + 'delete'" v-if="isOwner" class="btn btn-error"
          ><Icon icon="material-symbols:delete" class="h-5 w-5"
        /></label>
      </div>
    </div>
    <span id="top"></span>
    <input type="checkbox" :id="id + 'delete'" class="modal-toggle" />
    <div class="modal" role="dialog">
      <article class="prose modal-box w-96">
        <h3>İşlemi Onaylayın</h3>
        <p>
          {{ name }} adlı seriyi listenizden kaldırmak istediğinize emin
          misiniz?
        </p>
        <p>
          Eğer işlemi onaylarsanız yaptığınız diğer tüm değişiklikler yok
          sayılacaktır.
        </p>
        <div class="modal-action">
          <label @click="removelist()" class="btn btn-error"
            ><Icon icon="material-symbols:delete" class="h-5 w-5" /> İşlemi
            Onaylıyorum</label
          >
          <label :for="id + 'delete'" class="btn"
            ><Icon icon="material-symbols:cancel" class="h-5 w-5" />
            İptal</label
          >
        </div>
      </article>
    </div>
  </div>
</template>
