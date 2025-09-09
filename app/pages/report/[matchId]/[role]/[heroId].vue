<template>
    <div class="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden"
        style="background-color: var(--background-color); background-image: url('https://cdn.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">

        <!-- Header -->
        <header
            class="bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg py-4 px-6 md:px-10 flex justify-between items-center">
            <NuxtLink to="/" class="flex items-center gap-4 text-primary hover:opacity-80 transition-opacity">
                <svg class="text-primary" fill="none" height="24" viewBox="0 0 24 24" width="24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.23L19.5 8.5V15.5L12 19.77L4.5 15.5V8.5L12 4.23Z"
                        fill="currentColor"></path>
                    <path d="M4.5 8.5L12 12.5L19.5 8.5" stroke="currentColor" stroke-width="1.5"></path>
                    <path d="M12 22V12.5" stroke="currentColor" stroke-width="1.5"></path>
                </svg>
                <h1 class="text-xl font-bold" style="color: #cf5a2c;">Replay Rune</h1>
            </NuxtLink>
            <nav class="hidden md:flex items-center gap-6">
                <NuxtLink to="/analysis"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
                    Analysis
                </NuxtLink>
                <NuxtLink to="/history"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
                    History
                </NuxtLink>
                <!-- <NuxtLink to="/subscribe"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
                    Subscribe
                </NuxtLink> -->
            </nav>
            <div class="flex items-center gap-4">
                <a class="hidden md:block text-[var(--text-primary)] font-medium hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2"
                    href="#">Login</a>
                <a class="hidden md:flex bg-[var(--primary-color)] text-[var(--background-color)] font-bold py-2 px-5 rounded-md hover:shadow-[0_0_15px_rgba(13,242,242,0.7)] transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                    href="#">
                    Register
                </a>
                <button
                    class="md:hidden flex items-center justify-center size-10 rounded-full bg-[var(--card-background)] text-[var(--text-primary)]">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </div>
        </header>

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
                            <NuxtLink to="/analysis"
                                class="px-6 py-3 bg-[var(--accent-color)] text-black rounded-md font-semibold hover:bg-[var(--accent-color)]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] glowing-button">
                                New Analysis
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Wins -->
                <div class="rounded-lg p-8 mb-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">What You Did Well</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="win in report.wins" :key="win.title"
                            class="p-6 bg-[var(--accent-success)]/10 rounded-lg hover:bg-[var(--accent-success)]/15 transition-all duration-200">
                            <div class="flex items-start space-x-4">
                                <div
                                    class="flex-shrink-0 w-10 h-10 bg-[var(--accent-success)] text-white rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-[var(--accent-success)] text-xl mb-3">{{ win.title }}
                                    </h3>
                                    <p class="text-[var(--text-primary)] leading-relaxed mb-4">{{ win.description }}</p>
                                    <div v-if="win.dataComparison"
                                        class="text-xs text-[var(--text-secondary)] font-mono bg-[var(--card-background)]/50 rounded px-3 py-2">
                                        {{ win.dataComparison }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top 3 Fixes -->
                <div class="rounded-lg p-8 mb-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">Fixes for Next Game</h2>
                    <div class="space-y-6">
                        <div v-for="(fix, index) in report.fixes" :key="fix.title"
                            class="p-6 bg-[var(--accent-error)]/10 rounded-lg hover:bg-[var(--accent-error)]/15 transition-all duration-200">
                            <div class="flex items-start space-x-4">
                                <div
                                    class="flex-shrink-0 w-10 h-10 bg-[var(--accent-error)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {{ index + 1 }}
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-[var(--accent-error)] text-xl mb-3">{{ fix.title }}
                                    </h3>
                                    <p class="text-[var(--text-primary)] leading-relaxed mb-4">{{ fix.description }}</p>
                                    <div v-if="fix.dataComparison"
                                        class="text-xs text-[var(--text-secondary)] font-mono bg-[var(--card-background)]/50 rounded px-3 py-2">
                                        {{ fix.dataComparison }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KPI Grid -->
                <div class="rounded-lg p-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">Performance Metrics</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div v-for="kpi in report.kpis" :key="kpi.name"
                            class="p-6 bg-[var(--card-background)]/30 rounded-lg hover:bg-[var(--card-background)]/50 transition-all duration-200">
                            <div class="text-sm text-[var(--text-secondary)] mb-2">{{ kpi.name }}</div>
                            <div class="text-2xl font-bold text-[var(--text-primary)] mb-4">
                                {{ kpi.value }}{{ kpi.unit }}
                            </div>
                            <div class="flex items-center">
                                <div class="flex-1 bg-[var(--card-background)]/50 rounded-full h-3">
                                    <div class="h-3 rounded-full transition-all duration-300"
                                        :class="getPercentileColor(kpi.percentile)"
                                        :style="{ width: `${kpi.percentile}%` }"></div>
                                </div>
                                <span class="ml-3 text-sm font-medium" :class="getPercentileTextColor(kpi.percentile)">
                                    {{ kpi.percentile }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Mobile Menu Overlay and Menu -->
        <div class="fixed inset-0 bg-black/50 z-40 hidden" id="mobile-menu-overlay"></div>
        <div class="fixed top-0 right-0 h-full w-64 z-50 transform translate-x-full transition-transform duration-300 ease-in-out md:hidden"
            id="mobile-menu"
            style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
            <div class="p-6">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-xl font-bold text-[var(--text-primary)]">Menu</h2>
                    <button id="close-menu-btn">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                <nav class="flex flex-col gap-4">
                    <NuxtLink to="/analysis"
                        class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                        Analysis
                    </NuxtLink>
                    <NuxtLink to="/history"
                        class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                        History
                    </NuxtLink>
                    <!-- <NuxtLink to="/subscribe"
                        class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                        Subscribe
                    </NuxtLink> -->
                    <hr class="border-[var(--text-secondary)]/20 my-2" />
                    <a class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2"
                        href="#">Login</a>
                    <a class="mt-2 bg-[var(--primary-color)] text-center text-[var(--background-color)] font-bold py-2 px-5 rounded-md glowing-button"
                        href="#">
                        Register
                    </a>
                </nav>
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
const { loadHeroes, getHero } = useHeroes()

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

        console.log(finalReport.kpis.map(kpi => kpi.description));

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

    // Mobile menu functionality
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay')
    const openMenuBtn = document.querySelector('button.md\\:hidden')
    const closeMenuBtn = document.getElementById('close-menu-btn')

    if (mobileMenu && mobileMenuOverlay && openMenuBtn && closeMenuBtn) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('translate-x-full')
            mobileMenuOverlay.classList.toggle('hidden')
        }

        openMenuBtn.addEventListener('click', toggleMenu)
        closeMenuBtn.addEventListener('click', toggleMenu)
        mobileMenuOverlay.addEventListener('click', toggleMenu)
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
    if (percentile >= 80) return 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)]/80'
    if (percentile >= 70) return 'bg-gradient-to-r from-[var(--accent-success)] to-[var(--accent-success)]/80'
    if (percentile >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    if (percentile >= 40) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    return 'bg-gradient-to-r from-[var(--accent-error)] to-[var(--accent-error)]/80'
}

const getPercentileTextColor = (percentile: number) => {
    if (percentile >= 90) return 'text-purple-400'
    if (percentile >= 80) return 'text-[var(--primary-color)]'
    if (percentile >= 70) return 'text-[var(--accent-success)]'
    if (percentile >= 60) return 'text-yellow-400'
    if (percentile >= 40) return 'text-yellow-400'
    return 'text-[var(--accent-error)]'
}
</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>
