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
                    class="font-medium text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
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
                        class="font-medium text-[var(--primary-color)] transition-colors duration-200 py-2">
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