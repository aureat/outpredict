<script>
import { mapState, mapMutations } from "vuex";
import {
  getPredictionsAPI,
  processPredictionsRequest,
  pickQuestion,
} from "./utils/predictions";

export default {
  name: "App",
  inject: ["doGETRequest"],
  computed: {
    ...mapState({
      question: (state) => state.game.activeQuestion,
      themePreference: (state) => state.theme,
    }),
  },
  methods: {
    setAnswersFromQuestion() {
      this.doGETRequest(getPredictionsAPI(this.question), (res) => {
        this.setGameAnswers(processPredictionsRequest(this.question, res));
      });
    },
    ...mapMutations(["setGameQuestion", "setGameAnswers"]),
  },
  beforeCreate() {
    this.$store.commit('initialiseStore');
  },
  created() {
    if (!this.$store.state.game.activeQuestion) {
      this.setGameQuestion(pickQuestion());
      this.setAnswersFromQuestion();
    }
    if (this.themePreference == 'dark') {
      document.body.classList.add('dark');
    }
  },
};
</script>

<template>
  <div class="container flex flex-col mx-auto">
    <div class="mt-6 mb-16">
      <Navigation />
    </div>
    <router-view />
    <div class="mt-20">
      <Footer />
    </div>
  </div>

  <!-- <div id="toast-bottom-left" class="absolute bottom-5 right-5 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
    <div class="text-sm font-normal">Bottom left positioning.</div>
  </div> -->

</template>
