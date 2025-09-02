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

        <div v-else class="space-y-3">
            <div v-for="report in reports" :key="report.id"
                class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-4 hover:shadow-xl hover:border-accent-primary/30 hover:bg-dark-panel/80 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3 flex-1 cursor-pointer" @click="viewReport(report)">
                        <HeroImage :hero-id="report.heroId" :width="48" :height="48" class="rounded"
                            :alt="report.heroName" />
                        <div class="flex-1">
                            <div class="flex items-center space-x-2">
                                <div class="font-medium text-text-primary">
                                    {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                                </div>
                                <span class="text-xs px-2 py-1 rounded-full"
                                    :class="report.win === true ? 'bg-accent-success/10 text-accent-success border border-accent-success/30' : 'bg-accent-error/10 text-accent-error border border-accent-error/30'">
                                    {{ report.win === true ? 'Victory' : 'Defeat' }}
                                </span>
                            </div>
                            <div class="text-sm text-text-secondary">
                                Match {{ report.matchId }} • {{ formatDate(report.timestamp) }}
                            </div>
                            <div class="text-sm text-text-primary mt-1">
                                {{ report.summary }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click.stop="copyShareLink(report)"
                            class="text-text-secondary hover:text-accent-primary p-2 rounded-md hover:bg-accent-primary/10 transition-colors focus-accent"
                            title="Share">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                </path>
                            </svg>
                        </button>
                        <button @click.stop="confirmDeleteReport(report)"
                            class="text-accent-error hover:text-accent-error/80 p-2 rounded-md hover:bg-accent-error/10 transition-colors focus-accent"
                            title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="reports.length > 0" class="mt-8 text-center">
            <button @click="confirmClearHistory"
                class="px-4 py-2 text-text-secondary hover:text-accent-error transition-colors focus-accent">
                Clear All History
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHeroes } from '../composables/useHeroes'

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
const { loadHeroes } = useHeroes()

// No parsing needed for STRATZ data
const isParsing = (matchId: string) => false
const getAllParsingMatches = () => []

onMounted(async () => {
    // Load hero data first so images can be displayed
    await loadHeroes()
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

const confirmDeleteReport = (report: ReportSummary) => {
    if (confirm(`Are you sure you want to delete the analysis for ${report.heroName} (${getRoleDisplayName(report.role)}) from match ${report.matchId}?`)) {
        deleteReport(report)
    }
}

const deleteReport = (report: ReportSummary) => {
    const updated = reports.value.filter(r => r.id !== report.id)
    reports.value = updated
    localStorage.setItem('replay-checker-history', JSON.stringify(updated))
}

const confirmClearHistory = () => {
    if (confirm('Are you sure you want to clear all analysis history? This action cannot be undone.')) {
        clearHistory()
    }
}

const clearHistory = () => {
    reports.value = []
    localStorage.removeItem('replay-checker-history')
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