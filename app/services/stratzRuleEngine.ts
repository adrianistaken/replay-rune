import type { ComputedPlayerData, ComputedKPI, Fix, Win, TimelineMarker } from '../types'
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
            kpi: rule.when.kpi,
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
            case 'courierKills':
                // We don't have minute-by-minute courier kills, use fallback
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

    /**
     * Accumulate values in an array from index 0 to maxIndex (inclusive)
     * This converts per-minute values to cumulative values
     */
    private static accumulateArrayValues(array: number[] | undefined, maxIndex: number): number {
        if (!array || array.length === 0) {
            return 0
        }

        // Ensure we don't go beyond array bounds
        const endIndex = Math.min(maxIndex, array.length - 1)

        // Sum all values from index 0 to endIndex
        let total = 0
        for (let i = 0; i <= endIndex; i++) {
            total += array[i] || 0
        }

        return total
    }

    private static getPlayerValueAtTimeFallback(metricName: string, time: number, playerData: ComputedPlayerData, kpis: ComputedKPI[]): number {
        // Fallback to end-of-match data scaled to the target time
        const timeRatio = time / playerData.match_minutes

        switch (metricName) {
            case 'kDA':
                return playerData.gpm / 1000 // Simplified KDA approximation
            case 'deaths':
                return playerData.deaths_per10 * time / 10
            case 'heroDamage':
                return playerData.dpm * time / 60
            case 'cs':
                return playerData.lh_10 * timeRatio
            case 'xp':
                return playerData.xpm * time / 60
            case 'networth':
                return playerData.gpm * time / 60
            case 'level':
                return this.estimateLevelAtTime(time, playerData)
            case 'killContribution':
                return playerData.kpct
            case 'towerDamage':
                return 0
            case 'campsStacked':
                return playerData.stacks * timeRatio
            case 'abilityCasts':
                return this.estimateAbilityCastsAtTime(time, playerData)
            case 'courierKills':
                return 0
            case 'healingAllies':
                return 0
            case 'supportGold':
                return this.estimateSupportGoldAtTime(time, playerData)
            default:
                return 0
        }
    }

    private static getHeroAverageValueAtTime(metricName: string, time: number, playerData: ComputedPlayerData): number | null {
        if (!playerData.stratzData?.heroAverage) {
            console.log('No hero average data available')
            return null
        }

        // Find the hero average data for the closest time
        // Look for exact time match first, then closest time below
        let heroAvg = playerData.stratzData.heroAverage.find(avg => avg.time === time)

        if (!heroAvg) {
            // Find the closest time below the target time
            heroAvg = playerData.stratzData.heroAverage
                .filter(avg => avg.time <= time)
                .sort((a, b) => b.time - a.time)[0]
        }

        if (!heroAvg) {
            console.log(`No hero average data found for time ${time}`)
            return null
        }

        console.log(`Found hero average data at time ${heroAvg.time} for metric ${metricName}`)

        switch (metricName) {
            case 'kDA':
                // Calculate KDA from available data
                return heroAvg.kills / Math.max(heroAvg.deaths, 1)
            case 'deaths':
                return heroAvg.deaths || 0
            case 'heroDamage':
                return heroAvg.damage || 0
            case 'cs':
                return heroAvg.cs || 0
            case 'xp':
                return heroAvg.xp || 0
            case 'networth':
                return heroAvg.networth || 0
            case 'level':
                return heroAvg.level || 0
            case 'killContribution':
                // Not available in hero average data, use a default
                return 50 // Default 50% kill participation
            case 'towerDamage':
                // Not available in hero average data
                return 0
            case 'campsStacked':
                return heroAvg.campsStacked || 0
            case 'abilityCasts':
                return heroAvg.abilityCasts || 0
            case 'courierKills':
                return heroAvg.courierKills || 0
            case 'healingAllies':
                return heroAvg.healingAllies || 0
            case 'supportGold':
                return heroAvg.supportGold || 0
            default:
                console.warn(`Unknown hero average metric: ${metricName}`)
                return 0
        }
    }

    private static estimateLevelAtTime(time: number, playerData: ComputedPlayerData): number {
        // Simple estimation based on XPM
        const xpAtTime = playerData.xpm * time / 60
        // Rough level calculation (this is simplified)
        return Math.min(25, Math.floor(xpAtTime / 1000) + 1)
    }

    private static estimateAbilityCastsAtTime(time: number, playerData: ComputedPlayerData): number {
        // Estimate based on match duration and typical ability usage
        const matchMinutes = playerData.match_minutes
        const castsPerMinute = 2 // Rough estimate
        return Math.floor(castsPerMinute * time)
    }

    private static estimateSupportGoldAtTime(time: number, playerData: ComputedPlayerData): number {
        // Estimate support gold based on GPM and time
        const supportGpmRatio = 0.3 // Rough estimate for support gold vs total gold
        return playerData.gpm * supportGpmRatio * time / 60
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
                return playerData.gpm * playerData.match_minutes / 60
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
                return 50 // Default 50% kill participation
            case 'towerDamage':
                return 0 // Not available in hero average data
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
                return 0
        }
    }

    private static getMetricDisplayName(metricName: string): string {
        const metricNames: Record<string, string> = {
            'kDA': 'KDA',
            'deaths': 'Deaths',
            'heroDamage': 'Hero Damage',
            'cs': 'CS',
            'xp': 'XP',
            'networth': 'Net Worth',
            'level': 'Level',
            'killContribution': 'Kill Contribution',
            'towerDamage': 'Tower Damage',
            'campsStacked': 'Camps Stacked',
            'abilityCasts': 'Ability Casts',
            'courierKills': 'Courier Kills',
            'healingAllies': 'Ally Healing',
            'supportGold': 'Support Gold'
        }

        return metricNames[metricName] || metricName
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
            case 'courierKills':
                return Math.round(value).toString()
            case 'healingAllies':
                return Math.round(value).toString()
            case 'supportGold':
                return Math.round(value).toString()
            default:
                return Math.round(value).toString()
        }
    }



    private static generateTimeline(playerData: ComputedPlayerData): TimelineMarker[] {
        const timeline: TimelineMarker[] = []

        // Add first core item timing if available
        if (playerData.first_core_s > 0) {
            timeline.push({
                label: 'First Core Item',
                time: playerData.first_core_s,
                description: 'Core item timing',
                delta: 0 // We'll calculate this when we have hero average data
            })
        }

        // Add 10-minute benchmarks
        if (playerData.lh_10 > 0) {
            timeline.push({
                label: '10-min Farm',
                time: 600, // 10 minutes in seconds
                description: `Last hits: ${playerData.lh_10} `,
                delta: 0
            })
        }

        return timeline
    }

    private static generateSummary(fixes: Fix[], wins: Win[], playerData: ComputedPlayerData): string {
        if (fixes.length > 0 && fixes[0]) {
            const topFix = fixes[0]
            return `Focus on ${topFix.title.toLowerCase()} for your next game.`
        }

        if (wins.length > 0 && wins[0]) {
            const topWin = wins[0]
            return `Strong performance in ${topWin.title.toLowerCase()}. Keep it up!`
        }

        return 'Overall solid performance with room for optimization.'
    }

    private static generateDataComparison(rule: V3Rule, playerData: ComputedPlayerData): string {
        const { operator, kpi, value } = rule.when

        // Handle end-of-game rules differently
        if (rule.endOfGame) {
            return this.generateEndOfGameDataComparison(rule, playerData)
        }

        // Parse the KPI to get the metric name and time
        const parts = kpi.split('@')
        if (parts.length !== 2) {
            return ''
        }

        const metricName = parts[0]
        const timeStr = parts[1]
        const targetTime = parseInt(timeStr || '0')

        if (!metricName || isNaN(targetTime)) {
            return ''
        }

        // Get player and hero average values
        const playerValue = this.getPlayerValueAtSpecificTime(metricName, targetTime, playerData, [])
        const heroAverageValue = this.getHeroAverageValueAtTime(metricName, targetTime, playerData)

        if (heroAverageValue === null) {
            return ''
        }

        // Calculate delta and format the comparison
        const delta = (playerValue - heroAverageValue) / heroAverageValue
        const deltaPercent = (delta * 100).toFixed(1)

        return `${this.formatValue(metricName, playerValue)} vs ${this.formatValue(metricName, heroAverageValue)} avg (${deltaPercent}% ${delta > 0 ? '↑ higher than average' : '↓ lower than average'})`
    }

    private static generateEndOfGameDataComparison(rule: V3Rule, playerData: ComputedPlayerData): string {
        const { operator, kpi, value } = rule.when

        // For end-of-game rules, the KPI doesn't have a time component
        const metricName = kpi

        // Get end-of-game values (final values from the match)
        const playerValue = this.getEndOfGamePlayerValue(metricName, playerData)
        const heroAverageValue = this.getEndOfGameHeroAverageValue(metricName, playerData)

        if (heroAverageValue === null) {
            return ''
        }

        // Calculate delta and format the comparison
        const delta = (playerValue - heroAverageValue) / heroAverageValue
        const deltaPercent = (delta * 100).toFixed(1)

        return `${this.formatValue(metricName, playerValue)} vs ${this.formatValue(metricName, heroAverageValue)} avg (${deltaPercent}% ${delta > 0 ? '↑ higher than average' : '↓ lower than average'})`
    }
} 