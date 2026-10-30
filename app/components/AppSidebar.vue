<script setup lang="ts">
interface SidebarNavItem {
  label: string
  icon: string
  to: string
}

interface SidebarSection {
  id: string
  title?: string
  icon?: string
  items: SidebarNavItem[]
}

const open = defineModel<boolean>('open', { default: false })
const globalSidebarOpen = useSidebar()
const route = useRoute()
const { isMobile } = useDevice()
const { user } = useAuthUser()
const { openProfile } = useProfileModal()
const { canInstall, promptInstall } = usePwaInstall()
const { resolvedOsLabel } = useOsTheme()

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

const navSections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      {
        label: 'Ana Sayfa',
        icon: 'i-lucide-house',
        to: '/'
      },
      {
        label: 'Keşfet',
        icon: 'i-lucide-compass',
        to: '/explore'
      }
    ]
  },
  {
    id: 'library',
    title: 'Kitaplık',
    icon: 'i-lucide-library',
    items: [
      {
        label: 'Senkronizasyon',
        icon: 'i-lucide-cloud-backup',
        to: '/sync'
      },
      {
        label: 'Listeler',
        icon: 'i-lucide-library',
        to: '/lists'
      },
      {
        label: 'Okuma Geçmişi',
        icon: 'i-lucide-history',
        to: '/history'
      },
      {
        label: 'İndirilenler',
        icon: 'i-lucide-download',
        to: '/offline'
      }
    ]
  },
  {
    id: 'company',
    title: 'Kurumsal',
    icon: 'i-lucide-info',
    items: [
      {
        label: 'Bilgilendirme',
        icon: 'i-lucide-info',
        to: '/article/notice'
      },
      {
        label: 'Hakkımızda',
        icon: 'i-lucide-users',
        to: '/article/about'
      },
      {
        label: 'İletişim',
        icon: 'i-lucide-phone',
        to: '/article/contact'
      }
    ]
  },
  {
    id: 'legal',
    title: 'Yasal',
    icon: 'i-lucide-scale',
    items: [
      {
        label: 'Hizmet Koşulları',
        icon: 'i-lucide-scale',
        to: '/article/tos'
      },
      {
        label: 'Lisanslandırma',
        icon: 'i-lucide-copyright',
        to: '/article/licence'
      }
    ]
  }
]

function isItemActive(to: string): boolean {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path === to || route.path.startsWith(`${to}/`)
}

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
      root: 'os-sidebar-root',
      container: 'os-sidebar-container max-md:w-72 max-md:max-w-[85vw] max-md:p-0',
      inner:
        'os-sidebar-inner max-md:shadow-2xl transition-colors duration-200 divide-y-0',
      header:
        'px-3 py-3 group-data-[state=collapsed]/sidebar:px-2 group-data-[state=collapsed]/sidebar:justify-center',
      body:
        'px-2.5 py-2 group-data-[state=collapsed]/sidebar:px-2 group-data-[state=collapsed]/sidebar:py-2',
      footer:
        'px-2.5 py-3 group-data-[state=collapsed]/sidebar:px-2'
    }"
  >
    <template #header>
      <div
        class="flex flex-row items-center w-full pt-[env(safe-area-inset-top)] md:pt-0"
        :class="open ? 'justify-between' : 'justify-center'"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 min-w-0 focus:outline-none"
          :class="open ? '' : 'justify-center mx-auto'"
          @click="closeOnMobile"
        >
          <img
            src="https://cdn.sanity.io/images/1yge7tlr/production/b8497ba054d01f92ecf4f359a835f55e6a321d90-1080x1080.png?fit=max&w=600&h=600"
            class="size-8 rounded-xl shrink-0"
            alt="Mangile Logo"
          >
          <div
            class="flex items-center gap-1.5 min-w-0"
            :class="open ? 'flex' : 'flex lg:hidden'"
          >
            <span class="font-black text-base text-highlighted tracking-tight">Mangile</span>
            <UBadge
              color="primary"
              variant="subtle"
              size="xs"
              class="px-1.5 py-0 text-[9px] font-bold"
            >
              v2.0
            </UBadge>
          </div>
        </NuxtLink>
        <UButton
          v-if="open"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          class="md:hidden shrink-0"
          aria-label="Menüyü Kapat"
          @click="toggleSidebar"
        />
      </div>
    </template>

    <div class="flex h-full flex-col">
      <nav
        class="flex-1 overflow-y-auto space-y-3"
        aria-label="Ana Navigasyon"
      >
        <div
          v-for="section in navSections"
          :key="section.id"
          class="space-y-0.5"
        >
          <div
            v-if="section.title && open"
            class="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none"
          >
            <UIcon
              v-if="section.icon"
              :name="section.icon"
              class="w-3 h-3 text-primary md:hidden"
            />
            <span>{{ section.title }}</span>
          </div>

          <div
            v-for="item in section.items"
            :key="item.to"
          >
            <UTooltip
              :disabled="open"
              :text="item.label"
              :content="{ side: 'right' }"
            >
              <NuxtLink
                :to="item.to"
                :data-active="isItemActive(item.to) ? 'true' : undefined"
                :aria-current="isItemActive(item.to) ? 'page' : undefined"
                class="os-nav-link flex items-center overflow-hidden font-medium focus:outline-none"
                :class="
                  open
                    ? 'w-full gap-2.5 px-2.5 py-2 text-sm'
                    : 'w-full gap-2.5 px-2.5 py-2 text-sm lg:mx-auto lg:size-10 lg:justify-center lg:p-0'
                "
                @click="closeOnMobile"
              >
                <UIcon
                  :name="item.icon"
                  class="size-5 shrink-0"
                />
                <span
                  class="truncate"
                  :class="open ? 'inline' : 'inline lg:hidden'"
                >
                  {{ item.label }}
                </span>
              </NuxtLink>
            </UTooltip>
          </div>
        </div>
      </nav>
    </div>

    <template #footer>
      <div class="w-full pb-[env(safe-area-inset-bottom)] md:pb-0">
        <!-- PWA Install Button when installable -->
        <div
          v-if="canInstall"
          class="pb-2"
        >
          <UButton
            v-if="open"
            size="xs"
            color="primary"
            variant="soft"
            icon="i-lucide-download"
            label="Uygulamayı Yükle"
            block
            class="font-semibold"
            @click="void promptInstall()"
          />
          <div
            v-else
            class="flex justify-center"
          >
            <UTooltip
              text="Uygulamayı Yükle"
              :content="{ side: 'right' }"
            >
              <UButton
                size="sm"
                color="primary"
                variant="soft"
                icon="i-lucide-download"
                class="shrink-0"
                aria-label="Uygulamayı Yükle"
                @click="void promptInstall()"
              />
            </UTooltip>
          </div>
        </div>

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
                class="shrink-0"
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
              class="w-full p-2 os-card-interactive flex items-center justify-between gap-2 overflow-hidden text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          class="text-center text-[10px] text-muted pt-2 flex items-center justify-center gap-1.5"
        >
          <span>Mangile © 2026</span>
          <span>•</span>
          <span class="text-primary font-semibold">{{ resolvedOsLabel }}</span>
        </p>
      </div>
    </template>
  </USidebar>
</template>
