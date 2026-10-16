import { useStorage } from '@vueuse/core'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePwaInstall() {
  const installEvent = useState<BeforeInstallPromptEvent | null>(
    'pwa-install-event',
    () => null
  )
  const isInstalled = useState<boolean>('pwa-is-installed', () => false)
  const isIOS = useState<boolean>('pwa-is-ios', () => false)
  const showIOSGuide = ref(false)

  const isBannerDismissed = useStorage('mangile-pwa-banner-dismissed', false)

  if (import.meta.client) {
    onMounted(() => {
      // Standalone check
      const isStandalone
        = window.matchMedia('(display-mode: standalone)').matches
          || ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)

      isInstalled.value = !!isStandalone

      // iOS Safari check
      const ua = window.navigator.userAgent.toLowerCase()
      const isAppleMobile = /iphone|ipad|ipod/.test(ua)
      const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edgios/.test(ua)
      isIOS.value = isAppleMobile && isSafari && !isStandalone

      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault()
        installEvent.value = e as BeforeInstallPromptEvent
      })

      window.addEventListener('appinstalled', () => {
        isInstalled.value = true
        installEvent.value = null
      })
    })
  }

  const canInstall = computed(() => {
    if (isInstalled.value) return false
    return !!installEvent.value || isIOS.value
  })

  async function promptInstall(): Promise<'accepted' | 'dismissed' | 'ios' | 'unsupported'> {
    if (isIOS.value) {
      showIOSGuide.value = true
      return 'ios'
    }

    if (!installEvent.value) {
      return 'unsupported'
    }

    await installEvent.value.prompt()
    const choice = await installEvent.value.userChoice

    if (choice.outcome === 'accepted') {
      isInstalled.value = true
      installEvent.value = null
    }

    return choice.outcome
  }

  function dismissBanner() {
    isBannerDismissed.value = true
  }

  return {
    canInstall,
    isInstalled,
    isIOS,
    showIOSGuide,
    isBannerDismissed,
    promptInstall,
    dismissBanner
  }
}
