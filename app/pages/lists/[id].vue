<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const listId = String(route.params.id)

const { user } = useAuthUser()
const {
  fetchList,
  updateList,
  deleteList,
  removeListItem,
  updateListItems,
  toggleLike
} = useLists()
const toast = useToast()

const list = ref<ListData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const isLiked = computed(() => {
  if (!user.value?.logtoId || !list.value?.likes) return false
  return list.value.likes.some(
    l => l.logtoId === user.value?.logtoId || l.id === user.value?._id
  )
})

const isOwner = computed(() => {
  if (!user.value?.logtoId || !list.value?.user) return false
  return (
    list.value.user.logtoId === user.value.logtoId
    || list.value.user.id === user.value._id
  )
})

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchList(listId, user.value?.logtoId)
    list.value = data
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Liste yüklenemedi.'
    error.value = msg
  } finally {
    loading.value = false
  }
}

watch(
  () => user.value?.logtoId,
  () => {
    loadData()
  },
  { immediate: true }
)

const isEditModalOpen = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editIsPrivate = ref(false)
const isSubmittingEdit = ref(false)

function openEditList() {
  if (!list.value) return
  editTitle.value = list.value.title || ''
  editDescription.value = list.value.description || ''
  editIsPrivate.value = !!list.value.isPrivate
  isEditModalOpen.value = true
}

async function handleUpdateList() {
  if (!user.value?.logtoId || !editTitle.value.trim()) return
  isSubmittingEdit.value = true
  try {
    const updated = await updateList(listId, {
      title: editTitle.value.trim(),
      description: editDescription.value.trim(),
      isPrivate: editIsPrivate.value,
      logtoId: user.value.logtoId
    })
    list.value = updated
    isEditModalOpen.value = false
    toast.add({ title: 'Başarılı', description: 'Liste bilgileri güncellendi.', color: 'success' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Güncelleme başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingEdit.value = false
  }
}

const isDeleteModalOpen = ref(false)
const isSubmittingDelete = ref(false)

async function handleDeleteList() {
  if (!user.value?.logtoId) return
  isSubmittingDelete.value = true
  try {
    await deleteList(listId, user.value.logtoId)
    toast.add({ title: 'Silindi', description: 'Liste silindi.', color: 'success' })
    router.push('/lists')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Silme başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingDelete.value = false
  }
}

const isLiking = ref(false)
async function handleToggleLike() {
  if (!user.value?.logtoId) {
    toast.add({
      title: 'Giriş Yapmalısınız',
      description: 'Listeleri beğenmek için lütfen giriş yapın.',
      color: 'warning'
    })
    return
  }
  isLiking.value = true
  try {
    const updated = await toggleLike(listId, user.value.logtoId)
    list.value = updated
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İşlem başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isLiking.value = false
  }
}

const isEditItemModalOpen = ref(false)
const editingItemKey = ref('')
const editItemNote = ref('')
const editItemIndex = ref<number>(1)
const isSubmittingItemEdit = ref(false)

function openEditItem(item: ListItem) {
  editingItemKey.value = item._key
  editItemNote.value = item.note || ''
  editItemIndex.value = item.index || 1
  isEditItemModalOpen.value = true
}

async function handleUpdateItem() {
  if (!user.value?.logtoId || !list.value) return
  isSubmittingItemEdit.value = true
  try {
    const newItems = (list.value.items || []).map((it) => {
      if (it._key === editingItemKey.value) {
        return {
          ...it,
          note: editItemNote.value.trim() || undefined,
          index: editItemIndex.value
        }
      }
      return it
    })
    newItems.sort((a, b) => a.index - b.index)

    const updated = await updateListItems(listId, newItems, user.value.logtoId)
    list.value = updated
    isEditItemModalOpen.value = false
    toast.add({ title: 'Başarılı', description: 'Öge bilgisi güncellendi.', color: 'success' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Güncelleme başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  } finally {
    isSubmittingItemEdit.value = false
  }
}

function openDeleteModal() {
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

function closeEditModal() {
  isEditModalOpen.value = false
}

function closeEditItemModal() {
  isEditItemModalOpen.value = false
}

async function handleRemoveItem(key: string) {
  if (!user.value?.logtoId) return
  try {
    const updated = await removeListItem(listId, key, user.value.logtoId)
    list.value = updated
    toast.add({ title: 'Kaldırıldı', description: 'Öge listeden kaldırıldı.', color: 'success' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İşlem başarısız.'
    toast.add({ title: 'Hata', description: msg, color: 'error' })
  }
}

async function moveItem(index: number, direction: 'up' | 'down') {
  if (!user.value?.logtoId || !list.value?.items) return
  const items = [...list.value.items]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) return

  const current = items[index]
  const target = items[targetIndex]
  if (!current || !target) return

  items[index] = target
  items[targetIndex] = current

  items.forEach((it, idx) => {
    it.index = idx + 1
  })

  list.value.items = items

  try {
    const updated = await updateListItems(listId, items, user.value.logtoId)
    list.value = updated
  } catch {
    loadData()
  }
}

const viewMode = useStorage<'list' | 'grid' | 'compact'>('mangile-list-view-mode', 'list')

function getItemTitle(it: ListItem): string {
  if (it.reference?.title) return it.reference.title
  if (it.externalId) return `Harici Seri #${it.externalId}`
  return 'İsimsiz Öge'
}

function getItemLink(it: ListItem): string | null {
  if (it.reference?.myAnimeListId) return `/title/${it.reference.myAnimeListId}`
  if (it.externalId) return `/title/${it.externalId}`
  if (it.reference?.slug) return `/title/${it.reference.slug}`
  if (it.reference?._id) return `/title/${it.reference._id}`
  return null
}

function getItemCover(it: ListItem): string | undefined {
  return it.reference?.coverImage?.url
}

useSeoMeta({
  title: computed(() => (list.value ? `${list.value.title} - Mangile` : 'Liste Detayı - Mangile')),
  description: computed(() => list.value?.description || 'Mangile kullanıcı listesi detayı.')
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center gap-2 text-xs text-muted">
      <NuxtLink
        to="/lists"
        class="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        Tüm Listeler
      </NuxtLink>
    </div>

    <div
      v-if="loading"
      class="space-y-4"
    >
      <div class="h-40 rounded-3xl bg-muted/20 animate-pulse" />
      <div class="space-y-2">
        <div
          v-for="i in 4"
          :key="i"
          class="h-20 rounded-2xl bg-muted/15 animate-pulse"
        />
      </div>
    </div>

    <div
      v-else-if="error || !list"
      class="text-center py-16 space-y-3 bg-muted/10 rounded-3xl border border-default/20 p-6"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="size-12 text-error mx-auto"
      />
      <h2 class="text-lg font-bold text-foreground">
        {{ error || 'Liste bulunamadı' }}
      </h2>
      <p class="text-xs text-muted max-w-sm mx-auto">
        Bu liste gizli olabilir veya silinmiş olabilir.
      </p>
      <UButton
        to="/lists"
        color="primary"
        variant="solid"
        size="sm"
        class="rounded-xl font-bold"
      >
        Listelere Dön
      </UButton>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-card border border-default/20 shadow-xl space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-2 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                :color="list.isPrivate ? 'neutral' : 'success'"
                variant="subtle"
                size="sm"
                class="rounded-full"
              >
                {{ list.isPrivate ? 'Gizli Liste' : 'Herkese Açık' }}
              </UBadge>
              <span class="text-xs text-muted">
                {{ list.items?.length || list.itemsCount || 0 }} seri içeriyor
              </span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              {{ list.title }}
            </h1>

            <p class="text-sm text-muted leading-relaxed">
              {{ list.description || 'Bu liste için açıklama eklenmemiş.' }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <UButton
              color="error"
              :variant="isLiked ? 'solid' : 'soft'"
              size="sm"
              icon="i-lucide-heart"
              class="rounded-xl font-bold"
              :loading="isLiking"
              @click="handleToggleLike"
            >
              {{ list.likesCount || 0 }} Beğeni
            </UButton>

            <template v-if="isOwner">
              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                icon="i-lucide-pencil"
                class="rounded-xl font-bold"
                @click="openEditList"
              >
                Düzenle
              </UButton>
              <UButton
                color="error"
                variant="ghost"
                size="sm"
                icon="i-lucide-trash-2"
                class="rounded-xl font-bold"
                @click="openDeleteModal"
              >
                Sil
              </UButton>
            </template>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-default/15 text-xs text-muted">
          <div class="flex items-center gap-2.5">
            <UAvatar
              :src="list.user?.avatar"
              :alt="list.user?.name || list.user?.username"
              size="sm"
            />
            <div>
              <span class="font-bold text-foreground block">{{ list.user?.name || list.user?.username }}</span>
              <span class="text-[11px] text-muted">@{{ list.user?.username }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4 text-[11px]">
            <span v-if="list.createdAt">
              Oluşturuldu: {{ new Date(list.createdAt).toLocaleDateString('tr-TR') }}
            </span>
            <span v-if="list.updatedAt">
              Güncellendi: {{ new Date(list.updatedAt).toLocaleDateString('tr-TR') }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-foreground flex items-center gap-2">
              <UIcon
                name="i-lucide-list-ordered"
                class="size-5 text-primary"
              />
              Liste Sıralaması
            </h2>
            <span class="text-xs text-muted font-medium">
              Toplam {{ list.items?.length || 0 }} Seri
            </span>
          </div>

          <div class="flex items-center p-1 rounded-xl bg-muted/20 border border-default/20">
            <button
              type="button"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'list' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
              aria-label="Liste Görünümü"
              @click="viewMode = 'list'"
            >
              <UIcon
                name="i-lucide-layout-list"
                class="size-4"
              />
            </button>
            <button
              type="button"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'grid' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
              aria-label="Izgara Görünümü"
              @click="viewMode = 'grid'"
            >
              <UIcon
                name="i-lucide-layout-grid"
                class="size-4"
              />
            </button>
            <button
              type="button"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'compact' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
              aria-label="Kompakt Görünüm"
              @click="viewMode = 'compact'"
            >
              <UIcon
                name="i-lucide-align-justify"
                class="size-4"
              />
            </button>
          </div>
        </div>

        <div
          v-if="!list.items || list.items.length === 0"
          class="text-center py-16 space-y-3 bg-muted/10 rounded-2xl border border-default/20 p-6"
        >
          <UIcon
            name="i-lucide-bookmark-plus"
            class="size-10 text-muted mx-auto"
          />
          <h3 class="text-base font-bold text-foreground">
            Bu listede henüz içerik yok
          </h3>
          <p class="text-xs text-muted max-w-sm mx-auto">
            Manga veya hafif roman sayfalarındaki "Listeye Ekle" butonunu kullanarak bu listeye kolayca seriler ekleyebilirsiniz.
          </p>
          <UButton
            to="/explore"
            color="primary"
            variant="solid"
            size="sm"
            class="rounded-xl font-bold"
          >
            Serileri Keşfet
          </UButton>
        </div>

        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          <div
            v-for="(it, idx) in list.items"
            :key="it._key"
            class="group relative flex flex-col rounded-2xl bg-card border border-default/20 hover:border-primary/40 transition-all overflow-hidden shadow-xs"
          >
            <div class="relative aspect-[3/4] bg-muted/30 overflow-hidden">
              <img
                v-if="getItemCover(it)"
                :src="getItemCover(it)"
                :alt="getItemTitle(it)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-muted"
              >
                <UIcon
                  name="i-lucide-book"
                  class="size-8"
                />
              </div>

              <div class="absolute top-2 left-2 size-7 rounded-lg bg-background/85 backdrop-blur-md text-foreground font-black text-xs flex items-center justify-center border border-default/20 shadow-xs">
                #{{ it.index || idx + 1 }}
              </div>

              <div
                v-if="it.reference?.format || it.externalType"
                class="absolute top-2 right-2"
              >
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  class="rounded-md text-[9px] backdrop-blur-md bg-background/85"
                >
                  {{ it.reference?.format || (it.externalType === 'lightNovel' ? 'Hafif Roman' : 'Manga') }}
                </UBadge>
              </div>

              <div
                v-if="isOwner"
                class="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-background/90 to-transparent flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-chevron-up"
                  :disabled="idx === 0"
                  class="bg-background/80"
                  @click.stop="moveItem(idx, 'up')"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-chevron-down"
                  :disabled="idx === list.items.length - 1"
                  class="bg-background/80"
                  @click.stop="moveItem(idx, 'down')"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-pencil"
                  class="bg-background/80"
                  @click.stop="openEditItem(it)"
                />
                <UButton
                  variant="ghost"
                  color="error"
                  size="xs"
                  icon="i-lucide-trash-2"
                  class="bg-background/80"
                  @click.stop="handleRemoveItem(it._key)"
                />
              </div>
            </div>

            <div class="p-3 flex flex-col justify-between flex-1 gap-2">
              <div>
                <component
                  :is="getItemLink(it) ? 'NuxtLink' : 'span'"
                  :to="getItemLink(it)"
                  class="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {{ getItemTitle(it) }}
                </component>
                <p
                  v-if="it.note"
                  class="text-[11px] text-amber-600 dark:text-amber-400 mt-1 line-clamp-2"
                >
                  {{ it.note }}
                </p>
              </div>

              <div class="pt-1 border-t border-default/15 flex items-center justify-between text-[10px] text-muted">
                <span v-if="it.addedAt">{{ new Date(it.addedAt).toLocaleDateString('tr-TR') }}</span>
                <NuxtLink
                  v-if="getItemLink(it)"
                  :to="getItemLink(it)!"
                  class="text-primary hover:underline font-bold"
                >
                  Git &rarr;
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="viewMode === 'compact'"
          class="rounded-2xl border border-default/20 bg-card overflow-hidden divide-y divide-default/15"
        >
          <div
            v-for="(it, idx) in list.items"
            :key="it._key"
            class="group flex items-center justify-between px-3 sm:px-4 py-2.5 hover:bg-muted/15 transition-colors gap-3 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span class="font-bold text-primary shrink-0 w-6 text-center">#{{ it.index || idx + 1 }}</span>
              <img
                v-if="getItemCover(it)"
                :src="getItemCover(it)"
                :alt="getItemTitle(it)"
                class="size-8 rounded-lg object-cover shrink-0"
              >
              <component
                :is="getItemLink(it) ? 'NuxtLink' : 'span'"
                :to="getItemLink(it)"
                class="font-bold text-foreground hover:text-primary transition-colors truncate"
              >
                {{ getItemTitle(it) }}
              </component>
              <UBadge
                v-if="it.reference?.format || it.externalType"
                color="neutral"
                variant="subtle"
                size="xs"
                class="rounded text-[9px] shrink-0 hidden sm:inline-flex"
              >
                {{ it.reference?.format || (it.externalType === 'lightNovel' ? 'Hafif Roman' : 'Manga') }}
              </UBadge>
              <span
                v-if="it.note"
                class="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs hidden md:inline"
              >
                {{ it.note }}
              </span>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <template v-if="isOwner">
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-chevron-up"
                  :disabled="idx === 0"
                  aria-label="Yukarı Taşı"
                  @click="moveItem(idx, 'up')"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-chevron-down"
                  :disabled="idx === list.items.length - 1"
                  aria-label="Aşağı Taşı"
                  @click="moveItem(idx, 'down')"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-pencil"
                  aria-label="Düzenle"
                  @click="openEditItem(it)"
                />
                <UButton
                  variant="ghost"
                  color="error"
                  size="xs"
                  icon="i-lucide-trash-2"
                  aria-label="Kaldır"
                  @click="handleRemoveItem(it._key)"
                />
              </template>
              <UButton
                v-if="getItemLink(it)"
                :to="getItemLink(it)!"
                color="primary"
                variant="ghost"
                size="xs"
                icon="i-lucide-external-link"
              />
            </div>
          </div>
        </div>

        <div
          v-else
          class="space-y-2.5"
        >
          <div
            v-for="(it, idx) in list.items"
            :key="it._key"
            class="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-default/20 hover:border-primary/40 transition-all gap-4 shadow-sm"
          >
            <div class="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div class="size-8 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 border border-primary/20">
                #{{ it.index || idx + 1 }}
              </div>

              <div class="size-14 sm:size-16 rounded-xl overflow-hidden bg-muted/30 shrink-0 border border-default/20 relative">
                <img
                  v-if="getItemCover(it)"
                  :src="getItemCover(it)"
                  :alt="getItemTitle(it)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                >
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-muted"
                >
                  <UIcon
                    name="i-lucide-book"
                    class="size-6"
                  />
                </div>
              </div>

              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <component
                    :is="getItemLink(it) ? 'NuxtLink' : 'span'"
                    :to="getItemLink(it)"
                    class="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {{ getItemTitle(it) }}
                  </component>
                  <UBadge
                    v-if="it.reference?.format || it.externalType"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                    class="rounded-md text-[10px]"
                  >
                    {{ it.reference?.format || (it.externalType === 'lightNovel' ? 'Hafif Roman' : 'Manga') }}
                  </UBadge>
                </div>

                <div
                  v-if="it.note"
                  class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg w-fit max-w-full"
                >
                  <UIcon
                    name="i-lucide-sticky-note"
                    class="size-3.5 shrink-0"
                  />
                  <span class="truncate">{{ it.note }}</span>
                </div>

                <div class="text-[10px] text-muted flex items-center gap-2">
                  <span v-if="it.addedAt">
                    Eklendi: {{ new Date(it.addedAt).toLocaleDateString('tr-TR') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0 self-end sm:self-center">
              <template v-if="isOwner">
                <div class="flex items-center mr-1">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    icon="i-lucide-chevron-up"
                    :disabled="idx === 0"
                    aria-label="Yukarı Taşı"
                    @click="moveItem(idx, 'up')"
                  />
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    icon="i-lucide-chevron-down"
                    :disabled="idx === list.items.length - 1"
                    aria-label="Aşağı Taşı"
                    @click="moveItem(idx, 'down')"
                  />
                </div>

                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-pencil"
                  aria-label="Düzenle"
                  @click="openEditItem(it)"
                />
                <UButton
                  variant="ghost"
                  color="error"
                  size="xs"
                  icon="i-lucide-trash-2"
                  aria-label="Kaldır"
                  @click="handleRemoveItem(it._key)"
                />
              </template>

              <UButton
                v-if="getItemLink(it)"
                :to="getItemLink(it)!"
                color="primary"
                variant="soft"
                size="xs"
                icon="i-lucide-external-link"
                class="rounded-lg ml-1 font-semibold"
              >
                Görüntüle
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

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
          "{{ list?.title }}" listesini silmek istediğinizden emin misiniz? Listenin içerisindeki kayıtlı ögeler de kaldırılacaktır.
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

    <UModal
      v-model:open="isEditItemModalOpen"
      title="Ögeyi Düzenle"
      description="Sıra numarası veya kişisel notunuzu güncelleyin"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Sıra Numarası</label>
            <UInput
              v-model.number="editItemIndex"
              type="number"
              size="sm"
              class="w-full"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-foreground">Kişisel Not</label>
            <UTextarea
              v-model="editItemNote"
              size="sm"
              :rows="3"
              placeholder="Bu seri hakkındaki notunuz..."
              class="w-full"
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
            @click="closeEditItemModal"
          >
            İptal
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :loading="isSubmittingItemEdit"
            @click="handleUpdateItem"
          >
            Kaydet
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
