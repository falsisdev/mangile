// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@vueuse/nuxt",
    "nuxt-swiper",
    "@nuxt/icon",
    "@nuxtjs/device",
    "@logto/nuxt",
    "@nuxtjs/sanity",
    "@nuxt/content",
  ],
  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
  },
  runtimeConfig: {
    logto: {
      endpoint: "",
      appId: "",
      appSecret: "",
      cookieEncryptionKey: "",
    },
    sanity: {
      token: process.env.NUXT_SANITY_TOKEN,
    },
    public: {
      subjectToken: process.env.NUXT_SUBJECT_TOKEN,
      m2mAppID: process.env.NUXT_M2M_APP_ID,
      m2mAppSecret: process.env.NUXT_M2M_APP_SECRET,
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
