<template>
    <div class="min-h-screen bg-dark-bg py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-4xl font-bold text-accent-primary mb-4 text-center">Replay Rune</h1>
            <p class="text-text-primary text-center mb-8 max-w-2xl mx-auto">
                Analyze your Dota 2 matches with AI-powered insights. Enter a match ID to see which heroes were played,
                then select yours for personalized feedback and improvement suggestions.
            </p>

            <!-- Match ID Input -->
            <div class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-8">
                <div class="flex space-x-4">
                    <div class="flex-1">
                        <label for="matchId" class="block text-sm font-medium text-text-primary mb-2">
                            Match ID
                        </label>
                        <input type="text" id="matchId" v-model="matchId" placeholder="Enter match ID"
                            class="w-full px-3 py-2 bg-dark-card border border-dark-border-light rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary focus-accent"
                            @keyup.enter="fetchMatchData" />
                    </div>
                    <div class="flex items-end">
                        <button @click="fetchMatchData" :disabled="isLoading || !matchId"
                            class="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-dark-panel disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-accent">
                            <span v-if="isLoading">Loading Match...</span>
                            <span v-else>Load Match</span>
                        </button>
                    </div>
                </div>

                <div v-if="error" class="mt-4 p-3 bg-accent-error/10 border border-accent-error/30 rounded-md">
                    <p class="text-accent-error">{{ error }}</p>
                </div>

                <!-- Unparsed Match Warning -->
                <div v-if="matchData && !isMatchParsed && !isLoading"
                    class="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                                </path>
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-sm font-medium text-amber-500 mb-1">Match Not Yet Parsed</h4>
                            <p class="text-sm text-amber-600 mb-2">
                                This match needs to be parsed by Stratz before we can analyze it. This usually takes
                                just a few minutes.
                            </p>
                            <div class="flex items-center space-x-3">
                                <a :href="`https://stratz.com/match/${matchId}`" target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                        </path>
                                    </svg>
                                    Parse on Stratz
                                </a>
                                <button @click="startPollingForParsing"
                                    class="inline-flex items-center px-3 py-2 bg-accent-primary text-white text-sm font-medium rounded-md hover:bg-accent-primary/80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                        </path>
                                    </svg>
                                    Check Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="matchHeroes.length > 0 && !error && isMatchParsed"
                    class="mt-4 p-3 bg-accent-success/10 border border-accent-success/30 rounded-md">
                    <p class="text-accent-success">✅ Match loaded successfully! Select your hero and role below.</p>
                </div>
            </div>

            <!-- Hero Selection -->
            <div v-if="matchHeroes.length > 0"
                class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-6 mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-text-primary">Select Your Hero</h3>
                    <div v-if="isPollingForParsing" class="flex items-center space-x-2 text-sm text-accent-primary">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary"></div>
                        <span>{{ currentPollingMessage }}</span>
                    </div>
                </div>

                <!-- Hero Grid with Left/Right Split -->
                <div class="grid grid-cols-2 gap-8">
                    <!-- Radiant Heroes (Left) -->
                    <div>
                        <h4 class="text-sm font-medium text-team-radiant mb-3">Radiant</h4>
                        <div class="space-y-2">
                            <button v-for="hero in radiantHeroes" :key="hero.id" type="button"
                                @click="selectedHero = hero.id"
                                class="w-full p-3 text-left rounded-md border-2 transition-colors flex items-center space-x-3 focus-accent"
                                :class="selectedHero === hero.id
                                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                    : 'border-dark-border-light hover:border-accent-primary/50 bg-dark-card hover:bg-dark-card/80 text-text-primary'">
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
                        <h4 class="text-sm font-medium text-team-dire mb-3">Dire</h4>
                        <div class="space-y-2">
                            <button v-for="hero in direHeroes" :key="hero.id" type="button"
                                @click="selectedHero = hero.id"
                                class="w-full p-3 text-left rounded-md border-2 transition-colors flex items-center space-x-3 focus-accent"
                                :class="selectedHero === hero.id
                                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                    : 'border-dark-border-light hover:border-accent-primary/50 bg-dark-card hover:bg-dark-card/80 text-text-primary'">
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
                    <label class="block text-sm font-medium text-text-primary mb-2">
                        Your Role
                    </label>
                    <div class="grid grid-cols-5 gap-2">
                        <button v-for="role in roles" :key="role.value" type="button" @click="selectedRole = role.value"
                            class="p-3 text-center rounded-md border-2 transition-colors focus-accent"
                            :class="selectedRole === role.value
                                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                : 'border-dark-border-light hover:border-accent-primary/50 bg-dark-card hover:bg-dark-card/80 text-text-primary'">
                            <div class="font-semibold">{{ role.label }}</div>
                            <div class="text-xs text-text-secondary">{{ role.description }}</div>
                        </button>
                    </div>
                </div>

                <!-- Analyze Button -->
                <button @click="analyzeMatch"
                    :disabled="isLoading || !matchId || matchHeroes.length === 0 || !selectedRole || !selectedHero || !isMatchParsed"
                    class="w-full mt-6 bg-accent-primary text-white py-3 px-4 rounded-md font-medium hover:bg-accent-primary/80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-dark-panel disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-accent">
                    <span v-if="isLoading">Analyzing...</span>
                    <span v-else-if="!matchId">Enter Match ID</span>
                    <span v-else-if="matchHeroes.length === 0">Load Match First</span>
                    <span v-else-if="!selectedHero">Select Your Hero</span>
                    <span v-else-if="!selectedRole">Select Your Role</span>
                    <span v-else-if="!isMatchParsed">Parse Match First, Then Analyze</span>
                    <span v-else>Analyze Match</span>
                </button>
            </div>

            <!-- Recent History -->
            <div v-if="recentReports.length > 0" class="mt-8">
                <h3 class="text-lg font-semibold text-text-primary mb-4">Recent Reports</h3>
                <div class="space-y-3 relative">
                    <!-- Visible Reports (first 2) -->
                    <div v-for="report in recentReports.slice(0, 2)" :key="report.id"
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
                                <button @click.stop="confirmDeleteReport(report.id)"
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

                    <!-- Blurred Reports (if more than 2) -->
                    <div v-if="recentReports.length > 2" class="relative">
                        <div v-for="report in recentReports.slice(2)" :key="report.id"
                            class="bg-dark-panel rounded-lg shadow-lg border border-dark-border p-4 transition-all blur-sm opacity-50 pointer-events-none">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center space-x-3 flex-1">
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
                            </div>
                        </div>

                        <!-- Subscribe Overlay -->
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-dark-bg/90 to-transparent rounded-lg flex items-end justify-center pb-4">
                            <NuxtLink to="/subscribe"
                                class="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-primary/80 transition-colors shadow-lg focus-accent">
                                Subscribe to See All Reports
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useHeroes } from '../composables/useHeroes'


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

// Parsing status checking
const isMatchParsed = computed(() => {
    if (!matchData.value) return false
    return !!matchData.value.parsedDateTime
})

const isPollingForParsing = ref(false)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const currentPollingMessage = ref('')

// Rotating messages for polling feedback
const pollingMessages = [
    'Checking if match is parsed...',
    'Still waiting for parsing...',
    'This usually takes just a few minutes...',
    'Hang tight, almost there...',
    'Parsing in progress...'
]
let messageIndex = 0

const startPollingForParsing = async () => {
    if (isPollingForParsing.value) return

    isPollingForParsing.value = true
    messageIndex = 0
    currentPollingMessage.value = pollingMessages[0]

    // Start polling every 30 seconds
    pollingInterval.value = setInterval(async () => {
        try {
            // Fetch fresh match data to check parsing status
            const { StratzService } = await import('../services/stratz')
            const data = await StratzService.fetchMatch(matchId.value)

            if (data.parsedDateTime) {
                // Match is now parsed!
                stopPollingForParsing()
                matchData.value = data

                // Extract heroes from the updated match data
                const heroes: Hero[] = []
                data.players.forEach((player: any) => {
                    const heroData = getHero(player.hero.id)
                    const heroName: string = heroData?.localized_name || player.hero.displayName || `Hero ${player.hero.id}`
                    const side = player.isRadiant ? 'Radiant' : 'Dire'

                    heroes.push({
                        id: player.hero.id,
                        name: heroName,
                        side: side,
                        img: heroData?.img || ''
                    })
                })

                matchHeroes.value = heroes
                error.value = ''
                return
            }

            // Update rotating message
            messageIndex = (messageIndex + 1) % pollingMessages.length
            currentPollingMessage.value = pollingMessages[messageIndex]

        } catch (e) {
            console.error('Polling error:', e)
            currentPollingMessage.value = 'Error checking parsing status...'
        }
    }, 30000) // 30 seconds

    // Also check immediately
    try {
        const { StratzService } = await import('../services/stratz')
        const data = await StratzService.fetchMatch(matchId.value)

        if (data.parsedDateTime) {
            stopPollingForParsing()
            matchData.value = data

            // Extract heroes from the updated match data
            const heroes: Hero[] = []
            data.players.forEach((player: any) => {
                const heroData = getHero(player.hero.id)
                const heroName: string = heroData?.localized_name || player.hero.displayName || `Hero ${player.hero.id}`
                const side = player.isRadiant ? 'Radiant' : 'Dire'

                heroes.push({
                    id: player.hero.id,
                    name: heroName,
                    side: side,
                    img: heroData?.img || ''
                })
            })

            matchHeroes.value = heroes
            error.value = ''
        }
    } catch (e) {
        console.error('Immediate polling check error:', e)
    }
}

const stopPollingForParsing = () => {
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
        pollingInterval.value = null
    }
    isPollingForParsing.value = false
    currentPollingMessage.value = ''
}

// Clean up polling on component unmount
onUnmounted(() => {
    stopPollingForParsing()
})

// Computed properties for Radiant and Dire heroes, in original order
const radiantHeroes = computed(() =>
    matchHeroes.value.filter(hero => hero.side === 'Radiant')
)

const direHeroes = computed(() =>
    matchHeroes.value.filter(hero => hero.side === 'Dire')
)

// Load recent reports from localStorage and hero data
onMounted(async () => {
    // Load hero data first so images can be displayed
    await loadHeroes()

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
    if (!matchId.value) {
        return
    }

    // Reset previous data when loading new match
    resetForm()

    isLoading.value = true
    error.value = ''

    try {
        // Fetch match data from STRATZ
        const { StratzService } = await import('../services/stratz')
        const data = await StratzService.fetchMatch(matchId.value)

        if (!data.id) {
            throw new Error('Invalid match data received')
        }

        // STRATZ data is already parsed, no need for parsing logic
        matchData.value = data

        // Load and normalize hero data
        await loadHeroes()

        // Extract heroes from the STRATZ match data
        const heroes: Hero[] = []

        data.players.forEach((player: any, index: number) => {
            // Get hero data from our normalized hero data
            const heroData = getHero(player.hero.id)
            const heroName = heroData?.localized_name || player.hero.displayName || `Hero ${player.hero.id}`
            const side = player.isRadiant ? 'Radiant' : 'Dire'

            heroes.push({
                id: player.hero.id,
                name: heroName,
                side: side,
                img: heroData?.img || ''
            })
        })

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
    if (!matchId.value || !selectedRole.value || !selectedHero.value) {
        return
    }

    isLoading.value = true
    error.value = ''

    try {
        // STRATZ data is already parsed, no need to check parsing status
        const url = `/report/${matchId.value}/${selectedRole.value}/${selectedHero.value}`

        // Navigate to report page with match ID, role, and hero
        window.location.href = url
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

const copyShareLink = async (report: ReportSummary) => {
    const url = `${window.location.origin}/report/${report.matchId}/${report.role}/${report.heroId}`
    try {
        await navigator.clipboard.writeText(url)
        // TODO: Show success toast
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const confirmDeleteReport = (reportId: string) => {
    const report = recentReports.value.find(r => r.id === reportId)
    if (report && confirm(`Are you sure you want to delete the analysis for ${report.heroName} (${getRoleDisplayName(report.role)}) from match ${report.matchId}?`)) {
        deleteReport(reportId)
    }
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