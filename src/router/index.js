import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

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
  ],
});

export default router;
