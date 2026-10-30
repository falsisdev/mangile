<script setup lang="ts">
const route = useRoute()
const { user } = useAuthUser()
const { resolvedOsTheme } = useOsTheme()

const navItems = computed(() => [
  {
    label: 'Ana Sayfa',
    icon: 'i-lucide-house',
    to: '/',
    isActive: route.path === '/'
  },
  {
    label: 'Keşfet',
    icon: 'i-lucide-compass',
    to: '/explore',
    isActive: route.path.startsWith('/explore')
  },
  {
    label: 'Listeler',
    icon: 'i-lucide-library',
    to: '/lists',
    isActive: route.path.startsWith('/lists')
  },
  {
    label: 'Geçmiş',
    icon: 'i-lucide-history',
    to: '/history',
    isActive: route.path.startsWith('/history')
  },
  {
    label: user.value ? 'Profil' : 'Giriş',
    icon: user.value ? (user.value.avatar ? undefined : 'i-lucide-user') : 'i-lucide-log-in',
    avatar: user.value?.avatar || undefined,
    to: user.value ? '/profile' : '/sign-in',
    isExternal: !user.value,
    isActive: route.path.startsWith('/profile')
  }
])
</script>

<template>
  <nav
    class="os-bottom-nav fixed bottom-0 inset-x-0 z-40 md:hidden select-none"
    aria-label="Mobil Ana Gezinme"
  >
    <div
      class="grid grid-cols-5 items-center"
      :class="
        resolvedOsTheme === 'ios27' || resolvedOsTheme === 'material3'
          ? 'h-14 px-2 py-1'
          : 'h-15 px-1'
      "
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :external="item.isExternal"
        class="relative flex flex-col items-center justify-center gap-0.5 h-full text-center touch-manipulation transition-all duration-200 active:scale-92 group"
        :class="item.isActive ? 'text-primary font-bold' : 'text-muted hover:text-highlighted'"
      >
        <!-- iOS 27 & macOS 27: Full-Cell Liquid Glass Capsule Pill -->
        <span
          v-if="item.isActive && (resolvedOsTheme === 'ios27' || resolvedOsTheme === 'macos27')"
          class="absolute inset-x-1 inset-y-1 rounded-full bg-primary/14 dark:bg-white/12 border border-white/45 dark:border-white/15 shadow-xs pointer-events-none transition-all duration-200"
        />

        <!-- Fluent 2: Crisp Bottom Accent Line -->
        <span
          v-if="item.isActive && resolvedOsTheme === 'fluent2'"
          class="absolute bottom-1 w-5 h-0.75 rounded-full bg-primary transition-all duration-200"
        />

        <!-- Icon Container (M3 wraps icon in 56x28 stadium pill!) -->
        <div
          class="relative z-10 flex items-center justify-center transition-all duration-200"
          :class="[
            resolvedOsTheme === 'material3'
              ? item.isActive
                ? 'w-14 h-7 rounded-full bg-primary/18 text-primary'
                : 'w-14 h-7 rounded-full group-hover:bg-muted/50'
              : 'size-6'
          ]"
        >
          <UAvatar
            v-if="item.avatar"
            :src="item.avatar"
            size="2xs"
            class="ring-1 transition-all duration-150"
            :class="item.isActive ? 'ring-primary scale-105' : 'ring-default'"
          />
          <UIcon
            v-else-if="item.icon"
            :name="item.icon"
            class="size-5 transition-transform duration-150"
            :class="item.isActive ? 'text-primary scale-105' : 'text-muted group-hover:text-highlighted'"
          />
        </div>

        <span
          class="relative z-10 text-[10px] tracking-tight truncate max-w-[64px] leading-tight"
          :class="item.isActive ? 'font-bold text-primary' : 'font-medium text-muted'"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
