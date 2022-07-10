import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      user: {
        name: "Altun",
        score: 0,
      },
      theme: 'light',
      game: {
        activeQuestion: "",
        activeAnswers: ""
      }
    };
  },
  getters: {},
  mutations: {
    initialiseStore(state) {
			if(localStorage.getItem('gameState')) {
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('gameState')))
				);
			}
		},
    clearQuestionData(state) {
      state.game.activeQuestion = ""
      state.game.activeAnswers = ""
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    increaseUserScore(state, score) {
      state.user.score += score;
    },
    setGameQuestion(state, question) {
      state.game.activeQuestion = question;
    },
    setGameAnswers(state, answers) {
      state.game.activeAnswers = answers;
    }
  },
  actions: {}
});

store.subscribe((mutation, state) => {
	localStorage.setItem('gameState', JSON.stringify(state));
});

export default store;