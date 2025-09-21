<template>
    <div class="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden"
        style="background-color: var(--background-color); background-image: url('https://cdn.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">

        <!-- Header -->
        <AppNavigation />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 lg:px-8 relative z-10">
            <!-- Dark overlay for readability -->
            <div class="fixed inset-0 bg-black/30 -z-10"></div>

            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-16">
                <div class="rounded-lg p-12 mb-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-6">
                    </div>
                    <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-4">Analyzing Match...</h2>
                    <p class="text-[var(--text-secondary)]">Fetching data and generating your report</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-16">
                <div class="rounded-lg p-12 mb-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div class="text-[var(--accent-error)] text-6xl mb-6">⚠️</div>
                    <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-4">Analysis Failed</h2>
                    <p class="text-[var(--text-secondary)] mb-8">{{ error }}</p>
                    <NuxtLink to="/analysis"
                        class="bg-[var(--accent-color)] text-black font-bold py-3 px-8 rounded-md text-lg glowing-button hover:shadow-[0_0_20px_rgba(207,90,44,0.6)] transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                        Try Again
                    </NuxtLink>
                </div>
            </div>

            <!-- Report Content -->
            <div v-else-if="report" class="max-w-4xl mx-auto">
                <!-- Header Card -->
                <div class="rounded-lg p-8 mb-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center space-x-4 mb-4">
                                <HeroImage v-if="report.heroId" :hero-id="report.heroId" :width="80" :height="80"
                                    class="rounded-lg" :alt="report.heroName" />
                                <div>
                                    <h1 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">
                                        {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                                    </h1>
                                    <div class="flex items-center text-sm text-[var(--text-secondary)]">
                                        <span>Match {{ report.matchId }}</span>
                                        <span class="mx-2">•</span>
                                        <span>{{ formatDuration(report.matchDuration) }}</span>
                                        <span class="mx-2">•</span>
                                        <span
                                            :class="report.radiantWin ? 'text-[var(--team-radiant)]' : 'text-[var(--team-dire)]'">
                                            {{ report.radiantWin ? 'Radiant Victory' : 'Dire Victory' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-lg text-[var(--text-primary)] leading-relaxed">{{ report.summary }}</p>
                        </div>
                        <div class="flex space-x-3">
                            <button @click="copyShareLink"
                                class="text-[var(--text-secondary)] hover:text-[var(--primary-color)] p-3 rounded-md hover:bg-[var(--primary-color)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                title="Share">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                    </path>
                                </svg>
                            </button>
                            <a :href="`https://stratz.com/matches/${report.matchId}`" target="_blank"
                                rel="noopener noreferrer"
                                class="text-[var(--text-secondary)] hover:text-[var(--primary-color)] p-3 rounded-md hover:bg-[var(--primary-color)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                title="View on STRATZ">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Report Controls -->
                <ReportControls v-if="report && playerBracket >= 0" :hero-id="report.heroId" :position="report.role"
                    :match-duration="report.matchDuration" :player-bracket="playerBracket"
                    :bracket-averages-cache="bracketAveragesCache" @bracketChange="onBracketChange"
                    @timeChange="onTimeChange" ref="reportControlsRef" />

                <!-- Laning Phase -->
                <LaningPhase v-if="report.laningPhase" :cs-comparison="report.laningPhase.csComparison"
                    :denies-comparison="report.laningPhase.deniesComparison" :summary="report.laningPhase.summary" />

                <!-- Mid Game -->
                <MidGame v-if="report.midGame" :networth-comparison="report.midGame.networthComparison"
                    :last-hits-comparison="report.midGame.lastHitsComparison" :summary="report.midGame.summary"
                    :mid-game-minute="Number(report.midGame.midGameMinute)" />

                <!-- Support -->
                <Support v-if="report.support" :camps-stacked-comparison="report.support.campsStackedComparison"
                    :summary="report.support.summary" />

                <!-- Benchmark Comparisons -->
                <BenchmarkComparisons :comparisons="report.benchmarkComparisons" />
            </div>

            <!-- CTA Section -->
            <section class="mt-16 mb-8">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="rounded-lg p-8 text-center"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <div class="mb-6">
                            <h3 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-4">Ready for Another
                                Analysis?</h3>
                            <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                                Analyze more replays to track your progress, identify patterns, and improve your
                                gameplay.
                                Each analysis provides unique insights to help you climb the ranks.
                            </p>
                        </div>
                        <NuxtLink to="/"
                            class="inline-flex items-center px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-md text-lg glowing-button hover:shadow-[0_0_20px_rgba(244,231,211,0.6)] transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                            <span class="material-symbols-outlined mr-2">analytics</span>
                            Analyze Another Replay
                        </NuxtLink>
                    </div>
                </div>
            </section>
        </main>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHeroes } from '../../../../composables/useHeroes'
import { getBracketGroupingForQuery } from '../../../../utils/heroUtils'
import type { BracketAveragesCache } from '../../../../types'

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
    benchmarkComparisons: any[]
    laningPhase: {
        csComparison: {
            playerValue: number
            averageValue: number
            difference: number
            percentageDiff: number
        }
        deniesComparison: {
            playerValue: number
            averageValue: number
            difference: number
            percentageDiff: number
        }
        summary: string
    }
    midGame: {
        networthComparison: {
            playerValue: number
            averageValue: number
            difference: number
            percentageDiff: number
        }
        lastHitsComparison: {
            playerValue: number
            averageValue: number
            difference: number
            percentageDiff: number
        }
        summary: string
        midGameMinute: number
    }
    support: {
        campsStackedComparison: {
            playerValue: number
            averageValue: number
            difference: number
            percentageDiff: number
        }
        summary: string
    }
}

const route = useRoute()
const report = ref<AnalysisReport | null>(null)
const isLoading = ref(true)
const error = ref('')
const { loadHeroes, getHero } = useHeroes()

// New reactive data for controls
const bracketAveragesCache = ref<BracketAveragesCache | null>(null)
const playerBracket = ref(0)
const reportControlsRef = ref<any>(null)
const originalPlayerData = ref<any>(null)
const selectedBracketGrouping = ref('')
const selectedTime = ref(0)

onMounted(async () => {
    // Load hero data first so images can be displayed
    await loadHeroes()

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
            const parsedReport = JSON.parse(cachedReport)
            // Ensure laningPhase exists in cached reports
            if (!parsedReport.laningPhase) {
                parsedReport.laningPhase = {
                    csComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                    deniesComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                    summary: 'Laning phase data not available.'
                }
            }
            // Ensure midGame exists in cached reports
            if (!parsedReport.midGame) {
                parsedReport.midGame = {
                    networthComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                    lastHitsComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                    summary: 'Mid game data not available.',
                    midGameMinute: 20
                }
            }
            // Ensure support exists in cached reports
            if (!parsedReport.support) {
                parsedReport.support = {
                    campsStackedComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                    summary: 'Support data not available.'
                }
            }
            report.value = parsedReport

            // Set player bracket for controls even when loading cached report
            const storedMatchData = localStorage.getItem(`match-data-${matchId}`)
            if (storedMatchData) {
                const matchData = JSON.parse(storedMatchData)
                playerBracket.value = matchData.bracket || 0
                console.log('🎯 Set playerBracket from cached match data:', playerBracket.value)

                // Also load bracket averages cache for cached reports
                try {
                    const { StratzRuleEngine } = await import('../../../../services/stratzRuleEngine')
                    const position = role.toUpperCase().replace('POS', 'POSITION_')
                    const cacheKey = `bracket-averages-${parsedReport.heroId}-${position}`

                    const storedCache = localStorage.getItem(cacheKey)
                    if (storedCache) {
                        const parsedCache = JSON.parse(storedCache)
                        const now = Date.now()
                        const isCacheValid = Object.values(parsedCache).some((data: any) =>
                            data.cachedAt && (now - data.cachedAt) < 24 * 60 * 60 * 1000
                        )

                        if (isCacheValid) {
                            bracketAveragesCache.value = parsedCache
                            console.log('📁 Loaded cached bracket averages for cached report')
                        } else {
                            // Fetch fresh data if cache is expired
                            bracketAveragesCache.value = await StratzRuleEngine.fetchBracketAverages(
                                parsedReport.heroId,
                                position
                            )
                        }
                    } else {
                        // Fetch fresh data if no cache
                        bracketAveragesCache.value = await StratzRuleEngine.fetchBracketAverages(
                            parsedReport.heroId,
                            position
                        )
                    }
                } catch (bracketError) {
                    console.error('❌ Failed to load bracket averages for cached report:', bracketError)
                }
            }

            isLoading.value = false
            return
        }

        // Check if match data is already stored from the home page
        const storedMatchData = localStorage.getItem(`match-data-${matchId}`)
        let matchData

        if (storedMatchData) {
            console.log('📁 Using cached match data')
            matchData = JSON.parse(storedMatchData)
        } else {
            console.log('🌐 Fetching match data from STRATZ')
            // Fetch match data from STRATZ if not stored
            const { StratzService } = await import('../../../../services/stratz')
            matchData = await StratzService.fetchMatch(matchId)

            // Store the fetched data for future use
            localStorage.setItem(`match-data-${matchId}`, JSON.stringify(matchData))
        }

        if (!matchData || !matchData.players) {
            throw new Error('Failed to load match data')
        }

        // Find the player
        const player = matchData.players.find((p: any) => p.hero.id.toString() === heroId)
        if (!player) {
            throw new Error(`Hero ${heroId} not found in match`)
        }

        // Get hero data
        const heroData = getHero(player.hero.id)
        const heroName = heroData?.localized_name || player.hero.displayName

        // Compute player data and KPIs
        const { StratzService } = await import('../../../../services/stratz')
        const playerData = StratzService.computePlayerData(matchData, parseInt(heroId), role)
        const kpis = StratzService.computeKPIs(playerData)

        // Run analysis using the MVP benchmark engine
        const { MVPBenchmarkEngine } = await import('../../../../services/mvpBenchmarkEngine')

        let benchmarkAnalysis
        try {
            benchmarkAnalysis = MVPBenchmarkEngine.analyze(matchData, player.playerSlot)
        } catch (error) {
            console.error('Error in benchmark analysis:', error)
            throw error
        }

        // Create the report
        const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const finalReport = {
            id: reportId,
            matchId: matchId,
            heroName: heroName,
            heroId: player.hero.id,
            heroImg: heroData?.img || '',
            role: role,
            summary: benchmarkAnalysis.summary,
            kpis: [], // Remove KPIs for MVP
            fixes: [], // Remove fixes for MVP
            wins: [], // Remove wins for MVP
            timeline: [],
            timestamp: Date.now(),
            matchDuration: matchData.durationSeconds,
            radiantWin: matchData.didRadiantWin,
            playerSlot: player.isRadiant ? 0 : 128,
            benchmarkComparisons: benchmarkAnalysis?.comparisons || [],
            laningPhase: benchmarkAnalysis?.laningPhase || {
                csComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                deniesComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Laning phase data not available.'
            },
            midGame: benchmarkAnalysis?.midGame || {
                networthComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                lastHitsComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Mid game data not available.',
                midGameMinute: 20
            },
            support: benchmarkAnalysis?.support || {
                campsStackedComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Support data not available.'
            }
        }


        report.value = finalReport

        // Cache the report
        localStorage.setItem(reportCacheKey, JSON.stringify(finalReport))

        // Save to history
        saveToHistory(finalReport)

        // Set player bracket for controls
        playerBracket.value = matchData.bracket || 0

        // Store original player data for dynamic updates
        originalPlayerData.value = player

        // Initialize controls with player's bracket
        selectedBracketGrouping.value = getBracketGroupingForQuery(playerBracket.value)
        selectedTime.value = Math.floor(matchData.durationSeconds / 60)

        // Fetch bracket averages data after report is loaded
        try {
            const { StratzRuleEngine } = await import('../../../../services/stratzRuleEngine')
            const position = role.toUpperCase().replace('POS', 'POSITION_')
            const cacheKey = `bracket-averages-${player.hero.id}-${position}`

            // Check localStorage first
            const storedCache = localStorage.getItem(cacheKey)
            if (storedCache) {
                const parsedCache = JSON.parse(storedCache)
                // Check if cache is still valid (24 hours)
                const now = Date.now()
                const isCacheValid = Object.values(parsedCache).some((data: any) =>
                    data.cachedAt && (now - data.cachedAt) < 24 * 60 * 60 * 1000
                )

                if (isCacheValid) {
                    bracketAveragesCache.value = parsedCache
                } else {
                    bracketAveragesCache.value = await StratzRuleEngine.fetchBracketAverages(
                        player.hero.id,
                        position
                    )
                }
            } else {
                bracketAveragesCache.value = await StratzRuleEngine.fetchBracketAverages(
                    player.hero.id,
                    position
                )
            }
        } catch (bracketError) {
            console.error('❌ Failed to fetch bracket averages:', bracketError)
            // Don't fail the entire report if bracket averages fail
        }

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

// Control event handlers
const onBracketChange = async (bracketGrouping: string) => {
    console.log(`🔄 Switching to ${bracketGrouping} comparison`)
    await updateAnalysisData(bracketGrouping, selectedTime.value)
}

const onTimeChange = async (time: number) => {
    console.log(`⏰ Analyzing at ${time} minutes`)
    selectedTime.value = Number(time)
    await updateAnalysisData(selectedBracketGrouping.value, Number(time))
}

// Dynamic analysis update function
const updateAnalysisData = async (bracketGrouping: string, timeMinutes: number) => {
    if (!report.value || !originalPlayerData.value) {
        return
    }

    // If bracketAveragesCache is not available yet, show a loading state
    if (!bracketAveragesCache.value) {
        if (reportControlsRef.value) {
            reportControlsRef.value.setError('Loading bracket data... Please wait.')
        }
        return
    }

    try {
        const { DynamicAnalysisEngine } = await import('../../../../services/dynamicAnalysisEngine')

        const dynamicAnalysis = DynamicAnalysisEngine.recalculateAnalysis(
            originalPlayerData.value,
            report.value.matchDuration,
            bracketAveragesCache.value,
            bracketGrouping,
            timeMinutes
        )

        // Update the report with new analysis data
        report.value.benchmarkComparisons = dynamicAnalysis.comparisons
        report.value.laningPhase = dynamicAnalysis.laningPhase
        report.value.midGame = dynamicAnalysis.midGame
        report.value.support = dynamicAnalysis.support
        report.value.summary = dynamicAnalysis.summary

        // Clear any previous errors
        if (reportControlsRef.value) {
            reportControlsRef.value.clearError()
        }

    } catch (error) {
        console.error('❌ Failed to update analysis data:', error)
        if (reportControlsRef.value) {
            reportControlsRef.value.setError('Failed to update analysis data. Please try again.')
        }
    }
}

// Watch for bracketAveragesCache to become available and update analysis
watch(bracketAveragesCache, (newCache) => {
    if (newCache && selectedBracketGrouping.value && selectedTime.value) {
        updateAnalysisData(selectedBracketGrouping.value, selectedTime.value)
    }
}, { immediate: true })

</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>
