<template>
    <div class="rounded-lg p-4 mb-4"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
        <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Support</h2>

        <!-- Summary -->
        <div class="mb-4 p-3 bg-[var(--card-background)]/20 rounded-lg">
            <p class="text-[var(--text-primary)] text-base leading-relaxed">{{ summary }}</p>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 gap-4">
            <!-- Camps Stacked -->
            <div
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-2 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-[var(--text-primary)]">Camps Stacked</h3>
                        <span :class="getPerformanceColor(campsStackedComparison.percentageDiff)"
                            class="text-sm font-bold rounded-full bg-[var(--card-background)]/50 px-2 py-1">
                            {{ formatPercentage(campsStackedComparison.percentageDiff) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-2 py-1">
                    <div class="space-y-1">
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Your Camps Stacked</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                campsStackedComparison.playerValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Average Camps Stacked</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                campsStackedComparison.averageValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Difference</span>
                            <span
                                :class="campsStackedComparison.difference >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-error)]'"
                                class="font-bold">
                                {{ formatDifference(campsStackedComparison.difference) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface SupportComparison {
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
}

interface Props {
    campsStackedComparison: SupportComparison
    summary: string
}

defineProps<Props>()

const formatPercentage = (percentage: number): string => {
    if (isNaN(percentage)) {
        return '+0.0%'
    }
    const sign = percentage >= 0 ? '+' : ''
    return `${sign}${percentage.toFixed(1)}%`
}

const formatDifference = (difference: number): string => {
    if (isNaN(difference)) {
        return '+0.0'
    }
    const sign = difference >= 0 ? '+' : ''
    return `${sign}${difference.toFixed(1)}`
}

const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 20) return 'text-[var(--accent-success)]'
    if (percentage >= 10) return 'text-green-400'
    if (percentage >= 0) return 'text-yellow-400'
    if (percentage >= -10) return 'text-orange-400'
    return 'text-[var(--accent-error)]'
}
</script>
