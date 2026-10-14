<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const chapterKey = computed(() => {
  const param = route.params.chapterKey
  return Array.isArray(param) ? (param[0] ?? '') : (param ?? '')
})

if (route.name === 'chapter-chapterKey' && chapterKey.value) {
  const { data: chapterData } = await useFetch<{
    _type?: string
    lightNovel?: unknown
  }>(() => `${config.public.backend.baseUrl}/api/chapter?id=${chapterKey.value}`)

  const target = chapterData.value?._type === 'novelChapter' || chapterData.value?.lightNovel
    ? `/chapter/${chapterKey.value}/novel`
    : `/chapter/${chapterKey.value}/manga`

  await navigateTo(target, { replace: true })
}
</script>

<template>
  <NuxtPage />
</template>
