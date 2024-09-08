<script setup>
import { data } from "@/assets/data.ts";

const route = useRoute();
const { isMobileOrTablet } = useDevice();

const mangaID = ref(route.params.mangaID); //ref içinde çünkü watcher kullanılıyor
const manga = ref([]); //manganın <template> içerisinde kullanılacak bütün MAL verileri bu ref'in içerisine kaydolacak
const images = ref([]);
const recommendations = ref([]);
const relations = ref([]);
const warning = ref([]);

const recommendationsData = await $fetch(
  `https://api.jikan.moe/v4/manga/${mangaID.value}/recommendations`
);
recommendations.value = recommendationsData.data;

function moveElementToIndex(arr, value, targetIndex) {
  const currentIndex = arr.findIndex(
    (el) => el.jpg.large_image_url === value.jpg.large_image_url
  );
  if (currentIndex === -1 || currentIndex === targetIndex) {
    return arr;
  }
  const [removedElement] = arr.splice(currentIndex, 1);
  arr.splice(targetIndex, 0, removedElement);
  return arr;
}

//fonksiyon içinde çünkü watcher ile izlenmesi gerekiyor
async function fetchManga() {
  try {
    const [mangaData, imagesData] = await Promise.all([
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/full`),
      $fetch(`https://api.jikan.moe/v4/manga/${mangaID.value}/pictures`),
    ]);

    manga.value = mangaData.data;
    images.value = moveElementToIndex(
      imagesData.data,
      imagesData.data.find(
        (x) => x.jpg.large_image_url == manga.value.images.jpg.large_image_url
      ),
      0
    );

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
watchEffect(() => {
  if (manga.value?.title) {
    const seoMeta = [
      {
        property: "og:title",
        content: manga.value.title + " | Mangile",
      },
      {
        property: "og:description",
        content: `${manga.value.title} adlı mangaya ait bilgilere, bölümlere ve benzeri bir çok veriye ulaş ve manganın Türkçe bölümlerine Mangile'da eriş!`,
      },
      {
        property: "og:image",
        content: `https://mangile.vercel.app/api/canvas/manga/${mangaID.value}`,
      },
      {
        name: "twitter:card",
        content: `https://mangile.vercel.app/api/canvas/manga/${mangaID.value}`,
      },
      {
        name: "theme-color",
        content: "#0a0a0a",
      },
    ];
    useHead({
      title: manga.value.title,
      meta: seoMeta,
    });
  }
});

watch(mangaID, async (newID, oldID) => {
  if (newID !== oldID) {
    await fetchManga();
  }
}); //mangaID değiştiğinde tekrar fetch'le
onMounted(fetchManga); //sayfa ilk yüklendiğinde fetch'le
</script>

<template>
  <main class="lg:grid lg:grid-cols-11">
    <div class="lg:mx-0 mx-5 lg:col-start-1 lg:col-end-12">
      <div
        v-if="warning.length > 0"
        role="alert"
        class="alert alert-warning lg:text-md text-sm lg:mx-5 lg:mt-2 px-5 text-start flex"
      >
        <Icon name="material-symbols:warning" class="w-5 h-5 lg:-mr-2" />
        <span
          >UYARI: Bu seri
          {{ [...new Set(warning)].join(", ") }} içermektedir.</span
        >
      </div>
      <div
        v-if="manga.type != 'Manga'"
        role="alert"
        class="alert alert-info lg:text-md text-sm lg:mx-5 lg:mt-2 px-5 text-start flex"
      >
        <Icon name="material-symbols:info" class="w-5 h-5 -mr-2" />
        <span
          >Bilgi: Bu seri bir
          {{
            manga.type == "Light Novel"
              ? "Hafif Roman'dır"
              : manga.type == "Manhwa"
              ? "Manhwa'dır"
              : "Manga Değildir"
          }}</span
        >
      </div>
    </div>
    <div
      v-if="manga && manga.images && manga.images.jpg"
      class="card lg:card-side bg-base-100 lg:col-start-1 lg:col-end-11 lg:m-5 lg:grid lg:grid-cols-12"
    >
      <article class="prose lg:flex lg:flex-col lg:col-start-1 lg:col-end-5">
        <swiper
          :spaceBetween="0"
          :centeredSlides="true"
          :loop="true"
          class="lg:w-[287px] w-72"
        >
          <swiper-slide v-for="image of images" :key="image">
            <figure class="indicator">
              <span
                v-if="manga.demographics && manga.demographics[0]"
                class="indicator-item indicator-center indicator-bottom badge badge-base-100 mb-2 rounded-b-none"
                >{{ manga.demographics[0].name }}</span
              >
              <img
                class="rounded shadow-md w-72 h-auto"
                :src="image.jpg.large_image_url"
              />
            </figure>
          </swiper-slide>
        </swiper>
        <span v-if="!isMobileOrTablet" class="-mt-2">
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
        <span v-if="!isMobileOrTablet" class="-mt-2">
          <h1>Sanatçılar</h1>
          <div class="w-72 -m-2 -mt-5">
            <table class="table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="author of manga['authors']" :key="author">
                  <td
                    v-for="item of author['name'].split(', ').sort()"
                    :key="item"
                  >
                    {{ item }}
                  </td>
                  <td>
                    <NuxtLink
                      class="btn btn-xs btn-ghost"
                      :to="`/person/${author.mal_id}`"
                    >
                      Görüntüle
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
      </article>
      <div class="card-body lg:col-start-5 lg:col-end-12">
        <article class="prose">
          <span v-if="manga.authors" class="card-title lg:-my-7 -mt-12 -my-10">
            <h1 class="flex flex-col">
              <span class="text-sm text-gray-400 flex flex-row lg:mx-1 -mb-2">
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
                class="text-gray-400 lg:text-xl text-lg mx-1"
              >
                {{ manga.title_japanese }}
              </span>
            </h1>
          </span>
          <span>
            <span
              v-if="manga.status"
              class="badge badge-accent badge-sm lg:badge-md gap-2 mr-1"
              >{{ data["malstatus"][String(manga.status)] }}</span
            >
            <span
              v-for="genre of manga.genres"
              :key="genre"
              class="badge badge-neutral badge-sm lg:badge-md gap-2 my-1 mr-1"
              >{{ data.malgenres[String(genre.name)] }}</span
            >
            <br />
            <span v-if="manga.published" class="text-sm lg:text-md">
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
            <br /><br v-if="!isMobileOrTablet" />
            <span v-if="manga.synopsis" class="text-sm lg:text-md">{{
              manga.synopsis
            }}</span>
            <br /><br />
            <div
              v-if="manga.background"
              class="collapse collapse-arrow -mx-2 -mt-5"
            >
              <input type="checkbox" class="lg:text-xl text-lg peer" />
              <div class="collapse-title lg:text-xl text-lg">
                Arkaplan Bilgisi
              </div>
              <div class="collapse-content text-sm lg:text-md -mt-5">
                <p>
                  {{ manga.background }}
                </p>
              </div>
            </div>
            <article class="prose mt-5">
              <h1>Veri Tabanı</h1>
            </article>
            <span class="divider" />
            <ul class="menu menu-sm rounded-lg lg:w-full">
              <li>
                <details>
                  <summary>
                    <Icon name="mdi:book-open-blank-variant" class="h-5 w-5" />
                    Bölümler
                  </summary>
                  <ul>
                    <li>
                      <details>
                        <summary>
                          <Icon name="mdi:file-document" class="h-5 w-5" />
                          Bölüm 3
                        </summary>
                        <ul>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Tempest Fansub
                            </NuxtLink>
                          </li>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Manga Şehri
                            </NuxtLink>
                          </li>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Sad Scans
                            </NuxtLink>
                          </li>
                        </ul>
                      </details>
                    </li>
                    <li>
                      <details>
                        <summary>
                          <Icon name="mdi:file-document" class="h-5 w-5" />
                          Bölüm 2
                        </summary>
                        <ul>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Tempest Fansub
                            </NuxtLink>
                          </li>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Manga Şehri
                            </NuxtLink>
                          </li>
                        </ul>
                      </details>
                    </li>
                    <li>
                      <details>
                        <summary>
                          <Icon name="mdi:file-document" class="h-5 w-5" />
                          Bölüm 1
                        </summary>
                        <ul>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Tempest Fansub
                            </NuxtLink>
                          </li>
                          <li>
                            <NuxtLink class="no-underline flex flex-row">
                              <Icon
                                name="mdi:file-document-arrow-right"
                                class="h-5 w-5 mr-1"
                              />
                              Sad Scans
                            </NuxtLink>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>
                    <Icon name="mdi:file-document-edit" class="h-5 w-5" />
                    Çeviri Ekipleri
                  </summary>
                  <ul>
                    <li>
                      <NuxtLink class="no-underline flex flex-row">
                        <Icon
                          name="mdi:file-document-arrow-right"
                          class="h-5 w-5 mr-1"
                        />
                        Tempest Fansub
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink class="no-underline flex flex-row">
                        <Icon
                          name="mdi:file-document-arrow-right"
                          class="h-5 w-5 mr-1"
                        />
                        Manga Şehri
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink class="no-underline flex flex-row">
                        <Icon
                          name="mdi:file-document-arrow-right"
                          class="h-5 w-5 mr-1"
                        />
                        Sad Scans
                      </NuxtLink>
                    </li>
                  </ul>
                </details>
              </li>
              <li v-for="link of manga.external" :key="link">
                <NuxtLink :to="link.url" class="no-underline flex flex-row">
                  <Icon
                    :name="
                      link['url'].includes('twitter')
                        ? 'mdi:twitter'
                        : link['name']
                            .replaceAll('Official Site', 'mdi:web')
                            .replaceAll('Wikipedia', 'mdi:wikipedia')
                    "
                    class="h-5 w-5 mr-1"
                  />
                  {{
                    link["name"]
                      .replaceAll("Official Site", "Resmi Genel Ağ Adresi")
                      .replaceAll("Wikipedia", "Vikipedi")
                  }}
                </NuxtLink>
              </li>
              <li v-for="link of manga.serializations" :key="link">
                <NuxtLink :to="link.url" class="no-underline flex flex-row">
                  <Icon name="mdi:library" class="h-5 w-5 mr-1" />
                  {{
                    link["name"]
                      .replaceAll("Weekly", "Haftalık")
                      .replaceAll("Monthly", "Aylık")
                  }}
                </NuxtLink>
              </li>
            </ul>
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
        class="lg:col-start-12 lg:col-end-12"
      >
        <div class="stats">
          <span class="flex lg:flex-col flex-row flex-wrap">
            <article class="prose text-center">
              <h2 class="lg:m-0 mx-5">MAL İstatistikleri</h2>
            </article>
            <div class="stat">
              <div class="stat-figure">
                <Icon name="material-symbols:star" class="w-8 h-8" />
              </div>
              <div class="stat-title">Puan Ortalaması</div>
              <div class="stat-value">{{ manga.score }}</div>
              <div class="stat-desc">puan ortalamasına sahip</div>
            </div>
            <div class="stat">
              <div class="stat-figure">
                <Icon name="mdi:account-star" class="w-8 h-8" />
              </div>
              <div class="stat-title">Kamuoyu</div>
              <div class="stat-value">{{ manga.scored_by }}</div>
              <div class="stat-desc">kişi tarafından puanlandı</div>
            </div>
            <div class="stat">
              <div class="stat-figure">
                <Icon name="material-symbols:tag" class="w-8 h-8" />
              </div>
              <div class="stat-title">Sıralama</div>
              <div class="stat-value">{{ manga.rank }}.</div>
              <div class="stat-desc">sırada</div>
            </div>
            <div class="stat">
              <div class="stat-figure">
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
              <div class="stat-figure">
                <Icon name="mdi:account-group" class="w-8 h-8" />
              </div>
              <div class="stat-title">Üye</div>
              <div class="stat-value">{{ manga.members }}</div>
              <div class="stat-desc">kişinin kitaplığında</div>
            </div>
            <div class="stat">
              <div class="stat-figure">
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
    <div v-if="relations[0]" class="lg:col-start-1 lg:col-end-11 px-5">
      <article class="prose max-w-none lg:px-5">
        <h1 class="lg:flex lg:flex-row">Bağlantılı Seriler</h1>
      </article>
      <span
        v-for="relation of manga.relations"
        :key="relation"
        class="lg:my-5 lg:flex lg:flex-row"
      >
        <span
          v-if="
            relations.filter((x) => x.relation == relation.relation).length != 0
          "
          class="lg:mr-5 lg:flex lg:items-center"
        >
          <article
            v-if="!isMobileOrTablet"
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
                  .replaceAll("Parent Story", "Ana Öykü")
                  .replaceAll("Character", "Karakter")
              }}
            </h1>
          </article>
          <article v-else class="prose mt-5">
            <h1>
              {{
                relation["relation"]
                  .replaceAll("Other", "Diğer")
                  .replaceAll("Adaptation", "Adaptasyon")
                  .replaceAll("Sequel", "Devam Serisi")
                  .replaceAll("Prequel", "Önceki Seri")
                  .replaceAll("Side Story", "Yan Öykü")
                  .replaceAll("Alternative Version", "Alternatif Yorum")
                  .replaceAll("Parent Story", "Ana Öykü")
              }}
            </h1>
            <span class="divider -my-5" />
          </article>
        </span>
        <br v-if="isMobileOrTablet" />
        <span
          v-if="!isMobileOrTablet"
          class="divider divider-horizontal lg:ml-2"
        />
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
    <div
      v-if="recommendations[0]"
      class="lg:col-start-1 lg:col-end-12 lg:mt-0 mt-2"
    >
      <article class="prose max-w-none px-5">
        <h1 class="flex flex-row">İlginizi çekebilir</h1>
      </article>
      <RecommendationCard class="mt-5" :itemData="recommendations" />
    </div>
  </main>
</template>
