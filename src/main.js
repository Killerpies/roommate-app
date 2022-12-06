import "bootstrap/dist/css/bootstrap.min.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createAuth0 } from "@auth0/auth0-vue";

const app = createApp(App);

app.use(store);

app.use(router);

app.use(
  createAuth0({
    domain: process.env.AUTHENTICATION_DOMAIN,
    client_id: process.env.AUTHENTICATION_CLIENTID,
    redirect_uri: window.location.origin,
  })
);

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
