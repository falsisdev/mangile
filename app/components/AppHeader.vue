<script setup lang="ts">
const openSidebar = defineModel<boolean>('openSidebar', { default: false })

const breadcrumbs = useBreadcrumbs()
const { user } = useAuthUser()
const { openProfile } = useProfileModal()
const { resolvedOsLabel } = useOsTheme()

function toggleSidebar() {
  openSidebar.value = !openSidebar.value
}
</script>

<template>
  <header
    class="os-header-bar os-glass-bar h-[calc(3.25rem+env(safe-area-inset-top))] sm:h-13 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b z-30 pt-[env(safe-area-inset-top)] transition-colors duration-200"
  >
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <UButton
        :icon="openSidebar ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
        color="neutral"
        variant="ghost"
        size="sm"
        class="touch-manipulation shrink-0"
        aria-label="Menüyü Aç/Kapat"
        @click="toggleSidebar"
      />

      <div class="hidden md:flex items-center gap-2.5 min-w-0">
        <UBreadcrumb :items="breadcrumbs" />
      </div>

      <NuxtLink
        to="/"
        class="flex md:hidden items-center gap-2 min-w-0 select-none"
      >
        <img
          src="https://cdn.sanity.io/images/1yge7tlr/production/b8497ba054d01f92ecf4f359a835f55e6a321d90-1080x1080.png?fit=max&w=600&h=600"
          class="size-6 rounded-lg shrink-0 shadow-2xs"
          alt="Mangile"
        >
        <span class="font-black text-sm text-highlighted tracking-tight truncate">Mangile</span>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-1.5 sm:gap-2">
      <span
        class="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-(--os-badge-radius) bg-muted/60 border border-default/60 text-[10px] font-semibold text-muted select-none"
        title="Aktif Tasarım Sistemi"
      >
        <span class="size-1.5 rounded-full bg-primary" />
        {{ resolvedOsLabel }}
      </span>

      <AppSearch />

      <div class="os-header-pill-cluster">
        <AppThemePopover />
        <UColorModeButton size="sm" />
        <UButton
          to="https://github.com/falsisdev/mangile"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex"
        />
      </div>

      <button
        v-if="user"
        type="button"
        class="flex md:hidden rounded-full p-0.5 ring-1 ring-default focus:outline-none focus:ring-2 focus:ring-primary shrink-0 touch-manipulation active:scale-95 transition-transform"
        aria-label="Profil"
        @click="openProfile"
      >
        <UAvatar
          :src="user.avatar || undefined"
          :alt="user.name"
          size="2xs"
          icon="i-lucide-user"
        />
      </button>
    </div>
  </header>
</template>
