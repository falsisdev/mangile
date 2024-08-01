<script setup>
import { removeMangaFromBC, addMangaToBC } from "../../firebase";
//////////////////////////////////////////////////////////
const props = defineProps({
  name: String,
  id: String,
  userid: String,
  status: String,
});
//////////////////////////////////////////////////////////
const save = async () => {
  if (document.getElementById("durum").value) {
    if (props.status !== null)
      await removeMangaFromBC(props.userid, props.id, props.status);
    await addMangaToBC(
      props.userid,
      props.id,
      document.getElementById("durum").value == "Okunuyor"
        ? "reading"
        : document.getElementById("durum").value == "Bitirildi"
        ? "completed"
        : document.getElementById("durum").value == "Bekletiliyor"
        ? "onhold"
        : document.getElementById("durum").value == "Bırakıldı"
        ? "dropped"
        : document.getElementById("durum").value == "Planlandı"
        ? "plantoread"
        : document.getElementById("durum").value == "Yeniden Okunuyor"
        ? "rereading"
        : null
    );
    window.location.reload();
  } else {
    window.location.reload();
  }
};
//////////////////////////////////////////////////////////
</script>

<template>
  <article class="prose modal-box">
    <h3>İlerlemeyi Düzenle</h3>
    <p>
      {{ name }} adlı girdinin kitaplık ilerleme durumunu düzenlemektesiniz.
    </p>
    <span class="flex flex-row flex-wrap">
      <b>Okuma Durumu: </b>

      <select
        id="durum"
        class="select select-bordered select-sm w-full max-w-xs ml-2"
      >
        <option selected>
          {{
            status == "reading"
              ? "Okunuyor"
              : status == "completed"
              ? "Bitirildi"
              : status == "onhold"
              ? "Bekletiliyor"
              : status == "dropped"
              ? "Bırakıldı"
              : status == "plantoread"
              ? "Planlandı"
              : status == "rereading"
              ? "Yeniden Okunuyor"
              : "Kitaplığa ekle."
          }}
        </option>
        <option v-if="status !== 'reading'">Okunuyor</option>
        <option v-if="status !== 'completed'">Bitirildi</option>
        <option v-if="status !== 'onhold'">Bekletiliyor</option>
        <option v-if="status !== 'dropped'">Bırakıldı</option>
        <option v-if="status !== 'plantoread'">Planlandı</option>
        <option v-if="status !== 'rereading'">Yeniden Okunuyor</option>
      </select>
    </span>
    <div class="modal-action">
      <label @click="save()" class="btn btn-success"
        ><Icon icon="material-symbols:save" class="h-5 w-5" /> Kaydet</label
      >
      <label :for="id + 'edit'" class="btn"
        ><Icon icon="material-symbols:cancel" class="h-5 w-5" /> Kaydetmeden
        Çık</label
      >
    </div>
  </article>
</template>
