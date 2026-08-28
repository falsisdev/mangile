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
      <AppSidebar v-model:open="openSidebar" />
      <div class="flex flex-1 flex-col overflow-hidden">
        <header
          class="h-(--ui-header-height) shrink-0 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800"
        >
          <div class="flex items-center gap-4">
            <UButton
              v-if="!$device.isMobile"
              :icon="
                openSidebar
                  ? 'i-lucide-panel-left-close'
                  : 'i-lucide-panel-left-open'
              "
              color="neutral"
              variant="ghost"
              aria-label="Toggle sidebar"
              @click="void (openSidebar = !openSidebar)"
            />
            <UButton
              v-else-if="$device.isMobile && !openSidebar"
              icon="i-lucide-panel-left-open"
              color="neutral"
              variant="ghost"
              aria-label="Open sidebar"
              @click="void (openSidebar = !openSidebar)"
            />
            <h1 class="font-semibold text-sm hidden md:block">
              <UBreadcrumb :items="breadcrumbs" />
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <AppSearch />
            <UPopover
              v-model:open="themePanelOpen"
              :ui="{ content: 'w-72 p-3' }"
            >
              <UButton
                icon="i-lucide-settings-2"
                color="neutral"
                variant="ghost"
                aria-label="Open interface preferences"
              />

              <template #content>
                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-sm font-medium text-highlighted">
                      Renk tercihi
                    </p>
                    <span class="text-[10px] text-muted">{{
                      neutralThemeLabels[neutralThemePreference]
                    }}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
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
                      class="justify-start"
                      @click="void (neutralThemePreference = option)"
                    />
                  </div>
                  <UText class="text-xs text-muted">
                    Bu renk tercihi karanlık temada arkaplan renk değişikliğini
                    sağlar. Aydınlık temada belirgin bir değişiklik sağlamaz.
                  </UText>
                </div>
              </template>
            </UPopover>
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
