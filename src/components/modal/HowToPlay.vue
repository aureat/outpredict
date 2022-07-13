<script>
export default {
  name: 'HowToPlay',
  props: {
    show: Boolean,
  }
}
</script>

<template>
  <!-- How to play -->
  <div v-if="show" aria-hidden="true" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 flex justify-center items-center h-modal md:h-full md:inset-0">
      <div class="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">How to play?</h3>
                  <button @click="$emit('close')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                  </button>
              </div>
              <!-- Modal body -->
              <div class="p-6 space-y-6">
                  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      In OutPredict you are trying to guess how google would autocomplete a query.
                      You have to think about what do people usually search in google that begins with that query.
                  </p>
                  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      You have to complete all 5 rounds to score points for the set you chose in the beginning.
                      You have to guess 6 predictions for each question to be able to move on to the next one and keep your points.
                  </p>
                  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      When you can't guess further, you can give up on a given question and see all the predictions.
                      But you will lose all the points you scored for that question, and you will not be able to play that question again.
                      Once you finish 5 rounds, you can return to the set and complete the remaining questions.
                  </p>
              </div>
          </div>
      </div>
  </div>
</template>