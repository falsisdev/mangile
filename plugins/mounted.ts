export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        document.body.clientWidth <= 1262 ? window.location.href = 'https://cdn.falsisdev.repl.co/accessdenied.json' : ''
        if(localStorage.getItem("theme")) {
            if(localStorage.getItem("theme") != 'none') {
                var searchParams = new URLSearchParams(window.location.search);
                if(!searchParams.get("theme")) {
                if(!searchParams.get("preview")) {
                searchParams.set("theme", String(localStorage.getItem("theme")))
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);
                window.location.reload();
                }
                }
            }
        }
     })
})