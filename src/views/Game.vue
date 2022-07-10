<script>
import { mapState, mapMutations } from "vuex";
import {
  getGuessWordsFromGuess,
  checkGuessWithTargets,
} from "../utils/predictions";

export default {
  name: "Game",
  inject: ["doGETRequest"],
  data() {
    return {
      userGuess: "",
      toast: {
        show: false,
        type: 'info',
        text: ''
      }
    };
  },
  methods: {
    userGuessSubmit() {
      const guessWords = getGuessWordsFromGuess(this.userGuess);
      this.userGuess = "";
      if (guessWords.length > 0) {
        const answers = this.answers;
        let points = 0;
        answers.map((answer) => {
          if (!answer.solved) {
            const answerMatches = checkGuessWithTargets(guessWords, answer);
            if (!answerMatches) {
              return false;
            }
            answer.solved = true;
            this.increaseUserScore(guessWords.length);
            points += guessWords.length;
            return true;
          }
          return false;
        });
        this.setGameAnswers(answers);
        this.makeToast('success', `You gained ${points} points`);
      }
    },
    makeToast(type, text) {
      this.toast.show = true;
      this.toast.type = type;
      this.toast.text = text;
    },
    ...mapMutations(["setGameAnswers", "increaseUserScore"]),
  },
  computed: {
    ...mapState({
      question: (state) => state.game.activeQuestion,
      answers: (state) => state.game.activeAnswers,
    }),
  },
};
</script>

<template>
  <div class="search-container">
    <div class="search-box bg-gray-200 dark:bg-gray-800">
      <div class="search-input bg-gray-300 dark:bg-gray-700">
        <div class="input-icon"></div>
        <div class="input-text">
          <div class="question">{{ question }}</div>
          <div class="prediction">
            <span class="resizer">{{ userGuess || "filler" }}</span>
            <input
              class="bg-gray-400 dark:bg-gray-600"
              v-model="userGuess"
              @keyup.enter="userGuessSubmit"
              placeholder="your guess ..."
            />
          </div>
        </div>
      </div>
      <div class="search-results">
        <SearchResult
          v-for="a in answers"
          :key="a.prediction"
          :prediction="a.prediction"
          :predictionAnswer="a.predictionAnswer"
          :solved="a.solved"
        />
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Toast :show="toast.show" :icon="toast.type" @close="toast.show = false">
      <template #body>
        {{ toast.text }}
      </template>
    </Toast>
  </Teleport>

</template>