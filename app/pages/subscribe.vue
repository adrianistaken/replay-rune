<template>
    <div class="min-h-screen bg-dark-bg py-8">
        <div class="max-w-6xl mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-accent-primary mb-4">Choose Your Plan</h1>
                <p class="text-xl text-text-primary max-w-2xl mx-auto">
                    Unlock the full potential of your Dota 2 analysis with advanced insights and unlimited reports
                </p>
            </div>

            <!-- Pricing Cards -->
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Free Tier -->
                <div class="bg-dark-panel rounded-xl shadow-lg border border-dark-border p-8 relative">
                    <div class="text-center mb-6">
                        <div class="text-3xl font-bold text-text-primary mb-2">Free</div>
                        <div class="text-5xl font-bold text-text-primary mb-1">$0</div>
                        <div class="text-text-secondary">forever</div>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-accent-success rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-text-primary">2 free match reports per week</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-accent-success rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-text-primary">Basic performance metrics</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-accent-success rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-text-primary">Limited history (last 2 games)</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-accent-success rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-text-primary">Core improvement suggestions</span>
                        </div>
                    </div>

                    <button
                        class="w-full py-3 px-6 bg-dark-card text-text-primary rounded-lg font-medium hover:bg-dark-card/80 transition-colors focus-accent">
                        Current Plan
                    </button>
                </div>

                <!-- Paid Tier -->
                <div
                    class="bg-gradient-to-br from-accent-primary to-accent-primary/80 rounded-xl shadow-lg border border-accent-primary/50 p-8 relative">
                    <!-- Popular Badge -->
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Most Popular
                        </div>
                    </div>

                    <div class="text-center mb-6">
                        <div class="text-3xl font-bold text-white mb-2">Pro</div>
                        <div class="text-5xl font-bold text-white mb-1">$5</div>
                        <div class="text-white/80">per month</div>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-white font-medium">Unlimited match reports</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-white font-medium">Full history & progression charts</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-white font-medium">Role-specific insights</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-white font-medium">Advanced performance analytics</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-white font-medium">Ad-free experience</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-accent-primary" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <span class="text-white/90">AI-powered summaries (Coming Soon)</span>
                        </div>
                    </div>

                    <button
                        class="w-full py-3 px-6 bg-white text-accent-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg focus-accent">
                        Upgrade to Pro
                    </button>
                </div>
            </div>

            <!-- Features Comparison -->
            <div class="mt-16 max-w-5xl mx-auto">
                <h2 class="text-2xl font-bold text-text-primary text-center mb-8">Feature Comparison</h2>
                <div class="bg-dark-panel rounded-xl shadow-lg border border-dark-border overflow-hidden">
                    <!-- Table Header -->
                    <div class="grid grid-cols-3 bg-dark-card border-b border-dark-border">
                        <div class="p-6">
                            <h3 class="text-lg font-semibold text-text-primary">Feature</h3>
                        </div>
                        <div class="p-6 bg-dark-panel border-l border-dark-border">
                            <h3 class="text-lg font-semibold text-text-primary text-center">Free</h3>
                        </div>
                        <div class="p-6 bg-accent-primary/10 border-l border-dark-border">
                            <h3 class="text-lg font-semibold text-accent-primary text-center">Pro</h3>
                        </div>
                    </div>

                    <!-- Table Rows -->
                    <div class="divide-y divide-dark-border">
                        <!-- Match Reports Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Match Reports</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-secondary text-sm">2 per week</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-primary font-medium">Unlimited</span>
                            </div>
                        </div>

                        <!-- History Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Match History</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-secondary text-sm">Last 2 games</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-primary font-medium">Full history</span>
                            </div>
                        </div>

                        <!-- Analytics Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Performance Analytics</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-secondary text-sm">Basic metrics</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-primary font-medium">Advanced analytics</span>
                            </div>
                        </div>

                        <!-- Role Insights Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Role-Specific Insights</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-secondary text-sm">Limited</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-primary font-medium">Complete insights</span>
                            </div>
                        </div>

                        <!-- Progression Charts Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Progression Charts</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-muted">❌</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-success font-medium">✓</span>
                            </div>
                        </div>

                        <!-- Ad-Free Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">Ad-Free Experience</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-muted">❌</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-success font-medium">✓</span>
                            </div>
                        </div>

                        <!-- AI Summaries Row -->
                        <div class="grid grid-cols-3 hover:bg-dark-card/50 transition-colors">
                            <div class="p-6 flex items-center">
                                <span class="text-text-primary font-medium">AI-Powered Summaries</span>
                            </div>
                            <div class="p-6 bg-dark-panel border-l border-dark-border flex items-center justify-center">
                                <span class="text-text-muted">❌</span>
                            </div>
                            <div
                                class="p-6 bg-accent-primary/5 border-l border-dark-border flex items-center justify-center">
                                <span class="text-accent-primary font-medium">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="mt-16 max-w-3xl mx-auto">
                <h2 class="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>
                <div class="space-y-6">
                    <div class="bg-dark-panel rounded-lg border border-dark-border p-6">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Can I cancel my subscription anytime?
                        </h3>
                        <p class="text-text-primary">Yes, you can cancel your Pro subscription at any time. You'll
                            continue
                            to have access to Pro features until the end of your billing period.</p>
                    </div>
                    <div class="bg-dark-panel rounded-lg border border-dark-border p-6">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">What happens to my data if I downgrade?
                        </h3>
                        <p class="text-text-primary">Your match history and reports are preserved. You'll still have
                            access
                            to your last 2 games in the free tier, and all your data remains available if you upgrade
                            again.</p>
                    </div>
                    <div class="bg-dark-panel rounded-lg border border-dark-border p-6">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Do you offer refunds?</h3>
                        <p class="text-text-primary">We offer a 30-day money-back guarantee. If you're not satisfied
                            with
                            Pro features, contact us within 30 days for a full refund.</p>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="mt-16 text-center">
                <div class="bg-gradient-to-r from-accent-primary to-accent-primary/80 rounded-xl p-8 max-w-2xl mx-auto">
                    <h2 class="text-2xl font-bold text-white mb-4">Ready to Level Up Your Game?</h2>
                    <p class="text-white/90 mb-6">Join thousands of players who are already improving with detailed
                        insights and unlimited analysis.</p>
                    <button
                        class="bg-white text-accent-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg focus-accent">
                        Start Your Free Trial
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// This is a static page for now, no functionality needed
</script>