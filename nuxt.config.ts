export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
      ],
    app: {
      head: {
        link: [ { rel: "https://unpkg.com/vue-simple-markdown/dist/vue-simple-markdown.css" }, { rel: "icon", href: "https://media.discordapp.net/attachments/775822548519616562/1043106785617260554/mangile_sun.png?size=4096"}],
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