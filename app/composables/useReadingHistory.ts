import { useDebounceFn, useStorage } from '@vueuse/core'

export interface ReadingHistoryItem {
  seriesId: string
  seriesTitle: string
  seriesType: 'manga' | 'lightNovel'
  seriesFormat?: string
  coverUrl?: string
  chapterId: string
  chapterNumber: number
  volumeNumber?: number
  chapterTitle?: string
  currentPage?: number
  totalPages?: number
  progress?: number
  readAt: string
}

interface CloudHistoryResponse {
  _id?: string
  _type?: string
  updatedAt?: string
  items?: ReadingHistoryItem[]
}

export const MAX_LOCAL_HISTORY_ITEMS = 5
export const MAX_CLOUD_HISTORY_ITEMS = 100

export function useReadingHistory() {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.backend.baseUrl ?? '')
  const { user } = useAuthUser()

  const localHistory = useStorage<ReadingHistoryItem[]>(
    'mangile-local-reading-history-v1',
    []
  )

  const cloudHistory = useState<ReadingHistoryItem[]>(
    'mangile-cloud-reading-history-v1',
    () => []
  )
  const isLoadingCloud = useState<boolean>('mangile-cloud-history-loading', () => false)
  const hasLoadedCloud = useState<boolean>('mangile-cloud-history-loaded', () => false)

  async function fetchCloudHistory(force = false): Promise<ReadingHistoryItem[]> {
    if (!user.value?.logtoId) {
      cloudHistory.value = []
      hasLoadedCloud.value = false
      return []
    }

    if (hasLoadedCloud.value && !force) {
      return cloudHistory.value
    }

    isLoadingCloud.value = true
    try {
      const res = await $fetch<CloudHistoryResponse>(
        `${apiBase}/api/user/${user.value.logtoId}/history`,
        {
          headers: {
            'X-Logto-Id': user.value.logtoId
          }
        }
      )
      cloudHistory.value = res.items ?? []
      hasLoadedCloud.value = true
      return cloudHistory.value
    } catch {
      cloudHistory.value = []
      return []
    } finally {
      isLoadingCloud.value = false
    }
  }

  // Debounced cloud upsert to avoid spamming the backend during scrolling or rapid page turns
  const sendCloudUpsert = useDebounceFn(async (item: ReadingHistoryItem) => {
    if (!user.value?.logtoId) return
    try {
      const res = await $fetch<CloudHistoryResponse>(
        `${apiBase}/api/user/${user.value.logtoId}/history`,
        {
          method: 'POST',
          headers: {
            'X-Logto-Id': user.value.logtoId
          },
          body: {
            logtoId: user.value.logtoId,
            item
          }
        }
      )
      if (res.items) {
        cloudHistory.value = res.items
      }
    } catch (e) {
      console.error('[mangile] Cloud history upsert failed:', e)
    }
  }, 2500)

  function recordProgress(data: Omit<ReadingHistoryItem, 'readAt'> & { readAt?: string }) {
    const item: ReadingHistoryItem = {
      ...data,
      readAt: data.readAt || new Date().toISOString()
    }

    // 1. Update Local History (Instant, optimistic, limited to 5)
    const currentLocal = Array.isArray(localHistory.value) ? [...localHistory.value] : []
    const filteredLocal = currentLocal.filter(h => h.seriesId !== item.seriesId)
    filteredLocal.unshift(item)
    if (filteredLocal.length > MAX_LOCAL_HISTORY_ITEMS) {
      filteredLocal.length = MAX_LOCAL_HISTORY_ITEMS
    }
    localHistory.value = filteredLocal

    // 2. Update Cloud History if logged in (limited to 100)
    if (user.value?.logtoId) {
      const currentCloud = Array.isArray(cloudHistory.value) ? [...cloudHistory.value] : []
      const filteredCloud = currentCloud.filter(h => h.seriesId !== item.seriesId)
      filteredCloud.unshift(item)
      if (filteredCloud.length > MAX_CLOUD_HISTORY_ITEMS) {
        filteredCloud.length = MAX_CLOUD_HISTORY_ITEMS
      }
      cloudHistory.value = filteredCloud

      sendCloudUpsert(item)
    }
  }

  function deleteLocalItem(seriesId: string) {
    if (!Array.isArray(localHistory.value)) return
    localHistory.value = localHistory.value.filter(h => h.seriesId !== seriesId)
  }

  async function deleteCloudItem(seriesId: string): Promise<boolean> {
    if (!user.value?.logtoId) return false
    cloudHistory.value = cloudHistory.value.filter(h => h.seriesId !== seriesId)
    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/history/${seriesId}`, {
        method: 'DELETE',
        headers: {
          'X-Logto-Id': user.value.logtoId
        }
      })
      return true
    } catch (e) {
      console.error('[mangile] Cloud item deletion failed:', e)
      return false
    }
  }

  function clearLocalHistory() {
    localHistory.value = []
  }

  async function clearCloudHistory(): Promise<boolean> {
    if (!user.value?.logtoId) return false
    cloudHistory.value = []
    try {
      await $fetch(`${apiBase}/api/user/${user.value.logtoId}/history`, {
        method: 'DELETE',
        headers: {
          'X-Logto-Id': user.value.logtoId
        }
      })
      return true
    } catch (e) {
      console.error('[mangile] Cloud history clear failed:', e)
      return false
    }
  }

  async function copyLocalToCloud(): Promise<boolean> {
    if (!user.value?.logtoId) return false
    const itemsToSync = Array.isArray(localHistory.value) ? localHistory.value : []
    if (itemsToSync.length === 0) return true

    isLoadingCloud.value = true
    try {
      const res = await $fetch<CloudHistoryResponse>(
        `${apiBase}/api/user/${user.value.logtoId}/history/sync`,
        {
          method: 'POST',
          headers: {
            'X-Logto-Id': user.value.logtoId
          },
          body: {
            logtoId: user.value.logtoId,
            items: itemsToSync
          }
        }
      )
      if (res.items) {
        cloudHistory.value = res.items
      }
      return true
    } catch (e) {
      console.error('[mangile] Copy local to cloud failed:', e)
      return false
    } finally {
      isLoadingCloud.value = false
    }
  }

  function copyCloudToLocal(): boolean {
    const cloudItems = Array.isArray(cloudHistory.value) ? cloudHistory.value : []
    if (cloudItems.length === 0) return true

    const seriesMap = new Map<string, ReadingHistoryItem>()
    const currentLocal = Array.isArray(localHistory.value) ? localHistory.value : []

    // Add local first
    for (const it of currentLocal) {
      if (it.seriesId) seriesMap.set(it.seriesId, it)
    }

    // Merge cloud
    for (const it of cloudItems) {
      if (!it.seriesId) continue
      const existing = seriesMap.get(it.seriesId)
      if (existing) {
        if (it.readAt > existing.readAt) {
          seriesMap.set(it.seriesId, it)
        }
      } else {
        seriesMap.set(it.seriesId, it)
      }
    }

    const merged = Array.from(seriesMap.values())
    merged.sort((a, b) => (b.readAt > a.readAt ? 1 : -1))
    if (merged.length > MAX_LOCAL_HISTORY_ITEMS) {
      merged.length = MAX_LOCAL_HISTORY_ITEMS
    }

    localHistory.value = merged
    return true
  }

  // Auto-fetch cloud history on mount when user is authenticated
  if (import.meta.client && user.value?.logtoId && !hasLoadedCloud.value && !isLoadingCloud.value) {
    fetchCloudHistory()
  }

  return {
    localHistory,
    cloudHistory,
    isLoadingCloud,
    hasLoadedCloud,
    fetchCloudHistory,
    recordProgress,
    deleteLocalItem,
    deleteCloudItem,
    clearLocalHistory,
    clearCloudHistory,
    copyLocalToCloud,
    copyCloudToLocal
  }
}
