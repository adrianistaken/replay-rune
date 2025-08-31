<template>
    <div class="flex flex-col items-center justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-4"></div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">Parsing Replay...</h3>
        <p class="text-text-secondary text-center max-w-md">
            {{ message || "We're analyzing your match data. This usually takes just a few moments." }}
        </p>
        <div class="mt-4 text-sm text-text-muted">
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