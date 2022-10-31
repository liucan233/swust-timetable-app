import { createSSRApp } from "vue";
import App from "./App.vue";

import "@src/styles/global.css";

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
