<template>
  <main v-if="isLib">
    <div v-if="isList">
      <div
        v-if="isLiked"
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
          <div class="card-actions">
            <a class="btn btn-primary" :href="`/user/${userid}/list/${id}`"
              >Görüntüle</a
            >
          </div>
        </div>
      </div>
      <div
        v-else
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
            <label class="btn btn-ghost col-span-2 col-start-6"
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
            <a
              class="col-start-3 col-end-6 btn btn-primary"
              :href="`/user/${userid}/list/${id}`"
              >Görüntüle</a
            >
            <label
              :for="id"
              v-if="isOwner"
              class="col-start-6 col-end-8 btn btn-error"
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
    <div
      v-else-if="isListSerie"
      class="card card-side w-96 h-64 bg-base-100 rounded-auto"
    >
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
    <div
      v-else
      class="card card-compact w-64 h-64 image-full bg-base-100 rounded-auto"
    >
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
        <LibEdit :name="name" :id="id" :status="status" :userid="userid" />
      </div>
    </div>
  </main>
  <div
    v-else
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
      <p>{{ name }} mangasının bir bölümü sisteme eklendi.</p>
      <div class="dropdown dropdown-hover dropdown-top flex justify-end">
        <a class="btn btn-primary" :href="`/manga/${id}`">Oku!</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  removeMangaFromBC,
  removeMangaFromList,
  deleteList,
} from "../../firebase";
import LibEdit from "../Profile/LibEdit.vue";
import ListEdit from "../List/Edit.vue";

const props = defineProps({
  isLib: Boolean,
  isOwner: Boolean,
  id: String,
  cover: String,
  name: String,
  status: String,
  userid: String,
  isList: Boolean,
  description: String,
  coverid: String,
  isListSerie: Boolean,
  listid: String,
  likes: Number,
  isLiked: Boolean,
});

async function remove() {
  await removeMangaFromBC(props.userid, props.id, props.status);
  window.location.reload();
}

async function removelist() {
  await removeMangaFromList(props.userid, props.id, props.listid);
  window.location.reload();
}

async function deletelist() {
  await deleteList(props.userid, props.listid);
  window.location.reload();
}
</script>
