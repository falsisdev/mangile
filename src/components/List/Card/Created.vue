<script setup>
import ListEdit from "../Edit.vue";
import { deleteList } from "../../../firebase";

const props = defineProps({
  id: String,
  cover: String,
  name: String,
  userid: String,
  description: String,
  coverid: String,
  likes: Number,
  isOwner: Boolean,
});

const deletelist = async () => {
  await deleteList(props.userid, props.listid);
  window.location.reload();
};
</script>
<template>
  <div>
    <div
      class="card card-compact w-64 h-104 image-full bg-base-100 rounded-auto"
    >
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
        <div class="card-actions grid grid-cols-7">
          <label class="btn btn-ghost col-span-2 col-start-1"
            ><div
              class="tooltip flex flex-row"
              data-tip="Beğenmek için listeyi görüntülemeniz gerekmektedir"
            >
              <Icon
                icon="solar:heart-lock-bold"
                class="h-5 w-5 mr-1 pb-[0.5px]"
              />
              <span class="mt-[0.5px]">{{ likes }}</span>
            </div></label
          >
          <label
            :for="id + 'edit'"
            v-if="isOwner"
            class="col-start-1 col-end-3 btn btn-accent"
            ><Icon icon="material-symbols:edit" class="h-5 w-5"
          /></label>
          <label
            ><a
              class="col-start-3 col-end-6 btn btn-primary"
              :href="`/user/${userid}/list/${id}`"
              >Görüntüle</a
            ></label
          >
          <label
            :for="id"
            v-if="isOwner"
            class="ml-1 col-start-6 col-end-8 btn btn-error"
            ><Icon icon="material-symbols:delete" class="h-5 w-5"
          /></label>
        </div>
      </div>
      <input type="checkbox" :id="id" class="modal-toggle" />
      <div class="modal" role="dialog">
        <article class="prose modal-box w-96">
          <h3>İşlemi Onaylayın</h3>
          <p>
            {{ name }} adlı listeyi koleksiyonunuzdan kaldırmak istediğinize
            emin misiniz?
          </p>
          <div class="modal-action">
            <label @click="deletelist()" class="btn btn-error"
              ><Icon icon="material-symbols:delete" class="h-5 w-5" />
              Sil</label
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
        <ListEdit
          :name="name"
          :id="id"
          :description="description"
          :userid="userid"
        />
      </div>
    </div>
  </div>
</template>
