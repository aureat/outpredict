<script>
import { ExternalLinkIcon } from '@heroicons/vue/outline'

export default {
    name: "Footer",
    components: {
        ExternalLinkIcon
    }
}
</script>

<template>
    <footer class="p-4 mb-10 bg-gray-200 rounded-lg shadow flex items-center justify-center md:p-6 dark:bg-gray-800">
        <span class="text-sm text-gray-500 dark:text-gray-400 mr-5">
            © 2022 Altun Hasanli
        </span>
        <a href="https://github.com/altunh" target="_blank" class="text-sm text-gray-300 inline-flex items-center hover:underline">
            <ExternalLinkIcon class="w-4 h-4 text-white mr-1" />
            Github
        </a>
    </footer>
</template>