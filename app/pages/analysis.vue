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
                <h2 class="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">Match Analysis</h2>
                <p class="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">Analyze your Dota 2 matches with
                    AI-powered insights. Enter a match ID to see which heroes were played, then select yours for
                    personalized feedback and improvement suggestions.</p>
            </div>

            <!-- Match Analysis Section -->
            <section class="mb-12">
                <div class="rounded-lg p-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">

                    <!-- Match ID Input -->
                    <div class="mb-6">
                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="matchId" class="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Match ID
                                </label>
                                <input type="text" id="matchId" v-model="matchId" placeholder="Enter match ID"
                                    class="w-full px-4 py-3 rounded-md text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
                                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);"
                                    @keyup.enter="fetchMatchData" />
                            </div>
                            <div class="flex items-end">
                                <button @click="fetchMatchData" :disabled="isLoading || !matchId"
                                    class="px-6 py-3 bg-[var(--primary-color)] text-[var(--background-color)] rounded-md hover:bg-[var(--primary-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold glowing-button">
                                    <span v-if="isLoading">Loading Match...</span>
                                    <span v-else>Load Match</span>
                                </button>
                            </div>
                        </div>

                        <div v-if="error" class="mt-4 p-4 bg-[var(--accent-error)]/10 rounded-md">
                            <p class="text-[var(--accent-error)]">{{ error }}</p>
                        </div>

                        <!-- Unparsed Match Warning -->
                        <div v-if="matchData && !isMatchParsed && !isLoading"
                            class="mt-4 p-4 bg-amber-500/10 rounded-md">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0">
                                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-sm font-medium text-amber-500 mb-1">Match Not Yet Parsed</h4>
                                    <p class="text-sm text-amber-600 mb-2">
                                        This match needs to be parsed by Stratz before we can analyze it. This usually
                                        takes
                                        just a few minutes.
                                    </p>
                                    <div class="flex items-center space-x-3">
                                        <a :href="`https://stratz.com/match/${matchId}`" target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                                </path>
                                            </svg>
                                            Parse on Stratz
                                        </a>
                                        <button @click="startPollingForParsing"
                                            class="inline-flex items-center px-3 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-md hover:bg-[var(--primary-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
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
                    </div>

                    <!-- Hero Selection -->
                    <div v-if="matchHeroes.length > 0" class="mb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold text-[var(--text-primary)]">Select Your Hero</h4>
                            <div v-if="isPollingForParsing"
                                class="flex items-center space-x-2 text-sm text-[var(--primary-color)]">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary-color)]">
                                </div>
                                <span>{{ currentPollingMessage }}</span>
                            </div>
                        </div>

                        <!-- Hero Layout: Horizontal 5v5 with Responsive Design -->
                        <!-- Mobile: Vertical layout -->
                        <div class="md:hidden space-y-4">
                            <!-- Radiant Team (Top) -->
                            <div>
                                <h5 class="text-sm font-medium text-[var(--team-radiant)] mb-3 text-center">Radiant</h5>
                                <div class="flex justify-center gap-3">
                                    <button v-for="hero in radiantHeroes" :key="hero.id" type="button"
                                        @click="selectedHero = hero.id"
                                        class="flex flex-col items-center p-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24"
                                        :class="selectedHero === hero.id
                                            ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                            : 'text-[var(--text-primary)]'"
                                        :style="selectedHero === hero.id
                                            ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                            : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                        <HeroImage :hero-id="hero.id" :width="80" :height="80" class="rounded mb-2"
                                            :alt="hero.name" />
                                        <div class="text-center w-full">
                                            <div class="text-sm font-medium">{{ hero.name }}</div>
                                            <div class="text-xs text-[var(--text-secondary)]">{{
                                                getPositionDisplayName(hero.position) }}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- VS Separator -->
                            <div class="flex justify-center">
                                <div class="text-lg font-bold text-[var(--text-secondary)] px-3 py-1 rounded-lg"
                                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);">
                                    VS
                                </div>
                            </div>

                            <!-- Dire Team (Bottom) -->
                            <div>
                                <h5 class="text-sm font-medium text-[var(--team-dire)] mb-3 text-center">Dire</h5>
                                <div class="flex justify-center gap-3">
                                    <button v-for="hero in direHeroes" :key="hero.id" type="button"
                                        @click="selectedHero = hero.id"
                                        class="flex flex-col items-center p-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24"
                                        :class="selectedHero === hero.id
                                            ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                            : 'text-[var(--text-primary)]'"
                                        :style="selectedHero === hero.id
                                            ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                            : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                        <HeroImage :hero-id="hero.id" :width="80" :height="80" class="rounded mb-2"
                                            :alt="hero.name" />
                                        <div class="text-center w-full">
                                            <div class="text-sm font-medium">{{ hero.name }}</div>
                                            <div class="text-xs text-[var(--text-secondary)]">{{
                                                getPositionDisplayName(hero.position) }}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop: Horizontal layout -->
                        <div class="hidden md:block">
                            <div class="flex items-center justify-between gap-4">
                                <!-- Radiant Team (Left) -->
                                <div class="flex-1">
                                    <h5 class="text-sm font-medium text-[var(--team-radiant)] mb-3 text-center">Radiant
                                    </h5>
                                    <div class="flex justify-center gap-2">
                                        <button v-for="hero in radiantHeroes" :key="hero.id" type="button"
                                            @click="selectedHero = hero.id"
                                            class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-20"
                                            :class="selectedHero === hero.id
                                                ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                : 'text-[var(--text-primary)]'"
                                            :style="selectedHero === hero.id
                                                ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                            <HeroImage :hero-id="hero.id" :width="64" :height="64" class="rounded mb-1"
                                                :alt="hero.name" />
                                            <div class="text-center w-full">
                                                <div class="text-xs font-medium">{{ hero.name }}</div>
                                                <div class="text-xs text-[var(--text-secondary)]">{{
                                                    getPositionDisplayName(hero.position) }}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- VS Separator -->
                                <div class="flex-shrink-0">
                                    <div class="text-lg font-bold text-[var(--text-secondary)] px-3 py-1 rounded-lg"
                                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);">
                                        VS
                                    </div>
                                </div>

                                <!-- Dire Team (Right) -->
                                <div class="flex-1">
                                    <h5 class="text-sm font-medium text-[var(--team-dire)] mb-3 text-center">Dire</h5>
                                    <div class="flex justify-center gap-2">
                                        <button v-for="hero in direHeroes" :key="hero.id" type="button"
                                            @click="selectedHero = hero.id"
                                            class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-20"
                                            :class="selectedHero === hero.id
                                                ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                : 'text-[var(--text-primary)]'"
                                            :style="selectedHero === hero.id
                                                ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                            <HeroImage :hero-id="hero.id" :width="64" :height="64" class="rounded mb-1"
                                                :alt="hero.name" />
                                            <div class="text-center w-full">
                                                <div class="text-xs font-medium">{{ hero.name }}</div>
                                                <div class="text-xs text-[var(--text-secondary)]">{{
                                                    getPositionDisplayName(hero.position) }}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Analyze Button -->
                        <button @click="analyzeMatch"
                            :disabled="isLoading || !matchId || matchHeroes.length === 0 || !selectedHero || !isMatchParsed"
                            class="w-full mt-6 bg-[var(--accent-color)] text-black py-3 px-4 rounded-md font-medium hover:bg-[var(--accent-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 glowing-button">
                            <span v-if="isLoading">Analyzing...</span>
                            <span v-else-if="!matchId">Enter Match ID</span>
                            <span v-else-if="matchHeroes.length === 0">Load Match First</span>
                            <span v-else-if="!selectedHero">Select Your Hero</span>
                            <span v-else-if="!isMatchParsed">Parse Match First, Then Analyze</span>
                            <span v-else>Analyze Match</span>
                        </button>

                    </div>
                </div>
            </section>


        </main>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useHeroes } from '../composables/useHeroes'

interface Hero {
    id: number
    name: string
    side: string
    img: string
    position: string
}

const matchId = ref('')
const selectedHero = ref<number | null>(null)
const isLoading = ref(false)
const error = ref('')
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

// Position mapping from API format to display names
const positionMap: { [key: string]: string } = {
    'POSITION_1': 'Carry',
    'POSITION_2': 'Mid',
    'POSITION_3': 'Offlane',
    'POSITION_4': 'Soft Support',
    'POSITION_5': 'Hard Support'
}

const getPositionDisplayName = (position: string): string => {
    return positionMap[position] || position
}

const startPollingForParsing = async () => {
    if (isPollingForParsing.value) return

    isPollingForParsing.value = true
    messageIndex = 0
    currentPollingMessage.value = pollingMessages[0] || 'Checking if match is parsed...'

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
                    const position = (player.position as string) || 'Unknown'

                    heroes.push({
                        id: player.hero.id,
                        name: heroName,
                        side: side,
                        img: heroData?.img || '',
                        position: position
                    })
                })

                matchHeroes.value = heroes
                error.value = ''
                return
            }

            // Update rotating message
            messageIndex = (messageIndex + 1) % pollingMessages.length
            currentPollingMessage.value = pollingMessages[messageIndex] || 'Checking if match is parsed...'

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
                const position = (player.position as string) || 'Unknown'

                heroes.push({
                    id: player.hero.id,
                    name: heroName,
                    side: side,
                    img: heroData?.img || '',
                    position: position
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

// Helper function to get position number from position string
const getPositionNumber = (position: string): number => {
    // Handle different position formats: "POSITION_1", "pos1", "1", etc.
    const match = position.match(/(\d+)/)
    if (match) {
        return parseInt(match[1] || '999')
    }
    // Fallback for unknown positions
    return 999
}

// Computed properties for Radiant and Dire heroes, sorted by position
const radiantHeroes = computed(() =>
    matchHeroes.value
        .filter(hero => hero.side === 'Radiant')
        .sort((a, b) => {
            const posA = getPositionNumber(a.position)
            const posB = getPositionNumber(b.position)
            return posA - posB
        })
)

const direHeroes = computed(() =>
    matchHeroes.value
        .filter(hero => hero.side === 'Dire')
        .sort((a, b) => {
            const posA = getPositionNumber(a.position)
            const posB = getPositionNumber(b.position)
            return posA - posB
        })
)

// Load recent reports from localStorage and hero data
onMounted(async () => {
    // Load hero data first so images can be displayed
    await loadHeroes()
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

        // Store match data in localStorage for the report page to use
        localStorage.setItem(`match-data-${matchId.value}`, JSON.stringify(data))

        // Load and normalize hero data
        await loadHeroes()

        // Extract heroes from the STRATZ match data
        const heroes: Hero[] = []
        data.players.forEach((player: any) => {
            const heroData = getHero(player.hero.id)
            const heroName: string = heroData?.localized_name || player.hero.displayName || `Hero ${player.hero.id}`
            const side = player.isRadiant ? 'Radiant' : 'Dire'
            const position = (player.position as string) || 'Unknown'

            heroes.push({
                id: player.hero.id,
                name: heroName,
                side: side,
                img: heroData?.img || '',
                position: position
            })
        })

        matchHeroes.value = heroes
        error.value = ''

    } catch (e) {
        console.error('Error fetching match data:', e)
        error.value = e instanceof Error ? e.message : 'Failed to load match data'
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    selectedHero.value = null
    matchHeroes.value = []
    matchData.value = null
    error.value = ''
    stopPollingForParsing()
}

const analyzeMatch = async () => {
    if (!matchId.value || !selectedHero.value) {
        return
    }

    isLoading.value = true
    error.value = ''

    try {
        // Find the selected hero to get their position
        const selectedHeroData = matchHeroes.value.find(hero => hero.id === selectedHero.value)
        if (!selectedHeroData) {
            throw new Error('Selected hero not found')
        }

        // Convert position to the format expected by the report page
        const positionNumber = getPositionNumber(selectedHeroData.position)
        const roleValue = `pos${positionNumber}`

        // Navigate to the report page with the selected parameters
        const reportUrl = `/report/${matchId.value}/${roleValue}/${selectedHero.value}`
        window.location.href = reportUrl
    } catch (e) {
        console.error('Error analyzing match:', e)
        error.value = e instanceof Error ? e.message : 'Failed to analyze match'
    } finally {
        isLoading.value = false
    }
}

</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>
