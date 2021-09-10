import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      heading: "Startseite",
    },
    component: Home,
  },
  {
    path: "/testing",
    name: "Testing",
    meta: {
      heading: "Testseite",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "testing" */ "../views/Testing.vue"),
  },
  {
    path: "/testing-store",
    name: "VUEX Store",
    meta: {
      heading: "Testseite VUEX Store",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "testingStore" */
        "../views/TestingStore.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
