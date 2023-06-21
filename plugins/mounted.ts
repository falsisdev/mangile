export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        var searchParams = new URLSearchParams(window.location.search);
        document.body.clientWidth < 1450 ? window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : ''
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
        if(localStorage.getItem("icontheme")) {
            if(!searchParams.get("icon")) {
                searchParams.set("icon", String(localStorage.getItem("icontheme")))
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);
                window.location.reload();
            }
        }
        /*
        if(!localStorage.getItem("username") && !localStorage.getItem("password")) {
            if(!window.location.pathname.endsWith("/signup")) window.location.href = '/signup'
        }
        */
     })
})