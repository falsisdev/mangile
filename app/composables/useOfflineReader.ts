import { useStorage } from '@vueuse/core'

export interface OfflineChapterItem {
  chapterKey: string
  title?: string
  chapterNumber?: number
  volumeNumber?: number
  mangaTitle: string
  mangaId?: string
  coverImage?: string
  format?: string
  downloadedAt: number
  pageCount: number
  sizeBytes?: number
  pages: { url: string }[]
  chapterData?: Record<string, unknown>
}

const CACHE_NAME = 'mangile-offline-downloads'

export function useOfflineReader() {
  const manifest = useStorage<OfflineChapterItem[]>(
    'mangile-offline-chapters-manifest',
    []
  )

  const downloadProgress = useState<Record<string, number>>(
    'offline-download-progress',
    () => ({})
  )

  const isDownloading = useState<Record<string, boolean>>(
    'offline-is-downloading',
    () => ({})
  )

  const isSupported = computed(() => {
    return import.meta.client && 'caches' in window
  })

  function isChapterDownloaded(chapterKey: string): boolean {
    return manifest.value.some(item => item.chapterKey === chapterKey)
  }

  function getOfflineChapter<T = Record<string, unknown>>(chapterKey: string): T | null {
    const found = manifest.value.find(item => item.chapterKey === chapterKey)
    return (found?.chapterData as T) ?? null
  }

  async function downloadChapter(payload: {
    chapterKey: string
    title?: string
    chapterNumber?: number
    volumeNumber?: number
    mangaTitle: string
    mangaId?: string
    coverImage?: string
    format?: string
    pages: { url: string }[]
    chapterData?: Record<string, unknown>
  }): Promise<boolean> {
    if (!import.meta.client || !('caches' in window)) return false

    const { chapterKey, pages } = payload
    if (!pages || pages.length === 0) return false

    isDownloading.value[chapterKey] = true
    downloadProgress.value[chapterKey] = 0

    try {
      const cache = await caches.open(CACHE_NAME)
      let downloadedBytes = 0

      // Cache the chapter backend JSON if provided
      if (payload.chapterData) {
        const config = useRuntimeConfig()
        const apiUrl = `${config.public.backend.baseUrl}/api/chapter?id=${chapterKey}`
        const jsonBlob = new Blob([JSON.stringify(payload.chapterData)], {
          type: 'application/json'
        })
        const jsonResponse = new Response(jsonBlob, {
          headers: { 'Content-Type': 'application/json' }
        })
        await cache.put(apiUrl, jsonResponse)
      }

      // Download images in controlled concurrency
      const totalPages = pages.length
      let completedPages = 0

      for (const page of pages) {
        if (!page.url) continue
        try {
          const req = new Request(page.url, { mode: 'cors' })
          let res = await fetch(req)
          if (!res.ok) {
            // Fallback for CDNs without permissive CORS headers
            res = await fetch(page.url, { mode: 'no-cors' })
          }
          await cache.put(page.url, res)
          downloadedBytes += 150 * 1024 // Estimated ~150KB per page if opaque
        } catch {
          // Attempt no-cors fetch on network edge cases
          try {
            const noCorsRes = await fetch(page.url, { mode: 'no-cors' })
            await cache.put(page.url, noCorsRes)
          } catch {
            // Continue with other pages if one fails
          }
        }

        completedPages++
        downloadProgress.value[chapterKey] = Math.round(
          (completedPages / totalPages) * 100
        )
      }

      // Update manifest
      const existingIndex = manifest.value.findIndex(
        item => item.chapterKey === chapterKey
      )
      const newItem: OfflineChapterItem = {
        chapterKey: payload.chapterKey,
        title: payload.title,
        chapterNumber: payload.chapterNumber,
        volumeNumber: payload.volumeNumber,
        mangaTitle: payload.mangaTitle,
        mangaId: payload.mangaId,
        coverImage: payload.coverImage,
        format: payload.format,
        downloadedAt: Date.now(),
        pageCount: pages.length,
        sizeBytes: downloadedBytes,
        pages: payload.pages,
        chapterData: payload.chapterData
      }

      if (existingIndex >= 0) {
        manifest.value[existingIndex] = newItem
      } else {
        manifest.value.unshift(newItem)
      }

      return true
    } catch {
      return false
    } finally {
      isDownloading.value[chapterKey] = false
      downloadProgress.value[chapterKey] = 100
    }
  }

  async function removeChapter(chapterKey: string): Promise<void> {
    if (!import.meta.client || !('caches' in window)) return

    const item = manifest.value.find(c => c.chapterKey === chapterKey)
    if (item) {
      try {
        const cache = await caches.open(CACHE_NAME)
        for (const page of item.pages) {
          if (page.url) {
            await cache.delete(page.url)
          }
        }
        const config = useRuntimeConfig()
        const apiUrl = `${config.public.backend.baseUrl}/api/chapter?id=${chapterKey}`
        await cache.delete(apiUrl)
      } catch {
        // Cache cleanup best-effort
      }
    }

    manifest.value = manifest.value.filter(c => c.chapterKey !== chapterKey)
  }

  async function clearAll(): Promise<void> {
    if (!import.meta.client || !('caches' in window)) return

    try {
      await caches.delete(CACHE_NAME)
    } catch {
      // Best-effort
    }

    manifest.value = []
  }

  return {
    isSupported,
    manifest,
    downloadProgress,
    isDownloading,
    isChapterDownloaded,
    getOfflineChapter,
    downloadChapter,
    removeChapter,
    clearAll
  }
}
