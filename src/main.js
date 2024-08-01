import { createApp } from "vue";
import { Icon } from "@iconify/vue";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.component("Icon", Icon);
app.mount("#app");
app.config.errorHandler = (err, vm, info) => {
  console.error("Hata:", err);
  console.error("Vue Bileşeni:", vm);
  console.error("Ek Bilgi:", info);
};
