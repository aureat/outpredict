import { createApp } from "vue";
import store from "./store";
import router from "./router";
import CorsAnywhere from "./utils/cors-anywhere.js";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SearchResult from "./components/SearchResult";
import HowToPlay from "./components/modal/HowToPlay";

import "./assets/app.css";
import "./assets/index.css";
import "flowbite";

import 'animate.css';

const app = createApp(App);
app.use(store);
app.use(router);

app.use(CorsAnywhere, {
    corsAPI: "https://csb-qbo4dc-lvsifszlk-altunh.vercel.app/"
});

app.use(Toast, {
    transition: "Vue-Toastification__fade",
    position: "top-right",
    timeout: 2000,
    pauseOnHover: false,
    draggable: true,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
});

app.component("Navigation", Navigation);
app.component("Footer", Footer);
app.component("SearchResult", SearchResult);
app.component("HowToPlay", HowToPlay);

app.mount("#app");
