<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { 
  ArrowLeft, 
  Settings,
  ChevronLeft, 
  ChevronRight, 
  Maximize,
} from 'lucide-vue-next'

const props = defineProps<{
  pages: string[]
  mangaTitle: string
  chapterTitle: string,
  nextChapterKey: string,
  prevChapterKey: string,
  scan: string,
  readingMode?: 'webtoon' | 'manga'
}>()


const currentMode = ref<'webtoon' | 'manga'>(props.readingMode || 'manga')
const currentPage = ref(0)
const isUIVisible = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const route = useRoute();

const handleChapterChange = (which: 'next' | 'prev') => {
    if (which === 'next') {
        if(props.nextChapterKey) navigateTo(`/title/${route.params.titleID}/chapter/${props.nextChapterKey}`);
        else navigateTo(`/title/${route.params.titleID}`);
    }else if (which === 'prev') {
        if(props.prevChapterKey) navigateTo(`/title/${route.params.titleID}/chapter/${props.prevChapterKey}`);
        else navigateTo(`/title/${route.params.titleID}`);
    }
};

const toggleUI = () => {
  isUIVisible.value = !isUIVisible.value
}

const nextPage = () => {
  if (currentMode.value === 'manga' && currentPage.value < props.pages.length - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentMode.value === 'manga' && currentPage.value > 0) {
    currentPage.value--
  }
}

const setMode = (mode: 'webtoon' | 'manga') => {
  currentMode.value = mode
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') prevPage()
  if (e.key === 'ArrowLeft') nextPage()
  if (e.key === 'Escape') isUIVisible.value = true
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

function goBack() {
    window.history.length > 1 ? window.history.back() : navigateTo('/');
}
</script>

<template>
  <div 
    class="relative w-full h-screen overflow-hidden flex flex-col font-sans"
  >
    <header 
      :class="[
        'absolute top-2 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-sidebar backdrop-blur-md border border-2 rounded-lg transition-transform duration-300',
        isUIVisible ? 'translate-y-0' : '-translate-y-full'
      ]"
    >
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="goBack" class="text-zinc-300 hover:text-white">
          <ArrowLeft class="w-5 h-5" />
        </Button>
        <div class="flex flex-col">
          <h1 class="text-sm font-semibold truncate max-w-[200px] sm:max-w-md">{{ mangaTitle }}</h1>
          <span class="text-xs text-zinc-400">{{ chapterTitle }} | {{ scan }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" @click="toggleFullscreen" class="text-zinc-300 hover:text-white hidden sm:flex">
                <Maximize class="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tam Ekran</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="ghost" size="icon" class="text-zinc-300 hover:text-white">
          <Settings class="w-5 h-5" />
        </Button>
      </div>
    </header>

    <main 
      ref="containerRef"
      class="flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth"
      @click.self="toggleUI"
    >
      <div 
        v-if="currentMode === 'webtoon'" 
        class="flex flex-col items-center w-full min-h-full py-20"
        @click="toggleUI"
      >
        <img 
          v-for="(page, index) in pages" 
          :key="index" 
          :src="page" 
          loading="lazy"
          class="w-full max-w-3xl object-contain select-none"
          alt="Sayfa"
        />
      </div>

      <div 
        v-else 
        class="flex items-center justify-center w-full h-full relative"
      >
        <div class="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer" @click="nextPage"></div>
        <div class="absolute left-1/3 top-0 w-1/3 h-full z-10 cursor-pointer" @click="toggleUI"></div>
        <div class="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer" @click="prevPage"></div>

        <img 
          :src="pages[currentPage]" 
          class="max-w-full max-h-[90vh] object-contain select-none"
          alt="Sayfa"
        />
      </div>
    </main>

    <footer 
      :class="[
        'absolute bottom-2 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-sidebar backdrop-blur-md border border-2 rounded-lg transition-transform duration-300',
        isUIVisible ? 'translate-y-0' : 'translate-y-full'
      ]"
    >
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="handleChapterChange('prev')">
          <ChevronLeft class="w-4 h-4 mr-1" /> Önceki
        </Button>
      </div>

      <div class="flex items-center gap-4">
        <div class="bg-sidebar rounded-lg p-1 flex items-center">
          <button 
            @click="setMode('webtoon')"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', currentMode === 'webtoon' ? 'bg-secondary' : 'bg-sidebar cursor-pointer']"
          >
            Webtoon
          </button>
          <button 
            @click="setMode('manga')"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', currentMode === 'manga' ? 'bg-secondary' : 'bg-sidebar cursor-pointer']"
          >
            Manga
          </button>
        </div>

        <span v-if="currentMode === 'manga'" class="text-xs text-zinc-400 font-medium">
          {{ currentPage + 1 }} / {{ pages.length }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="handleChapterChange('next')">
          Sonraki <ChevronRight class="w-4 h-4 ml-1" />
        </Button>
      </div>
    </footer>
  </div>
</template>