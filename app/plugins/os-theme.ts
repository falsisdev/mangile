import { detectOsThemeFromSignals, OS_THEME_BOOTSTRAP_SCRIPT } from '~/utils/osTheme'

export default defineNuxtPlugin(() => {
  const headers = import.meta.server
    ? useRequestHeaders(['user-agent', 'sec-ch-ua-platform'])
    : {}

  const initialOs = import.meta.server
    ? detectOsThemeFromSignals(
        headers['user-agent'],
        headers['sec-ch-ua-platform'],
        0
      )
    : undefined

  useHead({
    htmlAttrs: import.meta.server && initialOs
      ? {
          'data-os-theme': initialOs,
          'data-detected-os': initialOs,
          'data-accent': 'os-default',
          'data-neutral': 'os-default'
        }
      : {},
    script: [
      {
        key: 'mangile-os-theme-bootstrap',
        innerHTML: OS_THEME_BOOTSTRAP_SCRIPT,
        tagPosition: 'head',
        tagPriority: 'critical'
      }
    ]
  })
})
