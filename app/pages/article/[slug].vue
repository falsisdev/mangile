<script setup lang="ts">
interface ArticleData {
  title: string
  description: string
  article: Array<Record<string, any>>
}

const route = useRoute()
const config = useRuntimeConfig()
const breadcrumbs = useBreadcrumbs()
const showBackToTop = ref(false)

const { data: article } = await useLazyAsyncData<ArticleData>(
  'article-' + route.params.slug,
  async () => {
    return await $fetch<ArticleData>(
      `${config.public.backend.baseUrl}/api/article/${route.params.slug}`
    )
  },
  {
    default: () => ({
      title: '',
      description: '',
      article: []
    })
  }
)

breadcrumbs.value = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Makaleler' },
  { label: article.value?.title || 'Yükleniyor...' }
]

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const getSanityImageUrl = (ref: string) => {
  if (!ref) return ''
  const projectId = config.public.sanity?.projectId
  const dataset = config.public.sanity?.dataset || 'production'

  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}

const renderedContent = computed(() => {
  if (!article.value?.article) return ''

  return article.value?.article
    .map((block: any) => {
      if (block._type === 'image') {
        const imageUrl
          = block.asset?.url
            || (block.asset?._ref ? getSanityImageUrl(block.asset._ref) : '')
        if (!imageUrl) return ''

        const caption = block.caption || block.alt || ''

        return `<figure class="my-10 flex flex-col items-center">
          <img src="${imageUrl}" alt="${caption}" loading="lazy" class="rounded-xl shadow-xl max-w-full h-auto max-h-[80vh] object-contain border border-gray-200 dark:border-gray-800" />
          ${caption ? `<figcaption class="text-sm text-gray-500 mt-3 italic">${caption}</figcaption>` : ''}
        </figure>`
      }

      if (block._type !== 'block') return ''

      const htmlContent = block.children
        .map((child: any) => {
          const text = child.text
          let tagsOpen = ''
          let tagsClose = ''

          if (child.marks && child.marks.length > 0) {
            child.marks.forEach((mark: string) => {
              if (mark === 'strong') {
                tagsOpen += '<strong class="font-bold">'
                tagsClose = '</strong>' + tagsClose
              } else if (mark === 'em') {
                tagsOpen += '<em class="italic">'
                tagsClose = '</em>' + tagsClose
              } else if (block.markDefs) {
                const def = block.markDefs.find((m: any) => m._key === mark)
                if (def && def._type === 'link') {
                  if (def.href.match(/\.(jpeg|jpg|gif|png|webp)(?:\?.*)?$/i)) {
                    tagsOpen += `<figure class="my-10 flex flex-col items-center">
                              <img src="${def.href}" alt="${text}" loading="lazy" class="rounded-xl shadow-xl max-w-full h-auto max-h-[80vh] object-contain border border-gray-200 dark:border-gray-800" />
                              <figcaption class="text-sm text-gray-500 mt-3 italic">${text}</figcaption>
                            </figure><span class="hidden">`
                    tagsClose = `</span>` + tagsClose
                  } else {
                    tagsOpen += `<a href="${def.href}" class="text-primary hover:underline font-medium" target="_blank" rel="noopener">`
                    tagsClose = `</a>` + tagsClose
                  }
                }
              }
            })
          }
          return tagsOpen + text.replace(/\n/g, '<br/>') + tagsClose
        })
        .join('')

      const style = block.style || 'normal'
      if (style === 'h1')
        return `<h1 class="text-4xl font-bold mt-10 mb-6">${htmlContent}</h1>`
      if (style === 'h2')
        return `<h2 class="text-3xl font-bold mt-8 mb-4">${htmlContent}</h2>`
      if (style === 'h3')
        return `<h3 class="text-2xl font-bold mt-6 mb-4">${htmlContent}</h3>`
      if (style === 'h4')
        return `<h4 class="text-xl font-bold mt-4 mb-2">${htmlContent}</h4>`

      return `<p class="mb-6 leading-relaxed">${htmlContent}</p>`
    })
    .join('')
})

useHead(() => ({
  title: article.value?.title || 'Makaleler - Mangile'
}))
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="font-bold text-3xl md:text-4xl leading-tight">
      {{ article?.title }}
    </h1>
    {{ article?.description }}

    <div v-html="renderedContent" />

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-16 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-16 opacity-0"
    >
      <UButton
        v-if="showBackToTop"
        icon="i-lucide-arrow-up"
        size="xl"
        color="primary"
        variant="soft"
        class="fixed bottom-20 right-20 rounded-lg shadow-xl z-50"
        aria-label="Başa Dön"
        @click="scrollToTop"
      />
    </Transition>
  </div>
</template>
