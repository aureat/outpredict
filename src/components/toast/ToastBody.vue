<script>
import { SparklesIcon } from '@heroicons/vue/outline'
import { EmojiSadIcon, EmojiHappyIcon, HandIcon, CheckIcon, FireIcon, LightningBoltIcon, InformationCircleIcon } from '@heroicons/vue/solid'

export default {
  name: "ToastBody",
  components: {
    SparklesIcon, EmojiSadIcon, EmojiHappyIcon, HandIcon, CheckIcon, FireIcon, LightningBoltIcon, InformationCircleIcon
  },
  props: {
    icon: String,
    msg: String,
  }
}
</script>

<template>

    <div v-if="icon == 'success'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <CheckIcon class="w-6 h-6" />
    </div>

    <div v-if="icon == 'info'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <InformationCircleIcon class="w-6 h-6" />
    </div>

    <div v-else-if="icon == 'score'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <SparklesIcon class="w-7 h-7" />
    </div>

    <div v-else-if="icon == 'sad'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <EmojiSadIcon class="w-7 h-7" />
    </div>

    <div v-else-if="icon == 'happy'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <EmojiHappyIcon class="w-7 h-7" />
    </div>

    <div v-else-if="icon == 'hand'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <HandIcon class="w-7 h-7" />
    </div>

    <div v-else-if="icon == 'fire'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <FireIcon class="w-7 h-7" />
    </div>

    <div v-else-if="icon == 'bolt'" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        <LightningBoltIcon class="w-7 h-7" />
    </div>

    <div class="ml-3 text-sm font-sans font-medium" v-html="msg"></div>
</template>