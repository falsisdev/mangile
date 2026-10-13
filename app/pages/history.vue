<script setup lang="ts">
import type { ReadingHistoryItem } from '~/composables/useReadingHistory'
import { formatTimeAgo } from '~/utils/time'

const { user } = useAuthUser()
const {
  localHistory,
  cloudHistory,
  isLoadingCloud,
  fetchCloudHistory,
  deleteLocalItem,
  deleteCloudItem,
  clearLocalHistory,
  clearCloudHistory,
  copyLocalToCloud,
  copyCloudToLocal
} = useReadingHistory()

const toast = useToast()

const activeTab = ref<'local' | 'cloud'>('local')
const searchQuery = ref('')

// Clear Modal State
const isClearModalOpen = ref(false)
const isSubmittingClear = ref(false)

function closeClearModal() {
  isClearModalOpen.value = false
}

// Sync Modal State
const isSyncModalOpen = ref(false)
const syncDirection = ref<'local-to-cloud' | 'cloud-to-local'>('local-to-cloud')
const isSubmittingSync = ref(false)

function closeSyncModal() {
  isSyncModalOpen.value = false
}

// Watch user to fetch cloud history
watch(
  () => user.value?.logtoId,
  (id) => {
    if (id && activeTab.value === 'cloud') {
      fetchCloudHistory(true)
    }
  },
  { immediate: true }
)

watch(activeTab, (tab) => {
  if (tab === 'cloud' && user.value?.logtoId) {
    fetchCloudHistory()
  }
})

const activeList = computed<ReadingHistoryItem[]>(() => {
  return activeTab.value === 'local'
    ? (Array.isArray(localHistory.value) ? localHistory.value : [])
    : (Array.isArray(cloudHistory.value) ? cloudHistory.value : [])
})

const filteredList = computed<ReadingHistoryItem[]>(() => {
  const list = activeList.value
  if (!searchQuery.value.trim()) return list
  const q = searchQuery.value.toLowerCase().trim()
  return list.filter((item) => {
    return (
      item.seriesTitle.toLowerCase().includes(q)
      || (item.chapterTitle && item.chapterTitle.toLowerCase().includes(q))
    )
  })
})

function handleDeleteItem(item: ReadingHistoryItem) {
  if (activeTab.value === 'local') {
    deleteLocalItem(item.seriesId)
    toast.add({
      title: 'Silindi',
      description: `"${item.seriesTitle}" tarayıcı geçmişinizden kaldırıldı.`,
      color: 'success'
    })
  } else {
    deleteCloudItem(item.seriesId)
    toast.add({
      title: 'Silindi',
      description: `"${item.seriesTitle}" profil geçmişinizden kaldırıldı.`,
      color: 'success'
    })
  }
}

function openClearModal() {
  if (activeList.value.length === 0) return
  isClearModalOpen.value = true
}

async function confirmClearHistory() {
  isSubmittingClear.value = true
  try {
    if (activeTab.value === 'local') {
      clearLocalHistory()
      toast.add({
        title: 'Geçmiş Temizlendi',
        description: 'Tarayıcı okuma geçmişiniz başarıyla temizlendi.',
        color: 'success'
      })
    } else {
      await clearCloudHistory()
      toast.add({
        title: 'Geçmiş Temizlendi',
        description: 'Profil okuma geçmişiniz başarıyla temizlendi.',
        color: 'success'
      })
    }
    isClearModalOpen.value = false
  } catch {
    toast.add({
      title: 'Hata',
      description: 'Geçmiş temizlenirken bir hata oluştu.',
      color: 'error'
    })
  } finally {
    isSubmittingClear.value = false
  }
}

function openSyncModal(direction: 'local-to-cloud' | 'cloud-to-local') {
  syncDirection.value = direction
  isSyncModalOpen.value = true
}

async function confirmSync() {
  isSubmittingSync.value = true
  try {
    if (syncDirection.value === 'local-to-cloud') {
      const ok = await copyLocalToCloud()
      if (ok) {
        toast.add({
          title: 'Profile Aktarıldı',
          description: 'Tarayıcı geçmişiniz başarıyla profilinize aktarıldı.',
          color: 'success'
        })
      } else {
        throw new Error('Aktarım başarısız oldu.')
      }
    } else {
      const ok = copyCloudToLocal()
      if (ok) {
        toast.add({
          title: 'Tarayıcıya Aktarıldı',
          description: 'Profil geçmişiniz bu tarayıcıya başarıyla kopyalandı.',
          color: 'success'
        })
      } else {
        throw new Error('Aktarım başarısız oldu.')
      }
    }
    isSyncModalOpen.value = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İşlem başarısız oldu.'
    toast.add({
      title: 'Hata',
      description: msg,
      color: 'error'
    })
  } finally {
    isSubmittingSync.value = false
  }
}

function getResumeLink(item: ReadingHistoryItem): string {
  const routeType = item.seriesType === 'lightNovel' ? 'novel' : 'manga'
  const url = `/chapter/${item.chapterId}/${routeType}`
  const params = new URLSearchParams()
  if (item.currentPage && item.currentPage > 1) {
    params.set('page', String(item.currentPage))
  } else if (item.progress && item.progress > 0) {
    params.set('progress', String(Math.round(item.progress)))
  }
  const queryStr = params.toString()
  return queryStr ? `${url}?${queryStr}` : url
}

function formatBadgeLabel(item: ReadingHistoryItem): string {
  if (item.seriesFormat) {
    if (item.seriesFormat.toLowerCase() === 'manhwa') return 'Manhwa'
    if (item.seriesFormat.toLowerCase() === 'webtoon') return 'Webtoon'
    if (item.seriesFormat.toLowerCase() === 'light_novel') return 'Hafif Roman'
  }
  return item.seriesType === 'lightNovel' ? 'Hafif Roman' : 'Manga'
}

useSeoMeta({
  title: 'Okuma Geçmişi - Mangile',
  description: 'Manga, manhwa ve hafif romanlarda kaldığınız bölümleri ve okuma geçmişinizi takip edin.'
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          <UIcon
            name="i-lucide-history"
            class="size-7 text-primary"
          />
          Okuma Geçmişi
        </h1>
        <p class="text-xs sm:text-sm text-muted mt-1">
          Kaldığınız serileri takip edin, tek tıkla okumaya devam edin
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <!-- Local Tab Transfer Action -->
        <UButton
          v-if="activeTab === 'local' && user"
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-cloud-upload"
          class="rounded-xl font-bold shrink-0 text-xs"
          :disabled="localHistory.length === 0"
          @click="openSyncModal('local-to-cloud')"
        >
          Profile Aktar
        </UButton>

        <!-- Cloud Tab Transfer Action -->
        <UButton
          v-if="activeTab === 'cloud' && user"
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-download"
          class="rounded-xl font-bold shrink-0 text-xs"
          :disabled="cloudHistory.length === 0"
          @click="openSyncModal('cloud-to-local')"
        >
          Tarayıcıya Aktar
        </UButton>

        <!-- Clear All Button -->
        <UButton
          v-if="(activeTab === 'local' && localHistory.length > 0) || (activeTab === 'cloud' && user && cloudHistory.length > 0)"
          color="error"
          variant="soft"
          size="sm"
          icon="i-lucide-trash-2"
          class="rounded-xl font-bold shrink-0 text-xs"
          @click="openClearModal"
        >
          Geçmişi Temizle
        </UButton>
      </div>
    </div>

    <!-- Navigation & Search Filter -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Tabs -->
      <div class="flex items-center p-1 rounded-xl bg-muted/20 border border-default/20 w-full sm:w-auto">
        <button
          type="button"
          class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          :class="activeTab === 'local' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
          @click="activeTab = 'local'"
        >
          <UIcon
            name="i-lucide-laptop"
            class="size-3.5"
          />
          <span>Tarayıcı Geçmişi</span>
          <span class="text-[10px] opacity-80">({{ localHistory.length }}/5)</span>
        </button>

        <button
          type="button"
          class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          :class="activeTab === 'cloud' ? 'bg-primary text-inverted shadow-xs' : 'text-muted hover:text-foreground'"
          @click="activeTab = 'cloud'"
        >
          <UIcon
            name="i-lucide-cloud"
            class="size-3.5"
          />
          <span>Profil Geçmişi</span>
          <span
            v-if="user"
            class="text-[10px] opacity-80"
          >({{ cloudHistory.length }})</span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Geçmişte ara..."
          size="sm"
          class="w-full"
        />
      </div>
    </div>

    <!-- Local Tab 5-Limit Banner -->
    <div
      v-if="activeTab === 'local'"
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs"
    >
      <div class="flex items-center gap-2 text-muted">
        <UIcon
          name="i-lucide-info"
          class="size-4 text-primary shrink-0"
        />
        <span>
          Tarayıcı geçmişi <strong>en fazla 5 kayıt</strong> ile sınırlıdır.
        </span>
      </div>
      <NuxtLink
        v-if="!user"
        to="/sign-in"
        :external="true"
        class="font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
      >
        Giriş Yaparak 100 Seriye Yükselt
        <UIcon
          name="i-lucide-arrow-right"
          class="size-3"
        />
      </NuxtLink>
    </div>

    <!-- Content Sections -->

    <!-- Cloud Tab: Not Logged In State -->
    <div
      v-if="activeTab === 'cloud' && !user"
      class="text-center py-16 space-y-4 bg-muted/10 rounded-2xl border border-default/20 p-6"
    >
      <div class="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <UIcon
          name="i-lucide-cloud-off"
          class="size-7"
        />
      </div>
      <div class="space-y-1">
        <h3 class="text-base font-bold text-foreground">
          Profil Geçmişi İçin Giriş Yapın
        </h3>
        <p class="text-xs text-muted max-w-md mx-auto">
          Okuma geçmişinizi bulutta saklayarak farklı cihazlardan da kaldığınız yere erişmek için hesabınıza giriş yapın.
        </p>
      </div>
      <div class="pt-2">
        <UButton
          to="/sign-in"
          :external="true"
          color="primary"
          variant="solid"
          size="sm"
          icon="i-lucide-log-in"
          class="rounded-xl font-bold"
        >
          Giriş Yap
        </UButton>
      </div>
    </div>

    <!-- Cloud Tab: Loading State -->
    <div
      v-else-if="activeTab === 'cloud' && isLoadingCloud"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-36 rounded-2xl bg-muted/20 animate-pulse border border-default/10"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredList.length === 0"
      class="text-center py-16 space-y-3 bg-muted/10 rounded-2xl border border-default/20 p-6"
    >
      <UIcon
        name="i-lucide-book-open"
        class="size-12 text-muted mx-auto"
      />
      <h3 class="text-base font-bold text-foreground">
        {{ searchQuery ? 'Aramaya Uygun Seri Bulunamadı' : 'Henüz Okuma Geçmişi Yok' }}
      </h3>
      <p class="text-xs text-muted max-w-sm mx-auto">
        {{
          searchQuery
            ? 'Farklı bir anahtar kelime ile aramayı deneyebilirsiniz.'
            : activeTab === 'local'
              ? 'Okuduğunuz manga ve romanlar otomatik olarak bu tarayıcıya kaydedilecektir.'
              : 'Profilinizde kayıtlı bir okuma geçmişi bulunmuyor.'
        }}
      </p>
      <div
        v-if="!searchQuery"
        class="pt-2"
      >
        <UButton
          to="/explore"
          color="primary"
          variant="solid"
          size="sm"
          icon="i-lucide-compass"
          class="rounded-xl font-bold"
        >
          Serileri Keşfet
        </UButton>
      </div>
    </div>

    <!-- Cards Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="item in filteredList"
        :key="item.seriesId"
        class="group relative overflow-hidden rounded-2xl bg-card border border-border/40 hover:border-primary/50 transition-all p-3.5 flex gap-3.5 hover:shadow-md"
      >
        <!-- Cover Thumbnail -->
        <NuxtLink
          :to="getResumeLink(item)"
          class="relative shrink-0 w-20 sm:w-22 h-28 sm:h-30 rounded-xl overflow-hidden bg-muted/40 block"
        >
          <img
            v-if="item.coverUrl"
            :src="item.coverUrl"
            :alt="item.seriesTitle"
            class="size-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          >
          <div
            v-else
            class="size-full flex items-center justify-center text-muted"
          >
            <UIcon
              name="i-lucide-image"
              class="size-6"
            />
          </div>

          <!-- Format Badge on Image -->
          <span
            class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/70 text-white backdrop-blur-xs"
          >
            {{ formatBadgeLabel(item) }}
          </span>
        </NuxtLink>

        <!-- Content Info -->
        <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div class="space-y-1">
            <!-- Series Title -->
            <NuxtLink
              :to="getResumeLink(item)"
              class="font-bold text-sm sm:text-base text-foreground line-clamp-1 hover:text-primary transition-colors"
              :title="item.seriesTitle"
            >
              {{ item.seriesTitle }}
            </NuxtLink>

            <!-- Chapter Info -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <UIcon
                name="i-lucide-bookmark"
                class="size-3.5 shrink-0"
              />
              <span class="truncate">
                Bölüm {{ item.chapterNumber }}
                <span
                  v-if="item.chapterTitle"
                  class="text-muted font-normal"
                >
                  - {{ item.chapterTitle }}
                </span>
              </span>
            </div>

            <!-- Page / Progress Text -->
            <div class="text-[11px] text-muted flex items-center gap-1.5 pt-0.5">
              <span v-if="item.currentPage && item.totalPages">
                Sayfa {{ item.currentPage }} / {{ item.totalPages }}
              </span>
              <span v-else-if="item.progress !== undefined">
                %{{ Math.round(item.progress) }} okundu
              </span>
              <span v-else>
                Kaldığınız yer kaydedildi
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                class="bg-primary h-full rounded-full transition-all duration-300"
                :style="{
                  width: `${
                    item.totalPages && item.currentPage
                      ? Math.min(100, Math.round((item.currentPage / item.totalPages) * 100))
                      : item.progress !== undefined
                        ? Math.min(100, Math.round(item.progress))
                        : 100
                  }%`
                }"
              />
            </div>
          </div>

          <!-- Bottom Actions & Timestamp -->
          <div class="flex items-center justify-between pt-2 mt-auto border-t border-border/20">
            <span class="text-[10px] text-muted flex items-center gap-1">
              <UIcon
                name="i-lucide-clock"
                class="size-3"
              />
              {{ formatTimeAgo(item.readAt) }}
            </span>

            <div class="flex items-center gap-1">
              <!-- Delete Single Item Button -->
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-trash"
                class="rounded-lg text-muted hover:text-error transition-colors"
                aria-label="Geçmişten Kaldır"
                @click="handleDeleteItem(item)"
              />

              <!-- Resume Reading Button -->
              <UButton
                :to="getResumeLink(item)"
                color="primary"
                variant="solid"
                size="xs"
                icon="i-lucide-play"
                class="rounded-lg font-bold text-[11px]"
              >
                Devam Et
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Clear History Modal -->
    <UModal v-model:open="isClearModalOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="size-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-alert-triangle"
                class="size-5"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-foreground">
                {{ activeTab === 'local' ? 'Tarayıcı Geçmişini Temizle' : 'Profil Geçmişini Temizle' }}
              </h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">
                {{
                  activeTab === 'local'
                    ? 'Bu tarayıcıdaki tüm okuma geçmişiniz silinecektir. Bu işlem geri alınamaz.'
                    : 'Hesabınızda kayıtlı tüm okuma geçmişiniz silinecektir. Bu işlem geri alınamaz.'
                }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <UButton
              label="İptal"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-xl"
              :disabled="isSubmittingClear"
              @click="closeClearModal"
            />
            <UButton
              label="Geçmişi Temizle"
              color="error"
              variant="solid"
              size="sm"
              class="rounded-xl font-bold"
              :loading="isSubmittingClear"
              @click="confirmClearHistory"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Confirm Sync / Transfer Modal -->
    <UModal v-model:open="isSyncModalOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UIcon
                :name="syncDirection === 'local-to-cloud' ? 'i-lucide-cloud-upload' : 'i-lucide-download'"
                class="size-5"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-foreground">
                {{ syncDirection === 'local-to-cloud' ? 'Tarayıcı Geçmişini Profile Aktar' : 'Profil Geçmişini Tarayıcıya Aktar' }}
              </h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">
                {{
                  syncDirection === 'local-to-cloud'
                    ? 'Bu tarayıcıda bulunan okuma kayıtları profilinize kopyalanacaktır. Mevcut profil geçmişiniz korunacak ve seriler birleştirilecektir. Devam etmek istiyor musunuz?'
                    : 'Profilinizde kayıtlı okuma geçmişi bu tarayıcıya kopyalanacaktır. Mevcut yerel kayıtlarınızla birleştirilecektir. Devam etmek istiyor musunuz?'
                }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <UButton
              label="Vazgeç"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-xl"
              :disabled="isSubmittingSync"
              @click="closeSyncModal"
            />
            <UButton
              :label="syncDirection === 'local-to-cloud' ? 'Profile Aktar' : 'Tarayıcıya Aktar'"
              color="primary"
              variant="solid"
              size="sm"
              class="rounded-xl font-bold"
              :loading="isSubmittingSync"
              @click="confirmSync"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
