<template>
    <div class="min-h-screen bg-gray-900 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-4xl font-bold text-orange-400 mb-4 text-center">Replay Rune</h1>
            <p class="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                Analyze your Dota 2 matches with AI-powered insights. Enter a match ID to see which heroes were played,
                then select yours for personalized feedback and improvement suggestions.
            </p>

            <!-- Match ID Input -->
            <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
                <div class="flex space-x-4">
                    <div class="flex-1">
                        <label for="matchId" class="block text-sm font-medium text-gray-300 mb-2">
                            Match ID
                        </label>
                        <input type="text" id="matchId" v-model="matchId" placeholder="Enter match ID"
                            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            @keyup.enter="fetchMatchData" />
                    </div>
                    <div class="flex items-end">
                        <button @click="fetchMatchData" :disabled="isLoading || !matchId"
                            class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <span v-if="isLoading">Loading...</span>
                            <span v-else>Load Match</span>
                        </button>
                    </div>
                </div>

                <div v-if="error" class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                    <p class="text-red-300">{{ error }}</p>
                </div>
            </div>

            <!-- Hero Selection -->
            <div v-if="matchHeroes.length > 0" class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-100">Select Your Hero</h3>
                    <div v-if="isParsing" class="flex items-center space-x-2 text-sm text-orange-400">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        <span>Parsing in background...</span>
                    </div>
                </div>

                <!-- Hero Grid with Left/Right Split -->
                <div class="grid grid-cols-2 gap-8">
                    <!-- Radiant Heroes (Left) -->
                    <div>
                        <h4 class="text-sm font-medium text-green-400 mb-3">Radiant</h4>
                        <div class="space-y-2">
                            <button v-for="hero in radiantHeroes" :key="hero.id" type="button"
                                @click="selectedHero = hero.id"
                                class="w-full p-3 text-left rounded-md border-2 transition-colors flex items-center space-x-3"
                                :class="selectedHero === hero.id
                                    ? 'border-orange-500 bg-orange-900/20 text-orange-300'
                                    : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200'">
                                <HeroImage :hero-id="hero.id" :width="48" :height="48" class="rounded"
                                    :alt="hero.name" />
                                <div class="flex-1">
                                    <div class="font-semibold">{{ hero.name }}</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Dire Heroes (Right) -->
                    <div>
                        <h4 class="text-sm font-medium text-red-400 mb-3">Dire</h4>
                        <div class="space-y-2">
                            <button v-for="hero in direHeroes" :key="hero.id" type="button"
                                @click="selectedHero = hero.id"
                                class="w-full p-3 text-left rounded-md border-2 transition-colors flex items-center space-x-3"
                                :class="selectedHero === hero.id
                                    ? 'border-orange-500 bg-orange-900/20 text-orange-300'
                                    : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200'">
                                <HeroImage :hero-id="hero.id" :width="48" :height="48" class="rounded"
                                    :alt="hero.name" />
                                <div class="flex-1">
                                    <div class="font-semibold">{{ hero.name }}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Role Selection -->
                <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Your Role
                    </label>
                    <div class="grid grid-cols-5 gap-2">
                        <button v-for="role in roles" :key="role.value" type="button" @click="selectedRole = role.value"
                            class="p-3 text-center rounded-md border-2 transition-colors" :class="selectedRole === role.value
                                ? 'border-orange-500 bg-orange-900/20 text-orange-300'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200'">
                            <div class="font-semibold">{{ role.label }}</div>
                            <div class="text-xs text-gray-400">{{ role.description }}</div>
                        </button>
                    </div>
                </div>

                <!-- Analyze Button -->
                <button @click="analyzeMatch" :disabled="isLoading || !selectedRole || !selectedHero"
                    class="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <span v-if="isLoading">Analyzing...</span>
                    <span v-else-if="isParsing">Continue to Analysis (Parsing in Progress)</span>
                    <span v-else>Analyze Match</span>
                </button>
            </div>

            <!-- Recent History -->
            <div v-if="recentReports.length > 0" class="mt-8">
                <h3 class="text-lg font-semibold text-gray-100 mb-4">Recent Reports</h3>
                <div class="space-y-3">
                    <div v-for="report in recentReports" :key="report.id"
                        class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 hover:shadow-xl transition-all">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3 flex-1 cursor-pointer" @click="viewReport(report)">
                                <HeroImage :hero-id="report.heroId" :width="48" :height="48" class="rounded"
                                    :alt="report.heroName" />
                                <div class="flex-1">
                                    <div class="flex items-center space-x-2">
                                        <div class="font-medium text-gray-100">
                                            {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                                        </div>
                                        <span class="text-xs px-2 py-1 rounded-full"
                                            :class="report.win === true ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'">
                                            {{ report.win === true ? 'Victory' : 'Defeat' }}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-400">
                                        Match {{ report.matchId }} • {{ formatDate(report.timestamp) }}
                                    </div>
                                    <div class="text-sm text-gray-300 mt-1">
                                        {{ report.summary }}
                                    </div>
                                </div>
                            </div>
                            <button @click.stop="deleteReport(report.id)"
                                class="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-red-900/20 transition-colors">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHeroes } from '../composables/useHeroes'
import { useParsingStatus } from '../composables/useParsingStatus'

interface Role {
    value: string
    label: string
    description: string
}

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

interface Hero {
    id: number
    name: string
    side: string
    img: string
}

const roles: Role[] = [
    { value: 'pos1', label: 'Pos 1', description: 'Carry' },
    { value: 'pos2', label: 'Pos 2', description: 'Mid' },
    { value: 'pos3', label: 'Pos 3', description: 'Offlane' },
    { value: 'pos4', label: 'Pos 4', description: 'Soft Support' },
    { value: 'pos5', label: 'Pos 5', description: 'Hard Support' }
]

const matchId = ref('')
const selectedRole = ref('')
const selectedHero = ref<number | null>(null)
const isLoading = ref(false)
const error = ref('')
const recentReports = ref<ReportSummary[]>([])
const matchData = ref<any>(null)
const { loadHeroes, getHero } = useHeroes()

const matchHeroes = ref<Hero[]>([])

// Parsing status
const { isParsing: checkIsParsing } = useParsingStatus()
const isParsing = computed(() => checkIsParsing(matchId.value))

// Computed properties for Radiant and Dire heroes, in original order
const radiantHeroes = computed(() =>
    matchHeroes.value.filter(hero => hero.side === 'Radiant')
)

const direHeroes = computed(() =>
    matchHeroes.value.filter(hero => hero.side === 'Dire')
)

// Load recent reports from localStorage
onMounted(() => {
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
            recentReports.value = validReports.slice(0, 5)
        } catch (e) {
            console.error('Failed to load history:', e)
            // Clear corrupted history
            localStorage.removeItem('replay-checker-history')
        }
    }
})

const fetchMatchData = async () => {
    if (!matchId.value) return

    isLoading.value = true
    error.value = ''

    try {
        console.log('Fetching match data for ID:', matchId.value)
        let response = await fetch(`https://api.opendota.com/api/matches/${matchId.value}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        let data = await response.json()
        console.log('Raw match data:', data)

        if (!data.match_id) {
            throw new Error('Invalid match data received')
        }

        // Check if replay needs parsing
        const needsParsing = !data.od_data?.has_parsed
        if (needsParsing) {
            console.log('Replay needs parsing, starting background process...')
            const { setParsing } = useParsingStatus()
            setParsing(matchId.value)

            // Start parsing in the background (don't await)
            const startBackgroundParsing = async () => {
                try {
                    const { OpenDotaService } = await import('../services/opendota')
                    const parsingResponse = await OpenDotaService.requestParsing(matchId.value)
                    console.log('Background parsing requested:', parsingResponse)

                    // Wait for parsing to complete in background
                    const isParsed = await OpenDotaService.waitForParsing(matchId.value, parsingResponse.job.jobId)

                    if (isParsed) {
                        console.log('Replay parsing completed in background')
                        const { setParsed, cacheMatchData } = useParsingStatus()
                        setParsed(matchId.value)

                        // Fetch and cache the parsed data
                        const parsedResponse = await fetch(`https://api.opendota.com/api/matches/${matchId.value}`)
                        if (parsedResponse.ok) {
                            const parsedData = await parsedResponse.json()
                            cacheMatchData(matchId.value, parsedData)
                            console.log('Parsed match data cached in background')
                        }
                    } else {
                        console.log('Background parsing timed out, but job may still be running')
                        // Don't remove status - let the report page handle it if user navigates there
                    }
                } catch (parsingError) {
                    console.error('Background parsing error:', parsingError)
                    // Don't remove status immediately - let the report page handle it
                    // The parsing job might still be running even if we had an error
                }
            }

            // Start background parsing without blocking the UI
            startBackgroundParsing()
        }

        // Use the data we have (parsed or unparsed) to show hero selection immediately
        matchData.value = data

        // Load and normalize hero data
        console.log('Loading hero data...')
        await loadHeroes()

        // Extract heroes from the match
        const heroes: Hero[] = []

        console.log('Processing players:', data.players.length)
        data.players.forEach((player: any, index: number) => {
            console.log(`Player ${index}:`, {
                hero_id: player.hero_id,
                player_slot: player.player_slot,
                lane_role: player.lane_role,
                name: player.name
            })

            // Get hero data from our normalized hero data
            const heroData = getHero(player.hero_id)
            const heroName = heroData?.localized_name || `Unknown Hero (${player.hero_id})`
            const side = player.player_slot < 128 ? 'Radiant' : 'Dire'

            heroes.push({
                id: player.hero_id,
                name: heroName,
                side: side,
                img: heroData?.img || ''
            })
        })

        console.log('Processed heroes:', heroes)
        matchHeroes.value = heroes
        selectedHero.value = null
        selectedRole.value = ''

    } catch (e: any) {
        error.value = e instanceof Error ? e.message : 'Failed to fetch match data. Please check the match ID and try again.'
        console.error('Fetch error:', e)
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    matchData.value = null
    matchHeroes.value = []
    selectedHero.value = null
    selectedRole.value = ''
    error.value = ''
}

const analyzeMatch = async () => {
    if (!matchId.value || !selectedRole.value || !selectedHero.value) return

    isLoading.value = true
    error.value = ''

    try {
        // Check if parsing is still in progress
        const { isParsing } = useParsingStatus()
        const stillParsing = isParsing(matchId.value)

        if (stillParsing) {
            console.log('Match is still being parsed, proceeding to report page...')
            // We can still proceed to the report page - it will handle the parsing status
        }

        // Navigate to report page with match ID, role, and hero
        window.location.href = `/report/${matchId.value}/${selectedRole.value}/${selectedHero.value}`
    } catch (e) {
        error.value = 'Failed to analyze match. Please try again.'
        console.error('Analysis error:', e)
    } finally {
        isLoading.value = false
    }
}

const viewReport = (report: ReportSummary) => {
    window.location.href = `/report/${report.matchId}/${report.role}/${report.heroId}`
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
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

const deleteReport = (reportId: string) => {
    try {
        const stored = localStorage.getItem('replay-checker-history')
        if (stored) {
            const history = JSON.parse(stored)
            const filtered = history.filter((r: any) => r && r.id !== reportId)
            localStorage.setItem('replay-checker-history', JSON.stringify(filtered))
            recentReports.value = filtered.slice(0, 5)
        }
    } catch (e) {
        console.error('Failed to delete report:', e)
        // Clear corrupted history
        localStorage.removeItem('replay-checker-history')
        recentReports.value = []
    }
}
</script>