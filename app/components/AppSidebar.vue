<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = defineModel<boolean>('open', { default: false })
const globalSidebarOpen = useSidebar()
const route = useRoute()
const { isMobile } = useDevice()
const { user } = useAuthUser()
const { openProfile } = useProfileModal()

watch(
  open,
  (newValue) => {
    globalSidebarOpen.value = newValue
  },
  { immediate: true }
)

watch(globalSidebarOpen, (newValue) => {
  open.value = newValue
})

function closeOnMobile() {
  const isMobileScreen
    = isMobile || (import.meta.client && window.innerWidth < 768)
  if (isMobileScreen) {
    open.value = false
    globalSidebarOpen.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    closeOnMobile()
  }
)

const mainItems: NavigationMenuItem[] = [
  {
    label: 'Ana Sayfa',
    icon: 'i-lucide-house',
    to: '/',
    onSelect: closeOnMobile
  },
  {
    label: 'Keşfet',
    icon: 'i-lucide-compass',
    to: '/explore',
    onSelect: closeOnMobile
  }
]

const libraryItems: NavigationMenuItem[] = [
  {
    label: 'Senkronizasyon',
    icon: 'i-lucide-cloud-backup',
    to: '/sync',
    onSelect: closeOnMobile
  },
  {
    label: 'Listeler',
    icon: 'i-lucide-library',
    to: '/lists',
    onSelect: closeOnMobile
  },
  {
    label: 'Okuma Geçmişi',
    icon: 'i-lucide-history',
    to: '/history',
    onSelect: closeOnMobile
  }
]

const companyItems: NavigationMenuItem[] = [
  {
    label: 'Bilgilendirme',
    icon: 'i-lucide-info',
    to: '/article/notice',
    onSelect: closeOnMobile
  },
  {
    label: 'Hakkımızda',
    icon: 'i-lucide-users',
    to: '/article/about',
    onSelect: closeOnMobile
  },
  {
    label: 'İletişim',
    icon: 'i-lucide-phone',
    to: '/article/contact',
    onSelect: closeOnMobile
  }
]

const legalItems: NavigationMenuItem[] = [
  {
    label: 'Hizmet Koşulları',
    icon: 'i-lucide-scale',
    to: '/article/tos',
    onSelect: closeOnMobile
  },
  {
    label: 'Lisanslandırma',
    icon: 'i-lucide-copyright',
    to: '/article/licence',
    onSelect: closeOnMobile
  }
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
    :ui="{
      container: 'max-md:w-72 max-md:max-w-[85vw]',
      inner:
        'max-md:bg-sidebar/95 max-md:backdrop-blur-xl max-md:border-r max-md:border-border/60 max-md:shadow-2xl'
    }"
  >
    <template #header>
      <div class="flex flex-row items-center w-full">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 min-w-0"
          @click="closeOnMobile"
        >
          <img
            src="https://cdn.sanity.io/images/1yge7tlr/production/b8497ba054d01f92ecf4f359a835f55e6a321d90-1080x1080.png?fit=max&w=600&h=600"
            class="size-8 rounded-xl shrink-0"
            alt="Mangile Logo"
          >
          <div
            class="flex items-center gap-1.5 min-w-0"
            :class="open ? 'flex' : 'flex md:hidden'"
          >
            <span class="font-black text-base text-foreground tracking-tight">Mangile</span>
            <UBadge
              color="primary"
              variant="subtle"
              size="xs"
              class="rounded-full px-1.5 py-0 text-[9px] font-bold"
            >
              v1.0
            </UBadge>
          </div>
        </NuxtLink>
        <span class="grow" />
        <UButton
          v-if="open"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full md:hidden shrink-0"
          aria-label="Menüyü Kapat"
          @click="toggleSidebar"
        />
      </div>
    </template>

    <div class="flex h-full flex-col">
      <div class="flex-1 overflow-y-auto">
        <UNavigationMenu
          :items="mainItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 max-md:p-2 max-md:rounded-xl overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-library"
            class="w-3 h-3 text-primary md:hidden"
          />
          <span>Kitaplık</span>
        </div>

        <UNavigationMenu
          :items="libraryItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 max-md:p-2 max-md:rounded-xl overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-info"
            class="w-3 h-3 text-primary md:hidden"
          />
          <span>Kurumsal</span>
        </div>

        <UNavigationMenu
          :items="companyItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 max-md:p-2 max-md:rounded-xl overflow-hidden' }"
        />

        <div
          v-if="open"
          class="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-scale"
            class="w-3 h-3 text-primary md:hidden"
          />
          <span>Yasal</span>
        </div>

        <UNavigationMenu
          :items="legalItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 max-md:p-2 max-md:rounded-xl overflow-hidden' }"
        />
      </div>
    </div>

    <template #footer>
      <div class="w-full">
        <template v-if="user">
          <div
            v-if="!open"
            class="flex flex-col items-center gap-2 py-1"
          >
            <UTooltip
              :text="`${user.name} (@${user.username || 'üye'})`"
              :content="{ side: 'right' }"
            >
              <button
                type="button"
                class="rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary p-0.5 hover:scale-105 transition-transform"
                aria-label="Profil"
                @click="openProfile"
              >
                <UAvatar
                  :src="user.avatar || undefined"
                  :alt="user.name"
                  size="sm"
                  icon="i-lucide-user"
                />
              </button>
            </UTooltip>
            <UTooltip
              text="Çıkış Yap"
              :content="{ side: 'right' }"
            >
              <UButton
                to="/sign-out"
                :external="true"
                icon="i-lucide-log-out"
                variant="ghost"
                color="neutral"
                size="sm"
                class="rounded-lg shrink-0"
                aria-label="Çıkış Yap"
                @click="closeOnMobile"
              />
            </UTooltip>
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <button
              type="button"
              class="w-full p-2 rounded-xl bg-muted/40 hover:bg-muted/70 transition-all flex items-center justify-between gap-2 overflow-hidden text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              @click="openProfile"
            >
              <UUser
                :name="user.name"
                :description="user.username ? `@${user.username}` : ''"
                :avatar="{
                  src: user.avatar || undefined,
                  loading: 'lazy',
                  icon: 'i-lucide-user'
                }"
                class="min-w-0 flex-1 truncate group-hover:opacity-90 transition-opacity"
              />
              <UBadge
                v-if="user.roleLabel"
                size="sm"
                variant="soft"
                color="primary"
                class="shrink-0 text-[9px] font-semibold"
              >
                {{ user.roleLabel }}
              </UBadge>
            </button>

            <UButton
              v-if="!user.isRegistered"
              to="/new-user"
              size="xs"
              color="warning"
              variant="soft"
              icon="i-lucide-sparkles"
              label="Kaydı Tamamla"
              block
              @click="closeOnMobile"
            />

            <UButton
              to="/sign-out"
              :external="true"
              label="Çıkış Yap"
              icon="i-lucide-log-out"
              block
              size="sm"
              color="neutral"
              variant="soft"
              @click="closeOnMobile"
            />
          </div>
        </template>

        <template v-else>
          <div
            v-if="!open"
            class="flex justify-center py-1"
          >
            <UTooltip
              text="Giriş Yap"
              :content="{ side: 'right' }"
            >
              <UButton
                to="/sign-in"
                :external="true"
                icon="i-lucide-log-in"
                color="primary"
                variant="solid"
                size="sm"
                class="rounded-lg"
                aria-label="Giriş Yap"
                @click="closeOnMobile"
              />
            </UTooltip>
          </div>

          <div
            v-else
            class="space-y-1"
          >
            <UButton
              to="/sign-in"
              :external="true"
              label="Giriş Yap"
              icon="i-lucide-log-in"
              block
              color="primary"
              variant="solid"
              @click="closeOnMobile"
            />
          </div>
        </template>

        <p
          v-if="open"
          class="text-center text-[10px] text-muted-foreground pt-2 md:hidden"
        >
          Mangile © 2026
        </p>
      </div>
    </template>
  </USidebar>
</template>
