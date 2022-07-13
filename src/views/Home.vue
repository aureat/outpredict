<script>
import { mapState } from "vuex";
import { ArrowLeftIcon } from "@heroicons/vue/outline";
import { AtSymbolIcon, UserIcon, GlobeAltIcon, StarIcon, QuestionMarkCircleIcon, CollectionIcon } from "@heroicons/vue/solid";

export default {
  name: "Home",
  inject: [
    "gameNotify",
    "notifyWelcome", 
    "isUserAuthenticated", 
    "isGameInProgress",
    "gameNewGame",
    "questionSets",
  ],
  components: { 
    AtSymbolIcon,
    UserIcon,
    GlobeAltIcon,
    StarIcon,
    QuestionMarkCircleIcon,
    CollectionIcon,
    ArrowLeftIcon
  },
  data() {
    return {
      username: '',
      mode: '',
      list: '',
      step: '',
      modeChosen: '',
      setChosen: '',
      howToPlayShow: false,
    }
  },
  computed: {
    ...mapState({
      userQuestions: (state) => state.user.questions,
      roundCount: (state) => state.user.roundCount,
    })
  },
  methods: {
    usernameSubmit() {
      this.$store.commit('authenticate')
      this.$store.commit('setUserName', this.username)
      this.step = 'mode'
      this.notifyWelcome(`
        <span class="font-semibold text-md">Hey, ${this.username}!</span><br>
        <span class="font-light">Go ahead and pick a mode, let's start playing!</span>
      `, 5000)
    },
    chooseScorer() {
      this.modeChosen = 'scorer'
      this.step = 'set'
    },
    chooseMultiplayer() {
      this.gameNotify('info', 'Coming soon...', 1500)
    },
    chooseExplorer() {
      if (this.userQuestions.length < this.roundCount) {
        this.gameNotify('bolt', `To play explorer you should add at least ${this.roundCount} questions.`, 5000)
        this.$router.push('/preferences')
        return
      }
      this.modeChosen = 'explorer'
      this.gameNewGame('explorer', 'user')
      setTimeout(() => {
       this.$router.push('/game')
      }, 500)
    },
    chooseSet(set) {
      this.setChosen = set
      this.gameNewGame('scorer', set)
      setTimeout(() => {
       this.$router.push('/game')
      }, 500)
    }
  },
  mounted() {
    if (this.isGameInProgress()) {
      this.$router.push('/game')
    }
    if (this.isUserAuthenticated()) {
      this.step = 'mode'
    } else {
      this.step = 'login'
    }
  }
}
</script>

<template>
  <div class="home-container mb-10">

    <TransitionGroup name="fade" mode="out-in">

      <!-- Pick Set -->
      <div :key="set" v-if="step == 'set'" class="mt-7 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div class="text-4xl font-bold text-center text-white mt-3.5">Pick a category</div>
        </div>
        <div class="mt-10 flex flex-col w-1/2 max-w-md justify-center gap-5">
          <button v-for="( set, slug ) in questionSets" @click="chooseSet(slug)" :class="['relative flex flex-col align-bottom pl-24 py-6 pr-6 w-full text-left bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow transition-all duration-200 hover:translate-x-2', (setChosen == slug) ? 'animate__animated animate__fadeOutRightBig animate__fast' : '']">
            <CollectionIcon class="absolute top-5 left-5 text-white w-12 h-12" />
            <div class="text-3xl font-semibold text-white">{{ set.title }}</div>
            <div class="mt-1 text-lg font-medium text-white">
              {{ set.description }}
            </div>
          </button>
        </div>
      </div>

      <!-- Pick Mode -->
      <div :key="mode" v-if="step == 'mode'" class="mt-7 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div class="text-4xl font-bold text-center text-white mt-3.5">Choose a mode to play</div>
        </div>
        <div class="mt-10 flex flex-wrap items-stretch justify-center gap-5">
          <button @click="chooseScorer()" class="relative flex flex-col align-bottom px-6 pt-20 pb-6 w-64 max-w-sm text-left bg-indigo-600 rounded-lg shadow transition-all duration-200 hover:-translate-y-2">
            <StarIcon class="absolute top-5 left-5 text-white w-12 h-12" />
            <div class="text-3xl font-semibold text-white">Scorer</div>
            <div class="mt-3 text-lg font-medium text-white">
              Pick different categories and try to guess web's most asked questions
            </div>
          </button>
          <button @click="chooseMultiplayer()" class="relative flex flex-col align-bottom px-6 pt-20 pb-6 w-64 max-w-sm text-left bg-amber-500 rounded-lg shadow transition-all duration-200 hover:-translate-y-2">
            <GlobeAltIcon class="absolute top-5 left-5 text-white w-12 h-12" />
            <div class="text-3xl font-semibold text-white">Multiplayer</div>
            <div class="mt-3 text-lg font-medium text-white">
              Bring in a friend and complete rounds together
            </div>
          </button>
          <button @click="chooseExplorer()" :class="['relative flex flex-col align-bottom px-6 pt-20 pb-6 w-64 max-w-sm text-left bg-green-400 rounded-lg shadow transition-all duration-200 hover:-translate-y-2', (modeChosen == 'explorer') ? 'animate__animated animate__tada animate__fast' : '']">
            <UserIcon class="absolute top-5 left-5 text-white w-12 h-12" />
            <div class="text-3xl font-semibold text-white">Explorer</div>
            <div class="mt-3 text-lg font-medium text-white">
              Ask your own questions and guess their autocompletions
            </div>
          </button>
        </div>
      </div>

      <!-- Pick Username -->
      <div :key="login" v-if="step == 'login'" class="mt-16 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div class="text-6xl font-black text-center text-white">Welcome!</div>
          <div class="text-3xl font-semibold text-center text-white mt-3.5">Can you beat google in autocomplete?</div>
        </div>
        <div class="mt-14 w-1/3">
          <div class="text-lg font-medium text-center text-white">Enter your username to get started</div>
          <form class="mt-3" @submit.prevent="usernameSubmit">
            <div class="relative">
              <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <AtSymbolIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input type="text" id="username" v-model="username" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cornflower-300 focus:border-cornflower-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="username" required>
              <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-cornflower-300 hover:bg-cornflower-200 focus:ring-4 focus:outline-none focus:ring-cornflower-300 font-medium rounded-lg text-sm px-4 py-2">Play</button>
            </div>
          </form>
        </div>
      </div>

    </TransitionGroup>

    <div class="mt-16 flex justify-center">
      <button v-if="step == 'set'" @click="step = 'mode'" class="inline-flex items-center justify-center text-white px-8 py-3.5 mr-3 bg-gray-600 rounded-lg duration-100 transition hover:scale-[1.05]">
        <ArrowLeftIcon class="w-5 h-5 mr-1.5" /><span class="font-bold text-md">Go Back</span>
      </button>
      <button @click="howToPlayShow = true" class="inline-flex items-center justify-center text-white px-8 py-3.5 bg-gray-600 rounded-lg duration-100 transition hover:scale-[1.05]">
        <QuestionMarkCircleIcon class="w-5 h-5 mr-1.5" /><span class="font-bold text-md">How to play</span>
      </button>
    </div>

    <Teleport to="body">
      <HowToPlay :show="howToPlayShow" @close="howToPlayShow = false" />
    </Teleport>

  </div>
</template>

<style>
.fade-enter-active {
  transition: opacity, transform 0.5s ease;
}

.fade-leave-active {
  display: none;
}

.fade-leave-to {
  display: none;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
</style>