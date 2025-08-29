<template>
    <div class="max-w-4xl mx-auto">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-100 mb-4">Analysis History</h1>
            <p class="text-lg text-gray-300">
                Your recent match analyses and insights.
            </p>
        </div>

        <!-- Currently Parsing Matches -->
        <div v-if="getAllParsingMatches.length > 0" class="mb-8">
            <h2 class="text-lg font-semibold text-gray-100 mb-4">Currently Parsing</h2>
            <div class="space-y-3">
                <div v-for="status in getAllParsingMatches" :key="status.matchId"
                    class="bg-gray-800 rounded-lg border border-orange-700 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                            <div>
                                <div class="text-gray-100 font-medium">Match {{ status.matchId }}</div>
                                <div class="text-sm text-gray-400">Parsing replay data...</div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ formatDate(status.lastChecked) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="reports.length === 0 && getAllParsingMatches.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">📊</div>
            <h2 class="text-xl font-semibold text-gray-100 mb-2">No Reports Yet</h2>
            <p class="text-gray-400 mb-6">Analyze your first match to see your history here.</p>
            <NuxtLink to="/"
                class="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                Analyze a Match
            </NuxtLink>
        </div>

        <div v-else class="space-y-4">
            <div v-for="report in reports" :key="report.id"
                class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all cursor-pointer"
                @click="viewReport(report)">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <h3 class="text-lg font-semibold text-gray-100">
                                {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                            </h3>
                            <span
                                class="ml-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600">
                                Match {{ report.matchId }}
                            </span>
                            <span class="ml-2 text-xs px-2 py-1 rounded-full"
                                :class="report.win ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'">
                                {{ report.win ? 'Victory' : 'Defeat' }}
                            </span>
                            <span v-if="isParsing(report.matchId)"
                                class="ml-2 text-xs px-2 py-1 rounded-full bg-orange-900/50 text-orange-300 border border-orange-700 flex items-center">
                                <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500 mr-1"></div>
                                Parsing
                            </span>
                        </div>
                        <p class="text-gray-300 mb-3">{{ report.summary }}</p>
                        <div class="text-sm text-gray-400">
                            Analyzed {{ formatDate(report.timestamp) }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click.stop="copyShareLink(report)"
                            class="p-2 text-gray-400 hover:text-orange-400 transition-colors" title="Share">
                            📋
                        </button>
                        <button @click.stop="deleteReport(report)"
                            class="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="reports.length > 0" class="mt-8 text-center">
            <button @click="clearHistory" class="px-4 py-2 text-gray-400 hover:text-red-400 transition-colors">
                Clear All History
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useParsingStatus } from '../composables/useParsingStatus'

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
const { isParsing, getAllParsingMatches } = useParsingStatus()

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