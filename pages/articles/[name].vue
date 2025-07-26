<script setup>
import { h } from 'vue';
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(useSanity().config);
const route = useRoute()
const query = groq`*[_type == 'articles' && slug.current == "${route.params.name}"]`
const { data, refresh } = useSanityQuery(query)

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
            const imageUrl = builder.image(value).url();
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

const renderedArticle = computed(() => {
    if (data.value && data.value[0] && data.value[0].article) {
        return renderPortableText(data.value[0].article);
    }
    return [];
});

</script>

<template>
    <div v-if="data" class="mt-20 p-5">
        <div v-if="renderedArticle.length > 0">
            <component :is="block" v-for="(block, index) in renderedArticle" :key="index" />
        </div>
        <div v-else>
            <p class="text-lg text-gray-600">Makale içeriği bulunamadı veya işlenemedi.</p>
        </div>
    </div>
    <div v-else class="flex items-center justify-center mt-20">
        <div class="flex flex-col items-center p-6">
            <img src="https://cdn.sanity.io/images/1yge7tlr/production/83e30dfcc97fbf00163de4f583c48475962d80c7-600x600.png"
                class="w-50 h-50 mb-5" />
            <p class="mt-4 text-lg text-primary font-semibold">Sayfa Bulunamadı.</p>
            <p class="text-md text-primary"> Üzgünüz. Böyle bir makale bulamadık...</p>
        </div>
    </div>
</template>
