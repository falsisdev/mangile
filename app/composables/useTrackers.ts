import { useDebounceFn } from '@vueuse/core'

export type TrackerProvider = 'mal' | 'anilist' | 'mangadex'

export interface TrackerStatus {
  provider: TrackerProvider
  matchedId?: string
  title?: string
  coverImage?: string
  status?: string
  score?: number
  numReadChapters: number
  totalChapters?: number
  url?: string
  isConnected: boolean
}

export interface SeriesAllTrackersStatus {
  seriesId: string
  autoSync: boolean
  trackers: Record<TrackerProvider, TrackerStatus>
}

export interface TrackerSearchResult {
  id: string
  provider: TrackerProvider
  title: string
  romajiTitle?: string
  coverImage?: string
  format?: string
  status?: string
  totalChapters?: number
  year?: number
  url?: string
}

export interface UserTrackersDocument {
  _id?: string
  _type?: string
  updatedAt?: string
  trackers?: Array<{
    seriesId: string
    seriesTitle?: string
    malId?: number
    anilistId?: number
    mangadexId?: string
    autoSync: boolean
    lastSyncedAt?: string
    lastChapter?: number
    lastStatus?: string
  }>
}

export function useTrackers() {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.backend.baseUrl ?? '')
  const { user } = useAuthUser()
  const toast = useToast()

  const cachedStatus = useState<Record<string, SeriesAllTrackersStatus>>(
    'mangile-cached-trackers-status',
    () => ({})
  )
  const loadingSeries = useState<Record<string, boolean>>(
    'mangile-loading-series-trackers',
    () => ({})
  )

  async function fetchSeriesStatus(seriesId: string, force = false): Promise<SeriesAllTrackersStatus | null> {
    if (!user.value?.logtoId || !seriesId) return null

    if (cachedStatus.value[seriesId] && !force) {
      return cachedStatus.value[seriesId]
    }

    loadingSeries.value[seriesId] = true
    try {
      const res = await $fetch<SeriesAllTrackersStatus>(
        `${apiBase}/api/user/${user.value.logtoId}/trackers/${seriesId}/status`,
        {
          headers: {
            'X-Logto-Id': user.value.logtoId
          }
        }
      )
      if (res) {
        cachedStatus.value[seriesId] = res
      }
      return res
    } catch {
      return null
    } finally {
      loadingSeries.value[seriesId] = false
    }
  }

  async function searchTitles(provider: TrackerProvider, query: string): Promise<TrackerSearchResult[]> {
    if (!query.trim()) return []
    try {
      const results = await $fetch<TrackerSearchResult[]>(`${apiBase}/api/tracker/search`, {
        query: {
          provider,
          q: query.trim()
        }
      })
      return results || []
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      toast.add({
        title: 'Arama Hatası',
        description: err?.data?.message || 'Sonuçlar getirilemedi.',
        color: 'error'
      })
      return []
    }
  }

  async function bindTracker(
    seriesId: string,
    seriesTitle: string,
    provider: TrackerProvider,
    matchedId: string,
    globalBind = false
  ): Promise<boolean> {
    if (!user.value?.logtoId) return false

    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/trackers/bind`, {
        method: 'POST',
        headers: {
          'X-Logto-Id': user.value.logtoId
        },
        body: {
          logtoId: user.value.logtoId,
          seriesId,
          seriesTitle,
          provider,
          matchedId,
          globalBind
        }
      })

      // Refresh live status for this series
      await fetchSeriesStatus(seriesId, true)
      toast.add({
        title: 'Eşleştirildi',
        description: 'Takipçi başarıyla bağlandı.',
        color: 'success'
      })
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      toast.add({
        title: 'Eşleştirme Başarısız',
        description: err?.data?.message || 'Eşleştirme kaydedilemedi.',
        color: 'error'
      })
      return false
    }
  }

  async function unbindTracker(seriesId: string, provider: TrackerProvider): Promise<boolean> {
    if (!user.value?.logtoId) return false

    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/trackers/${seriesId}/${provider}`, {
        method: 'DELETE',
        headers: {
          'X-Logto-Id': user.value.logtoId
        }
      })

      // Refresh live status
      await fetchSeriesStatus(seriesId, true)
      toast.add({
        title: 'Bağlantı Kaldırıldı',
        description: 'Takipçi eşleştirmesi kaldırıldı.',
        color: 'neutral'
      })
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      toast.add({
        title: 'Hata',
        description: err?.data?.message || 'İşlem başarısız.',
        color: 'error'
      })
      return false
    }
  }

  async function updateTrackerStatus(
    seriesId: string,
    provider: TrackerProvider,
    status: string,
    chapter: number,
    score: number
  ): Promise<boolean> {
    if (!user.value?.logtoId) return false

    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/trackers/update`, {
        method: 'POST',
        headers: {
          'X-Logto-Id': user.value.logtoId
        },
        body: {
          logtoId: user.value.logtoId,
          seriesId,
          provider,
          status,
          chapter,
          score
        }
      })

      // Refresh live status
      await fetchSeriesStatus(seriesId, true)
      toast.add({
        title: 'Güncellendi',
        description: 'Takipçi durumu güncellendi.',
        color: 'success'
      })
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      toast.add({
        title: 'Güncelleme Hatası',
        description: err?.data?.message || 'Durum güncellenemedi.',
        color: 'error'
      })
      return false
    }
  }

  // Debounced push to backend on chapter completion
  const recordChapterProgress = useDebounceFn(
    async (seriesId: string, chapterNumber: number, totalChapters?: number) => {
      if (!user.value?.logtoId || !seriesId) return

      try {
        await $fetch(`${apiBase}/api/user/${user.value.logtoId}/trackers/progress`, {
          method: 'POST',
          headers: {
            'X-Logto-Id': user.value.logtoId
          },
          body: {
            logtoId: user.value.logtoId,
            seriesId,
            chapterNumber,
            totalChapters
          }
        })
      } catch (e) {
        console.error('[mangile] Tracker progress push failed:', e)
      }
    },
    2000
  )

  async function connectProvider(provider: TrackerProvider): Promise<void> {
    if (!user.value?.logtoId) {
      toast.add({
        title: 'Giriş Gerekli',
        description: 'Hesabınızı bağlamak için lütfen önce giriş yapın.',
        color: 'warning'
      })
      return
    }

    try {
      const res = await $fetch<{ url: string }>(`${apiBase}/api/sync/oauth/${provider}/url`, {
        query: { logtoId: user.value.logtoId }
      })
      if (res?.url) {
        window.location.href = res.url
      }
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      toast.add({
        title: 'Bağlantı Hatası',
        description: err?.data?.message || 'Yetkilendirme bağlantısı alınamadı.',
        color: 'error'
      })
    }
  }

  async function disconnectProvider(provider: TrackerProvider): Promise<boolean> {
    if (!user.value?.logtoId) return false

    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/integrations/${provider}`, {
        method: 'DELETE',
        headers: {
          'X-Logto-Id': user.value.logtoId
        }
      })
      toast.add({
        title: 'Bağlantı Kesildi',
        description: `${provider.toUpperCase()} hesabı bağlantısı başarıyla kesildi.`,
        color: 'neutral'
      })
      return true
    } catch {
      toast.add({
        title: 'Hata',
        description: 'Entegrasyon bağlantısı kesilemedi.',
        color: 'error'
      })
      return false
    }
  }

  async function connectMangaDex(username: string, password: string): Promise<{ success: boolean, error?: string }> {
    if (!user.value?.logtoId) {
      toast.add({
        title: 'Giriş Gerekli',
        description: 'Hesabınızı bağlamak için lütfen önce giriş yapın.',
        color: 'warning'
      })
      return { success: false, error: 'Giriş yapılmalıdır.' }
    }

    try {
      const res = await $fetch<{ success: boolean, username?: string }>(
        `${apiBase}/api/user/${user.value.logtoId}/integrations/mangadex`,
        {
          method: 'POST',
          headers: {
            'X-Logto-Id': user.value.logtoId
          },
          body: {
            username,
            password
          }
        }
      )
      if (res?.success) {
        toast.add({
          title: 'Bağlandı',
          description: `MangaDex hesabı (${res.username || username}) başarıyla bağlandı.`,
          color: 'success'
        })
        return { success: true }
      }
      return { success: false, error: 'Bilinmeyen bir hata oluştu.' }
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      const msg = err?.data?.message || 'MangaDex hesabı doğrulanamadı. Lütfen bilgilerinizi kontrol edin.'
      toast.add({
        title: 'Bağlantı Hatası',
        description: msg,
        color: 'error'
      })
      return { success: false, error: msg }
    }
  }

  return {
    cachedStatus,
    loadingSeries,
    fetchSeriesStatus,
    searchTitles,
    bindTracker,
    unbindTracker,
    updateTrackerStatus,
    recordChapterProgress,
    connectProvider,
    connectMangaDex,
    disconnectProvider
  }
}
