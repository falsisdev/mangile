<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = defineModel<boolean>('open', { default: false })
const globalSidebarOpen = useSidebar()

watch(open, (newValue) => {
  globalSidebarOpen.value = newValue
}, { immediate: true })

watch(globalSidebarOpen, (newValue) => {
  open.value = newValue
})

const mainItems: NavigationMenuItem[] = [
  { label: 'Ana Sayfa', icon: 'i-lucide-house', to: '/' },
  { label: 'Keşfet', icon: 'i-lucide-compass', to: '/explore' }
]

const libraryItems: NavigationMenuItem[] = [
  { label: 'Senkronizasyon', icon: 'i-lucide-cloud-backup', to: '/sync' },
  { label: 'Listeler', icon: 'i-lucide-library', to: '/lists' },
  { label: 'Okuma Geçmişi', icon: 'i-lucide-history', to: '/history' }
]

const companyItems: NavigationMenuItem[] = [
  { label: 'Bilgilendirme', icon: 'i-lucide-info', to: '/article/notice' },
  { label: 'Hakkımızda', icon: 'i-lucide-users', to: '/article/about' },
  { label: 'İletişim', icon: 'i-lucide-phone', to: '/article/contact' }
]

const legalItems: NavigationMenuItem[] = [
  { label: 'Hizmet Koşulları', icon: 'i-lucide-scale', to: '/article/tos' },
  { label: 'Lisanslandırma', icon: 'i-lucide-copyright', to: '/article/licence' }
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
          class="size-8"
        >
        <span class="grow" />
        <UButton
          v-if="$device.isMobile && open"
          icon="i-lucide-panel-left-close"
          color="neutral"
          variant="ghost"
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
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Kitaplık
        </div>

        <UNavigationMenu
          :items="libraryItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Kurumsal
        </div>

        <UNavigationMenu
          :items="companyItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Yasal
        </div>

        <UNavigationMenu
          :items="legalItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </div>
    </div>

    <template #footer>
      <UButton
        label="Giriş Yap"
        icon="i-lucide-log-in"
        block
        to="/login"
      />
    </template>
  </USidebar>
</template>
