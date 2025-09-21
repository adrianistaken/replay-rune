import type { ComputedPlayerData, ComputedKPI, Fix, Win, TimelineMarker, BracketAveragesData, BracketAveragesCache, StratzHeroAverage } from '../types'
import type { RuleCategory } from '../../constants/ruleCategories'

export interface V3Rule {
    id: string
    roles: string[]
    atMin?: number
    endOfGame?: boolean
    when: {
        operator: 'delta_less_than' | 'delta_greater_than'
        kpi: string
        value: number
    }
    severity: number
    type: 'fix' | 'win'
    category: RuleCategory
    header: string
    description: string
}

export interface V3Ruleset {
    rulesVersion: string
    rules: V3Rule[]
}

export class StratzRuleEngine {
    private static ruleset: V3Ruleset | null = null

    static async loadRuleset(): Promise<V3Ruleset> {
        if (!this.ruleset) {
            try {
                const response = await fetch('/ruleset.v3.jsonc')
                const text = await response.text()

                // Parse JSONC (remove comments)
                let jsonText = text
                    .replace(/\/\/.*$/gm, '') // Remove single-line comments
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                    .replace(/,\s*}/g, '}') // Remove trailing commas
                    .replace(/,\s*]/g, ']') // Remove trailing commas in arrays

                this.ruleset = JSON.parse(jsonText)
                console.log('Loaded v3 ruleset:', this.ruleset)
            } catch (error) {
                console.error('Failed to load v3 ruleset:', error)
                throw new Error('Failed to load analysis ruleset')
            }
        }
        return this.ruleset!
    }

    static async analyzePlayer(
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[]
    ): Promise<{
        fixes: Fix[]
        wins: Win[]
        timeline: TimelineMarker[]
        summary: string
    }> {
        const startTime = Date.now()
        const ruleset = await this.loadRuleset()

        // Get player's actual role from the data
        const playerRole = this.getPlayerRole(playerData)

        // Evaluate all rules that apply to this player
        const applicableRules = ruleset.rules.filter(rule =>
            rule.roles.includes('ALL') || rule.roles.includes(playerRole)
        )

        // Evaluate each rule
        const evaluatedRules = applicableRules
            .map(rule => {
                const matches = this.evaluateRule(rule, playerData, kpis)
                return {
                    ...rule,
                    matches
                }
            })
            .filter(rule => rule.matches)
            .sort((a, b) => b.severity - a.severity)

        // Separate fixes and wins
        let fixes = evaluatedRules
            .filter(rule => rule.type === 'fix')
            .slice(0, 3) // Ensure exactly 3 fixes

        let wins = evaluatedRules
            .filter(rule => rule.type === 'win')
            .slice(0, 2) // Ensure exactly 2 wins

        // If no rules matched, provide default feedback
        if (fixes.length === 0 && wins.length === 0) {
            fixes = [
                {
                    id: 'default_fix_1',
                    roles: ['ALL'],
                    atMin: 20,
                    when: { operator: 'delta_less_than', kpi: 'cs@10', value: -0.25 },
                    severity: 0.5,
                    type: 'fix',
                    category: 'General',
                    header: 'Focus on improving your overall game performance',
                    description: 'Focus on improving your overall game performance',
                    matches: true
                },
                {
                    id: 'default_fix_2',
                    roles: ['ALL'],
                    atMin: 20,
                    when: { operator: 'delta_less_than', kpi: 'kDA@20', value: -0.25 },
                    severity: 0.4,
                    type: 'fix',
                    category: 'General',
                    header: 'Work on your positioning and decision making',
                    description: 'Work on your positioning and decision making',
                    matches: true
                },
                {
                    id: 'default_fix_3',
                    roles: ['ALL'],
                    atMin: 20,
                    when: { operator: 'delta_less_than', kpi: 'networth@20', value: -0.25 },
                    severity: 0.3,
                    type: 'fix',
                    category: 'General',
                    header: 'Improve your farming efficiency and resource management',
                    description: 'Improve your farming efficiency and resource management',
                    matches: true
                }
            ]
            wins = [
                {
                    id: 'default_win_1',
                    roles: ['ALL'],
                    atMin: 20,
                    when: { operator: 'delta_greater_than', kpi: 'kDA@20', value: 0.25 },
                    severity: 0.4,
                    type: 'win',
                    category: 'General',
                    header: 'Good overall game awareness and decision making',
                    description: 'Good overall game awareness and decision making',
                    matches: true
                },
                {
                    id: 'default_win_2',
                    roles: ['ALL'],
                    atMin: 20,
                    when: { operator: 'delta_greater_than', kpi: 'cs@10', value: 0.25 },
                    severity: 0.3,
                    type: 'win',
                    category: 'General',
                    header: 'Solid mechanical skills and execution',
                    description: 'Solid mechanical skills and execution',
                    matches: true
                }
            ]
        }

        // Convert to Fix/Win format
        const formattedFixes: Fix[] = fixes.map(rule => ({
            title: rule.header,
            description: rule.description,
            dataComparison: this.generateDataComparison(rule, playerData),
            priority: Math.round((1 - rule.severity) * 3) + 1, // Convert severity to priority (1-3)
            category: rule.category,
            confidence: Math.round(rule.severity * 3) // Convert severity to confidence (1-3)
        }))

        const formattedWins: Win[] = wins.map(rule => ({
            title: rule.header,
            description: rule.description,
            dataComparison: this.generateDataComparison(rule, playerData),
            priority: Math.round((1 - rule.severity) * 3) + 1, // Convert severity to priority (1-3)
            category: rule.category,
            confidence: Math.round(rule.severity * 3) // Convert severity to confidence (1-3)
        }))

        // Generate timeline (simplified for now)
        const timeline: TimelineMarker[] = this.generateTimeline(playerData)

        // Generate summary
        const summary = this.generateSummary(formattedFixes, formattedWins, playerData)

        const endTime = Date.now()
        console.log(`Rule engine analysis completed in ${endTime - startTime}ms`)

        const result = {
            fixes: formattedFixes,
            wins: formattedWins,
            timeline,
            summary
        }

        return result
    }

    /**
     * Fetches bracket averages data for all bracket groupings in a single query
     */
    static async fetchBracketAverages(
        heroId: number,
        position: string
    ): Promise<BracketAveragesCache> {
        const cacheKey = `bracket-averages-${heroId}-${position}`
        const cached = localStorage.getItem(cacheKey)

        if (cached) {
            const parsedCache = JSON.parse(cached) as BracketAveragesCache
            // Check if cache is still valid (24 hours)
            const now = Date.now()
            const isExpired = Object.values(parsedCache).some(data =>
                now - data.cachedAt > 24 * 60 * 60 * 1000
            )

            if (!isExpired) {
                console.log('📁 Using cached bracket averages')
                return parsedCache
            }
        }

        console.log('🔄 Fetching bracket averages for hero', heroId, position)

        try {
            // Single query for all bracket groupings
            const query = `
                query {
                    heroStats {
                        stats(heroIds:${heroId} bracketBasicIds:[HERALD_GUARDIAN, CRUSADER_ARCHON, LEGEND_ANCIENT, DIVINE_IMMORTAL, UNCALIBRATED] positionIds:${position} minTime:0 maxTime:100 groupByTime:true groupByBracket:true groupByPosition:true) {
                            heroId
                            position
                            bracketBasicIds
                            kills
                            deaths
                            time
                            matchCount
                            mvp
                            topCore
                            topSupport
                            courierKills
                            apm
                            goldPerMinute
                            xp
                            level
                            networth
                            supportGold
                            assists
                            damage
                            heroDamage
                            towerDamage
                            abilityCasts
                            casts
                            kDAAverage
                            killContributionAverage
                            cs
                            dn
                            campsStacked
                            healingSelf
                            healingAllies
                            healingItemSelf
                            healingItemAllies
                        }
                    }
                }
            `

            const response = await fetch('/api/stratz/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
            }

            const stats = result.data?.heroStats?.stats || []
            console.log(`📊 Fetched ${stats.length} data points from STRATZ API`)

            // Debug: Show sample data structure
            if (stats.length > 0) {
                console.log('🔍 Sample data structure:', {
                    bracketBasicIds: stats[0].bracketBasicIds,
                    position: stats[0].position,
                    time: stats[0].time,
                    matchCount: stats[0].matchCount
                })
            }

            // Group data by bracket grouping
            const cache: BracketAveragesCache = {}
            const bracketGroupings = ['HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL', 'UNCALIBRATED']

            for (const grouping of bracketGroupings) {
                const groupingData = stats.filter((stat: any) => stat.bracketBasicIds === grouping)

                console.log(`🔍 Grouping ${grouping}: ${groupingData.length} data points`)

                if (groupingData.length > 0) {
                    const key = `${heroId}-${position}-${grouping}`
                    cache[key] = {
                        heroId,
                        position,
                        bracketGrouping: grouping,
                        data: groupingData,
                        cachedAt: Date.now()
                    }
                    console.log(`✅ Cached ${grouping} data with key: ${key}`)
                } else {
                    console.log(`⚠️ No data found for ${grouping}`)
                }
            }

            if (Object.keys(cache).length === 0) {
                throw new Error('No bracket averages data found in STRATZ API response')
            }

            localStorage.setItem(cacheKey, JSON.stringify(cache))
            console.log(`✅ Loaded ${Object.keys(cache).length} bracket groupings: ${Object.keys(cache).map(key => key.split('-')[2]).join(', ')}`)
            return cache

        } catch (error) {
            console.error('❌ Failed to fetch bracket averages:', error)
            throw error
        }
    }


    /**
     * Gets bracket averages data for a specific bracket grouping and time
     */
    static getBracketAveragesAtTime(
        bracketAveragesCache: BracketAveragesCache,
        heroId: number,
        position: string,
        bracketGrouping: string,
        time: number
    ): StratzHeroAverage | null {
        const key = `${heroId}-${position}-${bracketGrouping}`
        const bracketData = bracketAveragesCache[key]

        if (!bracketData || !bracketData.data) {
            console.warn(`No bracket data found for ${key}`)
            return null
        }

        // Find the closest time within a 5-minute tolerance
        const tolerance = 5
        let closestData: StratzHeroAverage | null = null
        let minTimeDiff = Infinity

        for (const data of bracketData.data) {
            const timeDiff = Math.abs(data.time - time)
            if (timeDiff <= tolerance && timeDiff < minTimeDiff) {
                minTimeDiff = timeDiff
                closestData = data
            }
        }

        if (closestData) {
            console.log(`Found bracket data for ${bracketGrouping} at ${time} minutes (closest: ${closestData.time})`)
        } else {
            console.warn(`No bracket data found for ${bracketGrouping} at ${time} minutes (tolerance: ${tolerance})`)
        }

        return closestData
    }




    private static getPlayerRole(playerData: ComputedPlayerData): string {
        // Map the role from playerData to the format expected by rules
        const roleMap: Record<string, string> = {
            'pos1': 'POSITION_1',
            'pos2': 'POSITION_2',
            'pos3': 'POSITION_3',
            'pos4': 'POSITION_4',
            'pos5': 'POSITION_5'
        }

        return roleMap[playerData.role] || 'POSITION_1'
    }

    private static evaluateRule(rule: V3Rule, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        // Handle end-of-game rules differently
        if (rule.endOfGame) {
            return this.evaluateEndOfGameRule(rule, playerData, kpis)
        }

        const { operator, kpi, value } = rule.when

        // Parse the KPI to get the metric name and time
        const [metricName, timeStr] = kpi.split('@')
        const targetTime = parseInt(timeStr || '0')

        if (!metricName) {
            console.warn(`Invalid KPI format: ${kpi}`)
            return false
        }

        // Get the player's value for this metric at the specified time
        const playerValue = this.getPlayerValueAtSpecificTime(metricName, targetTime, playerData, kpis)

        // Get the hero average value for this metric at the specified time
        const heroAverageValue = this.getHeroAverageValueAtTime(metricName, targetTime, playerData)

        if (heroAverageValue === null) {
            console.log(`No hero average data for ${metricName} at ${targetTime} minutes`)
            return false
        }

        // Calculate delta (percentage difference from average)
        const delta = (playerValue - heroAverageValue) / heroAverageValue

        // Apply the operator
        switch (operator) {
            case 'delta_less_than':
                return delta < value
            case 'delta_greater_than':
                return delta > value
            default:
                return false
        }
    }

    private static evaluateEndOfGameRule(rule: V3Rule, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        const { operator, kpi, value } = rule.when

        // For end-of-game rules, the KPI doesn't have a time component
        const metricName = kpi

        // Get end-of-game values (final values from the match)
        const playerValue = this.getEndOfGamePlayerValue(metricName, playerData)
        const heroAverageValue = this.getEndOfGameHeroAverageValue(metricName, playerData)

        if (heroAverageValue === null) {
            console.log(`No end-of-game hero average data for ${metricName}`)
            return false
        }

        // Calculate delta (percentage difference from average)
        const delta = (playerValue - heroAverageValue) / heroAverageValue

        // Apply the operator
        switch (operator) {
            case 'delta_less_than':
                return delta < value
            case 'delta_greater_than':
                return delta > value
            default:
                return false
        }
    }

    private static getPlayerValueAtSpecificTime(metricName: string, time: number, playerData: ComputedPlayerData, kpis: ComputedKPI[]): number {
        // Get minute-by-minute player data from stats
        const playerStats = playerData.stratzData?.playerStats

        if (!playerStats) {
            return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
        }

        // Find the data up to the specific time (inclusive)
        const timeIndex = Math.floor(time)

        // Check if the stats arrays exist and have the required length
        if (!playerStats.impPerMinute || timeIndex >= playerStats.impPerMinute.length) {
            return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
        }

        switch (metricName) {
            case 'kDA':
                // Calculate KDA from cumulative data - we don't have minute-by-minute kills/deaths
                // Use fallback for now
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'deaths':
                // We don't have minute-by-minute deaths, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'heroDamage':
                // We don't have minute-by-minute hero damage, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'cs':
                // Use lastHitsPerMinute array - accumulate from index 0 to timeIndex
                return this.accumulateArrayValues(playerStats.lastHitsPerMinute, timeIndex)
            case 'xp':
                // Use experiencePerMinute array - accumulate from index 0 to timeIndex
                return this.accumulateArrayValues(playerStats.experiencePerMinute, timeIndex)
            case 'networth':
                // Use networthPerMinute array - this is already cumulative, just get the value at timeIndex
                return playerStats.networthPerMinute?.[timeIndex] || 0
            case 'level':
                // Use level array - this is already cumulative, just get the value at timeIndex
                return playerStats.level?.[timeIndex] || 0
            case 'killContribution':
                return playerData.kpct // Use end-of-match data for this
            case 'towerDamage':
                // We don't have minute-by-minute tower damage, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'campsStacked':
                // Use campStack array - accumulate from index 0 to timeIndex
                return this.accumulateArrayValues(playerStats.campStack, timeIndex)
            case 'abilityCasts':
                // We don't have minute-by-minute ability casts, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'healingAllies':
                // We don't have minute-by-minute healing, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            case 'supportGold':
                // We don't have minute-by-minute support gold, use fallback
                return this.getPlayerValueAtTimeFallback(metricName, time, playerData, kpis)
            default:
                console.warn(`Unknown metric: ${metricName}`)
                return 0
        }
    }

    private static getPlayerValueAtTimeFallback(metricName: string, time: number, playerData: ComputedPlayerData, kpis: ComputedKPI[]): number {
        // Fallback method for metrics we don't have minute-by-minute data for
        switch (metricName) {
            case 'kDA':
                // Estimate KDA based on GPM (simplified)
                return playerData.gpm / 1000
            case 'deaths':
                // Estimate deaths based on deaths_per10
                return playerData.deaths_per10 * time / 10
            case 'heroDamage':
                // Estimate hero damage based on DPM
                return playerData.dpm * time / 60
            case 'cs':
                // Estimate CS based on lh_10
                return playerData.lh_10 * time / 10
            case 'xp':
                // Estimate XP based on XPM
                return playerData.xpm * time / 60
            case 'networth':
                // Estimate networth based on GPM
                return playerData.gpm * time / 60
            case 'level':
                // Estimate level based on XP
                return Math.min(25, Math.floor((playerData.xpm * time / 60) / 1000) + 1)
            case 'killContribution':
                return playerData.kpct
            case 'towerDamage':
                // Estimate tower damage based on TDPM
                return playerData.tdpm * time / 60
            case 'campsStacked':
                return playerData.stacks * time / playerData.match_minutes
            case 'abilityCasts':
                // Estimate ability casts based on match duration
                return Math.floor(2 * time)
            case 'healingAllies':
                // No healing data available
                return 0
            case 'supportGold':
                // Estimate support gold
                return playerData.gpm * time / 60 * 0.3
            default:
                console.warn(`Unknown fallback metric: ${metricName}`)
                return 0
        }
    }


    private static getEndOfGamePlayerValue(metricName: string, playerData: ComputedPlayerData): number {
        // Get end-of-match values for the player
        switch (metricName) {
            case 'courierKills':
                // courier_kills doesn't exist, use a fallback
                return 0
            case 'kDA':
                // kills and deaths don't exist, use a fallback
                return playerData.gpm / 1000 // Simplified KDA approximation
            case 'deaths':
                // deaths doesn't exist, use deaths_per10 scaled to match duration
                return playerData.deaths_per10 * playerData.match_minutes / 10
            case 'heroDamage':
                return playerData.dpm * playerData.match_minutes / 60
            case 'cs':
                return playerData.lh_10 * playerData.match_minutes / 10 // Estimate total CS
            case 'xp':
                return playerData.xpm * playerData.match_minutes / 60
            case 'networth':
                return playerData.networth
            case 'level':
                // level doesn't exist, estimate based on XP
                return Math.min(25, Math.floor((playerData.xpm * playerData.match_minutes / 60) / 1000) + 1)
            case 'killContribution':
                return playerData.kpct
            case 'towerDamage':
                // tower_damage doesn't exist, use tdpm scaled to match duration
                return playerData.tdpm * playerData.match_minutes / 60
            case 'campsStacked':
                return playerData.stacks
            case 'abilityCasts':
                // ability_casts doesn't exist, estimate based on match duration
                return Math.floor(2 * playerData.match_minutes) // Rough estimate
            case 'healingAllies':
                // healing doesn't exist, use a default
                return 0
            case 'supportGold':
                return playerData.gpm * playerData.match_minutes / 60 * 0.3 // Estimate support gold
            default:
                console.warn(`Unknown end-of-game metric: ${metricName}`)
                return 0
        }
    }

    private static getHeroAverageValueAtTime(metricName: string, time: number, playerData: ComputedPlayerData): number | null {
        if (!playerData.stratzData?.heroAverage) {
            console.log('No hero average data available')
            return null
        }

        // Find the hero average data closest to the specified time
        const heroAvgData = playerData.stratzData.heroAverage
            .filter(avg => avg.time <= time)
            .sort((a, b) => b.time - a.time)[0]

        if (!heroAvgData) {
            console.log(`No hero average data found for time ${time}`)
            return null
        }

        console.log(`Using hero average data at time ${heroAvgData.time} for metric ${metricName} at requested time ${time}`)

        switch (metricName) {
            case 'kDA':
                return heroAvgData.kills / Math.max(heroAvgData.deaths, 1)
            case 'deaths':
                // For deaths at specific time, we need to calculate deaths per minute up to that time
                return (heroAvgData.deaths / Math.max(heroAvgData.time, 1)) * time
            case 'heroDamage':
                // For hero damage at specific time, we need to calculate damage per minute up to that time
                return (heroAvgData.damage / Math.max(heroAvgData.time, 1)) * time
            case 'cs':
                return heroAvgData.cs || 0
            case 'xp':
                return heroAvgData.xp || 0
            case 'networth':
                // For networth at specific time, we need to calculate networth per minute up to that time
                return (heroAvgData.networth / Math.max(heroAvgData.time, 1)) * time
            case 'level':
                return heroAvgData.level || 0
            case 'killContribution':
                return (heroAvgData.kills / Math.max(heroAvgData.kills + heroAvgData.deaths, 1)) * 100
            default:
                console.log(`Unknown metric: ${metricName}`)
                return null
        }
    }

    private static getEndOfGameHeroAverageValue(metricName: string, playerData: ComputedPlayerData): number | null {
        if (!playerData.stratzData?.heroAverage) {
            console.log('No hero average data available')
            return null
        }

        // Get the last (final) hero average data entry
        const finalHeroAvg = playerData.stratzData.heroAverage
            .sort((a, b) => b.time - a.time)[0]

        if (!finalHeroAvg) {
            console.log('No final hero average data found')
            return null
        }

        console.log(`Using final hero average data at time ${finalHeroAvg.time} for metric ${metricName}`)

        switch (metricName) {
            case 'courierKills':
                return finalHeroAvg.courierKills || 0
            case 'kDA':
                return finalHeroAvg.kills / Math.max(finalHeroAvg.deaths, 1)
            case 'deaths':
                return finalHeroAvg.deaths || 0
            case 'heroDamage':
                return finalHeroAvg.damage || 0
            case 'cs':
                return finalHeroAvg.cs || 0
            case 'xp':
                return finalHeroAvg.xp || 0
            case 'networth':
                return finalHeroAvg.networth || 0
            case 'level':
                return finalHeroAvg.level || 0
            case 'killContribution':
                return (finalHeroAvg.kills / Math.max(finalHeroAvg.kills + finalHeroAvg.deaths, 1)) * 100
            case 'towerDamage':
                return 0 // towerDamage not available in StratzHeroAverage
            case 'campsStacked':
                return finalHeroAvg.campsStacked || 0
            case 'abilityCasts':
                return finalHeroAvg.abilityCasts || 0
            case 'healingAllies':
                return finalHeroAvg.healingAllies || 0
            case 'supportGold':
                return finalHeroAvg.supportGold || 0
            default:
                console.warn(`Unknown end-of-game hero average metric: ${metricName}`)
                return null
        }
    }

    private static accumulateArrayValues(array: number[], timeIndex: number): number {
        if (!array || array.length === 0) return 0

        // Accumulate values from index 0 to timeIndex (inclusive)
        let sum = 0
        for (let i = 0; i <= Math.min(timeIndex, array.length - 1); i++) {
            sum += array[i] || 0
        }
        return sum
    }

    private static generateTimeline(playerData: ComputedPlayerData): TimelineMarker[] {
        // Generate a simplified timeline based on match data
        const timeline: TimelineMarker[] = []

        // Add some basic timeline markers
        if (playerData.gpm > 500) {
            timeline.push({
                time: 10,
                title: 'Strong Early Game',
                description: 'Good gold per minute in the early game',
                type: 'positive',
                category: 'farming'
            })
        }

        if (playerData.kpct > 60) {
            timeline.push({
                time: 20,
                title: 'High Kill Participation',
                description: 'Good teamfight participation',
                type: 'positive',
                category: 'teamfight'
            })
        }

        return timeline
    }

    private static generateSummary(fixes: Fix[], wins: Win[], playerData: ComputedPlayerData): string {
        const totalIssues = fixes.length
        const totalWins = wins.length

        if (totalIssues === 0 && totalWins === 0) {
            return `Your ${playerData.heroName} performance was average. Focus on improving your overall game mechanics and decision making.`
        }

        if (totalWins > totalIssues) {
            return `Great ${playerData.heroName} game! You showed strong performance in several areas. Keep up the good work and focus on the areas that need improvement.`
        }

        if (totalIssues > totalWins) {
            return `Your ${playerData.heroName} performance needs work. Focus on the key areas identified below to improve your gameplay.`
        }

        return `Mixed ${playerData.heroName} performance. You did well in some areas but need to improve in others. Focus on the key areas identified below.`
    }

    private static generateDataComparison(rule: V3Rule, playerData: ComputedPlayerData): string {
        const { kpi } = rule.when
        const [metricName, timeStr] = kpi.split('@')
        const time = parseInt(timeStr || '0')

        if (rule.endOfGame) {
            return this.generateEndOfGameDataComparison(rule, playerData)
        }

        // For time-specific rules, get actual comparison values
        return this.generateTimeSpecificDataComparison(metricName || 'unknown', time, playerData)
    }

    private static generateTimeSpecificDataComparison(metricName: string, time: number, playerData: ComputedPlayerData): string {
        // Get the actual player value at the specific time
        const playerValue = this.getPlayerValueAtSpecificTime(metricName, time, playerData, [])
        const heroAverageValue = this.getHeroAverageValueAtTime(metricName, time, playerData)

        if (heroAverageValue === null) {
            return `Your ${metricName} at ${time} minutes compared to similar players`
        }

        const delta = ((playerValue - heroAverageValue) / heroAverageValue) * 100
        const deltaText = delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`

        return `Your ${metricName} at ${time} minutes: ${this.formatValue(metricName, playerValue)} vs Average: ${this.formatValue(metricName, heroAverageValue)} (${deltaText})`
    }

    private static generateEndOfGameDataComparison(rule: V3Rule, playerData: ComputedPlayerData): string {
        const { kpi } = rule.when
        const metricName = kpi

        // Get the actual player value
        const playerValue = this.getEndOfGamePlayerValue(metricName, playerData)
        const heroAverageValue = this.getEndOfGameHeroAverageValue(metricName, playerData)

        if (heroAverageValue === null) {
            return `Your ${metricName} compared to similar players`
        }

        const delta = ((playerValue - heroAverageValue) / heroAverageValue) * 100
        const deltaText = delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`

        return `Your ${metricName}: ${this.formatValue(metricName, playerValue)} vs Average: ${this.formatValue(metricName, heroAverageValue)} (${deltaText})`
    }

    private static formatValue(metricName: string, value: number): string {
        switch (metricName) {
            case 'kDA':
                return value.toFixed(2)
            case 'deaths':
                return Math.round(value).toString()
            case 'heroDamage':
                return Math.round(value).toString()
            case 'cs':
                return Math.round(value).toString()
            case 'xp':
                return Math.round(value).toString()
            case 'networth':
                return Math.round(value).toString()
            case 'level':
                return Math.round(value).toString()
            case 'killContribution':
                return `${Math.round(value)}%`
            case 'towerDamage':
                return Math.round(value).toString()
            case 'campsStacked':
                return Math.round(value).toString()
            case 'abilityCasts':
                return Math.round(value).toString()
            case 'healingAllies':
                return Math.round(value).toString()
            case 'supportGold':
                return Math.round(value).toString()
            default:
                return Math.round(value).toString()
        }
    }
}
