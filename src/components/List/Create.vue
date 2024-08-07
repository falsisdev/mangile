<script setup>
import { createList } from "../../firebase";

const props = defineProps({
  id: String,
});

async function create() {
  await createList(
    props.id,
    document.getElementById("desc").value,
    document.getElementById("title").value
  );
  window.location.reload();
}
</script>
<template v-if="cookies.get('isLogged')">
  <article class="prose max-w-none">
    <h2>Liste Oluştur</h2>
  </article>
  Liste oluşturma sayfasındasınız. Yeni bir liste oluşturmak için aşağıya
  istenilen bilgileri girin ve kaydedin.
  <br />
  <br />
  <span class="flex flex-row flex-wrap">
    <b class="mr-3">Liste Adı: </b>
    <input
      id="title"
      type="text"
      placeholder="Listenize bir ad belirleyiniz (zorunlu)"
      class="input input-bordered input-sm w-full max-w-xs"
      required
    />
    <span class="divider"></span>
    <b class="mr-3">Açıklama: </b>
    <textarea
      id="desc"
      placeholder="Liste için bir açıklama giriniz (isteğe bağlı)"
      class="textarea textarea-bordered textarea-sm w-full max-w-xs"
    ></textarea>
    <span class="divider" />
    <div class="modal-action">
      <label @click="create()" class="btn btn-success"
        ><Icon icon="material-symbols:save" class="h-5 w-5" /> Kaydet</label
      >
    </div>
  </span>
</template>
