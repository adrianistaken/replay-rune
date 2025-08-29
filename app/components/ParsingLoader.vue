<template>
    <div class="flex flex-col items-center justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <h3 class="text-lg font-semibold text-gray-100 mb-2">Parsing Replay...</h3>
        <p class="text-gray-400 text-center max-w-md">
            {{ message || "We're analyzing your match data. This usually takes just a few moments." }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
            Match ID: {{ matchId }}
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    matchId: string
    message?: string
}

defineProps<Props>()
</script>