<script setup>
import LibEdit from "../LibEdit.vue";
import { removeMangaFromBC } from "../../../firebase";

const props = defineProps({
  isOwner: Boolean,
  id: String,
  cover: String,
  name: String,
  status: String,
  userid: String,
});

const remove = async () => {
  await removeMangaFromBC(props.userid, props.id, props.status);
  window.location.reload();
};
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
        Seri{{
          status == "reading"
            ? "ye devam ediliyor"
            : status == "completed"
            ? " tamamlanmış"
            : status == "onhold"
            ? " bekletiliyor"
            : status == "dropped"
            ? " bırakılmış"
            : status == "plantoread"
            ? " okunacak"
            : status == "rereading"
            ? " bir kez daha okunuyor"
            : "bilinmeyen bir durumda"
        }}
      </p>
      <div class="card-actions justify-start">
        <label :for="id + 'edit'" v-if="isOwner" class="btn btn-accent"
          ><Icon icon="material-symbols:edit" class="h-5 w-5"
        /></label>
        <a class="btn btn-primary" :href="`/manga/${id}`">Görüntüle</a>
        <label :for="id" v-if="isOwner" class="btn btn-error"
          ><Icon icon="material-symbols:delete" class="h-5 w-5"
        /></label>
      </div>
    </div>
    <input type="checkbox" :id="id" class="modal-toggle" />
    <div class="modal" role="dialog">
      <article class="prose modal-box w-96">
        <h3>İşlemi Onaylayın</h3>
        <p>
          {{ name }} adlı girdiyi kitaplığınızdan kaldırmak istediğinize emin
          misiniz?
        </p>
        <div class="modal-action">
          <label @click="remove()" class="btn btn-error"
            ><Icon icon="material-symbols:delete" class="h-5 w-5" /> Sil</label
          >
          <label :for="id" class="btn"
            ><Icon icon="material-symbols:cancel" class="h-5 w-5" />
            İptal</label
          >
        </div>
      </article>
    </div>
    <input type="checkbox" :id="id + 'edit'" class="modal-toggle" />
    <div class="modal" role="dialog">
      <LibEdit :name="name" :id="id" :status="status" :userid="userid" />
    </div>
  </div>
</template>
