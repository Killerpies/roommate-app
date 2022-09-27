import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App)

app.use(store)

app.use(router)

app.use(
    createAuth0({
      domain: "dev-3f6063v3.us.auth0.com",
      client_id: "VjzTdjG6M9W3ZasPstpq1HgPKTK40WtC",
      redirect_uri: window.location.origin
    })
  );

app.mount('#app')
