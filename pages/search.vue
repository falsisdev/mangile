<script setup>
const route = useRoute()
const searchQuery = ref(route.query.q || '')
const searchResults = ref([])
const isLoading = ref(false)
const error = ref(null)

const fetchAllResults = async (query) => {
    if (!query) return
    isLoading.value = true
    error.value = null
    searchResults.value = []
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${query}&sfw`)
        if (!response.ok) throw new Error('API isteği başarısız oldu.')
        const data = await response.json()
        searchResults.value = data.data || []
    } catch (err) {
        console.error('Arama sayfasında hata:', err)
        error.value = 'Sonuçlar getirilirken bir hata oluştu. Lütfen tekrar deneyin.'
    } finally {
        isLoading.value = false
    }
}

watch(
    () => route.query.q,
    (newQuery) => {
        searchQuery.value = newQuery || ''
        fetchAllResults(newQuery)
    },
    { immediate: true }
)
</script>

<template>
    <div class="container mx-auto pt-20">
        <h1 v-if="searchQuery" class="text-3xl font-bold mb-6">
            Arama Sonuçları: <span class="text-primary">{{ searchQuery }}</span>
        </h1>
        <h1 v-else class="text-3xl font-bold mb-6">
            Lütfen bir arama yapın
        </h1>

        <div v-if="isLoading" class="flex justify-center items-center h-64">
            <p>Yükleniyor...</p>
        </div>

        <div v-else-if="error" class="text-center text-red-500">
            {{ error }}
        </div>

        <div v-else-if="searchResults.length > 0" class="flex flex-wrap justify-center gap-4">
            <DefaultCard v-for="item in searchResults" :key="item.mal_id" :id="item.mal_id" :title="item.title"
                :cover="item.images.webp.large_image_url" :type="item.type"
                :badge-content="item.score ? item.score.toString() : 'N/A'" badge-tooltip="Puan" />
        </div>

        <div v-else-if="!isLoading && searchQuery" class="text-center h-64 flex items-center justify-center">
            <p class="text-muted-foreground">"{{ searchQuery }}" için sonuç bulunamadı.</p>
        </div>
    </div>
</template>