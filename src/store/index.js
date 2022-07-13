import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      theme: 'dark',
      questionsLoading: false,
      user: {
        auth: false,
        name: "",
        score: 0,
        questions: [],
        roundCount: 5,
        gamesPlayed: 0,
        sets: {},
      },
      activeGame: {
        type: '',
        set: '',
        gameScore: 0,
        round: 0,
        roundScore: 0,
        question: {
          id: 0,
          query: ""
        },
        answers: [],
        seen: [],
      }
    };
  },
  getters: {
    newUserQuestion(state) {
      const filtered = state.game.questions.filter((q) => q.completed != true)
      if (filtered.length > 0) {
        return filtered[Math.floor(Math.random() * filtered.length)].query
      }
      return false
    },
    getCompletedQuestions: (state) => (set) => {
      return state.user.sets[set].completed
    },
    getSeenQuestions(state) {
      return state.activeGame.seen
    },
    getSolvedAnswersCount(state) {
      return state.activeGame.answers.filter((answer) => answer.solved == true).length
    },
    isQuestionsLoading(state) {
      return state.questionsLoading
    }
  },
  mutations: {
    initialiseStore(state) {
			if(localStorage.getItem('store')) {
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				)
			}
		},
    setTheme(state, theme) {
      state.theme = theme
    },
    setQuestionsLoading(state, loading) {
      state.questionsLoading = loading
    },
    authenticate(state) {
      state.user.auth = true
    },
    deleteSession(state) {
      state.theme = "dark"
      state.user.auth = false
      state.user.name = ""
      state.user.score = 0
      state.user.questions = []
      state.user.roundCount = 5
      state.user.gamesPlayed = 0
      state.user.sets = {}
      this.commit('deleteGame')
    },
    deleteGame(state) {
      state.activeGame.type = ""
      state.activeGame.set = ""
      state.activeGame.gameScore = 0
      state.activeGame.round = 0
      state.activeGame.roundScore = 0
      state.activeGame.question.id = 0
      state.activeGame.question.query = ""
      state.activeGame.answers = []
      state.activeGame.seen = []
    },
    setUserName(state, name) {
      state.user.name = name
    },
    setRoundCount(state, count) {
      state.user.roundCount = count
    },
    increaseUserScore(state, score) {
      state.user.score += score
    },
    setUserQuestions(state, questions) {
      state.user.questions = questions
    },
    newGame(state, { type, set }) {
      state.activeGame.type = type
      state.activeGame.set = set
      state.activeGame.round = 1
    },
    pushSet(state, set) {
      state.user.sets[set] = {
        completed: [],
        cleared: false,
      }
    },
    addCompletedQuestion(state, id) {
      const set = state.activeGame.set
      state.user.sets[set].completed.push(id)
    },
    setGameQuestion(state, question) {
      state.activeGame.seen.push(question.id)
      state.activeGame.question.id = question.id
      state.activeGame.question.query = question.query
    },
    setGameAnswers(state, answers) {
      state.activeGame.answers = answers
    },
    increaseRoundScore(state, points) {
      state.activeGame.roundScore += points
    },
    completeRound(state, finished) {
      state.activeGame.round++
      if (finished) {
        state.activeGame.gameScore += state.activeGame.roundScore
        const id = state.activeGame.question.id
        this.commit('addCompletedQuestion', id)
      }
      state.activeGame.roundScore = 0
    },
    finishGame(state, finished) {
      state.user.gamesPlayed++
      if (finished) {
        state.user.score += state.activeGame.gameScore
      }
      this.commit('deleteGame')
    },
  },
  actions: {}
});

store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify(state));
});

export default store;