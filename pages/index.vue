<script setup>
import imageUrlBuilder from "@sanity/image-url";

const sanityConfig = useSanity().config;
const builder = imageUrlBuilder(sanityConfig); //Referans olarak dönen görsellerin url'lerini çekmeye yarar

const createdSeries = ref([]);
const updatedSeries = ref([]);
const highlights = ref([]);
const topMangas = ref([]);
const pubs = ref([]);

const queryCreated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_createdAt desc)`; //Son Eklenenler
const queryUpdated = groq`*[_type == 'manga' || _type == 'lightNovel'] | order(_updatedAt desc)`; //Son Güncellenenler

const { data: preCreatedData } = useSanityQuery(queryCreated); //Son Eklenenler
const { data: preUpdatedData } = useSanityQuery(queryUpdated); //Son Güncellenenler

const { data: highlightsData } = await useFetch("https://api.jikan.moe/v4/manga", {
    params: {
        limit: 20,
        sfw: true,
        genres_exclude: "28,26,9,49,12,53,44,35,65,74,15",
        order_by: "popularity",
        sort: "asc",
    },
    key: "highlights",
    staleTime: 1000 * 60 * 10, // 10 dakika
    cacheTime: 1000 * 60 * 60 * 24, // 24 saat
});

const { data: topMangasData } = await useFetch("https://api.jikan.moe/v4/top/manga", {
    key: "top-mangas",
    staleTime: 1000 * 60 * 10, //10dk
    cacheTime: 1000 * 60 * 60 * 24, //24 saat
});

const { data: pubsData } = await useFetch("https://api.jikan.moe/v4/top/manga", {
    params: { filter: "publishing" },
    key: "publishing-mangas",
    staleTime: 1000 * 60 * 10, //10dk
    cacheTime: 1000 * 60 * 60 * 24, //24 saat
});

// Veri işleme ve reaktif güncellemeler için watchEffect kullanımı
watchEffect(() => {
    if (preCreatedData.value) {
        createdSeries.value = preCreatedData.value.map(item => ({
            name: item.title,
            description: item.description,
            type: item._type,
            image: builder.image(item.coverImage.asset._ref).auto("format").url(),
            date: item._createdAt,
            genres: item.tags,
            id: item.myAnimeListId,
            chapterCount: item.chapters?.length || 0,
        }));
    }

    if (preUpdatedData.value) {
        updatedSeries.value = preUpdatedData.value.map(item => ({
            name: item.title,
            description: item.description,
            type: item._type,
            image: builder.image(item.coverImage.asset._ref).auto("format").url(),
            date: item._updatedAt,
            genres: item.tags,
            id: item.myAnimeListId,
            chapterCount: item.chapters?.length || 0,
        }));
    }

    if (highlightsData.value?.data) {
        highlights.value = highlightsData.value.data.map(item => ({
            name: item.title,
            description: item.synopsis,
            type: item.type?.replaceAll("Light Novel", "Hafif Roman").replaceAll("Novel", "Roman") || 'N/A',
            image: item.images?.jpg?.large_image_url,
            date: item.published?.prop,
            status: item.status,
            genres: item.genres,
            url: item.url,
            id: item.mal_id,
        }));
    }

    if (topMangasData.value?.data) {
        topMangas.value = topMangasData.value.data.map(item => ({
            name: item.title,
            description: item.synopsis,
            type: item.type?.replaceAll("Light Novel", "Hafif Roman").replaceAll("Novel", "Roman") || 'N/A',
            image: item.images?.jpg?.large_image_url,
            date: item.published?.prop,
            status: item.status,
            genres: item.genres,
            url: item.url,
            id: item.mal_id,
        }));
    }

    if (pubsData.value?.data) {
        pubs.value = pubsData.value.data.map(item => ({
            name: item.title,
            description: item.synopsis,
            type: item.type?.replaceAll("Light Novel", "Hafif Roman").replaceAll("Novel", "Roman") || 'N/A',
            image: item.images?.jpg?.large_image_url,
            date: item.published?.prop,
            status: item.status,
            genres: item.genres,
            url: item.url,
            id: item.mal_id,
        }));
    }
});


// SEO Meta Etiketleri
useSeoMeta({
    author: "Falsis",
    twitterData1: "Falsis",
    twitterLabel1: "created by",
    twitterTitle: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
    title: "Ana Sayfa",
    ogTitle: "Ana Sayfa",
    description: "Mangile - Türkçe Manga, Hafif Roman, Webtoon oku!",
    ogDescription: "Mangile - Dinamik, Efektif, Kullanışlı ve Türkçe manga okuma, takip etme ve paylaşma sistemi genel ağ sitesi.",
    ogImage: "https://cdn.sanity.io/images/1yge7tlr/production/5da7fab2f4103d1f13847fdfc879637b6e40d8a7-426x240.gif",
    twitterCard: "summary_large_image",
    twitterImage: "https://cdn.sanity.io/images/1yge7tlr/production/5da7fab2f4103d1f13847fdfc879637b6e40d8a7-426x240.gif",
});

// Zamanı "time ago" formatında gösteren fonksiyon
const timeAgo = (dateString) => {
    if (!dateString) return "bilinmiyor";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        yıl: 31536000,
        ay: 2592000,
        hafta: 604800,
        gün: 86400,
        saat: 3600,
        dakika: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit} önce`;
        }
    }
    return "az önce";
}

// Tarih formatlama fonksiyonu
const formatTooltipDate = (dateString) => {
    if (!dateString) return "Tarih bilgisi yok";
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'long' })} ${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
</script>
<template>
    <main>
        <HeroSection />
        <div class="flex justify-center w-full max-w-screen">
            <div class="container px-7 py-8">
                <section class="mb-12" v-if="updatedSeries.length > 0">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
                        Son Güncellenen İçerikler
                    </h2>
                    <Swiper :slides-per-view="2" :space-between="10" :loop="false" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 3.75,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1280': {
                            slidesPerView: 6.25,
                            spaceBetween: 30,
                        },
                        '1700': {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                    }">
                        <SwiperSlide v-for="title in updatedSeries" :key="title.id">
                            <DefaultCard :cover="title.image" :title="title.name"
                                :type="title.type.replaceAll('manga', 'Manga').replaceAll('lightNovel', 'Hafif Roman')"
                                :badgeContent="timeAgo(title.date)" :badgeTooltip="formatTooltipDate(title.date)"
                                :id="title.id" />
                        </SwiperSlide>
                    </Swiper>

                </section>

                <section class="mb-12" v-if="createdSeries.length > 0">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
                        Son Eklenen İçerikler
                    </h2>
                    <Swiper :slides-per-view="2" :space-between="10" :loop="false" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 3.75,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1280': {
                            slidesPerView: 6.25,
                            spaceBetween: 30,
                        },
                        '1700': {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                    }">
                        <SwiperSlide v-for="title in createdSeries" :key="title.id">
                            <DefaultCard :cover="title.image" :title="title.name"
                                :type="title.type.replaceAll('manga', 'Manga').replaceAll('lightNovel', 'Hafif Roman')"
                                :badgeContent="timeAgo(title.date)" :badgeTooltip="formatTooltipDate(title.date)"
                                :id="title.id" />
                        </SwiperSlide>
                    </Swiper>

                </section>

                <section class="mb-12" v-if="highlights.length > 0">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
                        Öne Çıkan İçerikler
                    </h2>
                    <Swiper :slides-per-view="2" :space-between="10" :modules="[SwiperAutoplay]" :loop="true" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 3.75,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1280': {
                            slidesPerView: 6.25,
                            spaceBetween: 30,
                        },
                        '1700': {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                    }">
                        <SwiperSlide v-for="manga in highlights" :key="manga.id">
                            <DefaultCard :cover="manga.image" :title="manga.name" :type="manga.type" :id="manga.id" />
                        </SwiperSlide>
                    </Swiper>

                </section>

                <section class="mb-12" v-if="topMangas.length > 0">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
                        En Yüksek Puanlı İçerikler
                    </h2>
                    <Swiper :slides-per-view="2" :space-between="10" :modules="[SwiperAutoplay]" :autoplay="{
                        delay: 4000,
                        disableOnInteraction: false,
                    }" :loop="true" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 3.75,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1280': {
                            slidesPerView: 6.25,
                            spaceBetween: 30,
                        },
                        '1700': {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                    }">
                        <SwiperSlide v-for="manga in topMangas" :key="manga.id">
                            <DefaultCard :cover="manga.image" :title="manga.name" :type="manga.type" :id="manga.id" />
                        </SwiperSlide>
                    </Swiper>
                </section>

                <section class="mb-12" v-if="pubs.length > 0">
                    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-5">
                        Yayınlanıyor
                    </h2>
                    <Swiper :slides-per-view="2" :space-between="10" :modules="[SwiperAutoplay]" :autoplay="{
                        delay: 6000,
                        disableOnInteraction: false,
                    }" :loop="true" :breakpoints="{
                        '400': {
                            slidesPerView: 2.5,
                            spaceBetween: 20,
                        },
                        '640': {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        '768': {
                            slidesPerView: 3.75,
                            spaceBetween: 30,
                        },
                        '1024': {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                        '1280': {
                            slidesPerView: 6.25,
                            spaceBetween: 30,
                        },
                        '1700': {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                    }">
                        <SwiperSlide v-for="manga in pubs" :key="manga.id">
                            <DefaultCard :cover="manga.image" :title="manga.name" :type="manga.type" :id="manga.id" />
                        </SwiperSlide>
                    </Swiper>

                </section>
            </div>
        </div>
    </main>
</template>