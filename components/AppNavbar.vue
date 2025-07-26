<script setup>
import { Icon } from '@iconify/vue'
import { useDebounceFn, onClickOutside } from '@vueuse/core'

const searchQuery = ref('')
const results = ref([])
const isLoading = ref(false)
const isDropdownVisible = ref(false)
const router = useRouter()
const searchWrapper = ref(null)

const fetchSearchResults = async () => {
    if (searchQuery.value.length < 3) {
        results.value = []
        isDropdownVisible.value = false
        return
    }
    isLoading.value = true
    isDropdownVisible.value = true
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${searchQuery.value}&limit=5&sfw`)
        const data = await response.json()
        results.value = data.data || []
    } catch (error) {
        console.error('Arama sırasında hata:', error)
        results.value = []
    } finally {
        isLoading.value = false
    }
}

const debouncedSearch = useDebounceFn(fetchSearchResults, 500)

watch(searchQuery, (newValue) => {
    if (newValue.length >= 3) {
        debouncedSearch()
    } else {
        isDropdownVisible.value = false
        results.value = []
    }
})

const goToSearchPage = () => {
    if (searchQuery.value.trim()) {
        isDropdownVisible.value = false
        router.push(`/search?q=${searchQuery.value.trim()}`)
    }
}

const handleResultClick = () => {
    isDropdownVisible.value = false
    searchQuery.value = ''
}

onClickOutside(searchWrapper, () => {
    isDropdownVisible.value = false
})
</script>

<template>
    <div class="w-full max-w-lg items-center flex flex-row backdrop-blur-md absolute z-50 mt-2">
        <div ref="searchWrapper" class="w-full max-w-lg items-center relative backdrop-blur-md z-50 mt-2">
            <div class="flex flex-row">
                <Input id="search" type="text" placeholder="Manga, manhwa veya novel ara..."
                    class="rounded-r-none max-w-screen ml-1 w-full" v-model="searchQuery"
                    @keydown.enter="goToSearchPage" @focus="isDropdownVisible = results.length > 0" />
                <Button variant="outline" class="rounded-l-none mr-1" @click="goToSearchPage">
                    <Icon icon="material-symbols:search-rounded" />
                </Button>
            </div>

            <Card v-if="isDropdownVisible" class="absolute w-full mt-2 max-h-96 overflow-y-auto">
                <div v-if="isLoading" class="p-4 text-center text-muted-foreground">
                    Yükleniyor...
                </div>
                <div v-else-if="results.length > 0">
                    <ul>
                        <li v-for="item in results" :key="item.mal_id">
                            <NuxtLink :to="`/title/${item.mal_id}`" @click="handleResultClick"
                                class="flex items-center p-3 hover:bg-accent transition-colors duration-200">
                                <Avatar class="h-16 w-12 rounded-md">
                                    <AvatarImage :src="item.images.webp.image_url" :alt="item.title"
                                        class="object-cover" />
                                    <AvatarFallback>{{ item.title.charAt(0) }}</AvatarFallback>
                                </Avatar>
                                <div class="ml-4">
                                    <p class="font-semibold text-sm">{{ item.title }}</p>
                                    <p class="text-xs text-muted-foreground">{{ item.type }}</p>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div v-else-if="searchQuery.length >= 3 && !isLoading" class="p-4 text-center text-muted-foreground">
                    Sonuç bulunamadı.
                </div>
            </Card>
        </div>
    </div>
</template>