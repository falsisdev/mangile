<script setup>
import { toRaw } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { isMobileOrTablet } = useDevice();

const query = groq`*[_id == $scanID] {
  ...,
  chapters[] {
    ...,
    source-> {
      _id,
      name,
      url,
      description
    }
  },
  titles[]-> {
    _id,
    name,
    description,
    coverImage
  }
}`;
const { data: preSanityData } = useSanityQuery(query, { scanID: route.params.scanID });

const sanityData = ref([]);
const chapters = ref([]);
const scans = ref([]);
const scanData = ref(null);
const titles = ref([]);

watchEffect(() => {
  if (preSanityData.value) {
    const fetchedData = toRaw(preSanityData.value);
    sanityData.value = fetchedData;

    if (fetchedData.length > 0) {
      scanData.value = fetchedData[0];
      if (fetchedData[0].chapters) {
        chapters.value = fetchedData[0].chapters;
        fetchedData[0].chapters.forEach((x) => {
          if(x.source) scans.value.push(x.source.name)
        });
      }
      if (fetchedData[0].titles) {
        titles.value = fetchedData[0].titles;
      }
    }
  }
});
</script>

<template>
  <main>
    <div class="lg:mx-0 mx-5">
      <div
        v-if="scanData"
        class="card bg-base-100 "
      >
        <article class="prose max-w-none">
          <h1 class="-mb-2">{{ scanData.name }}</h1>
          <SanityContent class="mt-5" :blocks="scanData.description"/>
        </article>
        <div class="card-body">
          <article class="prose max-w-none">
            <h2>Çevirilen Seriler</h2>
            <!--{{ titles }}-->
          </article>
        </div>
      </div>
    </div>
  </main>
</template>