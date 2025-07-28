<script setup lang="ts">
//@ts-nocheck
import { Icon } from '@iconify/vue'
import { toRaw } from 'vue';

const colorMode = useColorMode()
const user = useLogtoUser();
const sanity = useSanity()

let sanityUser = ref({})
let listsMenuItem = ref({})

if (Boolean(user)) {
  const query = groq`*[_type == "auth" && logtoId == $logtoId][0]{
    ...,
    lists[]-> {
      _id,
      title
    }
  }`
  sanityUser = await sanity.fetch(query, { logtoId: user.sub })

  const lists = sanityUser.lists;
  const listItems = Array.isArray(lists)
    ? lists
    : [lists]

  listsMenuItem.value = {
    title: "Listelerin",
    items: lists ? listItems.map((list) => ({
      title: (list.title || `Bölüm ${list.chapterNumber}`).length >= 17 ?
        (list.title || `Bölüm ${list.chapterNumber}`).slice(0, 17) +
        '...' :
        (list.title || `Bölüm ${list.chapterNumber}`),
      url: `/list/${list._id}`,
      icon: "material-symbols:list-alt-outline-rounded",
    }))
      : [
        {
          title: "Liste Oluştur",
          url: "/list/create",
          icon: "material-symbols:list-alt-add-outline-rounded",
        },
      ],
  };
}

const menuItems = [
  {
    title: "",
    items: [
      { title: "Anasayfa", url: "/", icon: "material-symbols:home-outline-rounded" },
    ]
  },
  {
    title: "Keşfet",
    items: [
      { title: "İçerikleri Keşfet", url: "/explore/titles", icon: "material-symbols:database-search-outline-rounded" },
      { title: "Listeleri Keşfet", url: /*"/explore/lists"*/ "", icon: "mdi:text-box-search-outline" },
    ]
  },
  {
    title: "Kullanıcı Bağlantıları",
    items: [
      { title: "Liste Oluştur", url: "/", icon: "material-symbols:list-alt-add-outline-rounded" },
      { title: "Kütüphane", url: "" /*"/library"*/, icon: "mdi:library-outline" },
      { title: "Okuma Geçmişi", url: "" /*"/history"*/, icon: "material-symbols:history" }
    ]
  },
  toRaw(listsMenuItem.value),
  {
    title: "Güncellemeler",
    items: [
      { title: "Güncelleme Notları", url: "" /*"/articles/release-notes"*/, icon: "mdi:file-document-refresh-outline" },
      { title: "Github Deposu", url: "https://github.com/falsisdev/mangile", icon: "mdi:github" }
    ],
  },
  {
    title: "Sistem",
    items: [
      { title: "Hakkımızda", url: "/articles/about", icon: "material-symbols:article-person-outline-sharp" },
      { title: "İletişim", url: "mailto: falsis@proton.me", icon: "material-symbols:contact-support-outline-rounded" },
      { title: "Gizlilik Prensipleri", url: "" /*"/articles/privacy-policy"*/, icon: "material-symbols:privacy-tip-outline-rounded" },
      { title: "Güvenlik İpuçları", url: "" /*"/articles/security-tips"*/, icon: "material-symbols:lock-person-outline-sharp" },
      { title: "Kullanıcı Sözleşmesi", url: "" /*"/articles/terms"*/, icon: "material-symbols:inbox-text-person-sharp" },
    ]
  }
]

const userItems = [
  { title: "Profili Görüntüle", url: `/user/${user?.sub}`, icon: "material-symbols:person-outline" },
  { title: "Ayarlar", url: "" /* "/settings" */, icon: "mdi:cog-outline" },
  { title: "Çıkış Yap", url: "/sign-out", icon: "mdi:logout-variant" }
]

const contextMenuItems = {
  lisItems: [
    {
      title: "Görüntüle",
      url: "/list/$id",
      icon: "mdi:eye-outline"
    },
    {
      title: "Düzenle",
      url: "" /*"/list/$id/edit"*/,
      icon: "material-symbols:edit-outline-rounded"
    }
  ],
  menuItems: [
    {
      title: "Görüntüle",
      url: "$url",
      icon: "mdi:eye-outline"
    },
    {
      title: "Yeni Sekmede Aç",
      url: "$url",
      icon: "material-symbols:open-in-new-rounded",
      style: "blank"
    }
  ]
}

function handleContextMenuClick(menuItem, baseUrl) {
  const finalUrl = menuItem.url
    .replace('$id', baseUrl.split('/').pop())
    .replace('$url', baseUrl)

  if (menuItem.style === 'blank') {
    window.open(finalUrl, '_blank', 'noopener,noreferrer') // güvenli şekilde
  } else {
    navigateTo(finalUrl)
  }
}
</script>

<template>
  <Sidebar>

    <SidebarHeader class="mx-1 flex gap-2 items-center sidebar-header">
      <SidebarMenu class="flex flex-row">
        <SidebarMenuItem>
          <img src="/assets/images/logo_latin.png" class="h-10 w-10" />
        </SidebarMenuItem>
        <span class="grow" />
        <SidebarMenuItem class="self-center">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost">
                <Icon icon="material-symbols:moon-stars"
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icon icon="material-symbols:sunny"
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Tema Seç</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="colorMode.preference = 'light'">
                <Icon icon="material-symbols:sunny" class="h-[1rem] w-[1rem]" /> Aydınlık
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'dark'">
                <Icon icon="material-symbols:moon-stars" class="h-[1rem] w-[1rem]" /> Karanlık
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'system'">
                <Icon icon="mdi:monitor-shimmer" class="h-[1rem] w-[1rem]" /> Sistem Varsayılanı
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="group in menuItems" :key="group.title">
        <SidebarGroupLabel v-if="group.title">{{ group.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.title" class="relative group">
              <ContextMenu>
                <ContextMenuTrigger>
                  <SidebarMenuButton asChild class="transition duration-400 w-full">
                    <div class="flex items-center justify-between w-full">
                      <!-- Sol taraf: ikon ve başlık -->
                      <NuxtLink :to="item.url" class="flex items-center grow">
                        <Icon :icon="item.icon" class="mr-2 w-4 h-4" />
                        <span>{{ item.title }}</span>
                      </NuxtLink>

                      <!-- Sağ taraf: sadece Listelerin grubunda görünür -->
                      <template v-if="group.title === 'Listelerin'">
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                          <NuxtLink :to="`${''/*item.url + '/edit'*/}`"
                            class="text-muted-foreground hover:text-primary duration-300" @click.stop>
                            <Icon icon="material-symbols:edit-outline-rounded" class="w-[1rem] h-[1rem]" />
                          </NuxtLink>
                          <AlertDialog>
                            <AlertDialogTrigger as-child>
                              <NuxtLink
                                class="dark:text-red-300 dark:hover:text-red-400 text-red-400 hover:text-red-600 duration-300 cursor-pointer"
                                @click.stop>
                                <Icon icon="material-symbols:delete-outline-sharp" class="w-[1rem] h-[1rem]" />
                              </NuxtLink>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Onay İsteği</AlertDialogTitle>
                                <AlertDialogDescription>
                                  <b>{{ item.title }}</b> adlı listenizi silmek istediğinize emin misiniz? Listeler
                                  silindikten sonra geri getirilemez ve yedekleri hiçbir yerde depolanmaz. Bu işlem geri
                                  alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction>
                                  <Icon icon="material-symbols:delete-outline-sharp" /> Sil
                                </AlertDialogAction>
                                <AlertDialogCancel>
                                  <Icon icon="mdi:close-circle-outline" /> Geri Al
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </template>
                    </div>
                  </SidebarMenuButton>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    v-for="menuItem in (group.title === 'Listelerin' ? contextMenuItems.lisItems : contextMenuItems.menuItems)"
                    :key="menuItem.title" class="duration-300" @click.stop="handleContextMenuClick(menuItem, item.url)">
                    <Icon :icon="menuItem.icon" />
                    <span>{{ menuItem.title }}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a :href="Boolean(user) ? '' : '/sign-in'">
                <SidebarMenuButton class="flex flex-row cursor-pointer">
                  <Avatar v-if="Boolean(user)" class="w-[1.5rem] h-[1.5rem]">
                    <AvatarImage :src="sanityUser?.avatar" />
                    <AvatarFallback>
                      <Icon icon="material-symbols:person-outline" />
                    </AvatarFallback>
                  </Avatar>
                  <Icon v-else icon="mdi:login-variant" />
                  <span class="grow">
                    {{ Boolean(user) ? (sanityUser?.name || "Kullanıcı") : "Giriş Yap" }}
                  </span>
                  <Icon v-if="Boolean(user)" icon="mdi:chevron-up" />
                </SidebarMenuButton>
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent v-if="Boolean(user)" side="top" class="max-w-screen min-w-56">
              <DropdownMenuItem v-for="item in userItems" :key="item.title" as-child>
                <a :href="item.url" class="flex items-center">
                  <Icon :icon="item.icon" class="mr-2 w-4 h-4" />
                  <span>{{ item.title }}</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

  </Sidebar>
</template>