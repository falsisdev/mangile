<template>
  <article class="prose modal-box">
    <h3>Listeyi Düzenle</h3>
    <p>{{ name }} adlı listeyi düzenliyorsunuz.</p>
    <span class="flex flex-row flex-wrap">
      <b class="mr-3">Liste Adı: </b>
      <input
        id="title"
        type="text"
        :placeholder="name"
        class="input input-bordered input-sm w-full max-w-xs"
      />
      <span class="divider"></span>
      <b class="mr-3">Açıklama: </b>
      <textarea
        id="desc"
        :placeholder="description"
        class="textarea textarea-bordered textarea-sm w-full max-w-xs"
        >{{ description }}</textarea
      >
      <span class="divider" />
      <div class="modal-action">
        <label @click="savelist()" class="btn btn-success"
          ><Icon icon="material-symbols:save" class="h-5 w-5" /> Kaydet</label
        >
        <label :for="id + 'edit'" class="btn"
          ><Icon icon="material-symbols:cancel" class="h-5 w-5" /> Kaydetmeden
          Çık</label
        >
      </div>
    </span>
    <br />
    <h1>İçerik <span class="divider" /></h1>
    <span class="flex flex-row flex-wrap">
      <Card
        v-for="item of collection['lists'].find((x) => x.id == id).series"
        class="m-2"
        :key="item"
        :isLib="true"
        :isListSerie="true"
        :id="item"
        :listid="id"
        :userid="userid"
        :isOwner="true"
        :cover="
          covers[
            collection['lists'].find((x) => x.id == id)['series'].indexOf(item)
          ]
        "
        :name="
          JSON.parse(
            infos[
              collection['lists']
                .find((x) => x.id == id)
                ['series'].indexOf(item)
            ].data.value
          ).data.attributes.title.en ||
          JSON.parse(
            infos[
              collection['lists']
                .find((x) => x.id == id)
                ['series'].indexOf(item)
            ].data.value
          ).data.attributes.title['ja-ro']
        "
      />
    </span>
  </article>
</template>
<script setup>
import { getCollectionById, updateList } from "../../firebase";
import Card from "../Manga/Card.vue";
import { useFetch } from "@vueuse/core";

const props = defineProps({
  name: String,
  description: String,
  id: String,
  userid: String,
});
const collection = await getCollectionById(props.userid);

const covers = [];
const infos = [];

for (let item of collection["lists"].find((x) => x.id == props.id).series) {
  const info = await useFetch(`https://api.mangadex.org/manga/${item}`);
  infos.push(info);
  let coverartid;
  for (let item of JSON.parse(info.data.value).data.relationships) {
    coverartid;
    if (item.type == "cover_art") {
      coverartid = item.id;
    }
  }
  const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
  covers.push(JSON.parse(cover.data.value).data.attributes.fileName);
}

async function savelist() {
  await updateList(
    props.userid,
    props.id,
    String(document.getElementById("desc").value),
    String(document.getElementById("title").value)
  );
  window.location.reload();
}
/*import { removeMangaFromBC, addMangaToBC } from "../firebase";

async function save() {
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
}*/
</script>
