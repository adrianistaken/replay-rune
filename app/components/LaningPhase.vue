<template>
    <div class="rounded-lg p-4 mb-4"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
        <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Laning Phase</h2>

        <!-- Summary -->
        <div class="mb-4 p-3 bg-[var(--card-background)]/20 rounded-lg">
            <p class="text-[var(--text-primary)] text-base leading-relaxed">{{ summary }}</p>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- CS @ 10 mins -->
            <div
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-2 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-[var(--text-primary)]">CS @ 10 mins</h3>
                        <span :class="getPerformanceColor(csComparison.percentageDiff)"
                            class="text-sm font-bold rounded-full bg-[var(--card-background)]/50 px-2 py-1">
                            {{ formatPercentage(csComparison.percentageDiff) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-2 py-1">
                    <div class="space-y-1">
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Your CS</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                csComparison.playerValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Average CS</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                csComparison.averageValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Difference</span>
                            <span
                                :class="csComparison.difference >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-error)]'"
                                class="font-bold">
                                {{ formatDifference(csComparison.difference) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Denies @ 10 mins -->
            <div
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-2 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-[var(--text-primary)]">Denies @ 10 mins</h3>
                        <span :class="getPerformanceColor(deniesComparison.percentageDiff)"
                            class="text-sm font-bold rounded-full bg-[var(--card-background)]/50 px-2 py-1">
                            {{ formatPercentage(deniesComparison.percentageDiff) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-2 py-1">
                    <div class="space-y-1">
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Your Denies</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                deniesComparison.playerValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Average Denies</span>
                            <span class="text-[var(--text-primary)] font-bold">{{
                                deniesComparison.averageValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Difference</span>
                            <span
                                :class="deniesComparison.difference >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-error)]'"
                                class="font-bold">
                                {{ formatDifference(deniesComparison.difference) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface LaningPhaseComparison {
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
}

interface Props {
    csComparison: LaningPhaseComparison
    deniesComparison: LaningPhaseComparison
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
