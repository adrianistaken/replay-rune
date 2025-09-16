<template>
    <div class="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden"
        style="background-color: var(--background-color); background-image: url('https://cdn.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">

        <!-- Header -->
        <AppNavigation />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 lg:px-8 relative z-10">
            <!-- Dark overlay for readability -->
            <div class="fixed inset-0 bg-black/30 -z-10"></div>

            <!-- Page Header -->
            <div class="mb-12 text-center pt-8 md:pt-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">Analysis History</h2>
                <p class="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">Your recent match analyses and
                    insights. Track your progress and review past performances.</p>
            </div>

            <!-- Content Container -->
            <div class="max-w-4xl mx-auto">
                <!-- Empty State -->
                <div v-if="reports.length === 0" class="text-center py-16">
                    <div class="rounded-lg p-12 mb-8"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <div class="text-[var(--text-secondary)] text-6xl mb-6">📊</div>
                        <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-4">No Reports Yet</h2>
                        <p class="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">Analyze your first match to see
                            your history here. Start improving your Dota 2 gameplay today!</p>
                        <NuxtLink to="/analysis"
                            class="bg-[var(--accent-color)] text-black font-bold py-3 px-8 rounded-md text-lg glowing-button hover:shadow-[0_0_20px_rgba(207,90,44,0.6)] transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                            Analyze a Match
                        </NuxtLink>
                    </div>
                </div>

                <!-- Reports List -->
                <div v-else class="space-y-4">
                    <div v-for="report in reports" :key="report.id"
                        class="rounded-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-4 flex-1 cursor-pointer" @click="viewReport(report)">
                                <HeroImage :hero-id="report.heroId" :width="64" :height="64" class="rounded-lg"
                                    :alt="report.heroName" />
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <div class="text-xl font-bold text-[var(--text-primary)]">
                                            {{ report.heroName }}
                                        </div>
                                        <div
                                            class="text-sm text-[var(--text-secondary)] bg-[var(--card-background)]/50 px-3 py-1 rounded-full">
                                            {{ getRoleDisplayName(report.role) }}
                                        </div>
                                        <span class="text-xs px-3 py-2 rounded-full font-medium"
                                            :class="report.win === true ? 'bg-[var(--accent-success)]/10 text-[var(--accent-success)]' : 'bg-[var(--accent-error)]/10 text-[var(--accent-error)]'">
                                            {{ report.win === true ? 'Victory' : 'Defeat' }}
                                        </span>
                                    </div>
                                    <div class="text-sm text-[var(--text-secondary)] mb-3">
                                        Match {{ report.matchId }} • {{ formatDate(report.timestamp) }}
                                    </div>
                                    <div class="text-[var(--text-primary)] leading-relaxed">
                                        {{ report.summary }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 ml-4">
                                <button @click.stop="copyShareLink(report)"
                                    class="text-[var(--text-secondary)] hover:text-[var(--primary-color)] p-3 rounded-md hover:bg-[var(--primary-color)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                    title="Share">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                        </path>
                                    </svg>
                                </button>
                                <button @click.stop="confirmDeleteReport(report)"
                                    class="text-[var(--accent-error)] hover:text-[var(--accent-error)]/80 p-3 rounded-md hover:bg-[var(--accent-error)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-error)]"
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

                <!-- Clear History Button -->
                <div v-if="reports.length > 0" class="mt-12 text-center">
                    <button @click="confirmClearHistory"
                        class="px-6 py-3 text-[var(--text-secondary)] hover:text-[var(--accent-error)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-error)] rounded-md hover:bg-[var(--accent-error)]/10">
                        Clear All History
                    </button>
                </div>
            </div>
        </main>

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

<style scoped>
/* Component-specific styles can go here if needed */
</style>