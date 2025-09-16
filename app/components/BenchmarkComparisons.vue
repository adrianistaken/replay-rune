<template>
    <div class="rounded-lg p-8"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
        <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">Performance vs Average</h2>
        <div v-if="comparisons && comparisons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="comparison in comparisons" :key="comparison.metric"
                class="bg-[var(--card-background)]/30 rounded-lg overflow-hidden border border-[var(--card-background)]/50 h-fit">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-[var(--primary-color)]/20 to-[var(--primary-color)]/10 p-3 border-b border-[var(--card-background)]/50">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-[var(--text-primary)] text-lg">{{ comparison.displayName }}</h3>
                        <span :class="getPerformanceColor(comparison.percentageDiff, comparison.metric)"
                            class="text-sm font-bold rounded-full bg-[var(--card-background)]/50">
                            {{ formatPercentage(comparison.percentageDiff, comparison.metric) }}
                        </span>
                    </div>
                </div>
                <!-- Data Table -->
                <div class="px-3 py-0">
                    <div class="space-y-2">
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Your Value</span>
                            <span class="text-[var(--text-primary)] font-bold">{{ formatValue(comparison.playerValue)
                            }}{{ comparison.unit }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1 border-b border-[var(--card-background)]/30">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Average</span>
                            <span class="text-[var(--text-primary)] font-bold">{{ formatValue(comparison.averageValue)
                            }}{{ comparison.unit }}</span>
                        </div>
                        <div class="flex justify-between items-center py-1">
                            <span class="text-[var(--text-secondary)] font-medium text-sm">Difference</span>
                            <span :class="getPerformanceColor(comparison.percentageDiff, comparison.metric)"
                                class="font-bold">
                                {{ formatDifference(comparison.difference, comparison.metric) }}{{ comparison.unit }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-8">
            <p class="text-[var(--text-secondary)]">No benchmark data available for this match.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BenchmarkComparison } from '../services/mvpBenchmarkEngine'

interface Props {
    comparisons: BenchmarkComparison[]
}

defineProps<Props>()

const formatValue = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0'
    }
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K'
    } else {
        return value.toFixed(1)
    }
}

const formatPercentage = (percentage: number | undefined | null, metric: string): string => {
    if (percentage === undefined || percentage === null || isNaN(percentage)) {
        return '+0.0%'
    }

    // For deaths, invert the percentage since lower is better
    const adjustedPercentage = metric === 'deaths' ? -percentage : percentage
    const sign = adjustedPercentage >= 0 ? '+' : ''
    return `${sign}${adjustedPercentage.toFixed(1)}%`
}

const formatDifference = (difference: number | undefined | null, metric: string): string => {
    if (difference === undefined || difference === null || isNaN(difference)) {
        return '+0.0'
    }

    // For deaths, invert the difference since lower is better
    const adjustedDifference = metric === 'deaths' ? -difference : difference
    const sign = adjustedDifference >= 0 ? '+' : ''
    return `${sign}${adjustedDifference.toFixed(1)}`
}

const getPerformanceColor = (percentage: number, metric: string): string => {
    // For deaths, invert the percentage since lower is better
    const adjustedPercentage = metric === 'deaths' ? -percentage : percentage

    if (adjustedPercentage >= 20) return 'text-[var(--accent-success)]'
    if (adjustedPercentage >= 10) return 'text-green-400'
    if (adjustedPercentage >= 0) return 'text-yellow-400'
    if (adjustedPercentage >= -10) return 'text-orange-400'
    return 'text-[var(--accent-error)]'
}
</script>
