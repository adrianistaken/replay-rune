<template>
    <div class="rounded-lg p-8 mb-8"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
        <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">Mid Game</h2>

        <!-- Summary -->
        <div class="mb-6 p-4 bg-[var(--card-background)]/20 rounded-lg">
            <p class="text-[var(--text-primary)] text-lg leading-relaxed">{{ summary }}</p>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Net Worth @ Mid Game -->
            <div
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-3 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-[var(--text-primary)]">Net Worth @ {{ midGameMinute }} mins
                        </h3>
                        <span :class="getPerformanceColor(networthComparison.percentageDiff)"
                            class="text-lg font-bold rounded-full bg-[var(--card-background)]/50">
                            {{ formatPercentage(networthComparison.percentageDiff) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-3 py-0">
                    <div class="space-y-2">
                        <div class="flex justify-between items-center py-2 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium">Your Net Worth</span>
                            <span class="text-[var(--text-primary)] font-bold text-lg">{{
                                formatValue(networthComparison.playerValue) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium">Average Net Worth</span>
                            <span class="text-[var(--text-primary)] font-bold text-lg">{{
                                formatValue(networthComparison.averageValue) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-[var(--text-secondary)] font-medium">Difference</span>
                            <span
                                :class="networthComparison.difference >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-error)]'"
                                class="font-bold text-lg">
                                {{ formatDifference(networthComparison.difference) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Last Hits @ Mid Game -->
            <div
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-3 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-[var(--text-primary)]">Last Hits @ {{ midGameMinute }} mins
                        </h3>
                        <span :class="getPerformanceColor(lastHitsComparison.percentageDiff)"
                            class="text-lg font-bold rounded-full bg-[var(--card-background)]/50">
                            {{ formatPercentage(lastHitsComparison.percentageDiff) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-3 py-0">
                    <div class="space-y-2">
                        <div class="flex justify-between items-center py-2 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium">Your Last Hits</span>
                            <span class="text-[var(--text-primary)] font-bold text-lg">{{
                                lastHitsComparison.playerValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium">Average Last Hits</span>
                            <span class="text-[var(--text-primary)] font-bold text-lg">{{
                                lastHitsComparison.averageValue.toFixed(1) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-[var(--text-secondary)] font-medium">Difference</span>
                            <span
                                :class="lastHitsComparison.difference >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-error)]'"
                                class="font-bold text-lg">
                                {{ formatDifference(lastHitsComparison.difference) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface MidGameComparison {
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
}

interface Props {
    networthComparison: MidGameComparison
    lastHitsComparison: MidGameComparison
    summary: string
    midGameMinute: number
}

defineProps<Props>()

const formatValue = (value: number): string => {
    if (isNaN(value)) {
        return '0'
    }
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K'
    } else {
        return value.toFixed(0)
    }
}

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
    return `${sign}${difference.toFixed(0)}`
}

const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 20) return 'text-[var(--accent-success)]'
    if (percentage >= 10) return 'text-green-400'
    if (percentage >= 0) return 'text-yellow-400'
    if (percentage >= -10) return 'text-orange-400'
    return 'text-[var(--accent-error)]'
}
</script>
