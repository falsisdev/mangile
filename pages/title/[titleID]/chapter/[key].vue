<script setup>
import { h, toRaw, ref, watchEffect } from 'vue';
import imageUrlBuilder from "@sanity/image-url";
import { Icon } from "@iconify/vue";
import { AligatorReader } from '@mangile/aligator'

const showBackToTop = ref(false);
const route = useRoute();
const builder = imageUrlBuilder(useSanity().config);

const sanityData = ref(null);
const chapter = ref(null);
const images = ref([]);
const manga = ref(null);
const selectedChapterKey = ref(route.params.key);

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
            const imageUrl = value.src || (value.asset ? builder.image(value.asset._ref).url() : '');
            return h('img', { src: imageUrl, alt: value.alt || '', class: 'my-6 rounded-lg max-w-full h-auto' });
        },
        codeBlock: ({ value }) => {
            return h('pre', { class: 'bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4' },
                h('code', { class: `language-${value.language || 'plaintext'}` }, value.code));
        }
    }
};

const handleChapterChange = (selectedKey) => {
    if (selectedKey) {
        navigateTo(`/title/${route.params.titleID}/chapter/${selectedKey}`);
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
                } else if (sanityData.value[0]._type === "lightNovel") {
                    const transformedContent = transformLinksToImages(chapter.value.content || []);
                    renderedLightNovelContent.value = renderPortableText(transformedContent);
                }
            }
        }
    }
});



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

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const checkScroll = () => {
    showBackToTop.value = window.scrollY > 500;
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
</script>

<template>
    <div class="min-h-screen max-w-screen w-full bg-background text-foreground flex flex-col">
        <div v-if="!sanityData" class="flex h-screen items-center justify-center">
            <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-primary" />
        </div>

        <div v-else class="relative flex flex-col">
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
             <div v-if="sanityData[0]._type === 'lightNovel'" class="fixed right-0 bottom-5 z-50 flex flex-col rounded-lg bg-transparent border-0 items-center">
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

            <div :class="sanityData[0]._type === 'lightNovel' ? 'px-5 pt-5 pb-16' : ''">
                <div v-if="sanityData[0]._type === 'manga'" class="flex flex-col gap-4">
                    <AligatorReader :pages="images" :mangaTitle="sanityData[0].title" :chapterTitle="chapter?.title"
                        :nextChapterKey="getNextChapterKey()" :prevChapterKey="getPreviousChapterKey()"
                        :scan="chapter?.source?.name" readingMode="manga" />
                </div>
                <div v-if="sanityData[0]._type === 'lightNovel'"
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
