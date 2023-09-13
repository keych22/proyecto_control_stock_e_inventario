import "@mdi/font/css/materialdesignicons.css";
import * as vueLabsComponents from "vuetify/labs/components";
import * as vuetifyComponents from "vuetify/components";
import * as vuetifyDirectives from "vuetify/directives";
import App from "@/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import firebase from "@/core/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import router from "@/router/router";
export default class Application {
  public static init() {
    const app = createApp(App);

    const vuetify = createVuetify({
      components: { ...vuetifyComponents, ...vueLabsComponents },
      directives: vuetifyDirectives,
    });
    app.use(vuetify, { iconfont: "mdi" });

    const pinia = createPinia();
    app.use(pinia);

    const unsubscribe = onAuthStateChanged(firebase.auth, () => {
      app.use(router);
      app.mount("#app");

      unsubscribe();
    });
  }
}
