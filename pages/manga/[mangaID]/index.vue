<script setup>
import { data } from "@/assets/data.ts";

const route = useRoute();
const mangaID = ref(route.params.mangaID); //ref içinde çünkü watcher kullanılıyor
const manga = ref([]); //manganın <template> içerisinde kullanılacak bütün MAL verileri bu ref'in içerisine kaydolacak
const recommendations = ref([]);
const relations = ref([]);
const warning = ref([]);

const recommendationsData = await $fetch(
  `https://api.jikan.moe/v4/manga/${mangaID.value}/recommendations`
);
recommendations.value = recommendationsData.data;

//fonksiyon içinde çünkü watcher ile izlenmesi gerekiyor
async function fetchManga() {
  try {
    const mangaData = await $fetch(
      `https://api.jikan.moe/v4/manga/${mangaID.value}/full`
    );
    manga.value = mangaData.data;

    manga.value.themes?.forEach((x) => {
      if (data.warnmessages[x.mal_id]) {
        warning.value.push(data.warnmessages[x.mal_id]);
      }
    });

    if (manga.value.relations) {
      const tempRelations = [];

      for (let relation of manga.value.relations) {
        for (let entry of relation.entry) {
          if (
            entry.type === "manga" &&
            !tempRelations.some((e) => e.entry.mal_id === entry.mal_id)
          ) {
            const entryData = await $fetch(
              `https://api.jikan.moe/v4/manga/${entry.mal_id}/full`
            );
            tempRelations.push({
              relation: relation.relation,
              entry: entryData.data,
            });
          }
        }
      }

      relations.value = tempRelations;
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
}

watch(mangaID, async (newID, oldID) => {
  if (newID !== oldID) {
    await fetchManga();
  }
}); //mangaID değiştiğinde tekrar fetch'le
onMounted(fetchManga); //sayfa ilk yüklendiğinde fetch'le
</script>

<template>
  <main class="grid grid-cols-11">
    <div
      v-if="warning.length > 0"
      role="alert"
      class="alert alert-warning col-start-1 col-end-11 mx-5"
    >
      <Icon name="material-symbols:warning" class="w-5 h-5 -mr-2" />
      <span
        >UYARI: Bu seri
        {{ [...new Set(warning)].join(", ") }} içermektedir.</span
      >
    </div>
    <div
      v-if="manga && manga.images && manga.images.jpg"
      class="card lg:card-side bg-base-100 col-start-1 col-end-11 m-5 grid grid-cols-12"
    >
      <article class="prose flex flex-col col-start-1 col-end-5">
        <figure class="indicator">
          <span
            v-if="manga.demographics && manga.demographics[0]"
            class="indicator-item indicator-center indicator-bottom badge badge-base-100 mb-2 rounded-b-none"
            >{{ manga.demographics[0].name }}</span
          >
          <img
            class="rounded shadow-md w-72 h-auto"
            :src="manga.images.jpg.large_image_url"
          />
        </figure>
        <span class="-mt-2">
          <h1>Başlıklar</h1>
          <div class="w-72 -m-2 -mt-5">
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Tür/Dil</th>
                  <th>Ad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="title of manga['titles']" :key="title">
                  <th>
                    <Icon
                      v-if="title.type != 'Default' || title.type != 'Synonym'"
                      :name="`flag:${data.titletypes[title['type']][1]}-4x3`"
                    />
                  </th>
                  <td>{{ data.titletypes[title["type"]][0] }}</td>
                  <td>{{ title["title"] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
      </article>
      <div class="card-body col-start-5 col-end-12">
        <article class="prose">
          <span v-if="manga.authors" class="card-title -my-7">
            <h1 class="flex flex-col">
              <span class="text-sm text-gray-400 flex flex-row mx-1 -mb-2">
                <span
                  v-for="author of manga.authors"
                  :key="author"
                  class="mr-1"
                >
                  {{ author["name"].split(", ").sort().join(" ")
                  }}{{
                    manga["authors"].length >= 2 &&
                    manga["authors"].length - 1 !=
                      manga["authors"].indexOf(author)
                      ? manga["authors"].length - 2 ==
                        manga["authors"].indexOf(author)
                        ? " ve "
                        : ", "
                      : ""
                  }}
                </span>
                <span class="-ml-1">'dan</span>
              </span>
              <span>
                {{ manga.title }}
              </span>
              <span
                v-if="
                  manga['title'].toLowerCase() !=
                  manga['title_japanese'].toLowerCase()
                "
                class="text-gray-400 text-xl mx-1"
              >
                {{ manga.title_japanese }}
              </span>
            </h1>
          </span>
          <span>
            <span v-if="manga.status" class="badge badge-accent gap-2 mr-1">{{
              data["malstatus"][String(manga.status)]
            }}</span>
            <span
              v-for="genre of manga.genres"
              :key="genre"
              class="badge badge-neutral gap-2 my-1 mr-1"
              >{{ data.malgenres[String(genre.name)] }}</span
            >
            <br />
            <span v-if="manga.published">
              {{
                `${manga["published"].prop.from.day} ${
                  data.months[parseInt(manga["published"].prop.from.month) - 1]
                } ${manga["published"].prop.from.year}'den ${
                  manga["published"].prop.to.day
                    ? manga["published"].prop.to.day
                    : ""
                } ${
                  manga["published"].prop.to.month
                    ? data.months[
                        parseInt(manga["published"].prop.to.month) - 1
                      ]
                    : ""
                } ${
                  manga["published"].prop.to.year
                    ? manga["published"].prop.to.year
                    : ""
                }${
                  manga.published.prop.year
                    ? "'e kadar yayınlandı"
                    : " günümüze kadar yayınını sürdürüyor"
                }`
              }}
            </span>
            <br /><br />
            <span v-if="manga.synopsis">{{ manga.synopsis }}</span>
            <br /><br />
            <span v-if="manga.background">{{ manga.background }}</span>
          </span>
        </article>
      </div>
      <div
        v-if="
          manga.score &&
          manga.scored_by &&
          manga.rank &&
          manga.popularity &&
          manga.members &&
          manga.favorites
        "
        class="col-start-12 col-end-12"
      >
        <div class="stats">
          <span class="flex flex-col">
            <article class="prose text-center">
              <h2>MAL İstatistikleri</h2>
            </article>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon name="material-symbols:star" class="w-8 h-8" />
              </div>
              <div class="stat-title">Puan Ortalaması</div>
              <div class="stat-value">{{ manga.score }}</div>
              <div class="stat-desc">puan ortalamasına sahip</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon name="mdi:account-star" class="w-8 h-8" />
              </div>
              <div class="stat-title">Kamuoyu</div>
              <div class="stat-value">{{ manga.scored_by }}</div>
              <div class="stat-desc">kişi tarafından puanlandı</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon name="material-symbols:tag" class="w-8 h-8" />
              </div>
              <div class="stat-title">Sıralama</div>
              <div class="stat-value">{{ manga.rank }}.</div>
              <div class="stat-desc">sırada</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon
                  name="material-symbols:auto-awesome-rounded"
                  class="w-8 h-8"
                />
              </div>
              <div class="stat-title">Popülerlik</div>
              <div class="stat-value">{{ manga.popularity }}.</div>
              <div class="stat-desc">aktif en popüler manga</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon name="mdi:account-group" class="w-8 h-8" />
              </div>
              <div class="stat-title">Üye</div>
              <div class="stat-value">{{ manga.members }}</div>
              <div class="stat-desc">kişi bu seriyi okuyor</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">
                <Icon name="material-symbols:favorite" class="w-8 h-8" />
              </div>
              <div class="stat-title">Favori</div>
              <div class="stat-value">{{ manga.favorites }}</div>
              <div class="stat-desc">
                <div class="stat-desc">kişinin favori mangası</div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div v-if="relations[0]" class="col-start-1 col-end-11 mx-5">
      <article class="prose max-w-none px-5">
        <h1 class="flex flex-row">Bağlantılı Seriler</h1>
      </article>
      <span
        v-for="relation of manga.relations"
        :key="relation"
        class="my-5 flex flex-row"
      >
        <span
          v-if="
            relations.filter((x) => x.relation == relation.relation).length != 0
          "
          class="mr-5 flex items-center"
        >
          <article
            class="prose rotate-180"
            style="text-orientation: sideways; writing-mode: vertical-lr"
          >
            <h1>
              {{
                relation["relation"]
                  .replaceAll("Other", "Diğer")
                  .replaceAll("Adaptation", "Adaptasyon")
                  .replaceAll("Sequel", "Devam Serisi")
                  .replaceAll("Prequel", "Önceki Seri")
                  .replaceAll("Side Story", "Yan Öykü")
                  .replaceAll("Alternative Version", "Alternatif Yorum")
              }}
            </h1>
          </article>
        </span>
        <span class="divider divider-horizontal ml-2" />
        <span class="flex flex-row flex-wrap">
          <RelationCard
            v-for="entry of relations.filter(
              (x) => x.relation == relation.relation
            )"
            :key="entry.entry.mal_id"
            :itemData="entry.entry"
            :index="relations.indexOf(entry)"
          />
        </span>
      </span>
    </div>
    <div class="col-start-1 col-end-12">
      <article class="prose max-w-none px-5">
        <h1 class="flex flex-row">İlginizi çekebilir</h1>
      </article>
      <RecommendationCard class="mt-5" :itemData="recommendations" />
    </div>
  </main>
</template>
