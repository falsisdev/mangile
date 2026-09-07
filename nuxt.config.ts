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
    logto: {
      endpoint:
        import.meta.env.NUXT_LOGTO_ENDPOINT
          || 'https://c8w7as.logto.app/',
      appId:
        import.meta.env.NUXT_LOGTO_APP_ID
          || import.meta.env.NUXT_LOGTO_APPID
          || '',
      appSecret:
        import.meta.env.NUXT_LOGTO_APP_SECRET
          || import.meta.env.NUXT_LOGTO_APPSECRET
          || '',
      cookieEncryptionKey:
        import.meta.env.NUXT_LOGTO_COOKIE_ENCRYPTION_KEY
          || '',
      customRedirectBaseUrl:
        import.meta.env.NUXT_LOGTO_CUSTOM_REDIRECT_BASE_URL
          || ''
    },
    sanityToken:
      import.meta.env.NUXT_SANITY_TOKEN
        || '',
    public: {
      backend: {
        baseUrl:
          import.meta.env.NUXT_PUBLIC_BACKEND_BASEURL
            || import.meta.env.NUXT_BACKENDBASE
      },
      sanity: {
        projectId:
          import.meta.env.NUXT_PUBLIC_SANITY_PROJECT_ID
            || import.meta.env.NUXT_SANITY_PROJECT_ID
            || '1yge7tlr',
        dataset:
          import.meta.env.NUXT_PUBLIC_SANITY_DATASET
            || import.meta.env.NUXT_SANITY_DATASET
            || 'production'
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
  },

  logto: {
    fetchUserInfo: true,
    postCallbackRedirectUri: '/new-user',
    postLogoutRedirectUri: '/'
  }
})
