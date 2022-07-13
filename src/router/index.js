import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Game from "../views/Game.vue";
import Preferences from "../views/Preferences.vue";

const routes = [
  { 
    name: "Home", 
    path: "/", 
    component: Home,
    meta: {
      transition: 'fade',
    }
  },
  { 
    name: "Game", 
    path: "/game", 
    component: Game,
    meta: {
      transition: 'slide-left',
    }
  },
  { 
    name: "Preferences", 
    path: "/preferences", 
    component: Preferences,
    meta: {
      transition: 'fade',
    }
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
