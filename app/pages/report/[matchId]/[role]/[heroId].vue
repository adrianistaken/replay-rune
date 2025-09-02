<template>
    <div class="max-w-4xl mx-auto">
        <div v-if="isLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Analyzing Match...</h2>
            <p class="text-text-secondary">Fetching data from STRATZ and generating your report</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
            <div class="text-accent-error text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Analysis Failed</h2>
            <p class="text-text-secondary mb-6">{{ error }}</p>
            <NuxtLink to="/"
                class="px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors focus-accent">
                Try Again
            </NuxtLink>
        </div>

        <div v-else-if="report">
            <!-- Header Card -->
            <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-6">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-4 mb-2">
                            <HeroImage v-if="report.heroId" :hero-id="report.heroId" :width="64" :height="64"
                                class="rounded" :alt="report.heroName" />
                            <div>
                                <h1 class="text-2xl font-bold text-text-primary">
                                    {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                                </h1>
                            </div>
                        </div>
                        <p class="text-lg text-text-primary">{{ report.summary }}</p>
                        <div class="flex items-center mt-2 text-sm text-text-secondary">
                            <span>Match {{ report.matchId }}</span>
                            <span class="mx-2">•</span>
                            <span>{{ formatDuration(report.matchDuration) }}</span>
                            <span class="mx-2">•</span>
                            <span :class="report.radiantWin ? 'text-team-radiant' : 'text-team-dire'">
                                {{ report.radiantWin ? 'Radiant Victory' : 'Dire Victory' }}
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button @click="copyShareLink"
                            class="text-text-secondary hover:text-accent-primary p-2 rounded-md hover:bg-accent-primary/10 transition-colors focus-accent"
                            title="Share">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                </path>
                            </svg>
                        </button>
                        <NuxtLink to="/"
                            class="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors focus-accent">
                            New Analysis
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Wins -->
            <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-6">
                <h2 class="text-xl font-semibold text-text-primary mb-4">What You Did Well</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="win in report.wins" :key="win.title"
                        class="p-4 bg-accent-success/10 rounded-lg border-l-4 border-accent-success">
                        <h3 class="font-semibold text-accent-success">{{ win.title }}</h3>
                        <p class="text-accent-success/80 mt-1">{{ win.description }}</p>
                        <div v-if="win.dataSource"
                            class="text-xs text-accent-success/40 mt-2 italic border-t border-accent-success/20 pt-2">
                            {{ win.dataSource }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top 3 Fixes -->
            <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-6">
                <h2 class="text-xl font-semibold text-text-primary mb-4">Fixes for Next Game</h2>
                <div class="space-y-4">
                    <div v-for="(fix, index) in report.fixes" :key="fix.title"
                        class="flex items-start space-x-4 p-4 bg-accent-error/10 rounded-lg border-l-4 border-accent-error">
                        <div
                            class="flex-shrink-0 w-8 h-8 bg-accent-error text-white rounded-full flex items-center justify-center font-bold">
                            {{ index + 1 }}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-accent-error">{{ fix.title }}</h3>
                            <p class="text-accent-error/80 mt-1">{{ fix.description }}</p>
                            <div v-if="fix.dataSource"
                                class="text-xs text-accent-error/40 mt-2 italic border-t border-accent-error/20 pt-2">
                                {{ fix.dataSource }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KPI Grid -->
            <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 class="text-xl font-semibold text-gray-100 mb-4">Performance Metrics</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="kpi in report.kpis" :key="kpi.name"
                        class="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-lg transition-all duration-200">
                        <div class="text-sm text-gray-400 mb-1">{{ kpi.name }}</div>
                        <div class="text-lg font-semibold text-gray-100">
                            {{ kpi.value }}{{ kpi.unit }}
                        </div>
                        <div class="flex items-center mt-2">
                            <div class="flex-1 bg-gray-600 rounded-full h-2">
                                <div class="h-2 rounded-full transition-all duration-300"
                                    :class="getPercentileColor(kpi.percentile)"
                                    :style="{ width: `${kpi.percentile}%` }"></div>
                            </div>
                            <span class="ml-2 text-sm font-medium" :class="getPercentileTextColor(kpi.percentile)">
                                {{ kpi.percentile }}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHeroes } from '../../../../composables/useHeroes'

interface AnalysisReport {
    id: string
    matchId: string
    heroName: string
    heroId: number
    heroImg: string
    role: string
    summary: string
    kpis: any[]
    fixes: any[]
    wins: any[]
    timeline: any[]
    timestamp: number
    matchDuration: number
    radiantWin: boolean
    playerSlot: number
}

const route = useRoute()
const report = ref<AnalysisReport | null>(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
    const matchId = route.params.matchId as string
    const role = route.params.role as string
    const heroId = route.params.heroId as string

    if (!matchId || !role || !heroId) {
        error.value = 'Invalid URL parameters'
        isLoading.value = false
        return
    }

    try {
        // Check cache first
        const reportCacheKey = `report-${matchId}-${role}-${heroId}`
        const cachedReport = localStorage.getItem(reportCacheKey)

        if (cachedReport) {
            report.value = JSON.parse(cachedReport)
            isLoading.value = false
            return
        }

        // No cached report, fetching fresh data...
        // Fetch match data from STRATZ
        const { StratzService } = await import('../../../../services/stratz')
        const matchData = await StratzService.fetchMatch(matchId)

        if (!matchData || !matchData.players) {
            throw new Error('Failed to load match data')
        }

        // Find the player
        const player = matchData.players.find((p: any) => p.hero.id.toString() === heroId)
        if (!player) {
            throw new Error(`Hero ${heroId} not found in match`)
        }

        // Get hero data
        const { loadHeroes, getHero } = useHeroes()
        await loadHeroes()
        const heroData = getHero(player.hero.id)
        const heroName = heroData?.localized_name || player.hero.displayName

        // Compute player data and KPIs
        const playerData = StratzService.computePlayerData(matchData, parseInt(heroId), role)
        const kpis = StratzService.computeKPIs(playerData)

        // Run analysis using the v3 rule engine
        const { StratzRuleEngine } = await import('../../../../services/stratzRuleEngine')
        const analysis = await StratzRuleEngine.analyzePlayer(playerData, kpis)

        // Create the report
        const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const finalReport = {
            id: reportId,
            matchId: matchId,
            heroName: heroName,
            heroId: player.hero.id,
            heroImg: heroData?.img || '',
            role: role,
            summary: analysis.summary,
            kpis: kpis.map(kpi => ({
                name: kpi.name,
                value: kpi.value,
                unit: kpi.unit,
                percentile: kpi.percentile,
                median: kpi.median,
                delta: kpi.delta,
                benchmark: kpi.median,
                description: kpi.name
            })),
            fixes: analysis.fixes,
            wins: analysis.wins,
            timeline: analysis.timeline || [],
            timestamp: Date.now(),
            matchDuration: matchData.durationSeconds,
            radiantWin: matchData.didRadiantWin,
            playerSlot: player.isRadiant ? 0 : 128
        }

        report.value = finalReport

        // Cache the report
        localStorage.setItem(reportCacheKey, JSON.stringify(finalReport))

        // Save to history
        saveToHistory(finalReport)

        isLoading.value = false

    } catch (err: any) {
        console.error('Analysis error:', err)
        error.value = err.message || 'Failed to analyze match'
        isLoading.value = false
    }
})

const saveToHistory = (report: AnalysisReport) => {
    const summary = {
        id: report.id,
        matchId: report.matchId,
        heroName: report.heroName,
        heroId: report.heroId,
        role: report.role,
        summary: report.summary,
        timestamp: report.timestamp,
        win: report.radiantWin === (report.playerSlot < 128)
    }

    const stored = localStorage.getItem('replay-checker-history')
    const history = stored ? JSON.parse(stored) : []
    const filtered = history.filter((r: any) => r.matchId !== report.matchId || r.role !== report.role)
    const updated = [summary, ...filtered].slice(0, 5)
    localStorage.setItem('replay-checker-history', JSON.stringify(updated))
}

const copyShareLink = async () => {
    const url = window.location.href
    try {
        await navigator.clipboard.writeText(url)
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
        'pos1': 'carry',
        'pos2': 'mid',
        'pos3': 'offlane',
        'pos4': 'soft support',
        'pos5': 'hard support'
    }
    return roleMap[role] || role
}

const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-gradient-to-r from-purple-500 to-purple-600'
    if (percentile >= 80) return 'bg-gradient-to-r from-accent-primary to-accent-primary/80'
    if (percentile >= 70) return 'bg-gradient-to-r from-accent-success to-accent-success/80'
    if (percentile >= 60) return 'bg-gradient-to-r from-accent-warning to-accent-warning/80'
    if (percentile >= 40) return 'bg-gradient-to-r from-accent-warning to-accent-warning/80'
    return 'bg-gradient-to-r from-accent-error to-accent-error/80'
}

const getPercentileTextColor = (percentile: number) => {
    if (percentile >= 90) return 'text-purple-400'
    if (percentile >= 80) return 'text-accent-primary'
    if (percentile >= 70) return 'text-accent-success'
    if (percentile >= 60) return 'text-accent-warning'
    if (percentile >= 40) return 'text-accent-warning'
    return 'text-accent-error'
}
</script>