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
                        <span :class="report.radiantWin ? 'text-green-400' : 'text-red-400'">
                            {{ report.radiantWin ? 'Radiant Victory' : 'Dire Victory' }}
                        </span>
                        <!-- Parsing Status Indicator -->
                        <div v-if="isParsing" class="flex items-center ml-4">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                            <span class="text-orange-400">Parsing in progress...</span>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button @click="copyShareLink"
                        class="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                        Share
                    </button>
                    <NuxtLink to="/"
                        class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                        New Analysis
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Top 3 Fixes -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">Top 3 Fixes for Next Game</h2>
            <div class="space-y-4">
                <div v-for="(fix, index) in report.fixes" :key="fix.title"
                    class="flex items-start space-x-4 p-4 bg-red-900/20 rounded-lg border-l-4 border-red-500">
                    <div
                        class="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                        {{ index + 1 }}
                    </div>
                    <div>
                        <h3 class="font-semibold text-red-300">{{ fix.title }}</h3>
                        <p class="text-red-200 mt-1">{{ fix.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Wins -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">What You Did Well</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="win in report.wins" :key="win.title"
                    class="p-4 bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <h3 class="font-semibold text-green-300">{{ win.title }}</h3>
                    <p class="text-green-200 mt-1">{{ win.description }}</p>
                </div>
            </div>
        </div>

        <!-- Timeline -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">Key Timings</h2>
            <div class="space-y-4">
                <div v-for="marker in report.timeline" :key="marker.label" class="bg-gray-700 rounded-lg p-4">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <img v-if="marker.itemImg" :src="marker.itemImg" :alt="marker.description"
                                class="h-20 rounded-lg border-2 border-gray-600" loading="lazy" decoding="async"
                                @error="handleItemImageError" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <h3 class="text-lg font-semibold text-gray-100">{{ marker.label }}</h3>
                                <span class="text-sm text-gray-400">{{ marker.description }}</span>
                            </div>
                            <div v-if="marker.details" class="text-sm text-gray-300 mb-2">{{ marker.details }}</div>
                            <div class="flex items-center space-x-4 text-sm">
                                <div class="flex items-center space-x-1">
                                    <span class="text-gray-400">Purchased at:</span>
                                    <span class="font-medium text-orange-400">{{ formatTime(marker.time) }}</span>
                                </div>
                                <div v-if="marker.delta" class="flex items-center space-x-1"
                                    :class="marker.delta > 0 ? 'text-red-400' : 'text-green-400'">
                                    <span class="text-gray-400">vs 12:00:</span>
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
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">Performance Metrics</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="kpi in report.kpis" :key="kpi.name"
                    class="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-lg transition-all duration-200">
                    <div class="text-sm text-gray-400 mb-2 font-medium">{{ kpi.name }}</div>
                    <div class="text-2xl font-bold mb-3 text-gray-100">
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
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 class="text-xl font-semibold text-gray-100 mb-2">Analyzing Match...</h2>
            <p class="text-gray-400">Fetching data from OpenDota and generating your report</p>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto">
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-12 text-center">
            <div class="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-semibold text-gray-100 mb-2">Analysis Failed</h2>
            <p class="text-gray-400 mb-6">{{ error }}</p>
            <NuxtLink to="/"
                class="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                Try Again
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHeroes } from '../../../composables/useHeroes'
import { useParsingStatus } from '../../../composables/useParsingStatus'

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

// Parsing status
const { isParsing: checkIsParsing } = useParsingStatus()
const isParsing = computed(() => {
    const matchId = route.params.matchId as string
    return checkIsParsing(matchId)
})

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

        // Check if we have cached match data first
        const { getCachedMatchData, hasCachedMatchData } = useParsingStatus()
        let match: any

        if (hasCachedMatchData(matchId)) {
            console.log('Using cached match data')
            match = getCachedMatchData(matchId)
        } else {
            console.log('Fetching match data from OpenDota')
            // Fetch match data from OpenDota
            let response = await fetch(`https://api.opendota.com/api/matches/${matchId}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch match data: ${response.status}`)
            }

            match = await response.json()
            console.log('Match data:', match)
        }

        // Check if replay needs parsing
        const needsParsing = !match.od_data?.has_parsed
        if (needsParsing) {
            console.log('Replay needs parsing, checking if already in progress...')
            const { isParsing, setParsing, cacheMatchData } = useParsingStatus()

            // Check if parsing is already in progress
            if (!isParsing(matchId)) {
                console.log('Starting parsing process...')
                setParsing(matchId)

                try {
                    const { OpenDotaService } = await import('../../../services/opendota')
                    const parsingResponse = await OpenDotaService.requestParsing(matchId)
                    console.log('Parsing requested:', parsingResponse)

                    // Wait for parsing to complete
                    const isParsed = await OpenDotaService.waitForParsing(matchId, parsingResponse.job.jobId)

                    if (isParsed) {
                        console.log('Replay parsing completed')
                        const { setParsed } = useParsingStatus()
                        setParsed(matchId)

                        // Fetch and cache the parsed data
                        const parsedResponse = await fetch(`https://api.opendota.com/api/matches/${matchId}`)
                        if (!parsedResponse.ok) {
                            throw new Error(`HTTP error! status: ${parsedResponse.status}`)
                        }
                        const parsedData = await parsedResponse.json()
                        cacheMatchData(matchId, parsedData)
                        match = parsedData
                    } else {
                        throw new Error('Replay parsing timed out. Please try again later.')
                    }
                } catch (parsingError) {
                    console.error('Parsing error:', parsingError)
                    const { removeStatus } = useParsingStatus()
                    removeStatus(matchId)
                    throw new Error('Failed to parse replay. Please try again later.')
                }
            } else {
                console.log('Parsing already in progress, waiting for completion...')
                // Parsing is already in progress, wait for it to complete
                try {
                    const { OpenDotaService } = await import('../../../services/opendota')
                    const { getJobId } = useParsingStatus()
                    const jobId = getJobId(matchId)

                    console.log(`Waiting for existing parsing job ${jobId} to complete...`)
                    const isParsed = await OpenDotaService.waitForParsing(matchId, jobId)

                    if (isParsed) {
                        console.log('Replay parsing completed')
                        const { setParsed } = useParsingStatus()
                        setParsed(matchId)

                        // Check if we have cached data first
                        if (hasCachedMatchData(matchId)) {
                            console.log('Using cached parsed data')
                            match = getCachedMatchData(matchId)
                        } else {
                            // Fetch the parsed data
                            const parsedResponse = await fetch(`https://api.opendota.com/api/matches/${matchId}`)
                            if (!parsedResponse.ok) {
                                throw new Error(`HTTP error! status: ${parsedResponse.status}`)
                            }
                            const parsedData = await parsedResponse.json()
                            cacheMatchData(matchId, parsedData)
                            match = parsedData
                        }
                    } else {
                        console.log('Parsing timed out, but continuing with available data...')
                        // Instead of throwing an error, continue with the unparsed data
                        // The user can still see basic information while parsing continues in background
                        console.log('Continuing with unparsed data while parsing continues in background')
                    }
                } catch (parsingError) {
                    console.error('Error waiting for parsing:', parsingError)
                    // Don't remove the parsing status or throw error - let it continue in background
                    console.log('Continuing with available data while parsing continues in background')
                }
            }
        }

        // Find the player with the specified hero ID
        let player = null
        if (heroId) {
            player = match.players.find((p: any) => p.hero_id.toString() === heroId)
        } else {
            // Fallback: find player by role (this is less reliable)
            player = match.players.find((p: any) => {
                const playerRole = p.lane_role || 1
                const targetRole = parseInt(role.replace('pos', ''))
                return playerRole === targetRole
            })
        }

        if (!player) {
            // Fallback: pick the first player (this shouldn't happen with the new flow)
            player = match.players[0]
            console.log('Fallback: using first player:', player)
        }

        // Load items data from JSON file
        const itemsResponse = await fetch('/constants/items.json')
        const itemsData = await itemsResponse.json()

        // Get hero data using the new hero system
        const { loadHeroes, getHero } = useHeroes()
        await loadHeroes()
        const heroData = getHero(player.hero_id)
        const heroName = heroData?.localized_name || 'Unknown Hero'

        // Import item utilities
        const { getItemImageUrl } = await import('../../../utils/itemUtils')

        // Find first core item and its timing using purchase log
        let firstCoreItemTiming = match.duration // Default to match duration if no core item found
        let firstCoreItemName = 'No core item'
        let firstCoreItemImg = ''
        let firstCoreItemCost = 0

        if (player.purchase_log && player.purchase_log.length > 0) {
            // Find the first item that costs over 1700 gold
            for (const purchase of player.purchase_log) {
                const itemData = itemsData[purchase.key]
                if (itemData && itemData.cost > 1700) {
                    firstCoreItemTiming = purchase.time
                    firstCoreItemName = itemData.dname || 'Unknown Item'
                    firstCoreItemImg = getItemImageUrl(itemData)
                    firstCoreItemCost = itemData.cost
                    break
                }
            }
        }

        // If no core item found, try with lower threshold (1200 gold)
        if (firstCoreItemName === 'No core item' && player.purchase_log && player.purchase_log.length > 0) {
            for (const purchase of player.purchase_log) {
                const itemData = itemsData[purchase.key]
                if (itemData && itemData.cost > 1200) {
                    firstCoreItemTiming = purchase.time
                    firstCoreItemName = itemData.dname || 'Unknown Item'
                    firstCoreItemImg = getItemImageUrl(itemData)
                    firstCoreItemCost = itemData.cost
                    break
                }
            }
        }

        // Compute player data inline
        const matchMinutes = match.duration / 60
        const teamKills = match.players
            .filter((p: any) => (p.player_slot < 128) === (player.player_slot < 128))
            .reduce((sum: number, p: any) => sum + p.kills, 0)
        const kpct = teamKills > 0 ? ((player.kills + player.assists) / teamKills) * 100 : 0
        const deathsPer10 = (player.deaths / matchMinutes) * 10
        const dpm = player.hero_damage / matchMinutes
        const tdpm = player.tower_damage / matchMinutes

        // Compute KPIs with benchmark data
        const benchmarks = player.benchmarks || {}
        const kpis = []

        // Helper function to get benchmark data
        const getBenchmarkData = (key: string) => {
            const benchmark = benchmarks[key]
            if (benchmark) {
                return {
                    raw: benchmark.raw,
                    percentile: Math.round(benchmark.pct * 100)
                }
            }
            return null
        }

        // GPM
        const gpmData = getBenchmarkData('gold_per_min')
        kpis.push({
            name: 'GPM',
            value: Math.round(player.gold_per_min),
            unit: '',
            percentile: gpmData?.percentile || 50,
            median: Math.round(gpmData?.raw || 540),
            delta: Math.round(player.gold_per_min - (gpmData?.raw || 540)),
            description: 'Gold per minute'
        })

        // XPM
        const xpmData = getBenchmarkData('xp_per_min')
        kpis.push({
            name: 'XPM',
            value: Math.round(player.xp_per_min),
            unit: '',
            percentile: xpmData?.percentile || 50,
            median: Math.round(xpmData?.raw || 580),
            delta: Math.round(player.xp_per_min - (xpmData?.raw || 580)),
            description: 'Experience per minute'
        })

        // Hero damage per minute
        const dpmData = getBenchmarkData('hero_damage_per_min')
        kpis.push({
            name: 'Hero Damage/min',
            value: Math.round(dpm),
            unit: '',
            percentile: dpmData?.percentile || 50,
            median: Math.round(dpmData?.raw || 420),
            delta: Math.round(dpm - (dpmData?.raw || 420)),
            description: 'Hero damage per minute'
        })

        // Last hits per minute
        const lhData = getBenchmarkData('last_hits_per_min')
        const lhPerMin = Math.round(player.last_hits / matchMinutes)
        kpis.push({
            name: 'Last Hits/min',
            value: lhPerMin,
            unit: '',
            percentile: lhData?.percentile || 50,
            median: Math.round(lhData?.raw || 52),
            delta: Math.round(lhPerMin - (lhData?.raw || 52)),
            description: 'Last hits per minute'
        })

        // Tower damage
        const tdData = getBenchmarkData('tower_damage')
        kpis.push({
            name: 'Tower Damage',
            value: Math.round(player.tower_damage),
            unit: '',
            percentile: tdData?.percentile || 50,
            median: Math.round(tdData?.raw || 0),
            delta: Math.round(player.tower_damage - (tdData?.raw || 0)),
            description: 'Tower damage'
        })

        // Hero healing
        const healingData = getBenchmarkData('hero_healing_per_min')
        const hpm = Math.round(player.hero_healing / matchMinutes)
        kpis.push({
            name: 'Hero Healing/min',
            value: hpm,
            unit: '',
            percentile: healingData?.percentile || 50,
            median: Math.round(healingData?.raw || 0),
            delta: Math.round(hpm - (healingData?.raw || 0)),
            description: 'Hero healing per minute'
        })

        // Kill participation
        kpis.push({
            name: 'Kill Participation',
            value: Math.round(kpct),
            unit: '%',
            percentile: kpct > 60 ? 80 : kpct > 40 ? 60 : 40,
            median: 50,
            delta: Math.round(kpct - 50),
            description: 'Kill participation percentage'
        })

        // Deaths per 10 minutes
        kpis.push({
            name: 'Deaths/10min',
            value: Math.round(deathsPer10 * 10) / 10,
            unit: '',
            percentile: deathsPer10 < 2 ? 80 : deathsPer10 < 3 ? 60 : 40,
            median: 2.5,
            delta: Math.round((deathsPer10 - 2.5) * 10) / 10,
            description: 'Deaths per 10 minutes'
        })

        // Run analysis using the rule engine
        const { RuleEngine } = await import('../../../services/ruleEngine')
        const analysis = RuleEngine.analyzePlayer({
            matchId: matchId,
            heroId: player.hero_id,
            heroName: heroName,
            role: role,
            playerSlot: player.player_slot,
            radiantWin: match.radiant_win,
            matchDuration: match.duration,
            lh_10: player.last_hits,
            gpm: player.gold_per_min,
            xpm: player.xp_per_min,
            kpct: kpct,
            dpm: dpm,
            tdpm: tdpm,
            deaths_per10: deathsPer10,
            first_core_s: firstCoreItemTiming,
            obs: player.observer_uses || 0,
            sentries: player.sentry_uses || 0,
            dewards: 0, // Not available in OpenDota API
            stacks: player.camps_stacked || 0,
            smokes_used: 0, // Not available in OpenDota API
            lane_nw_delta10: 0, // Not available in OpenDota API
            match_minutes: matchMinutes,
            win_minutes: matchMinutes,
            minute_bucket: '20+',
            benchmarks: player.benchmarks
        }, kpis.map(kpi => ({
            ...kpi,
            rawValue: kpi.value
        })))

        // Create the report
        const finalReport = {
            id: `report-${Date.now()}`,
            matchId: matchId,
            heroName: heroName,
            heroId: player.hero_id,
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
            timeline: [{
                label: 'First Core Item',
                time: Math.round(firstCoreItemTiming),
                delta: Math.round(firstCoreItemTiming - 720), // 12 minutes = 720 seconds
                description: firstCoreItemName,
                itemImg: firstCoreItemImg,
                details: `${firstCoreItemCost} gold `
            }],
            timestamp: Date.now(),
            matchDuration: match.duration,
            radiantWin: match.radiant_win,
            playerSlot: player.player_slot
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
    if (percentile >= 80) return 'bg-gradient-to-r from-blue-500 to-blue-600'
    if (percentile >= 70) return 'bg-gradient-to-r from-green-500 to-green-600'
    if (percentile >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    if (percentile >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-600'
    return 'bg-gradient-to-r from-red-500 to-red-600'
}

const getPercentileTextColor = (percentile: number) => {
    if (percentile >= 90) return 'text-purple-400'
    if (percentile >= 80) return 'text-blue-400'
    if (percentile >= 70) return 'text-green-400'
    if (percentile >= 60) return 'text-yellow-400'
    if (percentile >= 40) return 'text-orange-400'
    return 'text-red-400'
}

const getValueColor = (kpi: any) => {
    if (kpi.delta > 0) return 'text-green-400'
    if (kpi.delta < 0) return 'text-red-400'
    return 'text-gray-300'
}

const getPerformanceLevelClass = (percentile: number) => {
    if (percentile >= 90) return 'bg-purple-900/50 text-purple-300 border border-purple-700'
    if (percentile >= 80) return 'bg-blue-900/50 text-blue-300 border border-blue-700'
    if (percentile >= 70) return 'bg-green-900/50 text-green-300 border border-green-700'
    if (percentile >= 60) return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
    if (percentile >= 40) return 'bg-orange-900/50 text-orange-300 border border-orange-700'
    return 'bg-red-900/50 text-red-300 border border-red-700'
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