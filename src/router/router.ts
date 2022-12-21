import { createRouter, createWebHistory } from "vue-router";
import firebase from "@/core/services/firebase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!firebase.auth.currentUser && to.name !== "login") {
    next({ name: "login" });
  } else if (firebase.auth.currentUser && to.name == "login") {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
