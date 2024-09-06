// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@vueuse/nuxt",
    "nuxt-swiper",
    "@nuxt/icon",
    "@nuxtjs/device",
    "@logto/nuxt",
  ],
  runtimeConfig: {
    logto: {
      endpoint: "",
      appId: "",
      appSecret: "",
      cookieEncryptionKey: "",
    },
    subjectToken: "",
    m2mAppID: "",
    m2mAppSecret: "",
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
