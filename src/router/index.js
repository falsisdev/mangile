import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { getUser } from "../firebase";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/article/:type",
      name: "article",
      component: () => import("../views/ArticleView.vue"),
    },
    {
      path: "/lastuploads/:type",
      name: "lastuploads",
      component: () => import("../views/LastUploadsView.vue"),
    },
    {
      path: "/manga/random",
      name: "randommanga",
      component: () => import("../views/RandomManga.vue"),
    },
    {
      path: "/explore",
      name: "explore",
      component: () => import("../views/ExploreView.vue"),
    },
    {
      path: "/manga/:id",
      name: "manga",
      component: () => import("../views/MangaView.vue"),
    },
    {
      path: "/manga/:id/read/:vol/:ep",
      name: "read",
      component: () => import("../views/MangaRead.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchView.vue"),
    },
    {
      path: "/auth/:type",
      name: "auth",
      component: () => import("../views/LoginForm.vue"),
    },
    {
      path: "/user/:id/:action",
      name: "user",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/user/:userid/list/:listid",
      name: "list",
      component: () => import("../views/ListView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: async () => {
        if (cookies.get("email")) {
          if (
            Object.values(await getUser(cookies.get("email")))[
              Object.keys(await getUser(cookies.get("email"))).indexOf("roles")
            ].includes("mod")
          ) {
            return import("../views/DashView.vue");
          } else {
            return import("../views/ProfileView.vue");
          }
        } else {
          return import("../views/LoginForm.vue");
        }
      },
    },
  ],
});

export default router;
