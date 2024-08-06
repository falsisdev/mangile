<script setup>
import { useRoute } from "vue-router";
import { useFetch, useTitle } from "@vueuse/core";
import { ref, watch } from "vue";
import { useCookies } from "vue3-cookies";
//////////////////////////////////////////////////////////
import Tags from "../Tags.vue";
import {
  getManga,
  getVol,
  checkMangaInBC,
  getUser,
  getIDByEmail,
  removeMangaFromBC,
  addMangaToList,
  getListsById,
  checkMangaInFavorites,
  likeManga,
  unlikeManga,
  checkMangaExists,
} from "../../firebase";
import LibEdit from "../Profile/LibEdit.vue";
//////////////////////////////////////////////////////////
const route = useRoute();
const { cookies } = useCookies();
//////////////////////////////////////////////////////////
const redirect = (url) => (window.location.href = url);
const info = await useFetch(
  `https://api.mangadex.org/manga/${route.params.id}`
);
useTitle(
  !JSON.parse(info.data.value).data.attributes["altTitles"].some((x) => x.tr)
    ? !JSON.parse(info.data.value).data.attributes.title["en"]
      ? !JSON.parse(info.data.value).data.attributes.title["ja-ro"]
        ? !JSON.parse(info.data.value).data.attributes.title["ja"]
          ? "Bilinmeyen Başlık"
          : JSON.parse(info.data.value).data.attributes.title["ja"]
        : JSON.parse(info.data.value).data.attributes.title["ja-ro"]
      : JSON.parse(info.data.value).data.attributes.title["en"]
    : JSON.parse(info.data.value).data.attributes["altTitles"].find((x) => x.tr)
        .tr,
  { titleTemplate: "%s | Mangile" }
);
//////////////////////////////////////////////////////////
let loggeduser;
let id;
let lists;
//////////////////////////////////////////////////////////
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
  id = await getIDByEmail(cookies.get("email"));
  lists = await getListsById(id);
} else {
  loggeduser = null;
}
//////////////////////////////////////////////////////////
let checkmangainbc = loggeduser
  ? await checkMangaInBC(id, route.params.id)
  : null;
let exists = await checkMangaExists(route.params.id);
let isFav = ref(await checkMangaInFavorites(id, route.params.id));
//////////////////////////////////////////////////////////
const remove = async () => {
  await removeMangaFromBC(id, route.params.id, checkmangainbc[1]);
  window.location.reload();
};
const ekle = async () => {
  if (
    lists
      .find((x) => x.title == String(document.getElementById("liste").value))
      ["series"].includes(route.params.id)
  ) {
    window.location.reload();
  } else {
    await addMangaToList(
      id,
      lists.find(
        (x) => x.title == String(document.getElementById("liste").value)
      ).id,
      route.params.id
    );
    window.location.reload();
  }
};
const likeSwitch = async () => {
  if (isFav.value) {
    await unlikeManga(id, route.params.id);
    isFav.value = false;
  } else {
    await likeManga(id, route.params.id);
    isFav.value = true;
  }
};
//////////////////////////////////////////////////////////
let coverartid;
for (let item of JSON.parse(info.data.value).data.relationships) {
  if (item.type == "cover_art") {
    coverartid = item.id;
  }
}
let authorid;
for (let item of JSON.parse(info.data.value).data.relationships) {
  if (item.type == "author") {
    authorid = item.id;
  }
}
let artistid;
for (let item of JSON.parse(info.data.value).data.relationships) {
  if (item.type == "artist") {
    artistid = item.id;
  }
}
//////////////////////////////////////////////////////////
const artist = await useFetch(`https://api.mangadex.org/author/${artistid}`);
const author = await useFetch(`https://api.mangadex.org/author/${authorid}`);
const cover = await useFetch(`https://api.mangadex.org/cover/${coverartid}`);
const stats = await useFetch(
  `https://api.mangadex.org/statistics/manga?manga[]=${route.params.id}`
);
//////////////////////////////////////////////////////////
const ist = JSON.parse(stats.data.value).statistics[String(route.params.id)];
const mangadata = await getManga(route.params.id);
const links = JSON.parse(info.data.value).data.attributes.links;
const genres = JSON.parse(info.data.value).data.attributes.tags;
//////////////////////////////////////////////////////////
let warning;
let statuscode = mangadata == null ? 404 : 200;
//////////////////////////////////////////////////////////
const getVolData = async (i) => {
  const voldata = await getVol(
    route.params.id,
    parseInt(mangadata.volumes) - parseInt(i)
  );
  return voldata;
};
//////////////////////////////////////////////////////////
let titles = new Array();
let episodes = new Array();
//////////////////////////////////////////////////////////
try {
  for (var i = 0; i < mangadata.volumes; i++) {
    titles.push(Object(await getVolData(i)).title);
    episodes.push(Object(await getVolData(i)).episodes);
  }
} catch (err) {
  statuscode = 404;
}
//////////////////////////////////////////////////////////
for (let item of genres) {
  if (
    item.attributes.name.en == "Gore" ||
    item.attributes.name.en == "Sexual Violence" ||
    item.attributes.name.en == "Doujinshi" ||
    item.attributes.name.en == "Gay" ||
    item.attributes.name.en == "Lesbian" ||
    item.attributes.name.en == "Boys' Love" ||
    item.attributes.name.en == "Girls' Love" ||
    item.attributes.name.en == "Genderswap"
  ) {
    warning = ref(1);
  }
}
//////////////////////////////////////////////////////////
let chapterlist;
let chaps;
//////////////////////////////////////////////////////////
if (statuscode != 200) {
  chapterlist = await useFetch(
    `https://api.mangadex.org/chapter?manga=${route.params.id}&limit=100&order[chapter]=desc&translatedLanguage[]=en&includeExternalUrl=0`
  );
  chaps = JSON.parse(chapterlist.data.value).data;
}
//////////////////////////////////////////////////////////
let alttitle;
let done = false;
//////////////////////////////////////////////////////////
for (let item of JSON.parse(info.data.value).data.attributes.altTitles) {
  if (Boolean(item.tr)) {
    if (!done) {
      alttitle = JSON.parse(info.data.value).data.attributes.title["ja-ro"]
        ? JSON.parse(info.data.value).data.attributes.title["ja-ro"]
        : JSON.parse(info.data.value).data.attributes.title["ja"]
        ? JSON.parse(info.data.value).data.attributes.title["ja"]
        : JSON.parse(info.data.value).data.attributes.title["en"];
      done = true;
    }
  } else if (Boolean(item.en)) {
    if (!done) {
      alttitle = item.en;
      done = true;
    }
  } else if (Boolean(item.ja)) {
    if (!done) {
      alttitle = item.ja;
      done = true;
    }
  }
}
//////////////////////////////////////////////////////////
</script>
<template>
  <div class="grid grid-cols-10">
    <div class="col-span-9 col-start-1 col-end-10">
      <!--page view-->
      <div class="card lg:card-side bg-base-100">
        <span class="flex flex-col">
          <article class="prose">
            <figure>
              <img
                class="rounded shadow-md w-4/6 h-auto"
                :src="`https://mangadex.org/covers/${
                  JSON.parse(info.data.value).data.id
                }/${
                  JSON.parse(cover.data.value).data.attributes.fileName
                }.512.jpg`"
              />
            </figure>
          </article>
          <article class="prose ml-20 w-96 mt-5">
            <div v-if="warning == 1" class="alert alert-warning shadow-lg">
              <div class="flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-6 w-6 m-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span
                  >Bu seri 18 yaşının altındaki bireylerin psikolojik durumunu
                  ve akli dengesini bozabilecek içerikler içermektedir. 18 yaş
                  altı bireylerin bu riskin farkında olmadan bu seriyi okuması
                  önerilmemektedir.</span
                >
              </div>
            </div>
            <br />
            <div
              tabindex="0"
              class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">Bağlantılar</div>
              <div class="collapse-content">
                <span
                  v-for="[key, value] of Object.entries(links)"
                  :key="[key, value]"
                  class="m-[3px] badge bg-base-100 border border-base-300 badge-lg no-underline"
                >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'al'"
                    :href="`https://anilist.co/manga/${value}`"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#19212d"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#0af"
                        d="M2.247.794c-.104 0-.16.057-.16.16v.155l.815 2.33h.807c.104 0 .162-.056.162-.16v-.354c0-.104-.058-.161-.162-.161h-.947V.954c0-.103-.057-.16-.161-.16z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M1.293.794.363 3.44h.722l.158-.458h.786l.154.458h.719L1.976.794zm.114 1.602.225-.733.247.733z"
                      ></path></svg
                    ><span>Anilist</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'ap'"
                    :href="`https://anime-planet.com/manga/${value}`"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#1c3867"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#f0574b"
                        d="M2.117.926a1.19 1.19 0 0 0-1.19 1.19 1.19 1.19 0 0 0 .015.19c.253.137.612.27 1.026.368.425.101.819.147 1.114.14a1.19 1.19 0 0 0 .225-.697A1.19 1.19 0 0 0 2.117.926zm-1.114 1.61a1.19 1.19 0 0 0 1.114.771 1.19 1.19 0 0 0 .813-.32 6.46 6.46 0 0 1-1.927-.45z"
                      ></path>
                      <path
                        fill="#f69330"
                        d="M.935 1.522c-.346.017-.669.093-.709.232-.082.286.66.695 1.67.936 1.009.241 1.941.24 2.024-.045.04-.139-.203-.344-.49-.511l-.002.08c.133.099.195.212.172.291-.064.222-.787.238-1.632.037-.845-.2-1.47-.545-1.406-.767.024-.081.153-.149.331-.174z"
                      ></path></svg
                    ><span>Anime-Planet</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'bw'"
                    :href="`https://bookwalper.jp/series/${value}`"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined mr-[4px] m-[3px]"
                    >
                      <path
                        fill="#fff"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#e50012"
                        d="M3.563.826h.406V3.41h-.406z"
                      ></path>
                      <path
                        fill="#009fe8"
                        d="M.265 3.34.792.81l.397.083-.527 2.53z"
                      ></path>
                      <path fill="#530000" d="M1.19.826h.406V3.41H1.19z"></path>
                      <path fill="#b4b4b5" d="M1.98.826h.407V3.41H1.98z"></path>
                      <path
                        fill="#009844"
                        d="M2.772.826h.405V3.41h-.405z"
                      ></path></svg
                    ><span>BookWalker</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'kt'"
                    :href="`https://kitsu.io/manga/${value}`"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#493c47"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#e75e45"
                        d="M1.551.266a.107.107 0 0 0-.079.018c-.008.005-.013.011-.02.018L1.44.32a.732.732 0 0 0-.121.527 1.284 1.284 0 0 0-.12.071c-.007.005-.065.045-.11.087A.74.74 0 0 0 .554.928L.532.933C.524.937.515.94.509.945a.109.109 0 0 0-.03.148v.003l.006.008c.088.12.188.225.296.318l.003.003c.07.06.203.146.3.181 0 0 .6.231.63.245.012.004.03.01.037.01a.106.106 0 0 0 .125-.084.274.274 0 0 0 .003-.038V1.06a1.211 1.211 0 0 0-.061-.345L1.816.71a1.836 1.836 0 0 0-.19-.39L1.623.31 1.62.308a.106.106 0 0 0-.069-.042zM1.533.43c.057.095.105.193.143.296a1.314 1.314 0 0 0-.224.06.605.605 0 0 1 .081-.356zm1.102.558a1.17 1.17 0 0 0-.588.126c-.01.005-.022.01-.033.017v.605c0 .008 0 .04-.005.066a.238.238 0 0 1-.246.193.399.399 0 0 1-.095-.021l-.525-.204a1.429 1.429 0 0 0-.05-.02 4.781 4.781 0 0 0-.59.592l-.011.013a.108.108 0 0 0 0 .123.11.11 0 0 0 .083.047.105.105 0 0 0 .065-.018 3.096 3.096 0 0 1 .668-.364.11.11 0 0 1 .127.02c.037.038.039.1.007.14l-.036.06a3.13 3.13 0 0 0-.304.665l-.005.019v.001a.1.1 0 0 0 .016.084.11.11 0 0 0 .085.046.101.101 0 0 0 .064-.019.144.144 0 0 0 .024-.021c.001-.004.005-.007.006-.01a2.93 2.93 0 0 1 .273-.332 3.11 3.11 0 0 1 1.666-.929c.005-.002.01-.001.015-.001a.067.067 0 0 1 .063.07.065.065 0 0 1-.052.06c-.603.129-1.69.845-1.31 1.885a.318.318 0 0 0 .02.041.11.11 0 0 0 .083.047c.018 0 .07-.005.102-.062.061-.116.177-.246.513-.385.935-.387 1.09-.94 1.106-1.291v-.02A1.19 1.19 0 0 0 2.635.988zm-1.92.06a.592.592 0 0 1 .268.06 1.164 1.164 0 0 0-.138.188 1.803 1.803 0 0 1-.224-.24.602.602 0 0 1 .094-.009zm1.367 2.01c.194.314.533.34.533.34-.347.145-.484.288-.557.404a1.016 1.016 0 0 1 .024-.744z"
                      ></path></svg
                    ><span>Kitsu</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'mu'"
                    :href="`https://mangaupdates.com/series.html?id=${value}`"
                    ><svg
                      data-v-4c681a64=""
                      data-v-05a511f9=""
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      class="icon small text-icon-contrast text-undefined"
                    >
                      <path
                        fill="#cbd6e8"
                        stroke="#92a0ad"
                        d="M3 .5h10c1.385 0 2.5 1.115 2.5 2.5v10c0 1.385-1.115 2.5-2.5 2.5H3A2.495 2.495 0 0 1 .5 13V3C.5 1.615 1.615.5 3 .5z"
                      ></path>
                      <path
                        fill="#ff8c15"
                        d="M14.22 12.29q0 .333-.048.681-.047.348-.19.633-.142.286-.395.476-.254.19-.666.19-.506 0-.776-.317-.253-.317-.348-.776-.158-.76-.206-1.52l-.063-1.536q-.016-.776-.08-1.536-.063-.76-.253-1.52-.174.602-.364 1.204t-.412 1.188q-.174.428-.348.87-.159.429-.285.872-.111.364-.19.744-.08.38-.174.745-.032.142-.095.364-.064.206-.159.427-.079.222-.174.412t-.206.285q-.253.222-.602.301-.332.095-.65.095-.506 0-.807-.364-.3-.364-.443-.808-.111-.332-.174-.665-.064-.348-.143-.68-.206-.904-.49-1.775-.27-.87-.508-1.774-.316.713-.57 1.425-.237.713-.332 1.473-.08.554-.095 1.124 0 .554-.143 1.11-.11.41-.364.633-.238.237-.681.237-.412 0-.681-.174-.27-.158-.428-.428-.158-.269-.221-.601-.048-.349-.048-.697 0-.744.19-1.584.19-.855.46-1.71.269-.855.554-1.695.3-.84.522-1.568.206-.713.301-1.41.111-.696.27-1.408.063-.301.205-.586.159-.301.365-.523.221-.221.506-.364.286-.142.618-.142.238 0 .49.079.254.063.46.206.206.126.333.332.127.206.127.491 0 .206-.032.412-.032.19-.032.396 0 1.742.238 3.437.237 1.695.728 3.373.65-1.49 1.093-3.041.444-1.552.855-3.12.127-.46.238-.935.111-.475.333-.918.206-.412.506-.665.317-.27.792-.27.285 0 .57.064.301.047.539.19.237.127.38.364.158.222.158.57 0 .254-.031.507-.016.238-.016.49 0 1.189.142 2.377.159 1.172.428 2.344.222.998.364 1.995.159.982.159 1.995z"
                      ></path></svg
                    ><span>MangaUpdates</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'amz'"
                    :href="value"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#fff"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#ffa700"
                        d="M3.537 3.064a.695.695 0 0 0-.382.107c-.034.024-.028.057.01.053.125-.015.403-.049.453.015.05.064-.055.326-.102.443-.014.035.016.05.048.023.209-.175.262-.54.22-.593-.021-.026-.123-.05-.247-.048zM.34 3.09c-.025.004-.037.043-.01.073.456.518 1.057.83 1.725.83.476 0 1.03-.19 1.41-.545.064-.058.01-.147-.054-.112-.428.229-.893.34-1.317.34A2.94 2.94 0 0 1 .37 3.1a.045.045 0 0 0-.03-.01z"
                      ></path>
                      <path
                        d="M2.094.257c-.468 0-.99.175-1.1.753-.012.062.033.094.074.103l.476.052c.045-.003.077-.047.086-.091.04-.2.208-.295.395-.295.102 0 .217.037.277.127.069.102.059.24.059.357v.065c-.285.031-.658.053-.925.17a.835.835 0 0 0-.524.804c0 .511.322.767.736.767.35 0 .541-.083.811-.358.09.13.119.192.282.328.037.02.084.018.117-.012v.002c.099-.088.277-.243.378-.327.04-.033.033-.086.001-.131-.09-.124-.185-.225-.185-.456V1.35c0-.325.022-.624-.217-.847-.189-.181-.501-.245-.74-.245zm.268 1.464v.107c0 .192.004.351-.092.522-.079.138-.203.223-.341.223-.189 0-.3-.144-.3-.357 0-.419.377-.495.733-.495z"
                      ></path></svg
                    ><span>Amazon</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'cdj'"
                    :href="value"
                    ><svg
                      data-v-4c681a64=""
                      data-v-05a511f9=""
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      class="icon small text-icon-contrast text-undefined"
                    >
                      <path
                        fill="#09c"
                        d="M3 0h10c1.662 0 3 1.338 3 3v10c0 1.662-1.338 3-3 3H3c-1.662 0-3-1.338-3-3V3c0-1.662 1.338-3 3-3z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M5.995 8.905q-.084.307-.238.578-.153.263-.406.46-.253.198-.629.307-.368.11-.882.11-.859 0-1.28-.417-.414-.417-.414-1.104 0-.424.13-.862.13-.44.414-.797.284-.359.72-.585.438-.234 1.051-.234.537 0 .882.146.353.146.552.373.2.22.261.482.07.256.046.483H4.814q.023-.241-.046-.41-.061-.175-.337-.175-.215 0-.376.176-.153.175-.26.43-.1.25-.154.535-.046.285-.046.504 0 .57.406.57.215 0 .353-.139.138-.146.245-.431zm5.288-3.701-.892 4.08q-.066.32-.124.582-.051.262-.088.475H8.863q0-.092.007-.17.015-.078.03-.184-.351.432-1.031.432-.6 0-.921-.376-.322-.383-.322-1.05 0-.447.132-.887.131-.44.387-.788.256-.347.629-.56.38-.22.87-.22.358 0 .6.1.248.099.32.22l.366-1.654zm-2.39 2.278q-.213 0-.374.156-.16.149-.27.369-.11.213-.168.461-.059.241-.059.433 0 .284.103.433.102.149.336.149.175 0 .307-.078.132-.086.234-.235.102-.149.168-.354.073-.206.124-.462.088-.432 0-.652-.08-.22-.402-.22zm3.18-1.962.245-1.148h1.561l-.244 1.148zm1.443.549-.937 4.389c-.061.304-.135.565-.219.785s-.194.4-.33.54c-.134.14-.303.245-.506.312a2.258 2.258 0 0 1-.726.102c-.095 0-.205-.006-.329-.017-.182-.018-.441-.08-.537-.092l.278-1.113c.029.005.262.04.285.04h.05c.158 0 .267-.037.33-.11a.706.706 0 0 0 .126-.312l.962-4.525z"
                      ></path></svg
                    ><span>CDJapan</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'ebj'"
                    :href="value"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#fff"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#e95e5b"
                        d="M3.518 2.116s.218-.129.218-.436-.218-.435-.218-.435L2.008.374l-1.51.87 1.51.872s.218.129.218.436-.218.435-.218.435.218.13.218.436-.218.436-.218.436l1.51-.872s.218-.129.218-.435-.218-.436-.218-.436z"
                      ></path>
                      <path
                        fill="#231815"
                        d="M3.845 1.68c0-.364-.26-.523-.27-.53h-.002L2.063.28a.11.11 0 0 0-.11 0L.46 1.14c-.026.015-.071.041-.071.104a.109.109 0 0 0 .053.094.408.408 0 0 1 .165.342.403.403 0 0 1-.165.343.108.108 0 0 0-.054.093.11.11 0 0 0 .054.094.408.408 0 0 1 .165.342.403.403 0 0 1-.165.343.108.108 0 0 0-.054.093.109.109 0 0 0 .055.095l1.51.871a.109.109 0 0 0 .11 0l1.51-.871a.619.619 0 0 0 .272-.53.636.636 0 0 0-.162-.436.635.635 0 0 0 .162-.437zM.813 1.552l1.14.658c.01.007.164.109.164.342a.42.42 0 0 1-.12.304L.68 2.096a.637.637 0 0 0 .145-.416.716.716 0 0 0-.012-.128zm0 .871 1.14.658c.011.008.164.11.164.342a.42.42 0 0 1-.12.305L.68 2.968a.637.637 0 0 0 .145-.416.701.701 0 0 0-.012-.128zm2.649.47-1.139.658a.716.716 0 0 0 .012-.128.637.637 0 0 0-.145-.415l1.318-.76a.416.416 0 0 1 .119.304.403.403 0 0 1-.164.342zm0-.87-1.139.657a.716.716 0 0 0 .012-.128.618.618 0 0 0-.272-.53L.716 1.245 2.008.498l1.455.839c.012.008.164.11.164.342a.405.405 0 0 1-.164.343z"
                      ></path></svg
                    ><span>eBookJapan</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'mal'"
                    :href="`https://myanimelist.net/manga/${value}`"
                    ><svg
                      data-v-58fcffdf=""
                      data-v-57dbe908=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 4.233 4.233"
                      class="icon small text-icon-contrast text-undefined m-[3px] mr-[4px]"
                    >
                      <path
                        fill="#2e51a2"
                        d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.792.792 0 0 1 0 3.44V.794C0 .354.354 0 .794 0z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M1.935 2.997a1.459 1.459 0 0 1-.149-.378 1.074 1.074 0 0 1-.032-.317.99.99 0 0 1 .037-.325c.077-.286.267-.479.53-.538.085-.019.155-.023.345-.023h.17l.083.295-.461.004-.042.014a.385.385 0 0 0-.225.195.582.582 0 0 0-.048.126c.128.01.212.006.36.006v-.297h.376v1.059h-.381v-.466h-.212c-.206 0-.212 0-.212.01a1.274 1.274 0 0 0 .152.458c-.007.008-.266.195-.27.197-.004.001-.013-.008-.02-.02zM.265 1.416H.6l.3.428.303-.428h.336v1.402H1.2l-.002-.85-.302.378-.291-.383-.003.855H.265zm2.9.005h.333v1.095l.47.003-.073.291-.73.003z"
                      ></path></svg
                    ><span>MyAnimeList</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'nu'"
                    :href="value"
                    ><span>NovelUpdates</span></a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'raw'"
                    :href="value"
                    >Resmi Kaynak</a
                  >
                  <a
                    class="no-underline flex flex-row"
                    v-if="key == 'engtl'"
                    :href="value"
                    >Resmi İngilizce</a
                  >
                </span>
              </div>
            </div>
            <br />
            <div
              tabindex="0"
              class="collapse collapse-open border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                Serinin Yazarı ve Çizeri
              </div>
              <div class="collapse-content">
                <span
                  v-if="
                    JSON.parse(author.data.value).data.attributes.name ==
                    JSON.parse(artist.data.value).data.attributes.name
                  "
                  >{{
                    JSON.parse(author.data.value).data.attributes.name
                  }}</span
                >
                <span v-else
                  >Yazar: {{ JSON.parse(author.data.value).data.attributes.name
                  }}<br />Çizer:
                  {{ JSON.parse(artist.data.value).data.attributes.name }}</span
                >
              </div>
            </div>
            <br />
            <div
              tabindex="0"
              class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                Serinin Konusu
              </div>
              <div class="collapse-content">
                <span>{{
                  statuscode == 200
                    ? mangadata.description
                    : JSON.parse(info.data.value).data.attributes.description.en
                }}</span>
              </div>
            </div>
            <br />
            <div class="stats border border-base-300 flex flex-col">
              <div class="stat">
                <div class="stat-figure">
                  <span
                    ><Icon icon="material-symbols:heart-plus" class="h-5 w-5"
                  /></span>
                </div>
                <div class="stat-title">Takipçiler</div>
                <div class="stat-value">{{ ist.follows }}</div>
                <div class="stat-desc">kişi bu mangayı takip ediyor.</div>
              </div>

              <div class="stat">
                <div class="stat-figure">
                  <span
                    ><Icon icon="material-symbols:star" class="w-5 h-5"
                  /></span>
                </div>
                <div class="stat-title">Ortalama Puan</div>
                <div class="stat-value">
                  {{ ist.rating.average.toFixed(2) }}
                </div>
                <div class="stat-desc">puan ortalamasına sahip.</div>
              </div>
            </div>
            <br />
            <div
              class="border border-base-300 flex flex-col text-base p-5 rounded-xl"
            >
              <span
                v-for="item of JSON.parse(info.data.value).data.attributes
                  .altTitles"
                :key="item"
              >
                <a
                  v-for="i of Object.values(item)"
                  :key="i"
                  class="flex flex-row no-underline"
                >
                  <img
                    :src="`https://mangadex.org/img/flags/${
                      Object.keys(item)[Object.values(item).indexOf(i)] == 'uk'
                        ? 'ua'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ja'
                        ? 'jp'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'zh-hk'
                        ? 'cn'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'zh'
                        ? 'cn'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'kk'
                        ? 'kz'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'pt-br'
                        ? 'br'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'en'
                        ? 'gb'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ja-ro'
                        ? 'jp'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ko'
                        ? 'kr'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'fa'
                        ? 'ir'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'zh-ro'
                        ? 'cn'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'es-la'
                        ? 'mx'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'hi'
                        ? 'in'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'vi'
                        ? 'vn'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ar'
                        ? 'sa'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'he'
                        ? 'il'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'bn'
                        ? 'bd'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'my'
                        ? 'mm'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ms'
                        ? 'my'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ne'
                        ? 'np'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ta'
                        ? 'tam'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ko-ro'
                        ? 'kr'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'ca'
                        ? 'ad'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'cs'
                        ? 'cz'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'la'
                        ? 'ri'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'sv'
                        ? 'se'
                        : Object.keys(item)[Object.values(item).indexOf(i)] ==
                          'sr'
                        ? 'rs'
                        : Object.keys(item)[Object.values(item).indexOf(i)]
                    }.svg`"
                    class="w-6 m-0 mr-2 rounded-lg"
                  />{{ i }}
                </a>
                <span class="divider m-0" />
              </span>
            </div>
          </article>
        </span>
        <div class="card-body">
          <article class="prose">
            <span class="card-title">
              <h1 class="flex flex-col">
                <span>
                  {{
                    !JSON.parse(info.data.value).data.attributes[
                      "altTitles"
                    ].some((x) => x.tr)
                      ? !JSON.parse(info.data.value).data.attributes.title["en"]
                        ? !JSON.parse(info.data.value).data.attributes.title[
                            "ja-ro"
                          ]
                          ? !JSON.parse(info.data.value).data.attributes.title[
                              "ja"
                            ]
                            ? "Bilinmeyen Başlık"
                            : JSON.parse(info.data.value).data.attributes.title[
                                "ja"
                              ]
                          : JSON.parse(info.data.value).data.attributes.title[
                              "ja-ro"
                            ]
                        : JSON.parse(info.data.value).data.attributes.title[
                            "en"
                          ]
                      : JSON.parse(info.data.value).data.attributes[
                          "altTitles"
                        ].find((x) => x.tr).tr
                  }}
                </span>
                <span class="text-gray-400 text-xl mx-1">
                  {{ alttitle }}
                </span>
              </h1>
            </span>
            <span>
              <div
                tabindex="0"
                class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              >
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">Bilgiler</div>
                <div class="collapse-content">
                  <span class="flex flex-row"
                    ><Icon
                      class="h-5 w-5 mr-1"
                      icon="material-symbols:calendar-month" />
                    Yayın Tarihi:
                    {{
                      !JSON.parse(info.data.value).data.attributes.year
                        ? "Bilinmiyor"
                        : `${JSON.parse(info.data.value).data.attributes.year}`
                    }},
                    {{
                      JSON.parse(info.data.value).data.attributes.status ==
                      "completed"
                        ? " Yayın Tamamlandı."
                        : JSON.parse(info.data.value).data.attributes.status ==
                          "ongoing"
                        ? " Yayın Devam Ediyor."
                        : JSON.parse(info.data.value).data.attributes.status ==
                          "hiatus"
                        ? " Yayına Ara Verildi."
                        : "."
                    }}<br
                  /></span>
                  <span class="flex flex-row"
                    ><Icon
                      class="h-5 w-5 mr-1"
                      icon="material-symbols:translate"
                    />
                    Serinin Orjinal Dili:
                    {{
                      JSON.parse(info.data.value).data.attributes
                        .originalLanguage == "ja"
                        ? "Japonca"
                        : JSON.parse(info.data.value).data.attributes
                            .originalLanguage == "ko"
                        ? "Korece"
                        : JSON.parse(info.data.value).data.attributes
                            .originalLanguage == "ch"
                        ? "Çince"
                        : JSON.parse(info.data.value).data.attributes
                            .originalLanguage
                    }}<br />
                  </span>
                  <span class="flex flex-row"
                    ><span
                      ><Icon
                        class="h-5 w-5 mr-1"
                        icon="material-symbols:demography"
                    /></span>
                    Serinin Demografiği:
                    {{
                      JSON.parse(info.data.value).data.attributes
                        .publicationDemographic == "shounen"
                        ? "Shounen"
                        : JSON.parse(info.data.value).data.attributes
                            .publicationDemographic == "seinen"
                        ? "Seinen"
                        : JSON.parse(info.data.value).data.attributes
                            .publicationDemographic == "josei"
                        ? "Josei"
                        : JSON.parse(info.data.value).data.attributes
                            .publicationDemographic == "shoujo"
                        ? "Shoujo"
                        : JSON.parse(info.data.value).data.attributes
                            .publicationDemographic
                    }}</span
                  >
                </div>
              </div>
              <br />
              <div
                tabindex="0"
                class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              >
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">
                  Serinin Türleri
                </div>
                <div class="collapse-content">
                  <Tags
                    :tags="
                      JSON.stringify(
                        JSON.parse(info.data.value).data.attributes.tags
                      )
                    "
                  />
                </div>
              </div>
              <span class="divider" />
              <article v-if="loggeduser" class="prose my-3">
                <h1>Eylemler</h1>
                <span class="flex flex-row">
                  <span
                    v-if="exists"
                    class="tooltip"
                    data-tip="Favorilere Ekle"
                  >
                    <label @click="likeSwitch()" class="btn btn-secondary"
                      ><Icon
                        v-if="isFav"
                        id="fav"
                        icon="material-symbols:favorite"
                        class="h-5 w-5" /><Icon
                        v-else
                        id="unfav"
                        icon="material-symbols:favorite-outline"
                        class="h-5 w-5"
                    /></label>
                  </span>
                  <span class="tooltip" data-tip="Listeye Ekle">
                    <label for="list" class="btn btn-ghost mx-1"
                      ><Icon
                        icon="material-symbols:playlist-add-rounded"
                        class="h-5 w-5"
                      />Listeye Ekle</label
                    >
                  </span>
                  <span class="tooltip" data-tip="Okuma Durumunu Düzenle">
                    <label
                      :for="route.params.id + 'edit'"
                      :class="`btn ${
                        checkmangainbc[0]
                          ? checkmangainbc[1] == 'reading'
                            ? 'btn-success'
                            : checkmangainbc[1] == 'completed'
                            ? 'btn-info'
                            : checkmangainbc[1] == 'onhold'
                            ? 'btn-warning'
                            : checkmangainbc[1] == 'dropped'
                            ? 'btn-error'
                            : checkmangainbc[1] == 'plantoread'
                            ? 'btn-primary'
                            : checkmangainbc[1] == 'rereading'
                            ? 'btn-accent'
                            : 'btn-neutral'
                          : 'btn-neutral'
                      }`"
                    >
                      <Icon
                        icon="material-symbols:library-add"
                        class="h-4 w-4"
                      />
                      {{
                        checkmangainbc[0]
                          ? checkmangainbc[1] == "reading"
                            ? "Okunuyor"
                            : checkmangainbc[1] == "completed"
                            ? "Bitirildi"
                            : checkmangainbc[1] == "onhold"
                            ? "Bekletiliyor"
                            : checkmangainbc[1] == "dropped"
                            ? "Bırakıldı"
                            : checkmangainbc[1] == "plantoread"
                            ? "Planlandı"
                            : checkmangainbc[1] == "rereading"
                            ? "Yeniden Okunuyor"
                            : "Kitaplığa Ekle"
                          : "Kitaplığa Ekle"
                      }}
                    </label>
                  </span>
                  <span class="tooltip" data-tip="Kitaplıktan Kaldır">
                    <label
                      v-if="checkmangainbc[0]"
                      for="id"
                      class="btn btn-error mx-1"
                      ><Icon icon="material-symbols:delete" class="h-5 w-5" />
                      Kaldır</label
                    >
                  </span>
                </span>
                <input type="checkbox" id="id" class="modal-toggle" />
                <div class="modal" role="dialog">
                  <article class="prose modal-box w-96">
                    <h3>İşlemi Onaylayın</h3>
                    <p>
                      {{
                        JSON.parse(info.data.value).data.attributes.title.en ||
                        JSON.parse(info.data.value).data.attributes.title[
                          "ja-ro"
                        ]
                      }}
                      adlı girdiyi kitaplığınızdan kaldırmak istediğinize emin
                      misiniz?
                    </p>
                    <div class="modal-action">
                      <label @click="remove()" class="btn btn-error"
                        ><Icon icon="material-symbols:delete" class="h-5 w-5" />
                        Sil</label
                      >
                      <label for="id" class="btn"
                        ><Icon icon="material-symbols:cancel" class="h-5 w-5" />
                        İptal</label
                      >
                    </div>
                  </article>
                </div>
                <input type="checkbox" id="list" class="modal-toggle" />
                <div class="modal" role="dialog">
                  <article class="prose modal-box w-96">
                    <h3>Listeye Ekle</h3>
                    <p>
                      {{
                        JSON.parse(info.data.value).data.attributes.title.en ||
                        JSON.parse(info.data.value).data.attributes.title[
                          "ja-ro"
                        ]
                      }}
                      adlı girdiyi listeye ekleyin
                    </p>
                    <select
                      v-if="lists[0]"
                      id="liste"
                      class="select select-bordered select-sm w-full max-w-xs ml-2"
                    >
                      <option v-for="item of lists" :key="item">
                        {{ item.title }}
                      </option>
                    </select>
                    <span v-else
                      >Üzgünüz, hiç listeniz yok. Bir seriyi listenize eklemeden
                      önce bir liste oluşturun.</span
                    >
                    <div class="modal-action">
                      <label
                        v-if="lists[0]"
                        @click="ekle()"
                        class="btn btn-success"
                        ><Icon icon="material-symbols:add" class="h-5 w-5" />
                        Ekle</label
                      >
                      <label for="list" class="btn"
                        ><Icon icon="material-symbols:cancel" class="h-5 w-5" />
                        İptal</label
                      >
                    </div>
                  </article>
                </div>
                <input
                  type="checkbox"
                  :id="route.params.id + 'edit'"
                  class="modal-toggle"
                />
                <div class="modal" role="dialog">
                  <LibEdit
                    :name="
                      JSON.parse(info.data.value).data.attributes.title.en ||
                      JSON.parse(info.data.value).data.attributes.title['ja-ro']
                    "
                    :id="route.params.id"
                    :status="checkmangainbc[0] ? checkmangainbc[1] : null"
                    :userid="id"
                  />
                </div>
              </article>
              <button
                @click="
                  redirect(
                    `https://mangadex.org/manga/${
                      JSON.parse(info.data.value).data.id
                    }`
                  )
                "
                class="btn btn-block no-animation mx-1"
              >
                MangaDex Sayfasına Gidin
              </button>
              <div class="divider"></div>
            </span>
          </article>
          <div
            tabindex="0"
            class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
          >
            <input type="checkbox" />
            <div class="collapse-title text-xl font-medium">
              <article class="prose">
                <h2>Bölümler</h2>
              </article>
            </div>
            <div class="collapse-content">
              <ul
                v-if="statuscode == 200"
                class="menu bg-base-100 w-full p-2 rounded-box"
              >
                <span v-for="i of episodes" :key="i">
                  <li class="menu-title">
                    <span>{{ titles[episodes.indexOf(i)] }}</span>
                  </li>
                  <li v-for="a of i.reverse()" :key="a">
                    <a
                      :href="`/manga/${route.params.id}/read/${a.vol}/${a.ep}`"
                    >
                      <span
                        ><Icon
                          class="h-5 w-5"
                          icon="material-symbols:menu-book-rounded"
                      /></span>
                      <span class="flex flex-row">
                        <b class="mr-1">{{ a.title }}</b> (<RouterLink
                          class="link"
                          :to="`/scan/${a.scan}`"
                          >{{ a.source }}</RouterLink
                        >)
                      </span>
                    </a>
                  </li>
                </span>
              </ul>
              <div v-else>
                <div class="alert alert-warning">
                  <div class="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="stroke-current flex-shrink-0 h-6 w-6 m-1"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span
                      >Bu seriye Mangile kaynaklı hiçbir bölüm yüklenmemiş.
                      Aşağıda MangaDex kaynaklı bölümler listelenmiştir.</span
                    >
                  </div>
                </div>
                <br />
                <div
                  tabindex="0"
                  class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                >
                  <input type="checkbox" />
                  <div class="collapse-title text-xl font-medium">
                    <article class="prose">
                      <h2>MangaDex Kaynaklı Bölümler</h2>
                    </article>
                  </div>
                  <div class="collapse-content">
                    <ul class="menu bg-base-100 w-full p-2 rounded-box">
                      <li v-for="a of chaps" :key="a">
                        <a
                          target="_blank"
                          :href="`https://mangadex.org/chapter/${a.id}`"
                        >
                          <Icon
                            class="h-5 w-5"
                            icon="material-symbols:arrow-outward"
                          />
                          <b
                            >Bölüm {{ a.attributes.chapter }} -
                            {{ a.attributes.title }}</b
                          >
                          ({{
                            a.attributes.translatedLanguage == "en"
                              ? "İngilizce"
                              : a.attributes.translatedLanguage
                          }})
                        </a>
                      </li>
                    </ul>
                    <button
                      @click="
                        redirect(
                          `https://mangadex.org/manga/${
                            JSON.parse(info.data.value).data.id
                          }`
                        )
                      "
                      class="btn btn-block no-animation"
                    >
                      Daha Fazla Bölüm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
