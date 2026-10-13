<script setup lang="ts">
import type { TrackerProvider, TrackerStatus } from '~/composables/useTrackers'

const props = withDefaults(
  defineProps<{
    open?: boolean
    seriesId?: string
    seriesTitle?: string
    totalChapters?: number
    malId?: number
    anilistId?: number
    mangadexId?: string
  }>(),
  {
    open: false,
    seriesId: '',
    seriesTitle: '',
    totalChapters: undefined,
    malId: undefined,
    anilistId: undefined,
    mangadexId: undefined
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val)
})

const { user, isRegistered } = useAuthUser()
const {
  fetchSeriesStatus,
  unbindTracker,
  updateTrackerStatus,
  connectProvider,
  loadingSeries
} = useTrackers()

const searchModalOpen = ref(false)
const searchModalProvider = ref<TrackerProvider>('mangadex')
const mangaDexModalOpen = ref(false)
const savingProvider = ref<Record<string, boolean>>({})

// Form state for each provider
const formState = reactive<Record<TrackerProvider, {
  status: string
  chapter: number
  score: number
}>>({
  mal: { status: 'reading', chapter: 0, score: 0 },
  anilist: { status: 'reading', chapter: 0, score: 0 },
  mangadex: { status: 'reading', chapter: 0, score: 0 }
})

const statusOptions = [
  { label: 'Okunuyor', value: 'reading' },
  { label: 'Tamamlandı', value: 'completed' },
  { label: 'Beklemede', value: 'on_hold' },
  { label: 'Bırakıldı', value: 'dropped' },
  { label: 'Okunacak', value: 'plan_to_read' },
  { label: 'Tekrar Okunuyor', value: 'rereading' }
]

const scoreOptions = [
  { label: 'Puansız', value: 0 },
  { label: '10 - Başyapıt', value: 10 },
  { label: '9 - Harika', value: 9 },
  { label: '8 - Çok İyi', value: 8 },
  { label: '7 - İyi', value: 7 },
  { label: '6 - Fena Değil', value: 6 },
  { label: '5 - Ortalama', value: 5 },
  { label: '4 - Kötü', value: 4 },
  { label: '3 - Çok Kötü', value: 3 },
  { label: '2 - Berbat', value: 2 },
  { label: '1 - Korkunç', value: 1 }
]

const seriesTrackers = ref<Record<TrackerProvider, TrackerStatus>>({
  mal: { provider: 'mal', numReadChapters: 0, isConnected: false },
  anilist: { provider: 'anilist', numReadChapters: 0, isConnected: false },
  mangadex: { provider: 'mangadex', numReadChapters: 0, isConnected: false }
})

async function loadStatus() {
  if (!user.value?.logtoId || !props.seriesId) return
  if (props.malId && !seriesTrackers.value.mal.matchedId) {
    seriesTrackers.value.mal.matchedId = String(props.malId)
  }
  if (props.anilistId && !seriesTrackers.value.anilist.matchedId) {
    seriesTrackers.value.anilist.matchedId = String(props.anilistId)
  }
  if (props.mangadexId && !seriesTrackers.value.mangadex.matchedId) {
    seriesTrackers.value.mangadex.matchedId = String(props.mangadexId)
  }
  seriesTrackers.value.mal.isConnected = Boolean(user.value?.integrations?.mal?.accessToken)
  seriesTrackers.value.anilist.isConnected = Boolean(user.value?.integrations?.anilist?.accessToken)
  seriesTrackers.value.mangadex.isConnected = Boolean(user.value?.integrations?.mangadex?.accessToken)

  const data = await fetchSeriesStatus(props.seriesId, true)
  if (data?.trackers) {
    if (data.trackers.mal) {
      seriesTrackers.value.mal = data.trackers.mal
      formState.mal.status = data.trackers.mal.status || 'reading'
      formState.mal.chapter = data.trackers.mal.numReadChapters || 0
      formState.mal.score = data.trackers.mal.score || 0
    }
    if (data.trackers.anilist) {
      seriesTrackers.value.anilist = data.trackers.anilist
      formState.anilist.status = data.trackers.anilist.status || 'reading'
      formState.anilist.chapter = data.trackers.anilist.numReadChapters || 0
      formState.anilist.score = data.trackers.anilist.score || 0
    }
    if (data.trackers.mangadex) {
      seriesTrackers.value.mangadex = data.trackers.mangadex
      formState.mangadex.status = data.trackers.mangadex.status || 'reading'
      formState.mangadex.chapter = data.trackers.mangadex.numReadChapters || 0
      formState.mangadex.score = data.trackers.mangadex.score || 0
    }
  }
}

watch(
  () => props.open,
  (val) => {
    if (val && user.value?.logtoId) {
      loadStatus()
    }
  }
)

function isProviderConnected(provider: TrackerProvider): boolean {
  return Boolean(
    seriesTrackers.value[provider]?.isConnected
    || user.value?.integrations?.[provider]?.accessToken
  )
}

function handleConnect(provider: TrackerProvider) {
  if (provider === 'mangadex') {
    mangaDexModalOpen.value = true
  } else {
    connectProvider(provider)
  }
}

function openSearch(provider: TrackerProvider) {
  searchModalProvider.value = provider
  searchModalOpen.value = true
}

async function handleSaveStatus(provider: TrackerProvider) {
  savingProvider.value[provider] = true
  try {
    await updateTrackerStatus(
      props.seriesId,
      provider,
      formState[provider].status,
      formState[provider].chapter,
      formState[provider].score
    )
    await loadStatus()
  } finally {
    savingProvider.value[provider] = false
  }
}

async function handleUnbind(provider: TrackerProvider) {
  await unbindTracker(props.seriesId, provider)
  await loadStatus()
}

function handleChapterStep(provider: TrackerProvider, delta: number) {
  const current = formState[provider].chapter || 0
  const next = Math.max(0, current + delta)
  formState[provider].chapter = next
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard class="w-full max-w-2xl overflow-hidden rounded-2xl">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <UIcon
                  name="i-lucide-activity"
                  class="size-4"
                />
              </div>
              <div>
                <h3 class="text-base font-bold text-foreground">
                  Takipçiler & Senkronizasyon
                </h3>
                <p class="text-xs text-muted truncate max-w-xs sm:max-w-md">
                  {{ props.seriesTitle || 'Manga Takip' }}
                </p>
              </div>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="sm"
              class="rounded-xl"
              @click="void (isOpen = false)"
            />
          </div>
        </template>

        <!-- 1. Giriş Yapılmamış veya Profilsiz Durum -->
        <div
          v-if="!user || !isRegistered"
          class="py-8 px-2 text-center space-y-4"
        >
          <div class="size-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <UIcon
              name="i-lucide-lock"
              class="size-8"
            />
          </div>
          <div class="space-y-1.5 max-w-md mx-auto">
            <h4 class="text-base font-bold text-foreground">
              Senkronizasyon İçin Profil Zorunludur
            </h4>
            <p class="text-xs text-muted leading-relaxed">
              MyAnimeList, AniList ve MangaDex hesaplarınızla bölüm ilerlemesini otomatik senkronize etmek için lütfen giriş yapın ve profilinizi oluşturun.
            </p>
          </div>
          <div class="flex items-center justify-center gap-2 pt-2">
            <UButton
              v-if="!user"
              to="/sign-in"
              :external="true"
              label="Giriş Yap"
              icon="i-lucide-log-in"
              color="primary"
              class="rounded-xl font-bold"
            />
            <UButton
              v-else-if="!isRegistered"
              to="/new-user"
              label="Kaydı Tamamla"
              icon="i-lucide-sparkles"
              color="warning"
              class="rounded-xl font-bold"
            />
          </div>
        </div>

        <!-- 2. Giriş Yapılmış Durum (Takipçi Kartları) -->
        <div
          v-else
          class="space-y-4"
        >
          <div
            v-if="loadingSeries[props.seriesId]"
            class="py-12 flex flex-col items-center justify-center gap-2 text-muted"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="size-6 animate-spin text-primary"
            />
            <span class="text-xs">Takipçi verileri yükleniyor...</span>
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <!-- 2.1 MyAnimeList Kartı -->
            <div class="p-3.5 rounded-2xl bg-muted/20 border border-default/20 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <TrackerBrandIcon
                    provider="mal"
                    class="size-5"
                    :show-background="true"
                  />
                  <div>
                    <div class="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>MyAnimeList</span>
                      <UBadge
                        v-if="isProviderConnected('mal') && seriesTrackers.mal.matchedId"
                        size="xs"
                        variant="subtle"
                        color="success"
                        class="rounded font-semibold"
                      >
                        Senkronize
                      </UBadge>
                      <UBadge
                        v-else-if="!isProviderConnected('mal') && seriesTrackers.mal.matchedId"
                        size="xs"
                        variant="subtle"
                        color="warning"
                        class="rounded font-semibold"
                      >
                        Hesap Bağlanmadı
                      </UBadge>
                      <UBadge
                        v-else-if="isProviderConnected('mal') && !seriesTrackers.mal.matchedId"
                        size="xs"
                        variant="subtle"
                        color="neutral"
                        class="rounded"
                      >
                        Eşleşmedi
                      </UBadge>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    v-if="!isProviderConnected('mal')"
                    label="Hesabı Bağla"
                    icon="i-lucide-link"
                    size="xs"
                    color="primary"
                    variant="soft"
                    class="rounded-xl font-bold"
                    @click="handleConnect('mal')"
                  />
                  <template v-else>
                    <UButton
                      v-if="!seriesTrackers.mal.matchedId"
                      label="Eşleştir"
                      icon="i-lucide-search"
                      size="xs"
                      color="primary"
                      variant="soft"
                      class="rounded-xl font-bold"
                      @click="openSearch('mal')"
                    />
                    <UButton
                      v-else
                      label="Kaldır"
                      icon="i-lucide-unlink"
                      size="xs"
                      color="error"
                      variant="ghost"
                      class="rounded-xl"
                      @click="handleUnbind('mal')"
                    />
                  </template>
                </div>
              </div>

              <!-- Durum 1: Hesap bağlı değil AMA seri eşleşmiş -->
              <div
                v-if="!isProviderConnected('mal') && seriesTrackers.mal.matchedId"
                class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs"
              >
                <UIcon
                  name="i-lucide-alert-circle"
                  class="size-4 text-amber-500 shrink-0 mt-0.5"
                />
                <div class="flex-1 space-y-1">
                  <p class="text-foreground leading-relaxed">
                    Bu seri sistemde MyAnimeList ile otomatik eşleşti (ID: <span class="font-mono font-bold">{{ seriesTrackers.mal.matchedId }}</span>). Okuma ilerlemenizi senkronize etmek için önce MyAnimeList hesabınızı bağlayın.
                  </p>
                </div>
              </div>

              <!-- Durum 2: Hesap bağlı değil VE seri eşleşmemiş -->
              <div
                v-else-if="!isProviderConnected('mal') && !seriesTrackers.mal.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>İlerlemenizi senkronize etmek için MyAnimeList hesabınızı bağlayın.</span>
              </div>

              <!-- Durum 3: Hesap bağlı AMA seri eşleşmemiş -->
              <div
                v-else-if="isProviderConnected('mal') && !seriesTrackers.mal.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>Bu seri henüz MyAnimeList ile eşleştirilmedi.</span>
                <UButton
                  label="Ara ve Eşleştir"
                  icon="i-lucide-search"
                  size="xs"
                  color="primary"
                  variant="soft"
                  class="rounded-lg font-bold"
                  @click="openSearch('mal')"
                />
              </div>

              <!-- Durum 4: Hem hesap bağlı HEM seri eşleşmiş -> Canlı İlerleme Formu -->
              <div
                v-else-if="isProviderConnected('mal') && seriesTrackers.mal.matchedId"
                class="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Durum</label>
                  <select
                    v-model="formState.mal.status"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Bölüm</label>
                  <div class="flex items-center gap-1">
                    <UButton
                      icon="i-lucide-minus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      class="rounded-lg"
                      @click="handleChapterStep('mal', -1)"
                    />
                    <input
                      v-model.number="formState.mal.chapter"
                      type="number"
                      min="0"
                      class="w-full text-xs text-center font-bold rounded-xl bg-background border border-default/30 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                    <UButton
                      icon="i-lucide-plus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      class="rounded-lg"
                      @click="handleChapterStep('mal', 1)"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Puan</label>
                  <select
                    v-model.number="formState.mal.score"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in scoreOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="sm:col-span-3 flex items-center justify-end pt-1">
                  <UButton
                    label="Güncelle"
                    icon="i-lucide-check"
                    color="primary"
                    size="xs"
                    class="rounded-xl font-bold"
                    :loading="savingProvider.mal"
                    @click="handleSaveStatus('mal')"
                  />
                </div>
              </div>
            </div>

            <!-- 2.2 AniList Kartı -->
            <div class="p-3.5 rounded-2xl bg-muted/20 border border-default/20 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <TrackerBrandIcon
                    provider="anilist"
                    class="size-5"
                    :show-background="true"
                  />
                  <div>
                    <div class="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>AniList</span>
                      <UBadge
                        v-if="isProviderConnected('anilist') && seriesTrackers.anilist.matchedId"
                        size="xs"
                        variant="subtle"
                        color="success"
                        class="rounded font-semibold"
                      >
                        Senkronize
                      </UBadge>
                      <UBadge
                        v-else-if="!isProviderConnected('anilist') && seriesTrackers.anilist.matchedId"
                        size="xs"
                        variant="subtle"
                        color="warning"
                        class="rounded font-semibold"
                      >
                        Hesap Bağlanmadı
                      </UBadge>
                      <UBadge
                        v-else-if="isProviderConnected('anilist') && !seriesTrackers.anilist.matchedId"
                        size="xs"
                        variant="subtle"
                        color="neutral"
                        class="rounded"
                      >
                        Eşleşmedi
                      </UBadge>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    v-if="!isProviderConnected('anilist')"
                    label="Hesabı Bağla"
                    icon="i-lucide-link"
                    size="xs"
                    color="primary"
                    variant="soft"
                    class="rounded-xl font-bold"
                    @click="handleConnect('anilist')"
                  />
                  <template v-else>
                    <UButton
                      v-if="!seriesTrackers.anilist.matchedId"
                      label="Eşleştir"
                      icon="i-lucide-search"
                      size="xs"
                      color="primary"
                      variant="soft"
                      class="rounded-xl font-bold"
                      @click="openSearch('anilist')"
                    />
                    <UButton
                      v-else
                      label="Kaldır"
                      icon="i-lucide-unlink"
                      size="xs"
                      color="error"
                      variant="ghost"
                      class="rounded-xl"
                      @click="handleUnbind('anilist')"
                    />
                  </template>
                </div>
              </div>

              <!-- Durum 1: Hesap bağlı değil AMA seri eşleşmiş -->
              <div
                v-if="!isProviderConnected('anilist') && seriesTrackers.anilist.matchedId"
                class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs"
              >
                <UIcon
                  name="i-lucide-alert-circle"
                  class="size-4 text-amber-500 shrink-0 mt-0.5"
                />
                <div class="flex-1 space-y-1">
                  <p class="text-foreground leading-relaxed">
                    Bu seri sistemde AniList ile otomatik eşleşti (ID: <span class="font-mono font-bold">{{ seriesTrackers.anilist.matchedId }}</span>). Okuma ilerlemenizi senkronize etmek için önce AniList hesabınızı bağlayın.
                  </p>
                </div>
              </div>

              <!-- Durum 2: Hesap bağlı değil VE seri eşleşmemiş -->
              <div
                v-else-if="!isProviderConnected('anilist') && !seriesTrackers.anilist.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>İlerlemenizi senkronize etmek için AniList hesabınızı bağlayın.</span>
              </div>

              <!-- Durum 3: Hesap bağlı AMA seri eşleşmemiş -->
              <div
                v-else-if="isProviderConnected('anilist') && !seriesTrackers.anilist.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>Bu seri henüz AniList ile eşleştirilmedi.</span>
                <UButton
                  label="Ara ve Eşleştir"
                  icon="i-lucide-search"
                  size="xs"
                  color="primary"
                  variant="soft"
                  class="rounded-lg font-bold"
                  @click="openSearch('anilist')"
                />
              </div>

              <!-- Durum 4: Hem hesap bağlı HEM seri eşleşmiş -> Canlı İlerleme Formu -->
              <div
                v-else-if="isProviderConnected('anilist') && seriesTrackers.anilist.matchedId"
                class="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Durum</label>
                  <select
                    v-model="formState.anilist.status"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Bölüm</label>
                  <div class="flex items-center gap-1">
                    <UButton
                      icon="i-lucide-minus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      class="rounded-lg"
                      @click="handleChapterStep('anilist', -1)"
                    />
                    <input
                      v-model.number="formState.anilist.chapter"
                      type="number"
                      min="0"
                      class="w-full text-xs text-center font-bold rounded-xl bg-background border border-default/30 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                    <UButton
                      icon="i-lucide-plus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      class="rounded-lg"
                      @click="handleChapterStep('anilist', 1)"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Puan</label>
                  <select
                    v-model.number="formState.anilist.score"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in scoreOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="sm:col-span-3 flex items-center justify-end pt-1">
                  <UButton
                    label="Güncelle"
                    icon="i-lucide-check"
                    color="primary"
                    size="xs"
                    class="rounded-xl font-bold"
                    :loading="savingProvider.anilist"
                    @click="handleSaveStatus('anilist')"
                  />
                </div>
              </div>
            </div>

            <!-- 2.3 MangaDex Kartı -->
            <div class="p-3.5 rounded-2xl bg-muted/20 border border-default/20 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <TrackerBrandIcon
                    provider="mangadex"
                    class="size-5"
                    :show-background="true"
                  />
                  <div>
                    <div class="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>MangaDex</span>
                      <UBadge
                        v-if="isProviderConnected('mangadex') && seriesTrackers.mangadex.matchedId"
                        size="xs"
                        variant="subtle"
                        color="success"
                        class="rounded font-semibold"
                      >
                        Senkronize
                      </UBadge>
                      <UBadge
                        v-else-if="!isProviderConnected('mangadex') && seriesTrackers.mangadex.matchedId"
                        size="xs"
                        variant="subtle"
                        color="warning"
                        class="rounded font-semibold"
                      >
                        Hesap Bağlanmadı
                      </UBadge>
                      <UBadge
                        v-else-if="isProviderConnected('mangadex') && !seriesTrackers.mangadex.matchedId"
                        size="xs"
                        variant="subtle"
                        color="neutral"
                        class="rounded"
                      >
                        Eşleşmedi
                      </UBadge>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    v-if="!isProviderConnected('mangadex')"
                    label="Hesabı Bağla"
                    icon="i-lucide-link"
                    size="xs"
                    color="primary"
                    variant="soft"
                    class="rounded-xl font-bold"
                    @click="handleConnect('mangadex')"
                  />
                  <template v-else>
                    <UButton
                      v-if="!seriesTrackers.mangadex.matchedId"
                      label="Eşleştir"
                      icon="i-lucide-search"
                      size="xs"
                      color="primary"
                      variant="soft"
                      class="rounded-xl font-bold"
                      @click="openSearch('mangadex')"
                    />
                    <UButton
                      v-else
                      label="Kaldır"
                      icon="i-lucide-unlink"
                      size="xs"
                      color="error"
                      variant="ghost"
                      class="rounded-xl"
                      @click="handleUnbind('mangadex')"
                    />
                  </template>
                </div>
              </div>

              <!-- Durum 1: Hesap bağlı değil AMA seri eşleşmiş -->
              <div
                v-if="!isProviderConnected('mangadex') && seriesTrackers.mangadex.matchedId"
                class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs"
              >
                <UIcon
                  name="i-lucide-alert-circle"
                  class="size-4 text-amber-500 shrink-0 mt-0.5"
                />
                <div class="flex-1 space-y-1">
                  <p class="text-foreground leading-relaxed">
                    Bu seri sistemde MangaDex ile otomatik eşleşti (ID: <span class="font-mono font-bold">{{ seriesTrackers.mangadex.matchedId }}</span>). Okuma ilerlemenizi senkronize etmek için önce MangaDex hesabınızı bağlayın.
                  </p>
                </div>
              </div>

              <!-- Durum 2: Hesap bağlı değil VE seri eşleşmemiş -->
              <div
                v-else-if="!isProviderConnected('mangadex') && !seriesTrackers.mangadex.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>İlerlemenizi senkronize etmek için MangaDex hesabınızı bağlayın.</span>
              </div>

              <!-- Durum 3: Hesap bağlı AMA seri eşleşmemiş -->
              <div
                v-else-if="isProviderConnected('mangadex') && !seriesTrackers.mangadex.matchedId"
                class="p-2.5 rounded-xl bg-muted/30 border border-default/20 text-xs text-muted flex items-center justify-between"
              >
                <span>Bu seri henüz MangaDex ile eşleştirilmedi.</span>
                <UButton
                  label="Ara ve Eşleştir"
                  icon="i-lucide-search"
                  size="xs"
                  color="primary"
                  variant="soft"
                  class="rounded-lg font-bold"
                  @click="openSearch('mangadex')"
                />
              </div>

              <!-- Durum 4: Hem hesap bağlı HEM seri eşleşmiş -> Canlı İlerleme Formu -->
              <div
                v-else-if="isProviderConnected('mangadex') && seriesTrackers.mangadex.matchedId"
                class="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Durum</label>
                  <select
                    v-model="formState.mangadex.status"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-muted">Puan (1-10)</label>
                  <select
                    v-model.number="formState.mangadex.score"
                    class="w-full text-xs rounded-xl bg-background border border-default/30 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option
                      v-for="opt in scoreOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="sm:col-span-2 flex items-center justify-end pt-1">
                  <UButton
                    label="Güncelle"
                    icon="i-lucide-check"
                    color="primary"
                    size="xs"
                    class="rounded-xl font-bold"
                    :loading="savingProvider.mangadex"
                    @click="handleSaveStatus('mangadex')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>

  <!-- Eşleştirme Modalı -->
  <TrackerSearchModal
    v-model:open="searchModalOpen"
    :provider="searchModalProvider"
    :series-id="props.seriesId"
    :initial-title="props.seriesTitle"
    @matched="loadStatus"
  />

  <!-- MangaDex Bağlantı Modalı -->
  <TrackerMangaDexConnectModal
    v-model:open="mangaDexModalOpen"
    @connected="loadStatus"
  />
</template>
