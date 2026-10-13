<script setup lang="ts">
const route = useRoute()
const name = String(route.params.name ?? '')
const code = String(route.query.code ?? '')
const state = String(route.query.state ?? '')
const error = String(route.query.error ?? '')

onMounted(() => {
  let provider = 'mal'
  if (name.includes('anilist')) {
    provider = 'anilist'
  } else if (name.includes('mangadex')) {
    provider = 'mangadex'
  } else if (name.includes('mal')) {
    provider = 'mal'
  }

  const query: Record<string, string> = {}
  if (code) query.code = code
  if (state) query.state = state
  if (error) query.error = error

  navigateTo({
    path: `/auth/${provider}/callback`,
    query
  }, { replace: true })
})
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
    <UIcon
      name="i-lucide-loader-2"
      class="w-10 h-10 animate-spin text-primary mb-4"
    />
    <h2 class="text-xl font-bold text-neutral-100">
      Yetkilendirme Yönlendiriliyor...
    </h2>
  </div>
</template>
