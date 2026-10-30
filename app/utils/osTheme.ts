export type OsThemeId = 'ios27' | 'macos27' | 'fluent2' | 'material3'

export type OsThemePreference = 'auto' | OsThemeId

export type AccentThemePreference
  = | 'os-default'
    | 'monochrome'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'emerald'
    | 'rose'
    | 'amber'

export type NeutralThemePreference
  = | 'os-default'
    | 'mist'
    | 'slate'
    | 'zinc'
    | 'stone'
    | 'mauve'
    | 'olive'
    | 'taupe'
    | 'gray'
    | 'neutral'

export interface OsThemeOption {
  value: OsThemePreference
  label: string
  shortLabel: string
  subtitle: string
  icon: string
}

export interface AccentThemeOption {
  value: AccentThemePreference
  label: string
  swatch: string
}

export interface NeutralThemeOption {
  value: NeutralThemePreference
  label: string
}

export interface GlassIntensityPreset {
  value: number
  label: string
}

export const DEFAULT_GLASS_INTENSITY = 70

export const GLASS_INTENSITY_PRESETS: readonly GlassIntensityPreset[] = [
  { value: 0, label: 'Mat' },
  { value: 35, label: 'Az' },
  { value: 70, label: 'Dengeli' },
  { value: 100, label: 'Yoğun' }
] as const

export const OS_THEME_LABELS: Record<OsThemeId, string> = {
  ios27: 'iOS & iPadOS 27',
  macos27: 'macOS 27',
  fluent2: 'Fluent 2',
  material3: 'Material 3'
}

export const OS_THEME_SUBTITLES: Record<OsThemeId, string> = {
  ios27: 'Liquid Glass • Dokunmatik',
  macos27: 'Liquid Glass • Masaüstü',
  fluent2: 'Windows 11 • Mica & Acrylic',
  material3: 'Android & Linux • Tonal'
}

export const OS_THEME_OPTIONS: readonly OsThemeOption[] = [
  {
    value: 'auto',
    label: 'Otomatik (Cihazım)',
    shortLabel: 'Otomatik',
    subtitle: 'İşletim sistemine göre seçilir',
    icon: 'i-lucide-sparkles'
  },
  {
    value: 'ios27',
    label: 'iOS & iPadOS 27',
    shortLabel: 'iOS 27',
    subtitle: 'Liquid Glass kapsül ve katmanlar',
    icon: 'i-lucide-smartphone'
  },
  {
    value: 'macos27',
    label: 'macOS 27',
    shortLabel: 'macOS 27',
    subtitle: 'Yüzen cam ada ve araç çubuğu',
    icon: 'i-lucide-laptop'
  },
  {
    value: 'fluent2',
    label: 'Fluent 2 Web',
    shortLabel: 'Fluent 2',
    subtitle: 'Windows 11 Mica ve keskin hatlar',
    icon: 'i-lucide-monitor'
  },
  {
    value: 'material3',
    label: 'Material 3',
    shortLabel: 'Material 3',
    subtitle: 'Tonal yüzeyler ve hap kontroller',
    icon: 'i-lucide-layers'
  }
] as const

export const ACCENT_THEME_OPTIONS: readonly AccentThemeOption[] = [
  { value: 'os-default', label: 'Sistem', swatch: 'bg-linear-to-br from-white via-zinc-300 to-zinc-900 border border-white/30' },
  { value: 'monochrome', label: 'Beyaz / Monokrom', swatch: 'bg-white border border-zinc-400/50' },
  { value: 'indigo', label: 'Çivit', swatch: 'bg-indigo-500' },
  { value: 'blue', label: 'Mavi', swatch: 'bg-blue-500' },
  { value: 'violet', label: 'Mor', swatch: 'bg-violet-500' },
  { value: 'emerald', label: 'Zümrüt', swatch: 'bg-emerald-500' },
  { value: 'rose', label: 'Gül', swatch: 'bg-rose-500' },
  { value: 'amber', label: 'Kehribar', swatch: 'bg-amber-500' }
] as const

export const NEUTRAL_THEME_OPTIONS: readonly NeutralThemeOption[] = [
  { value: 'os-default', label: 'Sistem' },
  { value: 'mist', label: 'Duman' },
  { value: 'slate', label: 'Arduvaz' },
  { value: 'zinc', label: 'Çinko' },
  { value: 'stone', label: 'Kaya' },
  { value: 'mauve', label: 'Leylak' },
  { value: 'olive', label: 'Zeytin' },
  { value: 'taupe', label: 'Boz' },
  { value: 'gray', label: 'Kır' },
  { value: 'neutral', label: 'Yavan' }
] as const

const VALID_OS_THEMES = new Set<string>(['ios27', 'macos27', 'fluent2', 'material3'])
const VALID_ACCENT_THEMES = new Set<string>([
  'os-default',
  'monochrome',
  'blue',
  'indigo',
  'violet',
  'emerald',
  'rose',
  'amber'
])
const VALID_NEUTRAL_THEMES = new Set<string>([
  'os-default',
  'mist',
  'slate',
  'zinc',
  'stone',
  'mauve',
  'olive',
  'taupe',
  'gray',
  'neutral'
])

export function isValidOsThemeId(val: unknown): val is OsThemeId {
  return typeof val === 'string' && VALID_OS_THEMES.has(val)
}

export function isValidOsPreference(val: unknown): val is OsThemePreference {
  return val === 'auto' || isValidOsThemeId(val)
}

export function isValidAccentPreference(val: unknown): val is AccentThemePreference {
  return typeof val === 'string' && VALID_ACCENT_THEMES.has(val)
}

export function isValidNeutralPreference(val: unknown): val is NeutralThemePreference {
  return typeof val === 'string' && VALID_NEUTRAL_THEMES.has(val)
}

export function clampGlassIntensity(val: unknown): number {
  const num = typeof val === 'number' ? val : Number(val)
  if (Number.isNaN(num)) {
    return DEFAULT_GLASS_INTENSITY
  }
  return Math.max(0, Math.min(100, Math.round(num)))
}

export function computeGlassCssVariables(intensity: number) {
  const x = clampGlassIntensity(intensity)
  const surfaceMix = Math.round(100 - x * 0.62)
  const cardMix = Math.round(100 - x * 0.45)
  const blurPx = Math.round(x * 0.36)
  const saturatePct = Math.round(100 + x * 1.1)
  return {
    surfaceMix: `${surfaceMix}%`,
    cardMix: `${cardMix}%`,
    blurPx: `${blurPx}px`,
    saturatePct: `${saturatePct}%`
  }
}

export function detectOsThemeFromSignals(
  userAgent?: string | null,
  secChPlatform?: string | null,
  maxTouchPoints?: number
): OsThemeId {
  const ua = (userAgent || '').toLowerCase()
  const platform = (secChPlatform || '').replaceAll('"', '').toLowerCase()
  const touchPoints = maxTouchPoints ?? 0

  if (
    platform.includes('ios')
    || platform.includes('ipad')
    || /iphone|ipad|ipod/.test(ua)
  ) {
    return 'ios27'
  }

  if (platform.includes('mac') || /macintosh|mac os x/.test(ua)) {
    if (touchPoints > 1) {
      return 'ios27'
    }
    return 'macos27'
  }

  if (platform.includes('win') || /windows|win32|win64|wow64/.test(ua)) {
    return 'fluent2'
  }

  return 'material3'
}

export function resolvePrimaryColorForTheme(
  osTheme: OsThemeId,
  accent: AccentThemePreference
): 'blue' | 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'green' {
  if (
    accent === 'blue'
    || accent === 'indigo'
    || accent === 'violet'
    || accent === 'emerald'
    || accent === 'rose'
    || accent === 'amber'
  ) {
    return accent
  }
  if (accent === 'os-default' && osTheme === 'material3') {
    return 'indigo'
  }
  return 'indigo'
}

export function resolveNeutralColorForTheme(
  osTheme: OsThemeId,
  neutral: NeutralThemePreference
): 'mist' | 'slate' | 'zinc' | 'stone' | 'mauve' | 'olive' | 'taupe' | 'gray' | 'neutral' {
  if (neutral !== 'os-default') {
    return neutral
  }
  if (osTheme === 'ios27' || osTheme === 'macos27') {
    return 'zinc'
  }
  if (osTheme === 'fluent2') {
    return 'neutral'
  }
  return 'slate'
}

export function resolveThemeColorMeta(osTheme: OsThemeId, isDark: boolean): string {
  if (!isDark) {
    switch (osTheme) {
      case 'ios27':
        return '#F4F4F5'
      case 'macos27':
        return '#F4F4F5'
      case 'fluent2':
        return '#F5F5F5'
      case 'material3':
      default:
        return '#F8FAFC'
    }
  }
  switch (osTheme) {
    case 'ios27':
      return '#09090B'
    case 'macos27':
      return '#09090B'
    case 'fluent2':
      return '#0A0A0A'
    case 'material3':
    default:
      return '#0F172A'
  }
}

export const OS_THEME_BOOTSTRAP_SCRIPT = `(function(){try{var d=document.documentElement,u=(navigator.userAgent||'').toLowerCase(),p=(navigator.platform||'').toLowerCase(),t=navigator.maxTouchPoints||0,det='material3';if(/iphone|ipad|ipod/.test(u)||/iphone|ipad|ipod/.test(p)){det='ios27'}else if(/mac/.test(p)||/macintosh|mac os x/.test(u)){det=t>1?'ios27':'macos27'}else if(/win/.test(p)||/windows/.test(u)){det='fluent2'}var pref=localStorage.getItem('mangile-os-theme')||'auto';var os=(pref==='ios27'||pref==='macos27'||pref==='fluent2'||pref==='material3')?pref:det;var acc=localStorage.getItem('mangile-accent-theme')||'os-default';var neu=localStorage.getItem('mangile-neutral-theme')||'os-default';var rawG= Number(localStorage.getItem('mangile-glass-intensity')??70);var g=isNaN(rawG)?70:Math.max(0,Math.min(100,Math.round(rawG)));d.dataset.detectedOs=det;d.dataset.osTheme=os;d.dataset.accent=acc;d.dataset.neutral=neu;d.style.setProperty('--os-glass-surface-mix',Math.round(100-g*0.62)+'%');d.style.setProperty('--os-glass-card-mix',Math.round(100-g*0.45)+'%');d.style.setProperty('--os-glass-blur-px',Math.round(g*0.36)+'px');d.style.setProperty('--os-glass-saturate',Math.round(100+g*1.1)+'%')}catch(e){}})();`
