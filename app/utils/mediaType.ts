export interface MediaSourceInfo {
  _type?: string
  format?: string
  tags?: string[]
  externalMal?: {
    type?: string
    [key: string]: unknown
  } | null
  externalAnilist?: {
    countryOfOrigin?: string
    format?: string
    tags?: Array<{ name?: string } | string>
    [key: string]: unknown
  } | null
}

/**
 * Detects the user-facing media type string (e.g. 'Manhwa', 'Manhua', 'Manga', 'Hafif Roman')
 * based on Sanity format, MAL type, AniList country of origin and tags.
 */
export function detectMediaType(info: MediaSourceInfo | null | undefined): string {
  if (!info) return 'Manga'

  // 1. Check direct format field
  const rawFormat = (info.format || '').toLowerCase().trim()
  if (rawFormat === 'manhwa' || rawFormat === 'webtoon') return 'Manhwa'
  if (rawFormat === 'manhua') return 'Manhua'
  if (rawFormat === 'novel' || rawFormat === 'lightnovel' || rawFormat === 'light_novel') return 'Hafif Roman'

  // 2. Check MAL type
  const malType = (info.externalMal?.type || '').toLowerCase().trim()
  if (malType === 'manhwa') return 'Manhwa'
  if (malType === 'manhua') return 'Manhua'
  if (malType === 'light novel' || malType === 'novel') return 'Hafif Roman'

  // 3. Check AniList country of origin (KR -> Manhwa, CN -> Manhua, JP -> Manga)
  const country = (info.externalAnilist?.countryOfOrigin || '').toUpperCase().trim()
  if (country === 'KR') return 'Manhwa'
  if (country === 'CN' || country === 'TW' || country === 'HK') return 'Manhua'

  // 4. Check Tags
  const tagList = Array.isArray(info.tags) ? info.tags : []
  for (const tag of tagList) {
    const t = String(tag).toLowerCase().trim()
    if (t === 'manhwa' || t === 'webtoon' || t === 'web comic' || t === 'long strip') return 'Manhwa'
    if (t === 'manhua') return 'Manhua'
  }

  // 5. Check AniList tags
  const anilistTags = info.externalAnilist?.tags || []
  for (const tag of anilistTags) {
    const name = (typeof tag === 'string' ? tag : tag?.name || '').toLowerCase().trim()
    if (name === 'webtoon' || name === 'long strip') return 'Manhwa'
  }

  // 6. Check base _type
  if (info._type === 'lightNovel') return 'Hafif Roman'

  return 'Manga'
}

/**
 * Checks if the media is a Webtoon / Manhwa / Long-strip comic format
 * that should default to vertical continuous/webtoon reading mode.
 */
export function isWebtoonFormat(info: {
  format?: string
  tags?: string[]
  countryOfOrigin?: string
  malType?: string
  titleType?: string
} | null | undefined): boolean {
  if (!info) return false

  const format = (info.format || '').toLowerCase().trim()
  if (format === 'manhwa' || format === 'webtoon' || format === 'long strip') return true
  if (format === 'manhua') return true

  const malType = (info.malType || '').toLowerCase().trim()
  if (malType === 'manhwa' || malType === 'manhua') return true

  const country = (info.countryOfOrigin || '').toUpperCase().trim()
  if (country === 'KR' || country === 'CN') return true

  const tags = info.tags || []
  for (const tag of tags) {
    const t = String(tag).toLowerCase().trim()
    if (t === 'manhwa' || t === 'webtoon' || t === 'long strip' || t === 'web comic') return true
  }

  const titleType = (info.titleType || '').toLowerCase().trim()
  if (titleType === 'manhwa' || titleType === 'webtoon') return true

  return false
}
