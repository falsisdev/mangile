<script setup lang="ts">
import type { TrackerProvider, UserTrackersDocument } from '~/composables/useTrackers'

useSeoMeta({
  title: 'Bulut Senkronizasyon - Mangile',
  description: 'MyAnimeList, AniList ve MangaDex senkronizasyon yönetimi'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const config = useRuntimeConfig()
const apiBase = String(config.public.backend.baseUrl ?? '')
const { user, isRegistered, fetchSanityUser } = useAuthUser()
const { connectProvider, disconnectProvider, unbindTracker } = useTrackers()

const trackersDoc = ref<UserTrackersDocument | null>(null)
const loading = ref(false)

// Modal management
const activeSeriesModal = ref<{
  id: string
  title: string
  malId?: number
  anilistId?: number
  mangadexId?: string
} | null>(null)
const trackerModalOpen = ref(false)
const mangaDexModalOpen = ref(false)

function onMangaDexConnected() {
  fetchSanityUser(true)
}

async function loadTrackers() {
  if (!user.value?.logtoId) return
  loading.value = true
  try {
    const res = await $fetch<UserTrackersDocument>(
      `${apiBase}/api/user/${user.value.logtoId}/trackers`,
      {
        headers: {
          'X-Logto-Id': user.value.logtoId
        }
      }
    )
    trackersDoc.value = res
  } catch {
    trackersDoc.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Check redirect query params
  if (route.query.connected) {
    const p = String(route.query.connected).toUpperCase()
    toast.add({
      title: 'Bağlantı Başarılı',
      description: `${p} hesabı başarıyla bağlandı.`,
      color: 'success'
    })
    fetchSanityUser(true)
    router.replace({ query: {} })
  } else if (route.query.error) {
    toast.add({
      title: 'Bağlantı Hatası',
      description: String(route.query.error),
      color: 'error'
    })
    router.replace({ query: {} })
  }

  if (user.value?.logtoId) {
    loadTrackers()
  }
})

watch(
  () => user.value?.logtoId,
  (val) => {
    if (val) {
      loadTrackers()
    }
  }
)

async function handleDisconnect(provider: TrackerProvider) {
  await disconnectProvider(provider)
  await fetchSanityUser(true)
}

function openManageSeries(item: NonNullable<UserTrackersDocument['trackers']>[number]) {
  activeSeriesModal.value = {
    id: item.seriesId,
    title: item.seriesTitle || 'Manga',
    malId: item.malId,
    anilistId: item.anilistId,
    mangadexId: item.mangadexId
  }
  trackerModalOpen.value = true
}

async function handleRemoveAll(seriesId: string) {
  await unbindTracker(seriesId, 'mal')
  await unbindTracker(seriesId, 'anilist')
  await unbindTracker(seriesId, 'mangadex')
  await loadTrackers()
}
</script>

<template>
  <div class="min-h-screen py-8 pb-24">
    <UContainer class="max-w-5xl space-y-8">
      <!-- Başlık -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <UIcon
            name="i-lucide-cloud-sync"
            class="size-4"
          />
          Bulut Senkronizasyon
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-foreground">
          MAL, AniList & MangaDex Takibi
        </h1>
        <p class="text-sm text-muted max-w-2xl">
          Okuduğunuz bölümleri MyAnimeList, AniList ve MangaDex hesaplarınıza otomatik yansıtın veya Tachiyomi mantığında dilediğiniz gibi eşleştirin.
        </p>
      </div>

      <!-- Giriş Yapılmamışsa Uyarı Kartı -->
      <div
        v-if="!user || !isRegistered"
        class="p-6 rounded-3xl bg-muted/20 border border-default/20 text-center space-y-4 max-w-lg mx-auto my-12"
      >
        <div class="size-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <UIcon
            name="i-lucide-lock"
            class="size-8"
          />
        </div>
        <div class="space-y-1">
          <h2 class="text-base font-bold text-foreground">
            Senkronizasyon İçin Giriş Yapmalısınız
          </h2>
          <p class="text-xs text-muted leading-relaxed">
            Harici hesaplarınızı bağlamak ve okuma ilerlemenizi senkronize etmek için lütfen oturum açın ve Mangile profilinizi oluşturun.
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
            v-else
            to="/new-user"
            label="Kaydı Tamamla"
            icon="i-lucide-sparkles"
            color="warning"
            class="rounded-xl font-bold"
          />
        </div>
      </div>

      <!-- Giriş Yapılmış Durum -->
      <div
        v-else
        class="space-y-8"
      >
        <!-- 1. Entegrasyonlar Kartları -->
        <div class="space-y-3">
          <h2 class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
            <UIcon
              name="i-lucide-plug"
              class="size-3.5 text-primary"
            />
            Bağlı Hesaplar
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- MyAnimeList -->
            <div class="p-4 rounded-2xl bg-muted/20 border border-default/20 flex flex-col justify-between gap-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <TrackerBrandIcon
                    provider="mal"
                    class="size-6"
                    :show-background="true"
                  />
                  <div>
                    <h3 class="font-bold text-sm text-foreground">
                      MyAnimeList
                    </h3>
                    <p class="text-[11px] text-muted">
                      Manga Listesi & Puan
                    </p>
                  </div>
                </div>
                <UBadge
                  :color="user.integrations?.mal?.accessToken ? 'success' : 'neutral'"
                  size="xs"
                  variant="subtle"
                  class="rounded"
                >
                  {{ user.integrations?.mal?.accessToken ? 'Bağlı' : 'Bağlı Değil' }}
                </UBadge>
              </div>

              <div class="space-y-2">
                <p
                  v-if="!user.integrations?.mal?.accessToken"
                  class="text-[10px] text-muted/80 leading-snug"
                >
                  *Google ile giriş yapıyorsanız önce myanimelist.net üzerinde oturum açmış olun.
                </p>
                <div class="flex items-center justify-end">
                  <UButton
                    v-if="user.integrations?.mal?.accessToken"
                    label="Bağlantıyı Kes"
                    size="xs"
                    color="error"
                    variant="soft"
                    class="rounded-xl font-bold"
                    @click="handleDisconnect('mal')"
                  />
                  <UButton
                    v-else
                    label="Hesabı Bağla"
                    icon="i-lucide-link"
                    size="xs"
                    color="primary"
                    variant="solid"
                    class="rounded-xl font-bold"
                    @click="connectProvider('mal')"
                  />
                </div>
              </div>
            </div>

            <!-- AniList -->
            <div class="p-4 rounded-2xl bg-muted/20 border border-default/20 flex flex-col justify-between gap-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <TrackerBrandIcon
                    provider="anilist"
                    class="size-6"
                    :show-background="true"
                  />
                  <div>
                    <h3 class="font-bold text-sm text-foreground">
                      AniList
                    </h3>
                    <p class="text-[11px] text-muted">
                      Manga Listesi & Durum
                    </p>
                  </div>
                </div>
                <UBadge
                  :color="user.integrations?.anilist?.accessToken ? 'success' : 'neutral'"
                  size="xs"
                  variant="subtle"
                  class="rounded"
                >
                  {{ user.integrations?.anilist?.accessToken ? 'Bağlı' : 'Bağlı Değil' }}
                </UBadge>
              </div>

              <div class="flex items-center justify-end">
                <UButton
                  v-if="user.integrations?.anilist?.accessToken"
                  label="Bağlantıyı Kes"
                  size="xs"
                  color="error"
                  variant="soft"
                  class="rounded-xl font-bold"
                  @click="handleDisconnect('anilist')"
                />
                <UButton
                  v-else
                  label="Hesabı Bağla"
                  icon="i-lucide-link"
                  size="xs"
                  color="primary"
                  variant="solid"
                  class="rounded-xl font-bold"
                  @click="connectProvider('anilist')"
                />
              </div>
            </div>

            <!-- MangaDex -->
            <div class="p-4 rounded-2xl bg-muted/20 border border-default/20 flex flex-col justify-between gap-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <TrackerBrandIcon
                    provider="mangadex"
                    class="size-6"
                    :show-background="true"
                  />
                  <div>
                    <h3 class="font-bold text-sm text-foreground">
                      MangaDex
                    </h3>
                    <p class="text-[11px] text-muted">
                      Okuma Durumu & Puan
                    </p>
                  </div>
                </div>
                <UBadge
                  :color="user.integrations?.mangadex?.accessToken ? 'success' : 'neutral'"
                  size="xs"
                  variant="subtle"
                  class="rounded"
                >
                  {{ user.integrations?.mangadex?.accessToken ? (user.integrations.mangadex.username ? `@${user.integrations.mangadex.username}` : 'Bağlı') : 'Bağlı Değil' }}
                </UBadge>
              </div>

              <div class="flex items-center justify-end">
                <UButton
                  v-if="user.integrations?.mangadex?.accessToken"
                  label="Bağlantıyı Kes"
                  size="xs"
                  color="error"
                  variant="soft"
                  class="rounded-xl font-bold"
                  @click="handleDisconnect('mangadex')"
                />
                <UButton
                  v-else
                  label="Hesabı Bağla"
                  icon="i-lucide-link"
                  size="xs"
                  color="primary"
                  variant="solid"
                  class="rounded-xl font-bold"
                  @click="void (mangaDexModalOpen = true)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Takip Edilen Seriler -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <UIcon
                name="i-lucide-activity"
                class="size-3.5 text-primary"
              />
              Eşleştirilmiş Seriler ({{ trackersDoc?.trackers?.length || 0 }})
            </h2>
            <UButton
              icon="i-lucide-refresh-cw"
              size="xs"
              color="neutral"
              variant="ghost"
              class="rounded-lg"
              :loading="loading"
              @click="loadTrackers"
            />
          </div>

          <div
            v-if="loading"
            class="py-16 flex flex-col items-center justify-center gap-2 text-muted"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="size-6 animate-spin text-primary"
            />
            <span class="text-xs">Seriler yükleniyor...</span>
          </div>

          <div
            v-else-if="trackersDoc?.trackers && trackersDoc.trackers.length > 0"
            class="space-y-2"
          >
            <div
              v-for="item in trackersDoc.trackers"
              :key="item.seriesId"
              class="p-4 rounded-2xl bg-muted/20 border border-default/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-all"
            >
              <div class="space-y-1">
                <NuxtLink
                  :to="`/title/${item.seriesId}`"
                  class="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  {{ item.seriesTitle || item.seriesId }}
                  <UIcon
                    name="i-lucide-external-link"
                    class="size-3 text-muted"
                  />
                </NuxtLink>
                <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <UBadge
                    v-if="item.malId"
                    size="xs"
                    variant="subtle"
                    color="info"
                    class="rounded"
                  >
                    MAL: {{ item.malId }}
                  </UBadge>
                  <UBadge
                    v-if="item.anilistId"
                    size="xs"
                    variant="subtle"
                    color="primary"
                    class="rounded"
                  >
                    AniList: {{ item.anilistId }}
                  </UBadge>
                  <UBadge
                    v-if="item.mangadexId"
                    size="xs"
                    variant="subtle"
                    color="warning"
                    class="rounded"
                  >
                    MangaDex
                  </UBadge>
                  <span
                    v-if="item.lastChapter != null"
                    class="font-medium text-foreground/80"
                  >
                    Son Bölüm: {{ item.lastChapter }}
                  </span>
                  <span
                    v-if="item.lastStatus"
                    class="capitalize"
                  >
                    ({{ item.lastStatus }})
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2 sm:pt-0">
                <UButton
                  label="Düzenle"
                  icon="i-lucide-sliders"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  class="rounded-xl font-bold"
                  @click="openManageSeries(item)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  class="rounded-xl"
                  @click="handleRemoveAll(item.seriesId)"
                />
              </div>
            </div>
          </div>

          <!-- Henüz seri eşleşmemiş -->
          <div
            v-else
            class="py-16 p-6 rounded-3xl bg-muted/15 border border-dashed border-default/20 text-center space-y-3"
          >
            <div class="size-12 rounded-2xl bg-muted/30 text-muted mx-auto flex items-center justify-center">
              <UIcon
                name="i-lucide-bookmark-check"
                class="size-6"
              />
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-foreground">
                Henüz Eşleştirilmiş Seri Yok
              </h3>
              <p class="text-xs text-muted max-w-sm mx-auto">
                Bir seri sayfasına gidip "Takipçiler" butonuna tıklayarak MAL, AniList veya MangaDex ile kolayca eşleştirebilirsiniz.
              </p>
            </div>
            <UButton
              to="/explore"
              label="Serileri Keşfet"
              icon="i-lucide-compass"
              color="primary"
              variant="soft"
              size="xs"
              class="rounded-xl font-bold"
            />
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Tracker Düzenleme Modalı -->
    <TrackerModal
      v-if="activeSeriesModal"
      v-model:open="trackerModalOpen"
      :series-id="activeSeriesModal.id"
      :series-title="activeSeriesModal.title"
      :mal-id="activeSeriesModal.malId"
      :anilist-id="activeSeriesModal.anilistId"
      :mangadex-id="activeSeriesModal.mangadexId"
    />

    <!-- MangaDex Bağlantı Modalı -->
    <TrackerMangaDexConnectModal
      v-model:open="mangaDexModalOpen"
      @connected="onMangaDexConnected"
    />
  </div>
</template>
