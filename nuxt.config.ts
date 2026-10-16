export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@logto/nuxt',
    '@nuxtjs/device',
    'nuxt-swiper',
    '@vite-pwa/nuxt'
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

  icon: {
    serverBundle: {
      collections: ['lucide']
    },
    clientBundle: {
      scan: true
    }
  },

  logto: {
    fetchUserInfo: true,
    postCallbackRedirectUri: '/new-user',
    postLogoutRedirectUri: '/'
  },

  pwa: {
    registerType: 'prompt',
    manifest: {
      name: 'Mangile - Manga, Webtoon & Roman Okuma Platformu',
      short_name: 'Mangile',
      description: 'Dinamik, etkili ve kullanışlı manga/webtoon/roman okuma, takip etme ve paylaşma sistemi.',
      theme_color: '#09090b',
      background_color: '#09090b',
      display: 'standalone',
      orientation: 'any',
      scope: '/',
      start_url: '/',
      lang: 'tr',
      categories: ['books', 'entertainment'],
      icons: [
        {
          src: '/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      shortcuts: [
        {
          name: 'Keşfet',
          short_name: 'Keşfet',
          description: 'Yeni manga ve serileri keşfedin',
          url: '/explore',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Geçmiş',
          short_name: 'Geçmiş',
          description: 'Kaldığınız yerden okumaya devam edin',
          url: '/history',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Listeler',
          short_name: 'Listeler',
          description: 'Okuma listeleriniz',
          url: '/lists',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'İndirilenler',
          short_name: 'İndirilenler',
          description: 'Çevrimdışı kaydedilen bölümler',
          url: '/offline',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'sanity-cdn-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)(?:\?.*)?$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'manga-images-cache',
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\/api\/chapter(?:\?.*)?$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'chapter-api-cache',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
