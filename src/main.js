import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import VueAxios from "vue-axios";

import VueCookies from "vue-cookies";

const vApp = createApp(App);
vApp.use(store).use(router).use(VueAxios, axios).use(VueCookies, {
  expire: "30d",
  path: "/",
  domain: "",
  secure: true, // user management and cookie handling is only enabled in secure contexts
  sameSite: "Lax",
});

// automatic global registering of our base components
const componentFiles = import.meta.glob("./components/OpenwbBase*.vue", {
  eager: true,
});
Object.entries(componentFiles).forEach(([path, module]) => {
  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      path
        .split("/")
        .pop()
        .replace(/\.\w+$/, ""),
    ),
  );
  vApp.component(componentName, module.default);
});

vApp.mount("#app");
