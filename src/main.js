import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { Icon } from "@iconify/vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  console.error("Error:", err);
  console.error("Vue component:", vm);
  console.error("Additional info:", info);
};

app.use(createPinia());
app.use(router);
app.component("Icon", Icon);

app.mount("#app");
