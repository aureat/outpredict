<script>
export default {
  name: "SearchResult",
  props: {
    prediction: String,
    predictionAnswer: String,
    solved: Boolean,
  },
  computed: {
    resultString() {
      if (!this.solved) {
        return this.prediction.replace(
          this.predictionAnswer,
          `<span class="notguessed bg-gray-400 dark:bg-gray-600" style="width: ${
            this.predictionAnswer.length * 8
          }px"></span>`
        );
      } else {
        return this.prediction.replace(
          this.predictionAnswer,
          `<span class="guessed text-white bg-cornflower-300">${this.predictionAnswer}</span>`
        );
      }
    },
  },
};
</script>

<template>
  <div class="result">
    <div class="result-icon"></div>
    <div class="result-text text-black dark:text-white" v-html="resultString"></div>
  </div>
</template>

<style>
</style>
