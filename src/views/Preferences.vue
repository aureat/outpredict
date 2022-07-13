<script>
import { nextTick } from "vue";
import { mapState } from "vuex";
import { AtSymbolIcon, PencilIcon, FlagIcon } from "@heroicons/vue/solid";
import { PlusCircleIcon, SearchIcon, XIcon, CheckIcon } from "@heroicons/vue/outline";

const qdom = (type, id) => {
  return document.querySelector(`.question-item-${type}[data-question-id="${id}"]`)
}

const elbyid = (domid) => {
  return document.getElementById(domid);
}

const addTooltip = (target, trigger) => {
  const tooltip = new Tooltip(target, trigger)
}

export default {
  name: "Preferences",
  inject: ["gameNotify"],
  data() {
    return {
      username: '',
      questionInput: '',
      roundCount: 0,
      questions: [],
    }
  },
  components: {
    AtSymbolIcon, PlusCircleIcon, SearchIcon, PencilIcon, XIcon, CheckIcon, FlagIcon
  },
  methods: {
    usernameSubmit() {
      if (this.username != this.$store.state.user.name) {
        this.$store.commit('setUserName', this.username);
        this.notifySuccess('Username changed!')
      }
    },
    roundCountSubmit() {
      if (this.roundCount != this.$store.state.user.roundCount) {
        this.$store.commit('setRoundCount', this.roundCount);
        this.notifySuccess('Rounds per game changed!')
      }
    },
    async addQuestion() {
      this.questions.push({
        id: this.questions.length+1,
        query: this.questionInput,
        completed: false,
      })
      this.questionInput = ''
      this.updateStoreQuestions()
      this.notifySuccess('Question added!')
      await nextTick()
      const id = this.questions.length
      addTooltip(elbyid('tooltipEdit'), qdom('edit', id))
      addTooltip(elbyid('tooltipSave'), qdom('save', id))
      addTooltip(elbyid('tooltipDelete'), qdom('delete', id))
    },
    editQuestion(id) {
      qdom('edit', id).classList.add("hidden");
      qdom('save', id).classList.remove("hidden");
      qdom('text', id).classList.add("hidden")
      qdom('input', id).classList.remove("hidden")
      qdom('input-field', id).focus()
    },
    saveQuestion(id) {
      const question = this.questions.find((item) => item.id == id)
      question.query = qdom('input-field', id).value
      this.updateStoreQuestions()
      this.notifySuccess('Question updated!')
      qdom('edit', id).classList.remove("hidden");
      qdom('save', id).classList.add("hidden");
      qdom('text', id).classList.remove("hidden")
      qdom('input', id).classList.add("hidden")
    },
    deleteQuestion(id) {
      const question = this.questions.find((item) => item.id == id)
      this.questions.splice(this.questions.indexOf(question), 1);
      this.updateStoreQuestions()
      this.notifySuccess('Question deleted!')
      elbyid('tooltipEdit').classList.add("invisible")
      elbyid('tooltipDelete').classList.add("invisible")
      elbyid('tooltipSave').classList.add("invisible")
    },
    updateStoreQuestions() {
      this.$store.commit('setUserQuestions', this.questions)
    },
    notifySuccess(text) {
      this.gameNotify('success', text, 2000)
    }
  },
  mounted() {
    this.username = this.$store.state.user.name;
    this.roundCount = this.$store.state.user.roundCount
    this.questions = this.$store.state.user.questions;
    this.questions.forEach((q) => {
      addTooltip(elbyid('tooltipEdit'), qdom('edit', q.id))
      addTooltip(elbyid('tooltipSave'), qdom('save', q.id))
      addTooltip(elbyid('tooltipDelete'), qdom('delete', q.id))
    })
  }
}
</script>

<template>
  <div class="w-1/2 mx-auto">
    <div class="flex items-stretch gap-5">
      <div class="flex-1">
        <div class="text-lg font-medium dark:text-white">Username</div>
        <form class="mt-3" @submit.prevent="usernameSubmit">
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <AtSymbolIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="text" id="username" v-model="username" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cornflower-300 focus:border-cornflower-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="username" required>
            <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-cornflower-300 hover:bg-cornflower-200 focus:ring-4 focus:outline-none focus:ring-cornflower-300 font-medium rounded-lg text-sm px-4 py-2">Change</button>
          </div>
        </form>
      </div>
      <div class="w-56">
        <div class="text-lg font-medium dark:text-white">Rounds per game</div>
        <form class="mt-3" @submit.prevent="roundCountSubmit">
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FlagIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="text" id="roundCount" v-model="roundCount" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cornflower-300 focus:border-cornflower-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="username" required>
            <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-cornflower-300 hover:bg-cornflower-200 focus:ring-4 focus:outline-none focus:ring-cornflower-300 font-medium rounded-lg text-sm px-4 py-2">Change</button>
          </div>
        </form>
      </div>
    </div>

    <form class="mt-20" @submit.prevent="addQuestion">
      <div class="text-lg font-medium dark:text-white">Add your question</div>
      <div class="flex gap-2 mt-3">
        <div class="flex-1 relative">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <PlusCircleIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input type="text" id="questionInput" v-model="questionInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your new question">
        </div>
        <button type="submit" class="text-white bg-cornflower-300 hover:bg-cornflower-200 focus:ring-4 focus:outline-none focus:ring-cornflower-300 font-medium rounded-lg text-sm px-4 py-2">
          Add
        </button>
      </div>
    </form>

    <div class="mt-10 text-md font-medium dark:text-white">User-added Questions</div>
    <div class="mt-3 mb-16 flex flex-col">
      <div class="question-item mb-5" v-for="q in questions.slice().reverse()" :key="q.id" :data-question-id="q.id">
        <div class="text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-sm px-4 py-3 text-center w-full inline-flex items-center">
          <SearchIcon class="w-5 h-5 mr-3 text-white" />
          <div class="flex-1">
            <div class="question-item-text" :data-question-id="q.id">
              <span @click="editQuestion(q.id)">{{ q.query }} ...</span>
            </div>
            <div class="question-item-input hidden" :data-question-id="q.id">
              <input type="text" :value="q.query" @keyup.enter="saveQuestion(q.id)" placeholder="" :data-question-id="q.id" class="question-item-input-field font-medium text-sm text-center px-0 py-0 bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0" />
            </div>
          </div>
          <div class="inline-flex items-center justify-content">
            <a @click="editQuestion(q.id)" :data-question-id="q.id" data-tooltip-target="tooltipEdit" class="mr-3 question-item-edit">
              <PencilIcon class="w-5 h-5 text-white" />
            </a>
            <a @click="saveQuestion(q.id)" :data-question-id="q.id" data-tooltip-target="tooltipSave" class="mr-3 hidden question-item-save">
              <CheckIcon class="w-5 h-5 text-white" />
            </a>
            <a @click="deleteQuestion(q.id)" :data-question-id="q.id" data-tooltip-target="tooltipDelete" class="question-item-delete">
              <XIcon class="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
      <div id="tooltipEdit" ref="tooltipEdit" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Edit
      </div>
      <div id="tooltipDelete" ref="tooltipDelete" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Delete
      </div>
      <div id="tooltipSave" ref="tooltipSave" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Save
      </div>
    </div>
  </div>
</template>