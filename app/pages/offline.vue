<script setup lang="ts">
import { useNetwork } from '@vueuse/core'

useHead({
  title: 'Çevrimdışı İndirilenler - Mangile',
  meta: [
    {
      name: 'description',
      content: 'Cihazınıza indirdiğiniz bölümleri internetsiz okuyun.'
    }
  ]
})

const { isOnline } = useNetwork()
const { manifest, removeChapter, clearAll } = useOfflineReader()

function retryConnection() {
  if (import.meta.client) {
    window.location.reload()
  }
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

const totalStorageFormatted = computed(() => {
  const totalBytes = manifest.value.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0)
  if (totalBytes === 0) return '0 MB'
  const mb = totalBytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
})
</script>

<template>
  <div class="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Offline status alert if disconnected -->
    <div
      v-if="!isOnline"
      class="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
          <UIcon
            name="i-lucide-wifi-off"
            class="size-5"
          />
        </div>
        <div>
          <h2 class="text-sm font-semibold text-foreground">
            Şu Anda Çevrimdışısınız
          </h2>
          <p class="text-xs text-muted">
            İnternet bağlantısı kesildi. Cihazınıza kayıtlı bölümleri kesintisiz okumaya devam edebilirsiniz.
          </p>
        </div>
      </div>

      <UButton
        size="sm"
        color="warning"
        variant="soft"
        icon="i-lucide-refresh-cw"
        label="Yeniden Dene"
        class="shrink-0 font-medium"
        @click="retryConnection"
      />
    </div>

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
      <div>
        <h1 class="text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
          <UIcon
            name="i-lucide-download"
            class="size-6 text-primary"
          />
          Çevrimdışı İndirilenler
        </h1>
        <p class="text-xs sm:text-sm text-muted mt-1">
          Cihazınızda saklanan ve internet gerekmeden okunabilen bölümler.
        </p>
      </div>

      <div
        v-if="manifest.length > 0"
        class="flex items-center gap-2 shrink-0"
      >
        <UBadge
          color="neutral"
          variant="subtle"
          size="sm"
        >
          {{ manifest.length }} Bölüm • Yaklaşık {{ totalStorageFormatted }}
        </UBadge>
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Tümünü Temizle"
          @click="clearAll"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="manifest.length === 0"
      class="py-16 px-4 text-center rounded-3xl border border-dashed border-border/80 bg-muted/10 space-y-4"
    >
      <div class="size-14 mx-auto rounded-2xl bg-muted/20 text-muted flex items-center justify-center">
        <UIcon
          name="i-lucide-cloud-download"
          class="size-7"
        />
      </div>
      <div class="space-y-1 max-w-sm mx-auto">
        <p class="text-base font-semibold text-foreground">
          Henüz indirilmiş bölüm yok
        </p>
        <p class="text-xs text-muted">
          İnternetiniz varken manga ve roman sayfalarındaki 'Çevrimdışı İndir' butonuna dokunarak bölümleri internetsiz okumak üzere saklayabilirsiniz.
        </p>
      </div>
      <UButton
        to="/explore"
        color="primary"
        size="sm"
        icon="i-lucide-compass"
        label="İçerikleri Keşfet"
      />
    </div>

    <!-- Chapters Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="chapter in manifest"
        :key="chapter.chapterKey"
        class="group p-3.5 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between gap-3"
      >
        <div class="flex items-start gap-3">
          <img
            v-if="chapter.coverImage"
            :src="chapter.coverImage"
            :alt="chapter.mangaTitle"
            class="size-16 rounded-xl object-cover bg-muted/40 shrink-0 border border-border/40"
            loading="lazy"
          >
          <div
            v-else
            class="size-16 rounded-xl bg-muted/30 flex items-center justify-center shrink-0 border border-border/40"
          >
            <UIcon
              name="i-lucide-book-open"
              class="size-6 text-muted"
            />
          </div>

          <div class="min-w-0 flex-1 space-y-0.5">
            <p class="text-xs font-semibold text-primary line-clamp-1">
              {{ chapter.mangaTitle }}
            </p>
            <h3 class="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {{ chapter.chapterNumber ? `Bölüm ${chapter.chapterNumber}` : chapter.title || 'Bölüm' }}
            </h3>
            <p
              v-if="chapter.title && chapter.chapterNumber"
              class="text-[11px] text-muted line-clamp-1"
            >
              {{ chapter.title }}
            </p>
            <p class="text-[10px] text-muted pt-1">
              {{ chapter.pageCount }} sayfa • {{ formatDate(chapter.downloadedAt) }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
          <UButton
            :to="`/chapter/${chapter.chapterKey}`"
            size="xs"
            color="primary"
            variant="solid"
            icon="i-lucide-book-open"
            label="Hemen Oku"
            class="font-medium"
          />

          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-trash"
            aria-label="Bölümü Sil"
            @click="removeChapter(chapter.chapterKey)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
