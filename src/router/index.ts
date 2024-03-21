import { createRouter, createWebHistory } from "vue-router";

import HospitalSearch from "@/components/HospitalSearch.vue";
import Login from "@/views/login.vue";
import Signup from "@/views/signup.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HospitalSearch,
    },
    { path: "/login", 
      name: "Login", 
      component: Login 
    },
    { path: "/signup", 
      name: "Signup", 
      component: Signup
    },
  ],
});

// global navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("isLoggedIn");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else if (isLoggedIn && (to.name === "Login" || to.name === "Signup")) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;