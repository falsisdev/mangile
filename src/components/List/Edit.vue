<template>
  <article class="prose modal-box">
    <h3>Listeyi Düzenle</h3>
    <p>{{ name }} adlı listeyi düzenliyorsunuz.</p>
    <form
      @submit.prevent="onSubmit"
      class="flex flex-row flex-wrap form-control"
    >
      <b class="mr-3">Liste Adı: </b>
      <input
        v-model="form.title"
        type="text"
        :placeholder="name"
        class="input input-bordered input-sm w-full max-w-xs"
        required
      />
      <span class="divider"></span>
      <b class="mr-3">Açıklama: </b>
      <input
        v-model="form.desc"
        type="text"
        :placeholder="description"
        class="input input-bordered input-sm w-full max-w-xs"
        required
      />
      <span class="divider" />
      <div class="modal-action">
        <span class="form-control">
          <input type="submit" class="btn btn-success" value="Kaydet" />
        </span>
        <label :for="id + 'edit'" class="btn"
          ><Icon icon="material-symbols:cancel" class="h-5 w-5" /> Kaydetmeden
          Çık</label
        >
      </div>
    </form>
    <br />
    <h1>İçerik <span class="divider" /></h1>
    <span
      v-if="collection['lists'].find((x) => x.id == id).series[0]"
      class="flex flex-col"
    >
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
    <span v-else> Bu listede hiçbir manga bulunmamaktadır. </span>
  </article>
</template>
<script setup>
import { getCollectionById, updateList } from "../../firebase";
import Card from "../List/Card/Edit.vue";
import { useFetch } from "@vueuse/core";
import { reactive } from "vue";

const props = defineProps({
  name: String,
  description: String,
  id: String,
  userid: String,
});
const collection = await getCollectionById(props.userid);
const form = reactive({ title: "", desc: "" });

const covers = [];
const infos = [];

const onSubmit = async () => {
  await updateList(props.userid, props.id, form.desc, form.title);
  form.title = "";
  form.desc = "";
  window.location.reload();
  return { form, onSubmit };
};

if (collection["lists"].find((x) => x.id == props.id).series[0]) {
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
    const cover = await useFetch(
      `https://api.mangadex.org/cover/${coverartid}`
    );
    covers.push(JSON.parse(cover.data.value).data.attributes.fileName);
  }
} else {
  covers.push("e68fa7e9-9e7e-40d6-9a31-ada9d37a57e3");
}
</script>
