export const formatTimeAgo = (dateString?: string | null) => {
  if (!dateString) return 'bilinmiyor'

  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((Number(now) - Number(date)) / 1000)

  const intervals: Record<string, number> = {
    yıl: 31536000,
    ay: 2592000,
    hafta: 604800,
    gün: 86400,
    saat: 3600,
    dakika: 60
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit} önce`
    }
  }

  return 'az önce'
}
