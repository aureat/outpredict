import { createApp } from "vue";
import store from "./store";
import router from "./router";
import { doGETRequest } from "./utils/cors-anywhere.js";

import App from "./App.vue";
import Toast from "./components/Toast";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SearchResult from "./components/SearchResult";

import "./assets/app.css";
import "./assets/index.css";
import "flowbite";

const app = createApp(App);
app.use(store);
app.use(router);

app.provide("doGETRequest", doGETRequest);
app.component("Toast", Toast);
app.component("Navigation", Navigation);
app.component("Footer", Footer);
app.component("SearchResult", SearchResult);
app.mount("#app");
