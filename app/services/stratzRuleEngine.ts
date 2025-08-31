import type { ComputedPlayerData, ComputedKPI, Fix, Win, TimelineMarker } from '~/types'

export class StratzRuleEngine {
    static analyzePlayer(playerData: ComputedPlayerData, kpis: ComputedKPI[]): {
        fixes: Fix[]
        wins: Win[]
        timeline: TimelineMarker[]
        summary: string
    } {
        const fixes: Fix[] = []
        const wins: Win[] = []
        const timeline: TimelineMarker[] = []

        // Analyze based on STRATZ-specific data
        this.analyzePerformance(playerData, kpis, fixes, wins)
        this.analyzeRoleSpecific(playerData, kpis, fixes, wins)
        this.generateTimeline(playerData, timeline)

        // Sort and limit results
        const sortedFixes = this.sortFixes(fixes)
        const sortedWins = this.sortWins(wins)

        // Ensure we have exactly 3 fixes and 2 wins
        const finalFixes = this.ensureFixCount(sortedFixes)
        const finalWins = this.ensureWinCount(sortedWins)

        // Generate summary
        const summary = this.generateSummary(playerData, finalFixes, finalWins)

        return { fixes: finalFixes, wins: finalWins, timeline, summary }
    }

    private static analyzePerformance(playerData: ComputedPlayerData, kpis: ComputedKPI[], fixes: Fix[], wins: Win[]) {
        // Analyze GPM
        const gpmKpi = kpis.find(k => k.name === 'GPM')
        if (gpmKpi) {
            if (gpmKpi.percentile < 30) {
                fixes.push({
                    title: 'Low Gold Per Minute',
                    description: `Your GPM of ${Math.round(gpmKpi.value)} is in the bottom ${100 - gpmKpi.percentile}%. Focus on farming more efficiently and avoiding downtime.`,
                    priority: 1,
                    category: 'farming',
                    confidence: 3
                })
            } else if (gpmKpi.percentile > 80) {
                wins.push({
                    title: 'Excellent Farming',
                    description: `Your GPM of ${Math.round(gpmKpi.value)} is in the top ${gpmKpi.percentile}%. Great job maximizing your gold income.`,
                    kpi: 'GPM',
                    confidence: 3
                })
            }
        }

        // Analyze XPM
        const xpmKpi = kpis.find(k => k.name === 'XPM')
        if (xpmKpi) {
            if (xpmKpi.percentile < 30) {
                fixes.push({
                    title: 'Low Experience Per Minute',
                    description: `Your XPM of ${Math.round(xpmKpi.value)} is below average. Stay in lane longer and avoid dying to maintain experience advantage.`,
                    priority: 2,
                    category: 'farming',
                    confidence: 2
                })
            }
        }

        // Analyze Kill Participation
        const kpctKpi = kpis.find(k => k.name === 'Kill Participation')
        if (kpctKpi) {
            if (kpctKpi.value < 40) {
                fixes.push({
                    title: 'Low Fight Participation',
                    description: `Your kill participation of ${Math.round(kpctKpi.value)}% is too low. Join important fights and team objectives.`,
                    priority: 2,
                    category: 'teamwork',
                    confidence: 2
                })
            } else if (kpctKpi.value > 70) {
                wins.push({
                    title: 'High Fight Participation',
                    description: `Your kill participation of ${Math.round(kpctKpi.value)}% shows excellent involvement in team fights.`,
                    kpi: 'Kill Participation',
                    confidence: 2
                })
            }
        }

        // Analyze Deaths
        const deathsKpi = kpis.find(k => k.name === 'Deaths/10min')
        if (deathsKpi) {
            if (deathsKpi.value > 3) {
                fixes.push({
                    title: 'Too Many Deaths',
                    description: `You're dying ${deathsKpi.value.toFixed(1)} times per 10 minutes. Improve positioning and avoid unnecessary risks.`,
                    priority: 1,
                    category: 'positioning',
                    confidence: 3
                })
            } else if (deathsKpi.value < 1.5) {
                wins.push({
                    title: 'Good Survival',
                    description: `You're dying only ${deathsKpi.value.toFixed(1)} times per 10 minutes. Excellent positioning and decision making.`,
                    kpi: 'Deaths/10min',
                    confidence: 2
                })
            }
        }

        // Analyze IMP (Impact)
        const impKpi = kpis.find(k => k.name === 'IMP')
        if (impKpi && playerData.stratzData?.imp) {
            if (playerData.stratzData.imp < -20) {
                fixes.push({
                    title: 'Low Game Impact',
                    description: `Your impact score of ${playerData.stratzData.imp} indicates you're not contributing enough to your team's success.`,
                    priority: 1,
                    category: 'general',
                    confidence: 2
                })
            } else if (playerData.stratzData.imp > 20) {
                wins.push({
                    title: 'High Game Impact',
                    description: `Your impact score of ${playerData.stratzData.imp} shows you're making a significant positive contribution.`,
                    kpi: 'IMP',
                    confidence: 2
                })
            }
        }
    }

    private static analyzeRoleSpecific(playerData: ComputedPlayerData, kpis: ComputedKPI[], fixes: Fix[], wins: Win[]) {
        const role = playerData.stratzData?.role || playerData.role

        // Core roles (pos1, pos2, pos3)
        if (role === 'CORE' || role.startsWith('pos')) {
            const pos = role === 'CORE' ? 'pos2' : role // Default to mid for CORE role

            // Analyze last hits for cores
            const lhKpi = kpis.find(k => k.name === 'Last Hits/min')
            if (lhKpi) {
                if (lhKpi.percentile < 40) {
                    fixes.push({
                        title: 'Low Last Hit Efficiency',
                        description: `Your last hit rate is below average. Practice last hitting and prioritize CS over harassing in lane.`,
                        priority: 2,
                        category: 'farming',
                        confidence: 2
                    })
                } else if (lhKpi.percentile > 80) {
                    wins.push({
                        title: 'Excellent Last Hitting',
                        description: `Your last hit efficiency is in the top ${lhKpi.percentile}%. Great mechanical skill.`,
                        kpi: 'Last Hits/min',
                        confidence: 2
                    })
                }
            }

            // Analyze hero damage for cores
            const dpmKpi = kpis.find(k => k.name === 'Hero Damage/min')
            if (dpmKpi) {
                if (dpmKpi.percentile < 30) {
                    fixes.push({
                        title: 'Low Hero Damage',
                        description: `Your hero damage output is below average. Look for more opportunities to deal damage in fights.`,
                        priority: 3,
                        category: 'combat',
                        confidence: 2
                    })
                }
            }
        }

        // Support roles (pos4, pos5)
        if (role === 'HARD_SUPPORT' || role === 'LIGHT_SUPPORT' || role === 'pos4' || role === 'pos5') {
            // Analyze stacks for supports
            const stacksKpi = kpis.find(k => k.name === 'Stacks')
            if (stacksKpi) {
                if (stacksKpi.value < 2) {
                    fixes.push({
                        title: 'Low Camp Stacking',
                        description: `You only stacked ${stacksKpi.value} camps. Stack more camps to help your cores farm efficiently.`,
                        priority: 2,
                        category: 'support',
                        confidence: 2
                    })
                } else if (stacksKpi.value > 4) {
                    wins.push({
                        title: 'Good Camp Stacking',
                        description: `You stacked ${stacksKpi.value} camps. Excellent support play helping your cores.`,
                        kpi: 'Stacks',
                        confidence: 2
                    })
                }
            }
        }

        // Carry specific analysis
        if (role === 'CARRY' || role === 'pos1') {
            // Analyze first core item timing
            const firstCoreKpi = kpis.find(k => k.name === 'First Core Item')
            if (firstCoreKpi) {
                if (firstCoreKpi.value > 900) { // 15 minutes
                    fixes.push({
                        title: 'Late First Core Item',
                        description: `Your first core item came at ${Math.round(firstCoreKpi.value / 60)} minutes. Focus on efficient farming to hit earlier timings.`,
                        priority: 1,
                        category: 'timing',
                        confidence: 3
                    })
                } else if (firstCoreKpi.value < 600) { // 10 minutes
                    wins.push({
                        title: 'Early Core Item',
                        description: `You got your first core item at ${Math.round(firstCoreKpi.value / 60)} minutes. Excellent farming efficiency.`,
                        kpi: 'First Core Item',
                        confidence: 3
                    })
                }
            }
        }
    }

    private static generateTimeline(playerData: ComputedPlayerData, timeline: TimelineMarker[]) {
        // First core item timing
        const firstCoreKpi = playerData.first_core_s
        if (firstCoreKpi && firstCoreKpi > 0) {
            timeline.push({
                label: 'First Core Item',
                time: firstCoreKpi,
                delta: firstCoreKpi - 720, // vs 12 minute median
                description: 'Core item timing'
            })
        }

        // Add role-specific timeline markers
        const role = playerData.stratzData?.role || playerData.role
        if (role === 'CARRY' || role === 'pos1') {
            timeline.push({
                label: '10-min Farm',
                time: 600,
                delta: (playerData.lh_10 || 0) - 50,
                description: `Last hits: ${playerData.lh_10 || 0}`
            })
        }
    }

    private static sortFixes(fixes: Fix[]): Fix[] {
        return fixes.sort((a, b) => {
            // Sort by priority first (lower number = higher priority)
            if (a.priority !== b.priority) {
                return a.priority - b.priority
            }
            // Then by confidence
            return (b.confidence || 0) - (a.confidence || 0)
        })
    }

    private static sortWins(wins: Win[]): Win[] {
        return wins.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    }

    private static ensureFixCount(fixes: Fix[]): Fix[] {
        const defaultFixes = [
            {
                title: 'Focus on positioning',
                description: 'Work on staying alive longer and being in the right place at the right time.',
                priority: 1,
                category: 'positioning',
                confidence: 1
            },
            {
                title: 'Improve farming efficiency',
                description: 'Look for opportunities to farm more efficiently and hit your item timings.',
                priority: 2,
                category: 'farming',
                confidence: 1
            },
            {
                title: 'Better team coordination',
                description: 'Communicate more with your team and coordinate your movements and objectives.',
                priority: 3,
                category: 'teamwork',
                confidence: 1
            }
        ]

        while (fixes.length < 3) {
            const defaultFix = defaultFixes[fixes.length]
            if (defaultFix) {
                fixes.push(defaultFix)
            } else {
                break
            }
        }

        return fixes.slice(0, 3)
    }

    private static ensureWinCount(wins: Win[]): Win[] {
        const defaultWins = [
            {
                title: 'Good game awareness',
                description: 'You showed good understanding of the game flow and made solid decisions.',
                kpi: 'general',
                confidence: 1
            },
            {
                title: 'Positive attitude',
                description: 'Maintaining a positive mindset helps you and your team perform better.',
                kpi: 'general',
                confidence: 1
            }
        ]

        while (wins.length < 2) {
            const defaultWin = defaultWins[wins.length]
            if (defaultWin) {
                wins.push(defaultWin)
            } else {
                break
            }
        }

        return wins.slice(0, 2)
    }

    private static generateSummary(playerData: ComputedPlayerData, fixes: Fix[], wins: Win[]): string {
        let summary = ''

        if (wins.length > 0 && wins[0]) {
            summary += `Strong performance in ${wins[0].title.toLowerCase()}. `
        }

        if (fixes.length > 0 && fixes[0]) {
            summary += `Focus on ${fixes[0].title.toLowerCase()} for improvement.`
        } else {
            summary += 'Overall solid performance with room for optimization.'
        }

        return summary
    }
} 