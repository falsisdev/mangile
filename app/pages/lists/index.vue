<script setup lang="ts">
const { user } = useAuthUser()
const { fetchPublicLists, fetchUserLists, fetchLikedLists, createList, updateList, deleteList } = useLists()
const toast = useToast()

const activeTab = ref<'my' | 'explore' | 'liked'>('my')

const myLists = ref<ListData[]>([])
const exploreLists = ref<ListData[]>([])
const likedLists = ref<ListData[]>([])
const loadingMy = ref(false)
const loadingExplore = ref(false)
const loadingLiked = ref(false)
const searchQuery = ref('')

const isCreateModalOpen = ref(false)
const createTitle = ref('')
const createDescription = ref('')
const createIsPrivate = ref(false)
const isSubmittingCreate = ref(false)

const isEditModalOpen = ref(false)
const editingListId = ref('')
const editTitle = ref('')
const editDescription = ref('')
const editIsPrivate = ref(false)
const isSubmittingEdit = ref(false)

const isDeleteModalOpen = ref(false)
const deletingListId = ref('')
const isSubmittingDelete = ref(false)

async function loadMyLists() {
  if (!user.value?.logtoId) return
  loadingMy.value = true
  try {
    const data = await fetchUserLists(user.value.logtoId, user.value.logtoId)
    myLists.value = data || []
  } catch {
    myLists.value = []
  } finally {
    loadingMy.value = false
  }
}

async function loadExploreLists() {
  loadingExplore.value = true
  try {
    const data = await fetchPublicLists(50)
    exploreLists.value = data || []
  } catch {
    exploreLists.value = []
  } finally {
    loadingExplore.value = false
  }
}

async function loadLikedLists() {
  if (!user.value?.logtoId) return
  loadingLiked.value = true
  try {
    const data = await fetchLikedLists(user.value.logtoId)
    likedLists.value = data || []
  } catch {
    likedLists.value = []
  } finally {
    loadingLiked.value = false
  }
}

watch(
  () => user.value?.logtoId,
  (id) => {
    if (id) {
      loadMyLists()
      loadLikedLists()
    } else {
      activeTab.value = 'explore'
    }
  },
  { immediate: true }
)

watch(
  activeTab,
  (tab) => {
    if (tab === 'explore' && exploreLists.value.length === 0) {
      loadExploreLists()
    } else if (tab === 'my' && user.value?.logtoId && myLists.value.length === 0) {
      loadMyLists()
    } else if (tab === 'liked' && user.value?.logtoId && likedLists.value.length === 0) {
      loadLikedLists()
    }
  },
  { immediate: true }
)

const filteredMyLists = computed(() => {
  if (!searchQuery.value.trim()) return myLists.value
  const q = searchQuery.value.toLowerCase()
  return myLists.value.filter(
    l => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
  )
})

const filteredExploreLists = computed(() => {
  if (!searchQuery.value.trim()) return exploreLists.value
  const q = searchQuery.value.toLowerCase()
  return exploreLists.value.filter(
    l => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
  )
})

const filteredLikedLists = computed(() => {
  if (!searchQuery.value.trim()) return likedLists.value
  const q = searchQuery.value.toLowerCase()
  return likedLists.value.filter(
    l => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
  )
})

async function handleCreateList() {
  if (!user.value?.logtoId || !createTitle.value.trim()) return
  isSubmittingCreate.value = true
  try {
    const created = await createList({
      title: createTitle.value.trim(),
      description: createDescription.value.trim(),
      isPrivate: createIsPrivate.value,
      logtoId: user.value.logtoId
    })
    myLists.value.unshift(created)
    createTitle.value = ''
    createDescription.value = ''
    createIsPrivate.value = false
    isCreateModalOpen.value = false
    toast.add({
      title: 'Başarılı',
      description: 'Liste başarıyla oluşturuldu.',
      color: 'success'
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Liste oluşturulamadı.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingCreate.value = false
  }
}

function openEdit(l: ListData) {
  editingListId.value = l._id
  editTitle.value = l.title || ''
  editDescription.value = l.description || ''
  editIsPrivate.value = !!l.isPrivate
  isEditModalOpen.value = true
}

async function handleUpdateList() {
  if (!user.value?.logtoId || !editingListId.value || !editTitle.value.trim()) return
  isSubmittingEdit.value = true
  try {
    const updated = await updateList(editingListId.value, {
      title: editTitle.value.trim(),
      description: editDescription.value.trim(),
      isPrivate: editIsPrivate.value,
      logtoId: user.value.logtoId
    })
    const idx = myLists.value.findIndex(l => l._id === editingListId.value)
    if (idx !== -1) {
      myLists.value[idx] = updated
    }
    isEditModalOpen.value = false
    toast.add({
      title: 'Başarılı',
      description: 'Liste güncellendi.',
      color: 'success'
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Güncelleme başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingEdit.value = false
  }
}

function openDelete(l: ListData) {
  deletingListId.value = l._id
  isDeleteModalOpen.value = true
}

async function handleDeleteList() {
  if (!user.value?.logtoId || !deletingListId.value) return
  isSubmittingDelete.value = true
  try {
    await deleteList(deletingListId.value, user.value.logtoId)
    myLists.value = myLists.value.filter(l => l._id !== deletingListId.value)
    isDeleteModalOpen.value = false
    toast.add({
      title: 'Silindi',
      description: 'Liste başarıyla silindi.',
      color: 'success'
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Silme işlemi başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingDelete.value = false
  }
}

function openCreateModal() {
  createTitle.value = ''
  createDescription.value = ''
  createIsPrivate.value = false
  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
}

function closeEditModal() {
  isEditModalOpen.value = false
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

function getListPreviewCovers(l: ListData): string[] {
  const covers: string[] = []
  if (l.coverImage?.url) {
    covers.push(l.coverImage.url)
  }
  for (const item of l.items || []) {
    const url = item.reference?.coverImage?.url
    if (url && !covers.includes(url)) {
      covers.push(url)
      if (covers.length >= 3) break
    }
  }
  return covers
}

useSeoMeta({
  title: 'Listeler - Mangile',
  description: 'Manga ve hafif roman okuma listeleri ve koleksiyonları.'
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          <UIcon
            name="i-lucide-library"
            class="size-7 text-primary"
          />
          Listeler
        </h1>
        <p class="text-xs sm:text-sm text-muted mt-1">
          Kişisel manga ve hafif roman koleksiyonlarınız ve topluluk listeleri
        </p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <UButton
          v-if="user"
          color="primary"
          variant="solid"
          size="sm"
          icon="i-lucide-plus"
          class="rounded-xl font-bold shrink-0"
          @click="openCreateModal"
        >
          Yeni Liste
        </UButton>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center p-1 rounded-xl bg-muted/20 border border-default/20 w-full sm:w-auto">
        <button
          v-if="user"
          type="button"
          class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === 'my' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
          @click="activeTab = 'my'"
        >
          Listelerim ({{ myLists.length }})
        </button>
        <button
          type="button"
          class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === 'explore' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
          @click="activeTab = 'explore'"
        >
          Keşfet
        </button>
        <button
          v-if="user"
          type="button"
          class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === 'liked' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
          @click="activeTab = 'liked'"
        >
          Beğendiklerim ({{ likedLists.length }})
        </button>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Listelerde ara..."
          size="sm"
          class="w-full"
        />
      </div>
    </div>

    <div v-if="activeTab === 'my'">
      <div
        v-if="!user"
        class="text-center py-12 space-y-3 bg-muted/10 rounded-2xl border border-default/20 p-6"
      >
        <UIcon
          name="i-lucide-user-x"
          class="size-10 text-muted mx-auto"
        />
        <h3 class="text-base font-bold text-foreground">
          Giriş Yapılmadı
        </h3>
        <p class="text-xs text-muted max-w-sm mx-auto">
          Kendi özel listelerinizi oluşturmak, düzenlemek ve takip etmek için lütfen giriş yapın.
        </p>
        <UButton
          to="/sign-in"
          color="primary"
          variant="solid"
          size="sm"
          class="rounded-xl font-bold"
        >
          Giriş Yap
        </UButton>
      </div>

      <div
        v-else-if="loadingMy"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="h-44 rounded-2xl bg-muted/20 animate-pulse"
        />
      </div>

      <div
        v-else-if="filteredMyLists.length === 0"
        class="text-center py-12 space-y-3 bg-muted/10 rounded-2xl border border-default/20 p-6"
      >
        <UIcon
          name="i-lucide-library"
          class="size-10 text-muted mx-auto"
        />
        <h3 class="text-base font-bold text-foreground">
          Henüz Liste Yok
        </h3>
        <p class="text-xs text-muted max-w-sm mx-auto">
          {{ searchQuery ? 'Aramanıza uygun liste bulunamadı.' : 'Favori serilerinizi gruplamak için ilk listenizi hemen oluşturun.' }}
        </p>
        <UButton
          v-if="!searchQuery"
          color="primary"
          variant="solid"
          size="sm"
          icon="i-lucide-plus"
          class="rounded-xl font-bold"
          @click="openCreateModal"
        >
          Yeni Liste Oluştur
        </UButton>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="l in filteredMyLists"
          :key="l._id"
          class="group relative flex flex-col justify-between p-4 rounded-2xl bg-elevated/70 border border-default/30 hover:border-primary/50 transition-all hover:shadow-lg"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <UBadge
                :color="l.isPrivate ? 'neutral' : 'success'"
                variant="subtle"
                size="xs"
                class="rounded-full text-[10px]"
              >
                {{ l.isPrivate ? 'Gizli' : 'Herkese Açık' }}
              </UBadge>
              <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-pencil"
                  aria-label="Düzenle"
                  @click.stop="openEdit(l)"
                />
                <UButton
                  variant="ghost"
                  color="error"
                  size="xs"
                  icon="i-lucide-trash-2"
                  aria-label="Sil"
                  @click.stop="openDelete(l)"
                />
              </div>
            </div>

            <NuxtLink
              :to="`/lists/${l._id}`"
              class="block"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {{ l.title }}
                  </h3>
                  <p class="text-xs text-muted line-clamp-2 mt-1 min-h-[2rem]">
                    {{ l.description || 'Açıklama belirtilmemiş.' }}
                  </p>
                </div>
                <div
                  v-if="getListPreviewCovers(l).length > 0"
                  class="flex items-center -space-x-2 shrink-0 pt-0.5"
                >
                  <img
                    v-for="(c, cIdx) in getListPreviewCovers(l)"
                    :key="cIdx"
                    :src="c"
                    alt=""
                    class="size-9 rounded-lg object-cover ring-2 ring-background shadow-xs"
                  >
                </div>
              </div>
            </NuxtLink>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-default/15 text-[11px] text-muted mt-3">
            <span class="flex items-center gap-1 font-semibold text-foreground">
              <UIcon
                name="i-lucide-book-open"
                class="size-3.5 text-primary"
              />
              {{ l.items?.length || l.itemsCount || 0 }} Seri
            </span>
            <span class="flex items-center gap-1">
              <UIcon
                name="i-lucide-heart"
                class="size-3.5 text-red-500 fill-red-500"
              />
              {{ l.likesCount || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'explore'">
      <div
        v-if="loadingExplore"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-44 rounded-2xl bg-muted/20 animate-pulse"
        />
      </div>

      <div
        v-else-if="filteredExploreLists.length === 0"
        class="text-center py-12 space-y-2 bg-muted/10 rounded-2xl border border-default/20 p-6"
      >
        <UIcon
          name="i-lucide-compass"
          class="size-10 text-muted mx-auto"
        />
        <h3 class="text-base font-bold text-foreground">
          Açık Liste Bulunamadı
        </h3>
        <p class="text-xs text-muted">
          Henüz paylaşılan herkese açık bir liste yok.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <NuxtLink
          v-for="l in filteredExploreLists"
          :key="l._id"
          :to="`/lists/${l._id}`"
          class="group flex flex-col justify-between p-4 rounded-2xl bg-elevated/70 border border-default/30 hover:border-primary/50 transition-all hover:shadow-lg"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <UAvatar
                  :src="l.user?.avatar"
                  :alt="l.user?.name || l.user?.username"
                  size="xs"
                />
                <span class="text-xs font-semibold text-muted line-clamp-1">
                  {{ l.user?.name || l.user?.username || 'Kullanıcı' }}
                </span>
              </div>
              <UBadge
                color="primary"
                variant="subtle"
                size="xs"
                class="rounded-full text-[10px]"
              >
                {{ l.items?.length || l.itemsCount || 0 }} Öge
              </UBadge>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {{ l.title }}
                </h3>
                <p class="text-xs text-muted line-clamp-2 mt-1 min-h-[2rem]">
                  {{ l.description || 'Açıklama bulunmuyor.' }}
                </p>
              </div>
              <div
                v-if="getListPreviewCovers(l).length > 0"
                class="flex items-center -space-x-2 shrink-0 pt-0.5"
              >
                <img
                  v-for="(c, cIdx) in getListPreviewCovers(l)"
                  :key="cIdx"
                  :src="c"
                  alt=""
                  class="size-9 rounded-lg object-cover ring-2 ring-background shadow-xs"
                >
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-default/15 text-[11px] text-muted mt-3">
            <span>{{ l.createdAt ? new Date(l.createdAt).toLocaleDateString('tr-TR') : '' }}</span>
            <span class="flex items-center gap-1 font-semibold text-foreground">
              <UIcon
                name="i-lucide-heart"
                class="size-3.5 text-red-500 fill-red-500"
              />
              {{ l.likesCount || 0 }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="activeTab === 'liked'">
      <div
        v-if="loadingLiked"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="h-44 rounded-2xl bg-muted/20 animate-pulse"
        />
      </div>

      <div
        v-else-if="filteredLikedLists.length === 0"
        class="text-center py-12 space-y-2 bg-muted/10 rounded-2xl border border-default/20 p-6"
      >
        <UIcon
          name="i-lucide-heart"
          class="size-10 text-muted mx-auto"
        />
        <h3 class="text-base font-bold text-foreground">
          Beğenilen Liste Yok
        </h3>
        <p class="text-xs text-muted">
          {{ searchQuery ? 'Aramanıza uygun liste bulunamadı.' : 'Henüz hiçbir listeyi beğenmediniz. Keşfet sekmesinden listeleri inceleyebilirsiniz.' }}
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <NuxtLink
          v-for="l in filteredLikedLists"
          :key="l._id"
          :to="`/lists/${l._id}`"
          class="group flex flex-col justify-between p-4 rounded-2xl bg-elevated/70 border border-default/30 hover:border-primary/50 transition-all hover:shadow-lg"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <UAvatar
                  :src="l.user?.avatar"
                  :alt="l.user?.name || l.user?.username"
                  size="xs"
                />
                <span class="text-xs font-semibold text-muted line-clamp-1">
                  {{ l.user?.name || l.user?.username || 'Kullanıcı' }}
                </span>
              </div>
              <UBadge
                color="primary"
                variant="subtle"
                size="xs"
                class="rounded-full text-[10px]"
              >
                {{ l.items?.length || l.itemsCount || 0 }} Öge
              </UBadge>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {{ l.title }}
                </h3>
                <p class="text-xs text-muted line-clamp-2 mt-1 min-h-[2rem]">
                  {{ l.description || 'Açıklama bulunmuyor.' }}
                </p>
              </div>
              <div
                v-if="getListPreviewCovers(l).length > 0"
                class="flex items-center -space-x-2 shrink-0 pt-0.5"
              >
                <img
                  v-for="(c, cIdx) in getListPreviewCovers(l)"
                  :key="cIdx"
                  :src="c"
                  alt=""
                  class="size-9 rounded-lg object-cover ring-2 ring-background shadow-xs"
                >
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-default/15 text-[11px] text-muted mt-3">
            <span>{{ l.createdAt ? new Date(l.createdAt).toLocaleDateString('tr-TR') : '' }}</span>
            <span class="flex items-center gap-1 font-semibold text-foreground">
              <UIcon
                name="i-lucide-heart"
                class="size-3.5 text-red-500 fill-red-500"
              />
              {{ l.likesCount || 0 }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <UModal
      v-model:open="isCreateModalOpen"
      title="Yeni Liste Oluştur"
      description="Koleksiyonunuz için yeni bir liste ekleyin"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Liste Başlığı</label>
            <UInput
              v-model="createTitle"
              placeholder="Örn: En İyi Romantik Mangalar"
              size="sm"
              class="w-full"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Açıklama (İsteğe bağlı)</label>
            <UTextarea
              v-model="createDescription"
              placeholder="Liste hakkında kısa bilgi..."
              size="sm"
              :rows="3"
              class="w-full"
            />
          </div>
          <div class="pt-1">
            <UCheckbox
              v-model="createIsPrivate"
              name="createIsPrivate"
              label="Gizli Liste (Yalnızca siz görebilirsiniz)"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end gap-2 w-full">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="closeCreateModal"
          >
            İptal
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :loading="isSubmittingCreate"
            :disabled="!createTitle.trim()"
            @click="handleCreateList"
          >
            Oluştur
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isEditModalOpen"
      title="Listeyi Düzenle"
      description="Liste bilgilerinizi güncelleyin"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Liste Başlığı</label>
            <UInput
              v-model="editTitle"
              size="sm"
              class="w-full"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Açıklama</label>
            <UTextarea
              v-model="editDescription"
              size="sm"
              :rows="3"
              class="w-full"
            />
          </div>
          <div class="pt-1">
            <UCheckbox
              v-model="editIsPrivate"
              name="editIsPrivate"
              label="Gizli Liste"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end gap-2 w-full">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="closeEditModal"
          >
            İptal
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :loading="isSubmittingEdit"
            :disabled="!editTitle.trim()"
            @click="handleUpdateList"
          >
            Kaydet
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isDeleteModalOpen"
      title="Listeyi Sil"
      description="Bu işlem geri alınamaz"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #body>
        <p class="text-sm text-muted">
          Bu listeyi silmek istediğinizden emin misiniz? Listenin içerisindeki ögeler silinecektir.
        </p>
      </template>
      <template #footer>
        <div class="flex items-center justify-end gap-2 w-full">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="closeDeleteModal"
          >
            Vazgeç
          </UButton>
          <UButton
            color="error"
            variant="solid"
            size="sm"
            :loading="isSubmittingDelete"
            @click="handleDeleteList"
          >
            Listeyi Sil
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
