<script>
import { mapState, mapMutations } from "vuex"

export default {
  name: "Navigation",
  data() {
    return {
      themeSwitchLabel: 'Light Mode',
    }
  },
  computed: {
    ...mapState({
      userName: (state) => state.user.name,
      userScore: (state) => state.user.score,
    })
  },
  methods: {
    toggleTheme(e, value = e.target.checked) {
      if (value) {
        document.body.classList.add('dark')
        this.$store.commit('setTheme', 'dark');
        this.themeSwitchLabel = 'Dark Mode'
      } else {
        document.body.classList.remove('dark')
        this.$store.commit('setTheme', 'light');
        this.themeSwitchLabel = 'Light Mode'
      }
    },
    ...mapMutations(["clearQuestionData"])
  },
  mounted() {
    if (document.body.classList.contains("dark")) {
      this.$refs.themeSwitch.checked = true;
      this.themeSwitchLabel = 'Dark Mode'
    }
  }
};
</script>

<template>
  <nav class="px-2 sm:px-4 py-2.5">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
    <router-link to="/">
      <a class="flex items-center">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          OutPredict
        </span>
      </a>
    </router-link>
    <div class="flex md:order-2">
        <button 
          id="dropdownInformationButton" 
          data-dropdown-toggle="dropdownInformation" 
          class="text-black dark:text-white focus:outline-none font-medium text-sm px-2 py-1 mr-3 md:mr-0 text-center inline-flex items-center" 
          type="button">
          {{ userName }}
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownInformation" class="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
              <li>
                <router-link to="/">
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                </router-link>
              </li>
            </ul>
            <div class="px-4 py-3">
              <label for="small-toggle" class="inline-flex relative items-center mb-5 cursor-pointer">
                <input ref="themeSwitch" type="checkbox" @change="toggleTheme" id="small-toggle" class="sr-only peer">
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cornflower-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cornflower-300"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {{ themeSwitchLabel }}
                </span>
              </label>
            </div>
            <div class="py-1">
              <a @click="clearQuestionData" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                Delete My Session
              </a>
            </div>
        </div>

        <button data-collapse-toggle="mobile-menu-4" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-4" aria-expanded="false">
        <span class="sr-only">Open Main Menu</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        <svg class="hidden w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    </div>
    <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-4">
      <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
        <li>
          <router-link to="/">
            <a 
              class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Game
            </a>
          </router-link>
        </li>
      </ul>
    </div>
    </div>
  </nav>
</template>