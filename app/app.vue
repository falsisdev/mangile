<script setup>
const openSidebar = ref(false)
const breadcrumbs = useBreadcrumbs()
const route = useRoute()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

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
  <UApp v-if="route.meta.isLayouted !== false">
    <div class="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar v-model:open="openSidebar" />
      <div class="flex flex-1 flex-col overflow-hidden">
        <header class="h-(--ui-header-height) shrink-0 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <UButton
              v-if="!$device.isMobile"
              :icon="openSidebar ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
              color="neutral"
              variant="ghost"
              aria-label="Toggle sidebar"
              @click="openSidebar = !openSidebar"
            />
            <UButton
              v-else-if="$device.isMobile && !openSidebar"
              icon="i-lucide-panel-left-open"
              color="neutral"
              variant="ghost"
              aria-label="Open sidebar"
              @click="openSidebar = !openSidebar"
            />
            <h1 class="font-semibold text-sm hidden md:block"><UBreadcrumb :items="breadcrumbs"/></h1>
          </div>
          <Search/>
          <div class="flex items-center gap-2">
            <UColorModeButton />
            <UButton
              to="https://github.com/falsisdev/mangile"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
              color="neutral"
              variant="ghost"
            />
          </div>
        </header>
        <div class="flex-1 overflow-y-auto p-6">
          <UMain>
            <NuxtPage />
          </UMain>
        </div>
      </div>
    </div>
  </UApp>
  <NuxtPage v-else />
</template>
