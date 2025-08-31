<template>
    <div class="max-w-4xl mx-auto">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-text-primary mb-4">Analysis History</h1>
            <p class="text-lg text-text-primary">
                Your recent match analyses and insights.
            </p>
        </div>

        <div v-if="reports.length === 0" class="text-center py-12">
            <div class="text-text-muted text-6xl mb-4">📊</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">No Reports Yet</h2>
            <p class="text-text-secondary mb-6">Analyze your first match to see your history here.</p>
            <NuxtLink to="/"
                class="px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors focus-accent">
                Analyze a Match
            </NuxtLink>
        </div>

        <div v-else class="space-y-4">
            <div v-for="report in reports" :key="report.id"
                class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 hover:shadow-xl transition-all cursor-pointer"
                @click="viewReport(report)">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <h3 class="text-lg font-semibold text-text-primary">
                                {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                            </h3>
                            <span
                                class="ml-2 px-2 py-1 bg-dark-card text-text-secondary text-xs rounded-full border border-dark-border-light">
                                Match {{ report.matchId }}
                            </span>
                            <span class="ml-2 text-xs px-2 py-1 rounded-full"
                                :class="report.win ? 'bg-accent-success/10 text-accent-success border border-accent-success/30' : 'bg-accent-error/10 text-accent-error border border-accent-error/30'">
                                {{ report.win ? 'Victory' : 'Defeat' }}
                            </span>

                        </div>
                        <p class="text-text-primary mb-3">{{ report.summary }}</p>
                        <div class="text-sm text-text-secondary">
                            Analyzed {{ formatDate(report.timestamp) }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click.stop="copyShareLink(report)"
                            class="p-2 text-text-secondary hover:text-accent-primary transition-colors focus-accent"
                            title="Share">
                            📋
                        </button>
                        <button @click.stop="deleteReport(report)"
                            class="p-2 text-text-secondary hover:text-accent-error transition-colors focus-accent"
                            title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="reports.length > 0" class="mt-8 text-center">
            <button @click="clearHistory"
                class="px-4 py-2 text-text-secondary hover:text-accent-error transition-colors focus-accent">
                Clear All History
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'


interface ReportSummary {
    id: string
    matchId: string
    heroName: string
    heroId: number
    role: string
    summary: string
    timestamp: number
    win: boolean
}

const reports = ref<ReportSummary[]>([])
// No parsing needed for STRATZ data
const isParsing = (matchId: string) => false
const getAllParsingMatches = () => []

onMounted(() => {
    loadHistory()
})

const loadHistory = () => {
    const stored = localStorage.getItem('replay-checker-history')
    if (stored) {
        try {
            const history = JSON.parse(stored)
            // Filter out old reports that don't have the required fields
            const validReports = history.filter((report: any) =>
                report &&
                report.id &&
                report.matchId &&
                report.heroName &&
                report.heroId &&
                report.role &&
                report.summary &&
                report.timestamp &&
                typeof report.win === 'boolean'
            )
            reports.value = validReports
        } catch (e) {
            console.error('Failed to load history:', e)
            reports.value = []
        }
    }
}

const viewReport = (report: ReportSummary) => {
    // Navigate to the report page with hero ID
    window.location.href = `/report/${report.matchId}/${report.role}/${report.heroId}`
}

const copyShareLink = async (report: ReportSummary) => {
    const url = `${window.location.origin}/report/${report.matchId}/${report.role}/${report.heroId}`
    try {
        await navigator.clipboard.writeText(url)
        // TODO: Show success toast
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const deleteReport = (report: ReportSummary) => {
    if (confirm('Are you sure you want to delete this report?')) {
        const updated = reports.value.filter(r => r.id !== report.id)
        reports.value = updated
        localStorage.setItem('replay-checker-history', JSON.stringify(updated))
    }
}

const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
        reports.value = []
        localStorage.removeItem('replay-checker-history')
    }
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
        return 'Just now'
    } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
        return date.toLocaleDateString()
    }
}

const getRoleDisplayName = (role: string) => {
    if (!role) return 'unknown'

    const roleMap: { [key: string]: string } = {
        'pos1': 'carry',
        'pos2': 'mid',
        'pos3': 'offlane',
        'pos4': 'soft support',
        'pos5': 'hard support'
    }
    return roleMap[role] || role
}
</script>