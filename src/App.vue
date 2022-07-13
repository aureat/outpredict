<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { useToast } from "vue-toastification"
import {
  getPredictionsAPI,
  processPredictionsRequest,
  makeQuestionSet,
} from "./utils/predictions";

import ToastBody from "./components/toast/ToastBody.vue"
import ToastClose from "./components/toast/ToastClose.vue"


const questionSetGeneral = [
  "what to do when",
  "when did",
  "what does mean",
  "what is the meaning of",
  "where is",
  "how to translate",
  "how to open",
  "who created",
  "who founded",
  "who made",
  "what is the funniest",
  "can you",
  "what is the hardest",
  "how to",
  "what to watch",
  "what time is",
  "what does",
  "what would you do",
  "who is",
  "who died",
  "who owns",
  "where am I",
]

const questionSetPeople = [
  "elon musk",
  "steve jobs",
  "eminem",
  "troye sivan",
  "putin",
  "trump",
  "biden",
  "zelensky",
]

const questionSetHardcore = [
  "theory of",
  "gravitational field",
  "strategy of",
  "eastern music",
  "meme compilation",
  "development",
  "jobs in",
  "server administration"
]

const questionSets = {
  general: {
    title: "General Questions",
    description: "Web's most simplest questions",
    questions: questionSetGeneral,
  },
  people: {
    title: "People",
    description: "Questions about most searched people on the web",
    questions: questionSetPeople,
  },
  hardcore: {
    title: "Hardcore Google",
    description: "Questions you will never think of",
    questions: questionSetHardcore,
  }
}


export default {
  name: "App",
  data() {
    return {
      gameType: '',
      gameSet: [],
    }
  },
  computed: {
    ...mapState({
      question: (state) => state.activeGame.question,
      answers: (state) => state.activeGame.answers,
      currentType: (state) => state.activeGame.type,
      currentSet: (state) => state.activeGame.set,
      gameRound: (state) => state.activeGame.round,
      roundScore: (state) => state.activeGame.roundScore,
      gameScore: (state) => state.activeGame.gameScore,
      themePreference: (state) => state.theme,
    }),
  },
  methods: {
    isUserAuthenticated() {
      return this.$store.state.user.auth == true
    },
    isGameInProgress() {
      return this.$store.state.activeGame.round > 0
    },
    setAnswersFromQuestion() {
      this.setQuestionsLoading(true)
      const questionQuery = this.question.query
      this.$corsAnywhere.GET(getPredictionsAPI(questionQuery), (res) => {
        this.setGameAnswers(processPredictionsRequest(questionQuery, res));
        this.setQuestionsLoading(false)
        console.log(this.answers.map((answer) => answer.prediction))
      });
    },
    pickFromSet() {
      const set = this.currentSet
      const completedQuestions = this.getCompletedQuestions()(set)
      const seenQuestions = this.getSeenQuestions()
      const filtered = this.gameSet.filter(q => !completedQuestions.includes(q.id) && !seenQuestions.includes(q.id))
      if (filtered.length) {
        return filtered[Math.floor(Math.random() * filtered.length)]
      }
      return false
    },
    forceEndGame() {
      this.gameNotify('happy', `There are no new questions for you at this moment! You scored ${this.gameScore} points`, 2500)
      this.finishGame(true)
      this.$router.push('/')
    },
    gameNewQuestion() {
      this.gameQuestionLoading = true
      const newQuestion = this.pickFromSet()
      if (!newQuestion) {
        this.forceEndGame()
      }
      this.setGameQuestion(newQuestion)
      this.setAnswersFromQuestion()
    },
    gameNewGame(type, set) {
      if (!this.$store.state.user.sets[set]) {
        this.pushSet(set)
      }
      this.newGame({type: type, set: set})
      if (type == 'scorer') {
        this.gameSet = makeQuestionSet(questionSets, set)
      } else if (type == 'explorer') {
        this.gameSet = this.$store.state.user.questions
      }
      this.gameNewQuestion()
    },
    gameNotify(icon, text, duration=2000) {
      this.toast({
        component: ToastBody,
        props: {
          icon: icon,
          msg: text,
        }
      }, {
        toastClassName: "flex items-center w-full max-w-xs p-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow".split(" "),
        bodyClassName: "flex items-center w-full mr-3".split(" "),
        closeButton: ToastClose,
        icon: false,
        timeout: duration,
      })
    },
    notifyWelcome(text, duration=2000) {
      this.gameNotify('hand', text, duration)
    },
    ...mapGetters([
      "newQuestion", 
      "getCompletedQuestions",
      "getSeenQuestions",
      "getSolvedAnswersCount",
      "isQuestionsLoading"
      ]),
    ...mapMutations([
      "authenticate", 
      "setUserName", 
      "setQuestionsLoading",
      "setGameQuestions", 
      "newGame", 
      "pushSet", 
      "increaseRoundScore", 
      "setGameQuestion", 
      "setGameAnswers",
      "completeRound",
      "finishGame",
    ]),
  },
  provide() {
    return {
      questionSets: questionSets,
      gameNewGame: this.gameNewGame,
      gameNewQuestion: this.gameNewQuestion,
      increaseRoundScore: this.increaseRoundScore,
      completeRound: this.completeRound,
      finishGame: this.finishGame,
      isUserAuthenticated: this.isUserAuthenticated,
      isGameInProgress: this.isGameInProgress,
      getSolvedAnswersCount: this.getSolvedAnswersCount,
      gameNotify: this.gameNotify,
      notifyWelcome: this.notifyWelcome,
    }
  },
  beforeCreate() {
    this.$store.commit('initialiseStore');
  },
  created() {
    this.toast = useToast();
    if (this.themePreference == 'dark') {
      document.body.classList.add('dark');
    }
  },
  mounted() {
    if(this.isGameInProgress()) {
      const set = this.currentSet
      const type = this.currentType
      if (type == 'scorer') {
        this.gameSet = makeQuestionSet(questionSets, set)
      } else if (type == 'explorer') {
        this.gameSet = this.$store.state.user.questions
      }
    }
  }
};
</script>

<template>
  <div class="container flex flex-col mx-auto">
    <div class="mt-6 mb-12">
      <Navigation />
    </div>
    <div class="app-content">
      <router-view />
    </div>
    <div class="mt-28">
      <Footer></Footer>
    </div>
  </div>
</template>