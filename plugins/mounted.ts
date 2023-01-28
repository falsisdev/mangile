export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        document.body.clientWidth <= 1262 ? window.location.href = 'https://cdn.falsisdev.repl.co/accessdenied.json' : ''
     })
})