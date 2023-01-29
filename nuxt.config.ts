export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
      ],
    app: {
      head: {
        link: [ { rel: "https://unpkg.com/vue-simple-markdown/dist/vue-simple-markdown.css" }],
        script: [ { src: "https://unpkg.com/vue-simple-markdown" }]
      }
    },
    runtimeConfig: {
      public: {
        token: process.env.token,
        theme: "dracula"
      }
    }
})