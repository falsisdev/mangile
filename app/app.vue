<script setup lang="ts">
import { useStorage } from '@vueuse/core'

type NeutralPreference
  = | 'mauve'
    | 'neutral'
    | 'mist'
    | 'taupe'
    | 'slate'
    | 'stone'
    | 'olive'
    | 'zinc'
    | 'gray'

const appConfig = useAppConfig()
const openSidebar = ref(false)
const themePanelOpen = ref(false)
const breadcrumbs = useBreadcrumbs()
const route = useRoute()

const defaultNeutralTheme = 'mist'
const neutralThemeOptions = [
  'mauve',
  'neutral',
  'mist',
  'taupe',
  'slate',
  'stone',
  'olive',
  'zinc',
  'gray'
] as const satisfies readonly NeutralPreference[]
const neutralThemeLabels: Record<NeutralPreference, string> = {
  mauve: 'Leylak',
  neutral: 'Yavan',
  mist: 'Duman',
  taupe: 'Boz',
  slate: 'Arduvaz',
  stone: 'Kaya',
  olive: 'Zeytin',
  zinc: 'Çinko',
  gray: 'Kır'
}

const neutralThemePreference = useStorage<NeutralPreference>(
  'mangile-neutral-theme',
  'mist'
)

computed(() => {
  return neutralThemePreference.value === 'mist'
    ? defaultNeutralTheme
    : neutralThemePreference.value
})

const isNeutralThemeSelected = (option: NeutralPreference) =>
  neutralThemePreference.value === option

watch(
  neutralThemePreference,
  (preference) => {
    const nextNeutralTone
      = preference === 'mist' ? defaultNeutralTheme : preference
    if (appConfig.ui?.colors) {
      appConfig.ui.colors.neutral = nextNeutralTone
    }
  },
  { immediate: true }
)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
    { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'tr' }
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
      <AppSidebar v-model:open="openSidebar" />
      <div class="flex flex-1 flex-col overflow-hidden">
        <header
          class="h-12 sm:h-(--ui-header-height) shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-gray-200 dark:border-gray-800"
        >
          <div class="flex items-center gap-2 sm:gap-4">
            <UButton
              :icon="
                openSidebar
                  ? 'i-lucide-panel-left-close'
                  : 'i-lucide-panel-left-open'
              "
              color="neutral"
              variant="ghost"
              size="sm"
              class="touch-manipulation"
              aria-label="Menüyü Aç/Kapat"
              @click="void (openSidebar = !openSidebar)"
            />
            <h1 class="font-semibold text-xs sm:text-sm hidden md:block">
              <UBreadcrumb :items="breadcrumbs" />
            </h1>
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <AppSearch />
            <UPopover
              v-model:open="themePanelOpen"
              :ui="{ content: 'w-64 sm:w-72 p-2.5 sm:p-3' }"
            >
              <UButton
                icon="i-lucide-settings-2"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Open interface preferences"
              />

              <template #content>
                <div class="space-y-2.5 sm:space-y-3">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-xs sm:text-sm font-medium text-highlighted">
                      Renk tercihi
                    </p>
                    <span class="text-[9px] sm:text-[10px] text-muted">{{
                      neutralThemeLabels[neutralThemePreference]
                    }}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <UButton
                      v-for="option in neutralThemeOptions"
                      :key="option"
                      :label="neutralThemeLabels[option]"
                      :color="
                        isNeutralThemeSelected(option) ? 'primary' : 'neutral'
                      "
                      :variant="
                        isNeutralThemeSelected(option) ? 'solid' : 'soft'
                      "
                      size="xs"
                      class="justify-start sm:text-xs"
                      @click="void (neutralThemePreference = option)"
                    />
                  </div>
                  <UText class="text-[11px] sm:text-xs text-muted leading-relaxed">
                    Bu renk tercihi karanlık temada arkaplan renk değişikliğini
                    sağlar. Aydınlık temada belirgin bir değişiklik sağlamaz.
                  </UText>
                </div>
              </template>
            </UPopover>
            <UColorModeButton size="sm" />
            <UButton
              to="https://github.com/falsisdev/mangile"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </div>
        </header>
        <div class="flex-1 overflow-y-auto p-3 md:p-6 pb-12 md:pb-6 overscroll-y-none">
          <UMain>
            <NuxtPage
              :transition="{ name: 'page' }"
            />
          </UMain>
        </div>
      </div>
    </div>
  </UApp>
  <NuxtPage
    v-else
    :transition="{ name: 'page' }"
  />
</template>
