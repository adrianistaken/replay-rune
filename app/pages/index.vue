<template>
    <div class="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden"
        style="background-color: var(--background-color); background-image: url('https://cdn.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <!-- Header -->
        <AppNavigation />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 lg:px-8 relative z-10">
            <!-- Dark overlay for readability -->
            <div class="fixed inset-0 bg-black/30 -z-10"></div>
            <!-- Hero Section -->
            <div class="mb-12 text-center pt-8 md:pt-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">Unlock Your Dota
                    2 Potential
                </h2>
                <p class="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">Analyze your replays, gain deep
                    insights, and climb the ranks.</p>
                <p class="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">Replay Rune is your personal Dota 2
                    coach.</p>

                <!-- Match Analysis Section -->
                <div class="mt-8 max-w-4xl mx-auto">
                    <div class="rounded-lg p-8"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <!-- Match ID Input -->
                        <div class="mb-6">
                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="matchId"
                                        class="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Match ID
                                    </label>
                                    <input type="text" id="matchId" v-model="matchId" placeholder="Enter match ID"
                                        class="w-full px-4 py-3 rounded-md text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
                                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);"
                                        @keyup.enter="fetchMatchData" />
                                </div>
                                <div class="flex items-end gap-2">
                                    <button @click="loadRandomExample"
                                        class="px-3 py-3 bg-[var(--secondary-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--secondary-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition-all duration-200 flex items-center justify-center"
                                        title="Load random example match">
                                        <span class="material-symbols-outlined text-base">shuffle</span>
                                    </button>
                                    <button @click="fetchMatchData" :disabled="isLoading || !matchId"
                                        class="px-6 py-3 bg-[var(--primary-color)] text-[var(--accent-color)] rounded-md hover:bg-[var(--primary-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold glowing-button flex items-center justify-center">
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
                                            This match needs to be parsed by Stratz before we can analyze it. This
                                            usually
                                            takes
                                            just a few minutes.
                                        </p>
                                        <div class="flex items-center space-x-3">
                                            <a :href="`https://stratz.com/match/${matchId}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                                    </path>
                                                </svg>
                                                Parse on Stratz
                                            </a>
                                            <button @click="startPollingForParsing"
                                                class="inline-flex items-center px-3 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-md hover:bg-[var(--primary-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-amber-500/10 transition-colors">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
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
                                    <div
                                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary-color)]">
                                    </div>
                                    <span>{{ currentPollingMessage }}</span>
                                </div>
                            </div>

                            <!-- Hero Layout: Horizontal 5v5 with Responsive Design -->
                            <!-- Mobile: 2-3 Layout -->
                            <div class="md:hidden space-y-4">
                                <!-- Radiant Team (Top) -->
                                <div>
                                    <h5 class="text-sm font-medium text-[var(--team-radiant)] mb-4 text-center">Radiant
                                    </h5>
                                    <div class="space-y-2">
                                        <!-- Top row: Pos 1-2 -->
                                        <div class="flex justify-center gap-2">
                                            <button v-for="hero in radiantHeroes.slice(0, 2)" :key="hero.id"
                                                type="button" @click="selectedHero = hero.id"
                                                class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                :class="selectedHero === hero.id
                                                    ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                    : 'text-[var(--text-primary)]'"
                                                :style="selectedHero === hero.id
                                                    ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                    : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                <div class="w-full h-20 flex items-center justify-center p-0">
                                                    <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                        class="rounded w-full h-full object-cover" :alt="hero.name" />
                                                </div>
                                                <div class="text-center w-full px-1">
                                                    <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                    <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                        getPositionDisplayName(hero.position) }}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                        <!-- Bottom row: Pos 3-5 -->
                                        <div class="flex justify-center gap-2">
                                            <button v-for="hero in radiantHeroes.slice(2, 5)" :key="hero.id"
                                                type="button" @click="selectedHero = hero.id"
                                                class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                :class="selectedHero === hero.id
                                                    ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                    : 'text-[var(--text-primary)]'"
                                                :style="selectedHero === hero.id
                                                    ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                    : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                <div class="w-full h-20 flex items-center justify-center p-0">
                                                    <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                        class="rounded w-full h-full object-cover" :alt="hero.name" />
                                                </div>
                                                <div class="text-center w-full px-1">
                                                    <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                    <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                        getPositionDisplayName(hero.position) }}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
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
                                    <h5 class="text-sm font-medium text-[var(--team-dire)] mb-4 text-center">Dire</h5>
                                    <div class="space-y-2">
                                        <!-- Top row: Pos 1-2 -->
                                        <div class="flex justify-center gap-2">
                                            <button v-for="hero in direHeroes.slice(0, 2)" :key="hero.id" type="button"
                                                @click="selectedHero = hero.id"
                                                class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                :class="selectedHero === hero.id
                                                    ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                    : 'text-[var(--text-primary)]'"
                                                :style="selectedHero === hero.id
                                                    ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                    : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                <div class="w-full h-20 flex items-center justify-center p-0">
                                                    <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                        class="rounded w-full h-full object-cover" :alt="hero.name" />
                                                </div>
                                                <div class="text-center w-full px-1">
                                                    <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                    <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                        getPositionDisplayName(hero.position) }}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                        <!-- Bottom row: Pos 3-5 -->
                                        <div class="flex justify-center gap-2">
                                            <button v-for="hero in direHeroes.slice(2, 5)" :key="hero.id" type="button"
                                                @click="selectedHero = hero.id"
                                                class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                :class="selectedHero === hero.id
                                                    ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                    : 'text-[var(--text-primary)]'"
                                                :style="selectedHero === hero.id
                                                    ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                    : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                <div class="w-full h-20 flex items-center justify-center p-0">
                                                    <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                        class="rounded w-full h-full object-cover" :alt="hero.name" />
                                                </div>
                                                <div class="text-center w-full px-1">
                                                    <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                    <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                        getPositionDisplayName(hero.position) }}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Desktop: 2-3 Layout -->
                            <div class="hidden md:block">
                                <div class="flex items-center justify-center gap-8 max-w-full overflow-hidden">
                                    <!-- Radiant Team (Left) -->
                                    <div class="flex-1 min-w-0">
                                        <h5 class="text-sm font-medium text-[var(--team-radiant)] mb-4 text-center">
                                            Radiant</h5>
                                        <div class="space-y-2">
                                            <!-- Top row: Pos 1-2 -->
                                            <div class="flex justify-center gap-2">
                                                <button v-for="hero in radiantHeroes.slice(0, 2)" :key="hero.id"
                                                    type="button" @click="selectedHero = hero.id"
                                                    class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                    :class="selectedHero === hero.id
                                                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                        : 'text-[var(--text-primary)]'"
                                                    :style="selectedHero === hero.id
                                                        ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                        : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                    <div class="w-full h-20 flex items-center justify-center p-0">
                                                        <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                            class="rounded w-full h-full object-cover"
                                                            :alt="hero.name" />
                                                    </div>
                                                    <div class="text-center w-full px-1">
                                                        <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                        <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                            getPositionDisplayName(hero.position) }}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                            <!-- Bottom row: Pos 3-5 -->
                                            <div class="flex justify-center gap-2">
                                                <button v-for="hero in radiantHeroes.slice(2, 5)" :key="hero.id"
                                                    type="button" @click="selectedHero = hero.id"
                                                    class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                    :class="selectedHero === hero.id
                                                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                        : 'text-[var(--text-primary)]'"
                                                    :style="selectedHero === hero.id
                                                        ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                        : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                    <div class="w-full h-20 flex items-center justify-center p-0">
                                                        <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                            class="rounded w-full h-full object-cover"
                                                            :alt="hero.name" />
                                                    </div>
                                                    <div class="text-center w-full px-1">
                                                        <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                        <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                            getPositionDisplayName(hero.position) }}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
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
                                    <div class="flex-1 min-w-0">
                                        <h5 class="text-sm font-medium text-[var(--team-dire)] mb-4 text-center">Dire
                                        </h5>
                                        <div class="space-y-2">
                                            <!-- Top row: Pos 1-2 -->
                                            <div class="flex justify-center gap-2">
                                                <button v-for="hero in direHeroes.slice(0, 2)" :key="hero.id"
                                                    type="button" @click="selectedHero = hero.id"
                                                    class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                    :class="selectedHero === hero.id
                                                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                        : 'text-[var(--text-primary)]'"
                                                    :style="selectedHero === hero.id
                                                        ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                        : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                    <div class="w-full h-20 flex items-center justify-center p-0">
                                                        <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                            class="rounded w-full h-full object-cover"
                                                            :alt="hero.name" />
                                                    </div>
                                                    <div class="text-center w-full px-1">
                                                        <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                        <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                            getPositionDisplayName(hero.position) }}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                            <!-- Bottom row: Pos 3-5 -->
                                            <div class="flex justify-center gap-2">
                                                <button v-for="hero in direHeroes.slice(2, 5)" :key="hero.id"
                                                    type="button" @click="selectedHero = hero.id"
                                                    class="flex flex-col items-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-24 min-w-24"
                                                    :class="selectedHero === hero.id
                                                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                                        : 'text-[var(--text-primary)]'"
                                                    :style="selectedHero === hero.id
                                                        ? 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'
                                                        : 'background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%);'">
                                                    <div class="w-full h-20 flex items-center justify-center p-0">
                                                        <HeroImage :hero-id="hero.id" :width="80" :height="80"
                                                            class="rounded w-full h-full object-cover"
                                                            :alt="hero.name" />
                                                    </div>
                                                    <div class="text-center w-full px-1">
                                                        <div class="text-xs font-medium truncate">{{ hero.name }}</div>
                                                        <div class="text-xs text-[var(--text-secondary)] truncate">{{
                                                            getPositionDisplayName(hero.position) }}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Analyze Button -->
                            <button @click="analyzeMatch"
                                :disabled="isLoading || !matchId || matchHeroes.length === 0 || !selectedHero || !isMatchParsed"
                                class="w-full mt-6 py-3 px-4 rounded-md font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 glowing-button"
                                style="background-color: #709680; color: white;">
                                <span v-if="isLoading">Analyzing...</span>
                                <span v-else-if="!matchId">Enter Match ID</span>
                                <span v-else-if="matchHeroes.length === 0">Load Match First</span>
                                <span v-else-if="!selectedHero">Select Your Hero</span>
                                <span v-else-if="!isMatchParsed">Parse Match First, Then Analyze</span>
                                <span v-else>Analyze Match</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <!-- <section class=" mb-12 py-12">
                        <h3
                            class="text-2xl lg:text-3xl font-semibold text-[var(--text-primary)] mb-8 text-center pb-2 flex items-center justify-center gap-3">
                            <span class="material-symbols-outlined text-[var(--primary-color)]">auto_awesome</span>
                            Key Features
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div class="rounded-lg p-6 transition-all duration-300 ease-in-out group flex flex-col items-center text-center"
                                style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                                <div class="p-4 rounded-full bg-[var(--primary-color)]/10 mb-4">
                                    <span
                                        class="material-symbols-outlined text-4xl text-[var(--primary-color)]">insights</span>
                                </div>
                                <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">In-Depth Analysis</h4>
                                <p class="text-sm text-[var(--text-secondary)]">Go beyond post-game stats. We break down
                                    teamfights, farming patterns, and objective control to show you what truly mattered.
                                </p>
                            </div>
                            <div class="rounded-lg p-6 transition-all duration-300 ease-in-out group flex flex-col items-center text-center"
                                style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                                <div class="p-4 rounded-full bg-[var(--secondary-color)]/10 mb-4">
                                    <span
                                        class="material-symbols-outlined text-4xl text-[var(--secondary-color)]">timeline</span>
                                </div>
                                <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">Performance Tracking</h4>
                                <p class="text-sm text-[var(--text-secondary)]">Track your progress over time. Identify
                                    your
                                    strengths, weaknesses, and hero-specific trends with our personalized dashboard.</p>
                            </div>
                            <div class="rounded-lg p-6 transition-all duration-300 ease-in-out group flex flex-col items-center text-center"
                                style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                                <div class="p-4 rounded-full bg-[var(--accent-color)]/10 mb-4">
                                    <span
                                        class="material-symbols-outlined text-4xl text-[var(--accent-color)]">groups</span>
                                </div>
                                <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">Team Sync</h4>
                                <p class="text-sm text-[var(--text-secondary)]">Analyze games with your team. Share
                                    reports,
                                    compare stats, and develop winning strategies together for your next match.</p>
                            </div>
                        </div>
                        </section> -->

            <!-- Analysis CTA Section -->
            <!-- <section class="mb-12">
                <div class="rounded-lg p-8 my-12 flex flex-col md:flex-row items-center justify-between gap-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">Ready to Analyze?
                        </h3>
                        <p class="text-[var(--text-secondary)] max-w-2xl">Start analyzing your Dota 2 matches with our
                            AI-powered insights. Get detailed feedback on your performance and improvement suggestions.
                        </p>
                    </div>
                    <div class="flex-shrink-0">
                        <NuxtLink to="/analysis"
                            class="bg-[var(--accent-color)] text-black font-bold py-3 px-8 rounded-md text-lg glowing-button hover:shadow-[0_0_20px_rgba(207,90,44,0.6)] transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                            Start Analysis
                        </NuxtLink>
                    </div>
                </div>
            </section> -->

            <!-- Recent History Section -->
            <section v-if="recentReports.length > 0" class="mb-12">
                <h3
                    class="text-2xl lg:text-3xl font-semibold text-[var(--text-primary)] mb-6 text-center pb-2 flex items-center justify-center gap-3">
                    <span class="material-symbols-outlined text-[var(--primary-color)]">history</span>
                    Recent Reports
                </h3>
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="space-y-3 relative">
                        <!-- All Reports (no limit) -->
                        <div v-for="report in recentReports" :key="report.id"
                            class="rounded-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center space-x-3 flex-1 cursor-pointer"
                                    @click="viewReport(report)">
                                    <HeroImage :hero-id="report.heroId" :width="48" :height="48" class="rounded"
                                        :alt="report.heroName" />
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-2">
                                            <div class="font-medium text-[var(--text-primary)]">
                                                {{ report.heroName }} ({{ getRoleDisplayName(report.role) }})
                                            </div>
                                            <span class="text-xs px-2 py-1 rounded-full"
                                                :class="report.win === true ? 'bg-[var(--accent-success)]/10 text-[var(--accent-success)]' : 'bg-[var(--accent-error)]/10 text-[var(--accent-error)]'">
                                                {{ report.win === true ? 'Victory' : 'Defeat' }}
                                            </span>
                                        </div>
                                        <div class="text-sm text-[var(--text-secondary)]">
                                            Match {{ report.matchId }} • {{ formatDate(report.timestamp) }}
                                        </div>
                                        <div class="text-sm text-[var(--text-primary)] mt-1">
                                            {{ report.summary }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button @click.stop="copyShareLink(report)"
                                        class="text-[var(--text-secondary)] hover:text-[var(--primary-color)] p-2 rounded-md hover:bg-[var(--primary-color)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                        title="Share">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button @click.stop="confirmDeleteReport(report.id)"
                                        class="text-[var(--accent-error)] hover:text-[var(--accent-error)]/80 p-2 rounded-md hover:bg-[var(--accent-error)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-error)]"
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
                </div>
            </section>

            <!-- Registration CTA Section -->
            <!-- <section class="mb-12">
                <div class="rounded-lg p-8 my-12 flex flex-col md:flex-row items-center justify-between gap-8"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">Ready to Join?</h3>
                        <p class="text-[var(--text-secondary)] max-w-2xl">Create an account to save your replay history,
                            track your long-term performance, and unlock exclusive features.</p>
                    </div>
                    <div class="flex-shrink-0">
                        <a class="bg-[var(--primary-color)] text-[var(--background-color)] font-bold py-3 px-8 rounded-md text-lg glowing-button hover:shadow-[0_0_20px_rgba(13,242,242,0.6)] transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                            href="#">
                            Register Now
                        </a>
                    </div>
                </div>
            </section> -->
        </main>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
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

interface Hero {
    id: number
    name: string
    side: string
    img: string
    position: string
}

const recentReports = ref<ReportSummary[]>([])
const { loadHeroes, getHero } = useHeroes()

// Analysis functionality
const matchId = ref('')
const selectedHero = ref<number | null>(null)
const isLoading = ref(false)
const error = ref('')
const matchData = ref<any>(null)
const matchHeroes = ref<Hero[]>([])

// Example match IDs
const exampleMatchIds = ['8434858870', '8434858852', '8434858831']

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

// Load recent reports from localStorage
onMounted(async () => {
    // Ensure hero data is loaded so images resolve correctly on hard refresh
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
            recentReports.value = validReports
        } catch (e) {
            console.error('Failed to load history:', e)
            // Clear corrupted history
            localStorage.removeItem('replay-checker-history')
        }
    }
})

// Random example match loader
const loadRandomExample = () => {
    const randomIndex = Math.floor(Math.random() * exampleMatchIds.length)
    matchId.value = exampleMatchIds[randomIndex] || ''
}

// Analysis functions
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

// Clean up polling on component unmount
onUnmounted(() => {
    stopPollingForParsing()
})

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
            recentReports.value = filtered
        }
    } catch (e) {
        console.error('Failed to delete report:', e)
        // Clear corrupted history
        localStorage.removeItem('replay-checker-history')
        recentReports.value = []
    }
}

</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>
