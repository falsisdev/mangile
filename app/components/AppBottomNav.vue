<script setup lang="ts">
const route = useRoute()
const { user } = useAuthUser()

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
    class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom)] select-none transition-transform duration-200"
    aria-label="Mobil Ana Gezinme"
  >
    <div class="h-14 grid grid-cols-5 items-stretch px-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :external="item.isExternal"
        class="flex flex-col items-center justify-center gap-1 text-center touch-manipulation transition-all duration-150 active:scale-90 group relative"
        :class="item.isActive ? 'text-primary font-bold' : 'text-muted hover:text-foreground'"
      >
        <!-- Active indicator pill at top -->
        <span
          v-if="item.isActive"
          class="absolute top-1 w-8 h-1 rounded-full bg-primary transition-all duration-200"
        />

        <div class="relative flex items-center justify-center size-5 mt-1">
          <UAvatar
            v-if="item.avatar"
            :src="item.avatar"
            size="2xs"
            class="ring-1 transition-all duration-150"
            :class="item.isActive ? 'ring-primary scale-105' : 'ring-border/60'"
          />
          <UIcon
            v-else-if="item.icon"
            :name="item.icon"
            class="size-5 transition-transform duration-150 group-hover:scale-105"
            :class="item.isActive ? 'text-primary scale-105' : 'text-muted'"
          />
        </div>

        <span class="text-[10px] tracking-tight truncate max-w-[64px] leading-none">
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
