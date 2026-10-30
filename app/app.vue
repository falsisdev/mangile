<script setup lang="ts">
const openSidebar = shallowRef(false)
const route = useRoute()
const { themeColorHex } = useOsTheme()

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover' },
    { name: 'theme-color', content: themeColorHex.value },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }
  ],
  htmlAttrs: { lang: 'tr' }
}))

const title = 'Mangile'
const description = 'Dinamik, etkili ve kullanışlı manga/webtoon/roman okuma, takip etme ve paylaşma sistemi.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://mangile.vercel.app',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <VitePwaManifest />
  <UApp>
    <template v-if="route.meta.isLayouted !== false">
      <div class="os-app-canvas flex h-[100dvh] w-screen overflow-hidden">
        <AppSidebar v-model:open="openSidebar" />
        <div class="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppHeader v-model:open-sidebar="openSidebar" />
          <div class="flex-1 overflow-y-auto p-3 md:p-6 pb-(--os-bottom-nav-clearance) md:pb-6 overscroll-y-none">
            <UMain>
              <NuxtPage :transition="{ name: 'page' }" />
            </UMain>
          </div>
        </div>
      </div>
      <AppBottomNav />
      <ProfileModal />
    </template>

    <NuxtPage
      v-else
      :transition="{ name: 'page' }"
    />

    <PwaUpdatePrompt />
    <PwaInstallBanner />
  </UApp>
</template>
