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
                    class="font-medium text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
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
                <h2 class="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">Choose Your Plan</h2>
                <p class="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">Unlock the full potential of your Dota
                    2 analysis with advanced insights and unlimited reports</p>
            </div>

            <!-- Pricing Cards -->
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <!-- Free Tier -->
                <div class="rounded-xl p-8 relative"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <div class="text-center mb-6">
                        <div class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">Free</div>
                        <div class="text-5xl font-bold text-[var(--text-primary)] mb-1">$0</div>
                        <div class="text-[var(--text-secondary)]">forever</div>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-5 h-5 bg-[var(--accent-success)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)]">2 free match reports per week</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-5 h-5 bg-[var(--accent-success)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)]">Basic performance metrics</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-5 h-5 bg-[var(--accent-success)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)]">Limited history (last 2 games)</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-5 h-5 bg-[var(--accent-success)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)]">Core improvement suggestions</span>
                        </div>
                    </div>

                    <button
                        class="w-full py-3 px-6 bg-[var(--card-background)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--card-background)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]">
                        Current Plan
                    </button>
                </div>

                <!-- Paid Tier -->
                <div class="rounded-xl p-8 relative"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <!-- Popular Badge -->
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div
                            class="bg-[var(--accent-color)] text-black px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Most Popular
                        </div>
                    </div>

                    <div class="text-center mb-6">
                        <div class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">Pro</div>
                        <div class="text-5xl font-bold text-[var(--accent-color)] mb-1">$5</div>
                        <div class="text-[var(--text-secondary)]">per month</div>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)] font-medium">Unlimited match reports</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)] font-medium">Full history & progression
                                charts</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)] font-medium">Role-specific insights</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)] font-medium">Advanced performance analytics</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-primary)] font-medium">Ad-free experience</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <span class="text-[var(--text-secondary)]">AI-powered summaries (Coming Soon)</span>
                        </div>
                    </div>

                    <button
                        class="w-full py-3 px-6 bg-[var(--accent-color)] text-black rounded-lg font-semibold hover:bg-[var(--accent-color)]/90 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] glowing-button">
                        Upgrade to Pro
                    </button>
                </div>
            </div>

            <!-- Features Comparison -->
            <div class="mb-16">
                <h2 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] text-center mb-8">Feature
                    Comparison</h2>
                <div class="rounded-xl overflow-hidden"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <!-- Table Header -->
                    <div class="grid grid-cols-3">
                        <div class="p-6">
                            <h3 class="text-lg font-semibold text-[var(--text-primary)]">Feature</h3>
                        </div>
                        <div class="p-6 bg-[var(--card-background)]/30">
                            <h3 class="text-lg font-semibold text-[var(--text-primary)] text-center">Free</h3>
                        </div>
                        <div class="p-6 bg-[var(--accent-color)]/10">
                            <h3 class="text-lg font-semibold text-[var(--accent-color)] text-center">Pro</h3>
                        </div>
                    </div>

                    <!-- Table Rows -->
                    <div class="divide-y divide-[var(--text-secondary)]/20">
                        <!-- Match Reports Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Match Reports</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)] text-sm">2 per week</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-color)] font-medium">Unlimited</span>
                            </div>
                        </div>

                        <!-- History Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Match History</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)] text-sm">Last 2 games</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-color)] font-medium">Full history</span>
                            </div>
                        </div>

                        <!-- Analytics Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Performance Analytics</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)] text-sm">Basic metrics</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-color)] font-medium">Advanced analytics</span>
                            </div>
                        </div>

                        <!-- Role Insights Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Role-Specific Insights</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)] text-sm">Limited</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-color)] font-medium">Complete insights</span>
                            </div>
                        </div>

                        <!-- Progression Charts Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Progression Charts</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)]">❌</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-success)] font-medium">✓</span>
                            </div>
                        </div>

                        <!-- Ad-Free Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">Ad-Free Experience</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)]">❌</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-success)] font-medium">✓</span>
                            </div>
                        </div>

                        <!-- AI Summaries Row -->
                        <div class="grid grid-cols-3 hover:bg-[var(--card-background)]/20 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-[var(--text-primary)] font-medium">AI-Powered Summaries</span>
                            </div>
                            <div class="p-6 bg-[var(--card-background)]/30 flex items-center justify-center">
                                <span class="text-[var(--text-secondary)]">❌</span>
                            </div>
                            <div class="p-6 bg-[var(--accent-color)]/10 flex items-center justify-center">
                                <span class="text-[var(--accent-color)] font-medium">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="mb-16">
                <h2 class="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] text-center mb-8">Frequently Asked
                    Questions
                </h2>
                <div class="space-y-6 max-w-3xl mx-auto">
                    <div class="rounded-lg p-6"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Can I cancel my subscription
                            anytime?</h3>
                        <p class="text-[var(--text-primary)]">Yes, you can cancel your Pro subscription at any time.
                            You'll continue to have access to Pro features until the end of your billing period.</p>
                    </div>
                    <div class="rounded-lg p-6"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">What happens to my data if I
                            downgrade?</h3>
                        <p class="text-[var(--text-primary)]">Your match history and reports are preserved. You'll still
                            have access to your last 2 games in the free tier, and all your data remains available if
                            you upgrade again.</p>
                    </div>
                    <div class="rounded-lg p-6"
                        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Do you offer refunds?</h3>
                        <p class="text-[var(--text-primary)]">We offer a 30-day money-back guarantee. If you're not
                            satisfied with Pro features, contact us within 30 days for a full refund.</p>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="text-center">
                <div class="rounded-xl p-8 max-w-2xl mx-auto"
                    style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
                    <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Level Up Your Game?</h2>
                    <p class="text-[var(--text-secondary)] mb-6">Join thousands of players who are already improving
                        with detailed insights and unlimited analysis.</p>
                    <button
                        class="bg-[var(--accent-color)] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[var(--accent-color)]/90 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] glowing-button">
                        Start Your Free Trial
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
                        class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                        History
                    </NuxtLink>
                    <!-- <NuxtLink to="/subscribe"
                        class="font-medium text-[var(--primary-color)] transition-colors duration-200 py-2">
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
import { onMounted } from 'vue'

// This is a static page for now, no functionality needed

// Mobile menu functionality
onMounted(() => {
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
</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>