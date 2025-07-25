// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  modules: [
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/device",
    "@logto/nuxt",
    "@nuxtjs/sanity",
    "@nuxt/content",
    '@nuxt/image',
    "shadcn-nuxt",
    '@nuxtjs/color-mode',
    "nuxt-swiper"
  ],
  colorMode: {
    classSuffix: ''
  },
  sanity: {
    projectId: '1yge7tlr',
  },
  runtimeConfig: {
    logto: {
      endpoint: process.env.NUXT_LOGTO_ENDPOINT,
      appId: process.env.NUXT_LOGTO_APP_ID,
      appSecret: process.env.NUXT_LOGTO_APP_SECRET,
      cookieEncryptionKey: process.env.NUXT_LOGTO_COOKIE_ENCRYPTION_KEY,
    },
    sanity: {
      token: process.env.NUXT_SANITY_TOKEN,
    },
    public: {
      subjectToken: process.env.NUXT_SUBJECT_TOKEN,
      m2mAppID: process.env.NUXT_M2M_APP_ID,
      m2mAppSecret: process.env.NUXT_M2M_APP_SECRET,
      projectId: "1yge7tlr",
      disqusShortname: "mangile",
      sanityToken: process.env.NUXT_SANITY_TOKEN || "",
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
});