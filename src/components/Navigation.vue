<script>
import { mapState, mapMutations } from "vuex"
import { StarIcon, XIcon } from "@heroicons/vue/solid";
import { SparklesIcon } from "@heroicons/vue/outline";

export default {
  name: "Navigation",
  data() {
    return {
      themeSwitchLabel: 'Light Mode',
    }
  },
  components: {
    StarIcon, SparklesIcon, XIcon
  },
  inject: [
    "gameNewQuestion", 
    "isUserAuthenticated", 
    "isGameInProgress",
    "finishGame",
    "gameNotify",
  ],
  computed: {
    ...mapState({
      userName: (state) => state.user.name,
      userScore: (state) => state.user.score,
      gameRound: (state) => state.activeGame.round,
      roundScore: (state) => state.activeGame.roundScore,
      gameScore: (state) => state.activeGame.gameScore,
      roundCount: (state) => state.user.roundCount,
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
    exitGame() {
      this.gameNotify('sad', 'You ended the game!', 2000)
      this.finishGame(false)
      this.$router.push('/')
    },
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
        <a class="relative flex items-center bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2 rounded-xl transition hover:scale-[1.03]">
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white mr-4">
            OutPredict
          </span>
          <span class="font-bold text-white text-6xl absolute bottom-[0.05rem] right-3 skew-y-3 rotate-6">!</span>
        </a>
      </router-link>
      <div class="flex md:order-2">
          <button 
            id="dropdownInformationButton" 
            data-dropdown-toggle="dropdownInformation" 
            class="text-black dark:text-white focus:outline-none font-medium text-sm px-2 py-1 mr-3 md:mr-0 text-center inline-flex items-center" 
            type="button">
            <span v-if="isUserAuthenticated()">@{{ userName }}</span>
            <span v-else>Guest</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Dropdown menu -->
          <div id="dropdownInformation" class="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-darkDivide">
              <template v-if="isUserAuthenticated()">
                <div class="px-5 pt-5 pb-3">
                  <span class="text-sm font-medium text-black dark:text-white inline-flex justify-center text-center">
                    <StarIcon class="w-6 h-6 text-cornflower mr-2 mt-[-0.18rem]" />
                    <b class="mr-1">All-time:</b> {{ userScore }}
                  </span>
                </div>
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                  <li>
                    <router-link to="/preferences">
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Preferences</a>
                    </router-link>
                  </li>
                </ul>
              </template>
              <div class="px-4 py-3">
                <label for="themeSwitch" class="inline-flex relative items-center cursor-pointer mt-1">
                  <input ref="themeSwitch" type="checkbox" @change="toggleTheme" id="themeSwitch" class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cornflower-300 dark:peer-focus:ring-cornflower-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cornflower-300"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {{ themeSwitchLabel }}
                  </span>
                </label>
              </div>
          </div>
      </div>

      <div v-show="isGameInProgress()" class="justify-between items-center ml-[-79px]">
        <div class="flex items-stretch justify-center">
          <button @click="exitGame" data-tooltip-target="tooltipEndGame" data-tooltip-placement="bottom" class="inline-flex items-center justify-center text-white bg-gray-800 px-3.5 mr-3 rounded-lg duration-100 transition hover:scale-[1.05]">
            <XIcon class="w-6 h-6" />
          </button>
          <div class="inline-flex items-center justify-center text-white bg-gray-600 px-4 py-3 mr-3 rounded-lg">
            <span class="font-bold text-md">Round {{ gameRound }}</span>
            <span class="font-medium text-md">/{{ roundCount }}</span>
          </div>
          <div class="inline-flex items-center justify-center text-white px-4 py-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <SparklesIcon class="w-5 h-5 text-white mr-1.5" />
            <span class="font-bold text-md">{{ roundScore + gameScore }} Points</span>
          </div>
        </div>
        <div id="tooltipEndGame" ref="tooltipEndGame" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-600 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-500 transition-all duration-200">
          End Game
        </div>
      </div>

    </div>
  </nav>
</template>