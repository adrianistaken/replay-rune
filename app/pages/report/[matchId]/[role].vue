<template>
    <div v-if="report" class="max-w-4xl mx-auto">
        <!-- Header Card -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6">
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center space-x-4 mb-2">
                        <HeroImage v-if="report.heroId" :hero-id="report.heroId" :width="64" :height="64"
                            class="rounded" :alt="report.heroName" />
                        <div>
                            <h1 class="text-2xl font-bold text-gray-100">
                                {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                            </h1>
                        </div>
                    </div>
                    <p class="text-lg text-gray-300">{{ report.summary }}</p>
                    <div class="flex items-center mt-2 text-sm text-gray-400">
                        <span>Match {{ report.matchId }}</span>
                        <span class="mx-2">•</span>
                        <span>{{ formatDuration(report.matchDuration) }}</span>
                        <span class="mx-2">•</span>
                        <span :class="report.radiantWin ? 'text-team-radiant' : 'text-team-dire'">
                            {{ report.radiantWin ? 'Radiant Victory' : 'Dire Victory' }}
                        </span>
                        <!-- Parsing Status Indicator -->
                        <div v-if="isParsing" class="flex items-center ml-4">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary mr-2"></div>
                            <span class="text-accent-primary">Parsing in progress...</span>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button @click="copyShareLink"
                        class="px-4 py-2 bg-dark-card text-text-primary rounded-md hover:bg-dark-card/80 transition-colors focus-accent">
                        Share
                    </button>
                    <NuxtLink to="/"
                        class="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors focus-accent">
                        New Analysis
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Top 3 Fixes -->
        <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Top 3 Fixes for Next Game</h2>
            <div class="space-y-4">
                <div v-for="(fix, index) in report.fixes" :key="fix.title"
                    class="flex items-start space-x-4 p-4 bg-accent-error/10 rounded-lg border-l-4 border-accent-error">
                    <div
                        class="flex-shrink-0 w-8 h-8 bg-accent-error text-white rounded-full flex items-center justify-center font-bold">
                        {{ index + 1 }}
                    </div>
                    <div>
                        <h3 class="font-semibold text-accent-error">{{ fix.title }}</h3>
                        <p class="text-accent-error/80 mt-1">{{ fix.description }}</p>
                    </div>
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
                </div>
            </div>
        </div>

        <!-- Timeline -->
        <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Key Timings</h2>
            <div class="space-y-4">
                <div v-for="marker in report.timeline" :key="marker.label" class="bg-dark-card rounded-lg p-4">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <img v-if="marker.itemImg" :src="marker.itemImg" :alt="marker.description"
                                class="h-20 rounded-lg border-2 border-dark-border-light" loading="lazy"
                                decoding="async" @error="handleItemImageError" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <h3 class="text-lg font-semibold text-text-primary">{{ marker.label }}</h3>
                                <span class="text-sm text-text-secondary">{{ marker.description }}</span>
                            </div>
                            <div v-if="marker.details" class="text-sm text-text-primary mb-2">{{ marker.details }}</div>
                            <div class="flex items-center space-x-4 text-sm">
                                <div class="flex items-center space-x-1">
                                    <span class="text-text-secondary">Purchased at:</span>
                                    <span class="font-medium text-accent-primary">{{ formatTime(marker.time) }}</span>
                                </div>
                                <div v-if="marker.delta" class="flex items-center space-x-1"
                                    :class="marker.delta > 0 ? 'text-accent-error' : 'text-accent-success'">
                                    <span class="text-text-secondary">vs 12:00:</span>
                                    <span class="font-medium">{{ marker.delta > 0 ? '+' : '' }}{{ marker.delta
                                        }}s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- KPI Grid -->
        <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Performance Metrics</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="kpi in report.kpis" :key="kpi.name"
                    class="p-4 bg-dark-card rounded-lg border border-dark-border-light hover:shadow-lg transition-all duration-200">
                    <div class="text-sm text-text-secondary mb-2 font-medium">{{ kpi.name }}</div>
                    <div class="text-2xl font-bold mb-3 text-text-primary">
                        {{ formatValue(kpi.value) }}{{ kpi.unit }}
                    </div>

                    <!-- Percentile indicator with better visual design -->
                    <div class="mb-3">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-gray-500">Percentile Rank</span>
                            <span class="text-sm font-semibold" :class="getPercentileTextColor(kpi.percentile)">
                                {{ kpi.percentile }}%
                            </span>
                        </div>
                        <div class="relative">
                            <div class="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                                <div class="h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                    :class="getPercentileColor(kpi.percentile)"
                                    :style="{ width: `${kpi.percentile}%` }">
                                </div>
                            </div>
                            <!-- Performance level indicator -->
                            <div class="mt-2 text-center">
                                <span class="text-xs font-medium px-2 py-1 rounded-full"
                                    :class="getPerformanceLevelClass(kpi.percentile)">
                                    {{ getPerformanceLevelText(kpi.percentile) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="max-w-4xl mx-auto">
        <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Analyzing Match...</h2>
            <p class="text-text-secondary">Fetching data from STRATZ and generating your report</p>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto">
        <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-12 text-center">
            <div class="text-accent-error text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Analysis Failed</h2>
            <p class="text-text-secondary mb-6">{{ error }}</p>
            <NuxtLink to="/"
                class="px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors focus-accent">
                Try Again
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHeroes } from '../../../composables/useHeroes'

// Define the interface locally for now
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

// No parsing needed for STRATZ data
const isParsing = computed(() => false)

onMounted(async () => {
    const matchId = route.params.matchId as string
    const role = route.params.role as string
    const heroId = route.params.heroId as string

    if (!matchId || !role) {
        error.value = 'Invalid URL parameters'
        isLoading.value = false
        return
    }

    try {
        console.log('Loading report for:', { matchId, role, heroId })

        // Fetch match data from STRATZ
        console.log('Fetching match data from STRATZ API...')
        const { StratzService } = await import('../../../services/stratz')
        const match = await StratzService.fetchMatch(matchId)
        console.log('STRATZ API response received:', match)
        console.log('Match ID:', match.id)
        console.log('Match duration:', match.durationSeconds)
        console.log('Radiant win:', match.didRadiantWin)
        console.log('Number of players:', match.players.length)
        console.log('Players:', match.players.map(p => ({
            heroId: p.hero.id,
            heroName: p.hero.displayName,
            role: p.role,
            isRadiant: p.isRadiant
        })))

        // Find the player with the specified hero ID
        console.log('Looking for player with hero ID:', heroId)
        let player = null
        if (heroId) {
            player = match.players.find((p: any) => p.hero.id.toString() === heroId)
        } else {
            // Fallback: find player by role (this is less reliable)
            player = match.players.find((p: any) => {
                const playerRole = p.role || 'CORE'
                const targetRole = role.toUpperCase()
                return playerRole === targetRole
            })
        }

        if (!player) {
            // Fallback: pick the first player (this shouldn't happen with the new flow)
            player = match.players[0]
            console.log('Fallback: using first player:', player)
        }

        if (!player) {
            throw new Error('No player found in match')
        }

        console.log('Found player:', {
            heroId: player.hero.id,
            heroName: player.hero.displayName,
            role: player.role,
            isRadiant: player.isRadiant,
            kills: player.kills,
            deaths: player.deaths,
            assists: player.assists,
            gpm: player.goldPerMinute,
            xpm: player.experiencePerMinute,
            imp: player.imp
        })

        // Get hero data using the new hero system
        const { loadHeroes, getHero } = useHeroes()
        await loadHeroes()
        const heroData = getHero(player.hero.id)
        const heroName = heroData?.localized_name || player.hero.displayName

        // Use STRATZ service to compute player data
        console.log('Computing player data with STRATZ service...')
        const playerData = StratzService.computePlayerData(match, player.hero.id, role)
        console.log('Computed player data:', playerData)

        console.log('Computing KPIs with STRATZ service...')
        const kpis = StratzService.computeKPIs(playerData)
        console.log('Computed KPIs:', kpis)

        // Run analysis using the STRATZ rule engine
        console.log('Running STRATZ rule engine analysis...')
        const { StratzRuleEngine } = await import('../../../services/stratzRuleEngine')
        const analysis = StratzRuleEngine.analyzePlayer(playerData, kpis)
        console.log('Analysis results:', analysis)

        // Create the report
        const finalReport = {
            id: `report-${Date.now()}`,
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
            timeline: analysis.timeline,
            timestamp: Date.now(),
            matchDuration: match.durationSeconds,
            radiantWin: match.didRadiantWin,
            playerSlot: player.isRadiant ? 0 : 128
        }

        console.log('Final report data:', finalReport)
        report.value = finalReport

        // Save to history
        if (report.value) {
            saveToHistory(report.value)
        }

    } catch (error: any) {
        console.error('Analysis error:', error)
        error.value = error instanceof Error ? error.message : 'Failed to analyze match. Please check the match ID and try again.'
    } finally {
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

    // Remove if already exists
    const filtered = history.filter((r: any) => r.matchId !== report.matchId || r.role !== report.role)

    // Add to front and keep only last 5
    const updated = [summary, ...filtered].slice(0, 5)

    localStorage.setItem('replay-checker-history', JSON.stringify(updated))
}

const copyShareLink = async () => {
    const url = window.location.href
    try {
        await navigator.clipboard.writeText(url)
        // TODO: Show success toast
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatValue = (value: number) => {
    return Math.round(value * 100) / 100
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

const getValueColor = (kpi: any) => {
    if (kpi.delta > 0) return 'text-accent-success'
    if (kpi.delta < 0) return 'text-accent-error'
    return 'text-text-primary'
}

const getPerformanceLevelClass = (percentile: number) => {
    if (percentile >= 90) return 'bg-purple-900/50 text-purple-300 border border-purple-700'
    if (percentile >= 80) return 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
    if (percentile >= 70) return 'bg-accent-success/10 text-accent-success border border-accent-success/30'
    if (percentile >= 60) return 'bg-accent-warning/10 text-accent-warning border border-accent-warning/30'
    if (percentile >= 40) return 'bg-accent-warning/10 text-accent-warning border border-accent-warning/30'
    return 'bg-accent-error/10 text-accent-error border border-accent-error/30'
}

const getPerformanceLevelText = (percentile: number) => {
    if (percentile >= 90) return 'Exceptional'
    if (percentile >= 80) return 'Excellent'
    if (percentile >= 70) return 'Good'
    if (percentile >= 60) return 'Above Average'
    if (percentile >= 40) return 'Average'
    return 'Below Average'
}

const handleItemImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/hero-fallback.svg'
}
</script>