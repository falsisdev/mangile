<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const provider = String(route.params.provider ?? '')
const code = String(route.query.code ?? '')
const state = String(route.query.state ?? '')
const error = String(route.query.error ?? '')

onMounted(() => {
  if (error) {
    navigateTo(`/sync?error=${encodeURIComponent(error)}`)
    return
  }

  if (code && state) {
    const apiBase = String(config.public.backend?.baseUrl ?? '')
    window.location.href = `${apiBase}/api/sync/oauth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
  } else {
    navigateTo('/sync?error=missing_credentials')
  }
})
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
    <UIcon
      name="i-lucide-loader-2"
      class="w-10 h-10 animate-spin text-primary mb-4"
    />
    <h2 class="text-xl font-bold text-neutral-100">
      Hesap Yetkilendiriliyor...
    </h2>
    <p class="text-sm text-neutral-400 mt-2">
      Lütfen bekleyin, Manga takipçi hesabınız bağlanıyor.
    </p>
  </div>
</template>
