import { useStorage } from '@vueuse/core'
import {
  clampGlassIntensity,
  computeGlassCssVariables,
  DEFAULT_GLASS_INTENSITY,
  detectOsThemeFromSignals,
  isValidAccentPreference,
  isValidNeutralPreference,
  isValidOsPreference,
  isValidOsThemeId,
  OS_THEME_LABELS,
  OS_THEME_SUBTITLES,
  resolveNeutralColorForTheme,
  resolvePrimaryColorForTheme,
  resolveThemeColorMeta
} from '~/utils/osTheme'
import type {
  AccentThemePreference,
  NeutralThemePreference,
  OsThemeId,
  OsThemePreference
} from '~/utils/osTheme'

export function useOsTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()

  const ssrDetectedOs = useState<OsThemeId>('mangile-ssr-detected-os', () => {
    if (import.meta.server) {
      const headers = useRequestHeaders(['user-agent', 'sec-ch-ua-platform'])
      return detectOsThemeFromSignals(
        headers['user-agent'],
        headers['sec-ch-ua-platform'],
        0
      )
    }
    if (import.meta.client) {
      const fromDataset = document.documentElement.dataset.detectedOs
      if (isValidOsThemeId(fromDataset)) {
        return fromDataset
      }
      return detectOsThemeFromSignals(
        navigator.userAgent,
        navigator.platform,
        navigator.maxTouchPoints
      )
    }
    return 'material3'
  })

  const osPreference = useStorage<OsThemePreference>('mangile-os-theme', 'auto')
  const accentPreference = useStorage<AccentThemePreference>('mangile-accent-theme', 'os-default')
  const neutralPreference = useStorage<NeutralThemePreference>('mangile-neutral-theme', 'os-default')
  const glassIntensity = useStorage<number>('mangile-glass-intensity', DEFAULT_GLASS_INTENSITY)

  const detectedOs = computed<OsThemeId>(() => ssrDetectedOs.value)

  const resolvedOsTheme = computed<OsThemeId>(() => {
    const pref = osPreference.value
    if (pref !== 'auto' && isValidOsThemeId(pref)) {
      return pref
    }
    return detectedOs.value
  })

  const resolvedOsLabel = computed(() => OS_THEME_LABELS[resolvedOsTheme.value])
  const resolvedOsSubtitle = computed(() => OS_THEME_SUBTITLES[resolvedOsTheme.value])
  const detectedOsLabel = computed(() => OS_THEME_LABELS[detectedOs.value])

  const isAppleTheme = computed(
    () => resolvedOsTheme.value === 'ios27' || resolvedOsTheme.value === 'macos27'
  )

  function setOsPreference(next: OsThemePreference) {
    if (isValidOsPreference(next)) {
      osPreference.value = next
    }
  }

  function setAccentPreference(next: AccentThemePreference) {
    if (isValidAccentPreference(next)) {
      accentPreference.value = next
    }
  }

  function setNeutralPreference(next: NeutralThemePreference) {
    if (isValidNeutralPreference(next)) {
      neutralPreference.value = next
    }
  }

  function setGlassIntensity(next: number) {
    glassIntensity.value = clampGlassIntensity(next)
  }

  function resetAllThemePreferences() {
    osPreference.value = 'auto'
    accentPreference.value = 'os-default'
    neutralPreference.value = 'os-default'
    glassIntensity.value = DEFAULT_GLASS_INTENSITY
  }

  function syncThemeStateToDom() {
    const activeOs = resolvedOsTheme.value
    const activeAccent = isValidAccentPreference(accentPreference.value)
      ? accentPreference.value
      : 'os-default'
    const activeNeutral = isValidNeutralPreference(neutralPreference.value)
      ? neutralPreference.value
      : 'os-default'
    const clampedGlass = clampGlassIntensity(glassIntensity.value)

    if (appConfig.ui?.colors) {
      appConfig.ui.colors.primary = resolvePrimaryColorForTheme(activeOs, activeAccent)
      appConfig.ui.colors.neutral = resolveNeutralColorForTheme(activeOs, activeNeutral)
    }

    if (import.meta.client) {
      const root = document.documentElement
      root.dataset.osTheme = activeOs
      root.dataset.detectedOs = detectedOs.value
      root.dataset.accent = activeAccent
      root.dataset.neutral = activeNeutral
      const glassVars = computeGlassCssVariables(clampedGlass)
      root.style.setProperty('--os-glass-surface-mix', glassVars.surfaceMix)
      root.style.setProperty('--os-glass-card-mix', glassVars.cardMix)
      root.style.setProperty('--os-glass-blur-px', glassVars.blurPx)
      root.style.setProperty('--os-glass-saturate', glassVars.saturatePct)
    }
  }

  watch(
    [resolvedOsTheme, accentPreference, neutralPreference, glassIntensity],
    () => {
      syncThemeStateToDom()
    },
    { immediate: true }
  )

  if (import.meta.client) {
    onMounted(() => {
      const clientDetected = detectOsThemeFromSignals(
        navigator.userAgent,
        navigator.platform,
        navigator.maxTouchPoints
      )
      if (ssrDetectedOs.value !== clientDetected) {
        ssrDetectedOs.value = clientDetected
      }
      if (!isValidOsPreference(osPreference.value)) {
        osPreference.value = 'auto'
      }
      if (!isValidAccentPreference(accentPreference.value)) {
        accentPreference.value = 'os-default'
      }
      if (!isValidNeutralPreference(neutralPreference.value)) {
        neutralPreference.value = 'os-default'
      }
      glassIntensity.value = clampGlassIntensity(glassIntensity.value)
      syncThemeStateToDom()
    })
  }

  const themeColorHex = computed(() =>
    resolveThemeColorMeta(resolvedOsTheme.value, colorMode.value === 'dark')
  )

  return {
    osPreference,
    detectedOs,
    detectedOsLabel,
    resolvedOsTheme,
    resolvedOsLabel,
    resolvedOsSubtitle,
    accentPreference,
    neutralPreference,
    glassIntensity,
    isAppleTheme,
    themeColorHex,
    setOsPreference,
    setAccentPreference,
    setNeutralPreference,
    setGlassIntensity,
    resetAllThemePreferences
  }
}
