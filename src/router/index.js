import { createRouter, createWebHistory, useRoute } from "vue-router";
import { getUser } from "../firebase";
import { useCookies } from "vue3-cookies";
import DefaultView from "../views/DefaultView.vue";

const { cookies } = useCookies();
const route = useRoute();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:catchAll(.*)",
      component: () => import("../components/Error.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../components/Home.vue"),
    },
    {
      path: "/article",
      name: "article",
      component: () => DefaultView,
      children: [
        {
          path: "about",
          component: () => import("../components/Article/About.vue"),
        },
        {
          path: "ui",
          component: () => import("../components/Article/UI.vue"),
        },
        {
          path: "contact",
          component: () => import("../components/Article/Contact.vue"),
        },
        {
          path: "rules",
          component: () => import("../components/Article/Rules.vue"),
        },
        {
          path: "genres",
          component: () => import("../components/Article/Genres.vue"),
        },
        {
          path: "privacy",
          component: () => import("../components/Article/Privacy.vue"),
        },
        {
          path: "security",
          component: () => import("../components/Article/Security.vue"),
        },
        {
          path: "terms",
          component: () => import("../components/Article/Terms.vue"),
        },
      ],
    },
    {
      path: "/lastuploads",
      name: "lastuploads",
      component: () => DefaultView,
      children: [
        {
          path: "chapters",
          component: () => import("../components/Last/Chapter.vue"),
        },
        {
          path: "manga",
          component: () => import("../components/Last/Serie.vue"),
        },
      ],
    },
    {
      path: "/explore",
      name: "explore",
      component: () => import("../components/Explore.vue"),
    },
    {
      path: "/manga",
      name: "manga",
      component: () => DefaultView,
      children: [
        {
          path: ":id",
          component: () => import("../components/Manga/View.vue"),
        },
        {
          path: ":id/read/:vol/:ep",
          component: () => import("../components/Manga/Read.vue"),
        },
        {
          path: "random",
          component: () => import("../components/Manga/Random.vue"),
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../components/Search.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => DefaultView,
      children: [
        {
          path: ":type",
          component: () => import("../components/AuthForm.vue"),
        },
      ],
    },
    {
      path: "/user",
      name: "user",
      component: () => DefaultView,
      children: [
        {
          path: ":id",
          component: () => import("../components/Profile/View.vue"),
          children: [
            {
              path: "edit",
              component: () => import("../components/Profile/Edit.vue"),
            },
            {
              path: "library",
              component: () => import("../components/Profile/Library.vue"),
            },
            {
              path: "list/:listid",
              component: () => import("../components/List/View.vue"),
            },
          ],
        },
      ],
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
            return import("../components/Profile/View.vue");
          }
        } else {
          return import("../components/AuthForm.vue");
        }
      },
    },
  ],
});

export default router;
