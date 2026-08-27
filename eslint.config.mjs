// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Sanity CMS üzerinden gelen güvenli içerik için gerekli
    'vue/no-v-html': 'off'
  }
})
