export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        var searchParams = new URLSearchParams(window.location.search);
        document.body.clientWidth < 1100 ? window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : ''
        if(localStorage.getItem("theme")) {
            if(localStorage.getItem("theme") != 'none') {
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