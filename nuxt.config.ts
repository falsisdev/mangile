// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@logto/nuxt',
    '@nuxtjs/device',
    'nuxt-swiper'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      backend: {
        baseUrl: import.meta.env.NUXT_BACKENDBASE
      },
      sanity: {
        projectId: import.meta.env.NUXT_SANITY_PROJECTID,
        dataset: import.meta.env.NUXT_SANITY_DATASET
      }
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
