<script setup>
import { h, toRaw, ref, watchEffect, onMounted, onBeforeUnmount, computed } from 'vue';
import imageUrlBuilder from "@sanity/image-url";
import { Icon } from "@iconify/vue";

const isSettingsOpen = ref(false);
const isWebtoonMode = ref(false);
const zoomLevel = ref(100);
const isFullscreen = ref(false);
const currentPage = ref(1);
const showBackToTop = ref(false);
const route = useRoute();
const { isMobileOrTablet } = useDevice();
const builder = imageUrlBuilder(useSanity().config);

const sanityData = ref(null);
const chapter = ref(null);
const images = ref([]);
const manga = ref(null);
const selectedChapterKey = ref(route.params.key);
const isSinglePageMode = ref(false);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const scrollLeft = ref(0);
const scrollTop = ref(0);

const portableTextComponents = {
    block: {
        h1: (props) => h('h1', { class: 'text-4xl font-bold mb-4' }, props.children),
        h2: (props) => h('h2', { class: 'text-3xl font-semibold mb-3' }, props.children),
        normal: (props) => h('p', { class: 'mb-4' }, props.children),
        h3: (props) => h('h3', { class: 'text-2xl font-semibold mb-3' }, props.children),
        h4: (props) => h('h4', { class: 'text-xl font-semibold mb-2' }, props.children),
        blockquote: (props) => h('blockquote', { class: 'border-l-4 border-gray-300 pl-4 italic mb-4' }, props.children),
    },
    marks: {
        link: (props) => h('a', { href: props.value.href, target: '_blank', rel: 'noopener noreferrer', class: 'text-blue-600 hover:underline' }, props.children),
        strong: (props) => h('strong', {}, props.children),
        em: (props) => h('em', {}, props.children),
        code: (props) => h('code', { class: 'bg-gray-100 p-1 rounded text-sm' }, props.children),
    },
    list: {
        bullet: (props) => h('ul', { class: 'list-disc ml-6 mb-4' }, props.children),
        number: (props) => h('ol', { class: 'list-decimal ml-6 mb-4' }, props.children),
    },
    listItem: {
        bullet: (props) => h('li', {}, props.children),
        number: (props) => h('li', {}, props.children),
    },
    types: {
        image: ({ value }) => {
            // Use value.src if it exists (from transformLinksToImages), otherwise build from asset
            const imageUrl = value.src || (value.asset ? builder.image(value.asset._ref).url() : '');
            return h('img', { src: imageUrl, alt: value.alt || '', class: 'my-6 rounded-lg max-w-full h-auto' });
        },
        codeBlock: ({ value }) => {
            return h('pre', { class: 'bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4' },
                h('code', { class: `language-${value.language || 'plaintext'}` }, value.code));
        }
    }
};

const renderPortableText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) {
        return [];
    }

    return blocks.map(block => {
        if (block._type === 'block') {
            const children = block.children.map(span => {
                let text = span.text;
                if (span.marks && span.marks.length > 0) {
                    span.marks.forEach(mark => {
                        const markDef = block.markDefs.find(def => def._key === mark);
                        if (markDef && portableTextComponents.marks[markDef._type]) {
                            text = portableTextComponents.marks[markDef._type]({ value: markDef, children: text });
                        } else if (portableTextComponents.marks[mark]) {
                            text = portableTextComponents.marks[mark]({ children: text });
                        }
                    });
                }
                return text;
            });

            const blockComponent = portableTextComponents.block[block.style || 'normal'];
            if (blockComponent) {
                return blockComponent({ children: children });
            }
        }
        else if (portableTextComponents.types[block._type]) {
            return portableTextComponents.types[block._type]({ value: block });
        }
        return h('div', {}, JSON.stringify(block));
    });
};

const renderedLightNovelContent = ref([]);

const query = groq`*[myAnimeListId == ${route.params.titleID}] {
  ...,
  chapters[] {
    ...,
    source-> {
      _id,
      name,
      url,
      description
    }
  }
}`;

const { data: preSanityData } = useSanityQuery(query);

const transformLinksToImages = (content) => {
    if (!content) return [];
    return content.map(block => {
        if (block._type === 'image' && block.asset) {
            return {
                _type: 'image',
                src: builder.image(block.asset._ref).auto('format').url(),
                alt: block.alt || '',
            };
        }
        if (block._type === 'block' && block.children) {
            return {
                ...block,
                children: block.children.map(child => {
                    if (child._type === 'span' && child.marks?.length > 0) {
                        const linkMark = block.markDefs?.find(mark =>
                            mark._key === child.marks[0] && mark._type === 'link'
                        );
                        if (linkMark) {
                            return {
                                _type: 'image',
                                src: linkMark.href,
                                alt: child.text
                            };
                        }
                    }
                    return child;
                })
            };
        }
        return block;
    });
};

watchEffect(() => {
    if (preSanityData.value) {
        sanityData.value = toRaw(preSanityData.value);

        if (sanityData.value.length > 0 && sanityData.value[0].chapters) {
            const foundChapter = sanityData.value[0].chapters.find(
                (x) => x._key === route.params.key
            );

            if (foundChapter) {
                chapter.value = foundChapter;
                selectedChapterKey.value = foundChapter._key;

                if (sanityData.value[0]._type === "manga") {
                    images.value = chapter.value.pages?.map((page) =>
                        builder.image(page.asset._ref).auto("format").url()
                    ) || [];

                    if (sanityData.value[0].mangaType === "manhwa" || sanityData.value[0].mangaType === "webtoon") {
                        isWebtoonMode.value = true;
                        isSinglePageMode.value = false;
                    } else {
                        isWebtoonMode.value = false;
                        isSinglePageMode.value = false;
                    }
                } else if (sanityData.value[0]._type === "lightNovel") {
                    const transformedContent = transformLinksToImages(chapter.value.content || []);
                    renderedLightNovelContent.value = renderPortableText(transformedContent);
                }
            }
        }
    }
});

const handleChapterChange = (selectedKey) => {
    if (selectedKey) {
        navigateTo(`/title/${route.params.titleID}/chapter/${selectedKey}`);
    }
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .then(() => isFullscreen.value = true)
            .catch(err => console.error('Fullscreen error:', err));
    } else {
        document.exitFullscreen()
            .then(() => isFullscreen.value = false);
    }
};

const zoomIn = () => {
    if (zoomLevel.value < 200) {
        zoomLevel.value += 25;
        updateZoom();
    }
};

const zoomOut = () => {
    if (zoomLevel.value > 50) {
        zoomLevel.value -= 25;
        updateZoom();
    }
};

const resetZoom = () => {
    zoomLevel.value = 100;
    updateZoom();
};

const updateZoom = () => {
    const pages = document.querySelectorAll('.manga-page');
    pages.forEach(page => {
        page.style.transform = `scale(${zoomLevel.value / 100})`;
    });
    saveSettings();
};

const toggleWebtoonMode = () => {
    isWebtoonMode.value = !isWebtoonMode.value;
    saveSettings();
};

const toggleSinglePageMode = () => {
    isSinglePageMode.value = !isSinglePageMode.value;
    saveSettings();
};

const getNextChapterKey = () => {
    if (!sanityData.value?.[0]?.chapters || !chapter.value) return '';
    const currentIndex = sanityData.value[0].chapters.findIndex(chap => chap._key === chapter.value._key);
    if (currentIndex === -1 || currentIndex >= sanityData.value[0].chapters.length - 1) return '';
    return sanityData.value[0].chapters[currentIndex + 1]._key;
};

const getPreviousChapterKey = () => {
    if (!sanityData.value?.[0]?.chapters || !chapter.value) return '';
    const currentIndex = sanityData.value[0].chapters.findIndex(chap => chap._key === chapter.value._key);
    if (currentIndex <= 0) return '';
    return sanityData.value[0].chapters[currentIndex - 1]._key;
};

const saveSettings = () => {
    localStorage.setItem('mangaReaderSettings', JSON.stringify({
        isWebtoonMode: isWebtoonMode.value,
        zoomLevel: zoomLevel.value,
        isSinglePageMode: isSinglePageMode.value
    }));
};

const loadSettings = () => {
    const savedSettings = localStorage.getItem('mangaReaderSettings');
    if (savedSettings) {
        try {
            const { isWebtoonMode: savedMode, zoomLevel: savedZoom, isSinglePageMode: savedSinglePage } = JSON.parse(savedSettings);
            isWebtoonMode.value = savedMode ?? false;
            zoomLevel.value = savedZoom ?? 100;
            isSinglePageMode.value = savedSinglePage ?? false;
        } catch (e) {
            console.error('Settings parse error:', e);
        }
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const checkScroll = () => {
    showBackToTop.value = window.scrollY > 500;
};

const startDrag = (e) => {
    if (zoomLevel.value <= 100) return;

    e.preventDefault();
    e.stopPropagation();

    isDragging.value = true;
    startX.value = e.clientX;
    startY.value = e.clientY;
    scrollLeft.value = window.scrollX;
    scrollTop.value = window.scrollY;

    e.target.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
};

const doDrag = (e) => {
    if (!isDragging.value) return;
    e.preventDefault();
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;
    const walkX = (startX.value - x) * 2;
    const walkY = (startY.value - y) * 2;

    window.scrollTo(scrollLeft.value + walkX, scrollTop.value + walkY);
};

const endDrag = (e) => {
    if (!isDragging.value) return;
    isDragging.value = false;

    if (e.target) {
        e.target.style.cursor = zoomLevel.value > 100 ? 'grab' : 'default';
    }
    document.body.style.userSelect = '';
};

const updateCurrentPage = () => {
    if (!images.value.length) return;

    const pageElements = document.querySelectorAll('.manga-page-container');
    const scrollPosition = window.scrollY + (window.innerHeight / 2);

    for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i];
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = rect.bottom + window.scrollY;

        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            currentPage.value = i + 1;
            break;
        }
    }
};

onMounted(() => {
    loadSettings();
    document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement;
    });

    window.addEventListener('scroll', updateCurrentPage);
    window.addEventListener('scroll', checkScroll);
    updateCurrentPage();

    if (sanityData.value?.[0]?._type === 'manga') {
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mouseleave', endDrag);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateCurrentPage);
    window.removeEventListener('scroll', checkScroll);
    document.removeEventListener('fullscreenchange', () => { });
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('mouseleave', endDrag);
});
</script>

<template>
    <div class="min-h-screen max-w-screen w-full bg-background text-foreground flex flex-col">
        <div v-if="!sanityData" class="flex h-screen items-center justify-center">
            <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-primary" />
        </div>

        <div v-else class="relative">
            <header class="mt-20 bg-background/95 border-b">
                <div class="flex h-14 items-center justify-between px-4">
                    <div class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" as-child>
                            <NuxtLink to="/">
                                <Icon icon="lucide:home" class="h-5 w-5" />
                            </NuxtLink>
                        </Button>
                        <h1 class="text-lg font-semibold line-clamp-1">
                            {{ sanityData[0]?.title || manga?.title }}
                        </h1>
                    </div>

                    <div class="flex items-center gap-2">
                        <Select v-model="selectedChapterKey" @update:modelValue="handleChapterChange">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Bölüm seç..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Bölümler</SelectLabel>
                                    <SelectItem v-for="chap in sanityData[0]?.chapters" :key="chap._key"
                                        :value="chap._key">
                                        {{ chap.chapterNumber ? `Bölüm ${chap.chapterNumber}` : '' }} {{ chap.title }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button variant="secondary" class="cursor-pointer shadow-lg justify-start"
                            @click="() => navigateTo(`/title/${route.params.titleID}`)">
                            <Icon icon="mdi:book-arrow-right-outline" />
                        </Button>
                    </div>
                </div>
            </header>

            <div
                class="fixed right-4 bottom-20 z-50 flex flex-col gap-2 p-2 bg-transparent border-0 rounded-lg border items-center">
                <Button v-if="sanityData[0]._type === 'manga'" variant="secondary" size="icon" @click="zoomIn"
                    :disabled="zoomLevel >= 200" title="Yakınlaştır">
                    <Icon icon="lucide:zoom-in" class="h-5 w-5" />
                </Button>
                <Button v-if="sanityData[0]._type === 'manga'" variant="secondary" size="icon" @click="resetZoom"
                    title="Sıfırla">
                    <span class="text-xs">{{ zoomLevel }}%</span>
                </Button>
                <Button v-if="sanityData[0]._type === 'manga'" variant="secondary" size="icon" @click="zoomOut"
                    :disabled="zoomLevel <= 50" title="Uzaklaştır">
                    <Icon icon="lucide:zoom-out" class="h-5 w-5" />
                </Button>
                <Button v-if="sanityData[0]._type === 'manga'" variant="secondary" size="icon"
                    @click="toggleWebtoonMode" :title="isWebtoonMode ? 'Standart Mod' : 'Webtoon Modu'">
                    <Icon :icon="isWebtoonMode ? 'lucide:panel-top' : 'lucide:scroll'" class="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" @click="toggleFullscreen"
                    :title="isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'">
                    <Icon :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" class="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" v-if="showBackToTop" @click="scrollToTop" title="Başa Dön">
                    <Icon icon="lucide:arrow-up" class="h-5 w-5" />
                </Button>
                <span v-if="sanityData[0]._type === 'manga'" class="text-sm text-muted-foreground">
                    {{ currentPage }}/{{ images.length || 1 }}
                </span>
            </div>

            <div class="fixed right-0 bottom-5 z-50 flex flex-col rounded-lg bg-transparent border-0 items-center">
                <div class="gap-1 flex flex-row items-center px-4">
                    <Button variant="secondary" :disabled="!getPreviousChapterKey()"
                        @click="navigateTo(`/title/${route.params.titleID}/chapter/${getPreviousChapterKey()}`)">
                        <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                        Önceki Bölüm
                    </Button>
                    <Button variant="secondary" :disabled="!getNextChapterKey()"
                        @click="navigateTo(`/title/${route.params.titleID}/chapter/${getNextChapterKey()}`)">
                        Sonraki Bölüm
                        <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div class="px-5 pt-5 pb-16">
                <div v-if="sanityData[0]._type === 'manga'" class="space-y-6 flex flex-col">
                    <div class="flex flex-row justify-between">
                        <h2 class="text-xl font-semibold">
                            {{ chapter?.chapterNumber ? `${chapter.chapterNumber}` : '' }} {{ chapter?.title ?
                                `-
                            ${chapter.title}` : '' }}
                        </h2>
                        <div>
                            <span class="text-sm text-muted-foreground">
                                Kaynak: {{ chapter?.source?.name }}
                            </span>
                        </div>
                    </div>

                    <div :class="{ 'flex flex-col gap-4': isWebtoonMode, 'space-y-4': !isWebtoonMode }">
                        <div v-for="(image, index) in images" :key="index"
                            class="manga-page-container overflow-hidden flex justify-center" :id="`page-${index + 1}`">
                            <img :src="image" :alt="`Sayfa ${index + 1}`"
                                class="manga-page w-full object-contain mx-auto transition-transform duration-200"
                                :style="{
                                    transform: `scale(${zoomLevel / 100})`,
                                    maxHeight: isWebtoonMode ? 'none' : '90vh',
                                    cursor: zoomLevel > 100 ? 'grab' : 'default'
                                }" @mousedown="startDrag" @mousemove="doDrag" @mouseup="endDrag"
                                @mouseleave="endDrag" />
                        </div>
                    </div>
                </div>

                <div v-else-if="sanityData[0]._type === 'lightNovel'"
                    class="prose prose-invert max-w-none space-y-8 flex flex-col">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-2xl font-bold">
                            {{ chapter?.title }}
                        </h2>
                        <p class="text-muted-foreground">
                            Kaynak: {{ chapter?.source?.name }}
                        </p>
                    </div>

                    <div class="space-y-6">
                        <component :is="block" v-for="(block, blockIndex) in renderedLightNovelContent"
                            :key="blockIndex" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.manga-page {
    transform-origin: top center;
    transition: transform 0.2s ease;
}

.webtoon-mode .manga-page {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: none !important;
    margin-bottom: 1rem;
}

.prose {
    color: inherit;
}

.prose img {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.single-page {
    max-width: 50% !important;
    margin: 0 auto;
}

.full-width {
    width: 100%;
}

.manga-page[style*="cursor: grab"] {
    cursor: grab;
}

.manga-page[style*="cursor: grab"]:active {
    cursor: grabbing;
}
</style>
