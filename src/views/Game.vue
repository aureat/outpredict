<script>
import { mapState, mapMutations } from "vuex";
import {
  getGuessWordsFromGuess,
  checkGuessWithTargets,
} from "../utils/predictions";

import { ArrowRightIcon } from "@heroicons/vue/outline";
import { MinusCircleIcon, XIcon, QuestionMarkCircleIcon } from "@heroicons/vue/solid";

export default {
  name: "Game",
  inject: [
    "gameNotify",
    "increaseRoundScore",
    "gameNewQuestion",
    "completeRound",
    "finishGame",
    "getSolvedAnswersCount",
    "isUserAuthenticated",
    "isGameInProgress",
  ],
  data() {
    return {
      userGuess: "",
      userGuessShake: false,
      canContinue: false,
      howToPlayShow: false,
    };
  },
  components: {
    ArrowRightIcon, MinusCircleIcon, XIcon, QuestionMarkCircleIcon
  },
  methods: {
    userGuessSubmit() {
      const guessWords = getGuessWordsFromGuess(this.userGuess)
      this.userGuess = ""
      if (guessWords.length > 0) {
        const answers = this.answers
        let points = 0
        answers.map((answer) => {
          if (!answer.solved) {
            const answerMatches = checkGuessWithTargets(guessWords, answer)
            if (!answerMatches) {
              return false
            }
            answer.solved = true;
            this.increaseRoundScore(guessWords.length)
            points += guessWords.length;
            return true
          }
          return false
        })
        this.setGameAnswers(answers)
        this.checkCanContinue()
        if (points > 0) {
          this.notifyScore(points)
        } else {
          this.noGuess()
        }
      } else {
        this.notifyBadGuess()
      }
    },
    checkCanContinue() {
      this.canContinue = this.getSolvedAnswersCount() >= 6
    },
    giveUp() {
      if (this.gameRound == this.roundCount) {
        this.endCloseGame(true)
        return
      }
      this.completeRound(false)
      this.gameNewQuestion()
    },
    nextQuestion() {
      this.canContinue = false
      this.completeRound(true)
      if (this.gameRound < this.roundCount) {
        this.gameNewQuestion()
      } else {
        this.endCloseGame(true)
      }
    },
    endCloseGame(finished) {
      if (finished && this.gameScore) {
        this.notifyGameFinishedPoints(this.gameScore)
      } else {
        this.notifyGameFinishedNoPoints(this.gameScore)
      }
      this.finishGame(finished)
      this.$router.push('/')
    },
    notifyScore(points) {
      if (points == 1) {
        this.gameNotify('score', `You scored ${points} point`)
      } else {
        this.gameNotify('score', `You scored ${points} points`)
      }
    },
    notifyBadGuess() {
      this.gameNotify('sad', `You shouldn't use functional words`, 2000)
    },
    notifyGameFinishedNoPoints() {
      this.gameNotify('sad', `Game is finished! You couldn't score any question`, 3000)
    },
    notifyGameFinishedPoints(points) {
      this.gameNotify('fire', `Game is finished! You scored ${points} points`, 3000)
    },
    noGuess() {
      this.userGuessShake = true
      setTimeout(() => this.userGuessShake = false, 500)
    },
    ...mapMutations(["setGameAnswers", "increaseUserScore"]),
  },
  computed: {
    ...mapState({
      question: (state) => state.activeGame.question,
      answers: (state) => state.activeGame.answers,
      gameRound: (state) => state.activeGame.round,
      roundScore: (state) => state.activeGame.roundScore,
      gameScore: (state) => state.activeGame.gameScore,
      roundCount: (state) => state.user.roundCount,
      isQuestionsLoading: (state) => state.questionsLoading,
    }),
  },
  mounted() {
    if (!this.isUserAuthenticated() || !this.isGameInProgress()) {
      this.$router.push('/')
    }
    this.checkCanContinue()
    console.log(this.answers.map((answer) => answer.prediction))
  }
};
</script>

<template>

  <div class="search-container">
    <div class="search-box shadow bg-gray-200 dark:bg-gray-800">
      <div class="search-input bg-gray-300 dark:bg-gray-700">
        <div class="input-icon"></div>
        <div class="input-text text-black dark:text-white">
          <div class="question ">{{ question.query }}</div>
          <div class="prediction">
            <span class="resizer">{{ userGuess || "filler" }}</span>
            <input
              :class="['text-black dark:text-white bg-gray-200 dark:bg-gray-600', (userGuessShake) ? 'animate__animated animate__shakeX' : '']"
              v-model="userGuess"
              @keyup.enter="userGuessSubmit"
              placeholder="your guess ..."
            />
          </div>
        </div>
      </div>
      <div class="search-results">
        <div v-if="isQuestionsLoading" class="results-loading text-center">
          <div class="text-gray-900 dark:text-white font-medium text-lg px-5 py-4 mx-auto text-center inline-flex items-center">
            <svg role="status" class="inline w-8 h-8 mr-4 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            Loading...
          </div>
        </div>
        <SearchResult v-else
          v-for="a in answers"
          :key="a.prediction"
          :prediction="a.prediction"
          :predictionAnswer="a.predictionAnswer"
          :solved="a.solved"
        />
      </div>
    </div>
  </div>

  <div class="relative flex items-center justify-end mt-16">
    <div class="absolute left-[50%] translate-x-[-50%]">
      <button @click="howToPlayShow = true" class="inline-flex items-center justify-center text-white px-8 py-3.5 mr-3 bg-gray-600 rounded-lg duration-100 transition hover:scale-[1.05]">
        <QuestionMarkCircleIcon class="w-5 h-5 mr-1.5" /><span class="font-bold text-md">How to play</span>
      </button>
      <button @click="giveUp" class="inline-flex items-center justify-center text-white px-8 py-3.5 bg-gray-600 rounded-lg duration-100 transition hover:scale-[1.05]">
        <MinusCircleIcon class="w-5 h-5 mr-1.5" /><span class="font-bold text-md">Give Up</span>
      </button>
    </div>
    <button @click="nextQuestion" v-show="canContinue" class="inline-flex items-center justify-center text-white px-8 py-3.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg duration-100 transition hover:scale-[1.05]">
      <span v-if="gameRound == 5" class="font-bold text-md">Complete Game</span>
      <span v-else class="font-bold text-md">Next Question</span>
      <ArrowRightIcon class="w-5 h-5 ml-1.5" />
    </button>
  </div>

  <Teleport to="body">
    <HowToPlay :show="howToPlayShow" @close="howToPlayShow = false" />
  </Teleport>

</template>