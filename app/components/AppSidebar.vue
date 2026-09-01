<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = defineModel<boolean>('open', { default: false })
const globalSidebarOpen = useSidebar()
const route = useRoute()
const { isMobile } = useDevice()

watch(open, (newValue) => {
  globalSidebarOpen.value = newValue
}, { immediate: true })

watch(globalSidebarOpen, (newValue) => {
  open.value = newValue
})

function closeOnMobile() {
  const isMobileScreen = isMobile || (import.meta.client && window.innerWidth < 768)
  if (isMobileScreen) {
    open.value = false
    globalSidebarOpen.value = false
  }
}

watch(() => route.fullPath, () => {
  closeOnMobile()
})

const mainItems: NavigationMenuItem[] = [
  { label: 'Ana Sayfa', icon: 'i-lucide-house', to: '/', onSelect: closeOnMobile },
  { label: 'Keşfet', icon: 'i-lucide-compass', to: '/explore', onSelect: closeOnMobile }
]

const libraryItems: NavigationMenuItem[] = [
  { label: 'Senkronizasyon', icon: 'i-lucide-cloud-backup', to: '/sync', onSelect: closeOnMobile },
  { label: 'Listeler', icon: 'i-lucide-library', to: '/lists', onSelect: closeOnMobile },
  { label: 'Okuma Geçmişi', icon: 'i-lucide-history', to: '/history', onSelect: closeOnMobile }
]

const companyItems: NavigationMenuItem[] = [
  { label: 'Bilgilendirme', icon: 'i-lucide-info', to: '/article/notice', onSelect: closeOnMobile },
  { label: 'Hakkımızda', icon: 'i-lucide-users', to: '/article/about', onSelect: closeOnMobile },
  { label: 'İletişim', icon: 'i-lucide-phone', to: '/article/contact', onSelect: closeOnMobile }
]

const legalItems: NavigationMenuItem[] = [
  { label: 'Hizmet Koşulları', icon: 'i-lucide-scale', to: '/article/tos', onSelect: closeOnMobile },
  { label: 'Lisanslandırma', icon: 'i-lucide-copyright', to: '/article/licence', onSelect: closeOnMobile }
]

function toggleSidebar() {
  open.value = !open.value
}
</script>

<template>
  <USidebar
    v-model:open="open"
    variant="sidebar"
    collapsible="icon"
    side="left"
  >
    <template #header>
      <div class="flex flex-row items-center w-full">
        <img
          src="https://cdn.sanity.io/images/1yge7tlr/production/b8497ba054d01f92ecf4f359a835f55e6a321d90-1080x1080.png?fit=max&w=600&h=600"
          class="size-7 sm:size-8"
        >
        <span class="grow" />
        <UButton
          v-if="$device.isMobile && open"
          icon="i-lucide-panel-left-close"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Toggle sidebar"
          @click="toggleSidebar"
        />
      </div>
    </template>

    <div class="flex h-full flex-col">
      <div class="flex-1 overflow-y-auto">
        <UNavigationMenu
          :items="mainItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 text-xs sm:text-sm overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-2.5 pt-4 pb-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted"
        >
          Kitaplık
        </div>

        <UNavigationMenu
          :items="libraryItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 text-xs sm:text-sm overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-2.5 pt-4 pb-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted"
        >
          Kurumsal
        </div>

        <UNavigationMenu
          :items="companyItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 text-xs sm:text-sm overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-2.5 pt-4 pb-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted"
        >
          Yasal
        </div>

        <UNavigationMenu
          :items="legalItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 text-xs sm:text-sm overflow-hidden' }"
        />
      </div>
    </div>

    <template #footer>
      <UButton
        label="Giriş Yap"
        icon="i-lucide-log-in"
        size="sm"
        block
        to="/login"
        @click="closeOnMobile"
      />
    </template>
  </USidebar>
</template>
