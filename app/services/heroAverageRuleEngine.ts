import type { ComputedPlayerData, ComputedKPI, Fix, Win, TimelineMarker } from '~/types'

export interface HeroAverageRule {
    id: string
    roles: string[]
    conditions: RuleCondition[]
    severity: number
    advice: {
        title: string
        detail: string
    }
    dataSource?: string // Explanation of where the data comes from
}

export interface RuleCondition {
    kpi: string
    op: 'lt' | 'lte' | 'eq' | 'gte' | 'gt'
    value: number | { $ref: string }
}

export interface NumbersThatMatter {
    kpi: string
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
    label: string
    dataSource: string
}

export interface HeroAverageReport {
    focusArea?: HeroAverageRule
    fixes: HeroAverageRule[]
    wins: HeroAverageRule[]
    numbersThatMatter: NumbersThatMatter[]
    summary: string
    isCoreVersion: boolean
    timeline: TimelineMarker[]
}

export class HeroAverageRuleEngine {
    private static ruleset: any = null

    static async loadRuleset(): Promise<any> {
        if (!this.ruleset) {
            try {
                const response = await fetch('/ruleset.jsonc')
                const text = await response.text()
                console.log('Raw ruleset text:', text.substring(0, 200) + '...')

                // Better JSONC parsing - remove comments and clean up
                let jsonText = text
                    .replace(/\/\/.*$/gm, '') // Remove single-line comments
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                    .replace(/,\s*}/g, '}') // Remove trailing commas
                    .replace(/,\s*]/g, ']') // Remove trailing commas in arrays

                console.log('Cleaned JSON text:', jsonText.substring(0, 200) + '...')

                this.ruleset = JSON.parse(jsonText)
                console.log('Parsed ruleset:', this.ruleset)
            } catch (error) {
                console.error('Failed to load ruleset:', error)
                console.error('Error details:', error)
                throw new Error('Failed to load analysis ruleset')
            }
        }
        return this.ruleset
    }

    static async analyzePlayer(
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[]
    ): Promise<HeroAverageReport> {
        const ruleset = await this.loadRuleset()
        console.log('Loaded ruleset:', ruleset)

        // Compute hero average comparisons
        const heroAverageData = this.computeHeroAverageComparisons(playerData, kpis)
        console.log('Hero average data:', heroAverageData)

        // Check if we have sufficient hero average data
        const isCoreVersion = this.hasSufficientHeroAverageData(heroAverageData)

        // Evaluate all rules
        const allRules = [
            ...ruleset.focusAreas.map((rule: any) => ({ ...rule, type: 'focusArea' })),
            ...ruleset.fixes.map((rule: any) => ({ ...rule, type: 'fix' })),
            ...ruleset.wins.map((rule: any) => ({ ...rule, type: 'win' }))
        ]
        console.log('All rules:', allRules)

        const evaluatedRules = allRules
            .filter(rule => this.ruleAppliesToRole(rule, playerData.role))
            .map(rule => ({
                ...rule,
                matches: this.evaluateRuleConditions(rule, playerData, kpis, heroAverageData)
            }))
            .filter(rule => rule.matches)
            .sort((a, b) => b.severity - a.severity)

        console.log('Evaluated rules:', evaluatedRules)
        console.log('Player role:', playerData.role)
        console.log('Rules that apply to role:', allRules.filter(rule => this.ruleAppliesToRole(rule, playerData.role)))

        // Select focus area (highest severity fix)
        const focusArea = evaluatedRules
            .filter(rule => rule.type === 'focusArea')
            .sort((a, b) => b.severity - a.severity)[0]

        // Select fixes (excluding focus area)
        const fixes = evaluatedRules
            .filter(rule => rule.type === 'fix' && rule.id !== focusArea?.id)
            .slice(0, ruleset.selection.maxFixes)

        // Select wins
        const wins = evaluatedRules
            .filter(rule => rule.type === 'win')
            .slice(0, ruleset.selection.maxWins)

        // Generate numbers that matter
        const numbersThatMatter = this.generateNumbersThatMatter(
            playerData,
            kpis,
            heroAverageData,
            ruleset.numbersThatMatter[playerData.role] || []
        )

        // Generate timeline
        const timeline = this.generateTimeline(playerData, heroAverageData)

        // Generate summary
        const summary = this.generateSummary(focusArea, fixes, wins, playerData)

        return {
            focusArea: focusArea || undefined,
            fixes: fixes.map(rule => ({
                id: rule.id,
                roles: rule.roles,
                conditions: rule.conditions,
                severity: rule.severity,
                advice: rule.advice,
                dataSource: rule.dataSource || this.generateDataSource(rule, playerData, heroAverageData)
            })),
            wins: wins.map(rule => ({
                id: rule.id,
                roles: rule.roles,
                conditions: rule.conditions,
                severity: rule.severity,
                advice: rule.advice,
                dataSource: rule.dataSource || this.generateDataSource(rule, playerData, heroAverageData)
            })),
            numbersThatMatter,
            timeline,
            summary,
            isCoreVersion
        }
    }

    private static computeHeroAverageComparisons(
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[]
    ): Record<string, { playerValue: number; averageValue: number; difference: number; percentageDiff: number; time: number }> {
        const comparisons: Record<string, any> = {}

        // Get hero average data from STRATZ - find the closest time match
        const matchMinutes = Math.floor(playerData.match_minutes)
        const heroAvg = playerData.stratzData?.heroAverage.find(avg =>
            avg.time === matchMinutes
        ) || playerData.stratzData?.heroAverage.find(avg =>
            avg.time === Math.max(...(playerData.stratzData?.heroAverage.map(h => h.time).filter(t => t <= matchMinutes) || []))
        )

        if (heroAvg) {
            // GPM comparison - use cumulative networth to calculate GPM
            const playerGpm = playerData.gpm
            const avgGpm = heroAvg.networth / (heroAvg.time || 1) * 60 // Convert to GPM
            const gpmDiff = playerGpm - avgGpm
            const gpmPercentageDiff = avgGpm > 0 ? (gpmDiff / avgGpm) * 100 : 0

            comparisons.gpm_vs_avg = {
                playerValue: playerGpm,
                averageValue: avgGpm,
                difference: gpmDiff,
                percentageDiff: gpmPercentageDiff,
                time: heroAvg.time
            }

            // XPM comparison - use cumulative XP
            const playerXpm = playerData.xpm
            const avgXpm = heroAvg.xp / (heroAvg.time || 1) * 60 // Convert to XPM
            const xpmDiff = playerXpm - avgXpm
            const xpmPercentageDiff = avgXpm > 0 ? (xpmDiff / avgXpm) * 100 : 0

            comparisons.xpm_vs_avg = {
                playerValue: playerXpm,
                averageValue: avgXpm,
                difference: xpmDiff,
                percentageDiff: xpmPercentageDiff,
                time: heroAvg.time
            }

            // Kill participation comparison - use cumulative kills
            const playerKpct = playerData.kpct
            const avgKpct = heroAvg.kills > 0 ? (heroAvg.kills / (heroAvg.kills + heroAvg.deaths)) * 100 : 50
            const kpctDiff = playerKpct - avgKpct
            const kpctPercentageDiff = (kpctDiff / avgKpct) * 100

            comparisons.kpct_vs_avg = {
                playerValue: playerKpct,
                averageValue: avgKpct,
                difference: kpctDiff,
                percentageDiff: kpctPercentageDiff,
                time: heroAvg.time
            }

            // Deaths comparison - use cumulative deaths per minute
            const playerDeaths = playerData.deaths_per10
            const avgDeaths = (heroAvg.deaths / (heroAvg.time || 1)) * 10 // Convert to deaths per 10 minutes
            const deathsDiff = playerDeaths - avgDeaths
            const deathsPercentageDiff = avgDeaths > 0 ? (deathsDiff / avgDeaths) * 100 : 0

            comparisons.deaths_vs_avg = {
                playerValue: playerDeaths,
                averageValue: avgDeaths,
                difference: deathsDiff,
                percentageDiff: deathsPercentageDiff,
                time: heroAvg.time
            }

            // Last hits at 10 comparison - find 10-minute data
            const heroAvg10 = playerData.stratzData?.heroAverage.find(avg => avg.time === 10)
            if (heroAvg10) {
                const playerLh10 = playerData.lh_10
                const avgLh10 = heroAvg10.cs
                const lh10Diff = playerLh10 - avgLh10
                const lh10PercentageDiff = avgLh10 > 0 ? (lh10Diff / avgLh10) * 100 : 0

                comparisons.lh_10_vs_avg = {
                    playerValue: playerLh10,
                    averageValue: avgLh10,
                    difference: lh10Diff,
                    percentageDiff: lh10PercentageDiff,
                    time: 10
                }
            }

            // First core timing comparison - estimate from networth progression
            const avgFirstCore = this.estimateFirstCoreTiming(playerData.stratzData?.heroAverage || [])
            const playerFirstCore = playerData.first_core_s
            const firstCoreDiff = playerFirstCore - avgFirstCore
            const firstCorePercentageDiff = (firstCoreDiff / avgFirstCore) * 100

            comparisons.first_core_vs_avg = {
                playerValue: playerFirstCore,
                averageValue: avgFirstCore,
                difference: firstCoreDiff,
                percentageDiff: firstCorePercentageDiff,
                time: heroAvg.time
            }

            // Support-specific metrics
            if (playerData.role === 'pos4' || playerData.role === 'pos5') {
                // Camps stacked comparison
                const playerStacks = playerData.stacks
                const avgStacks = heroAvg.campsStacked
                const stacksDiff = playerStacks - avgStacks
                const stacksPercentageDiff = avgStacks > 0 ? (stacksDiff / avgStacks) * 100 : 0

                comparisons.stacks_vs_avg = {
                    playerValue: playerStacks,
                    averageValue: avgStacks,
                    difference: stacksDiff,
                    percentageDiff: stacksPercentageDiff,
                    time: heroAvg.time
                }
            }
        }

        return comparisons
    }

    private static estimateFirstCoreTiming(heroAverage: any[]): number {
        // Estimate first core item timing based on networth progression
        // Look for when networth reaches ~2500 gold (typical first core item)
        const firstCoreNetworth = 2500
        const timing = heroAverage.find(avg => avg.networth >= firstCoreNetworth)
        return timing ? timing.time * 60 : 720 // Default to 12 minutes if not found
    }

    private static hasSufficientHeroAverageData(heroAverageData: Record<string, any>): boolean {
        const requiredFields = ['gpm_vs_avg', 'xpm_vs_avg', 'kpct_vs_avg']
        const availableFields = requiredFields.filter(field => heroAverageData[field])
        return availableFields.length >= 2 // Need at least 2 out of 3 key comparisons
    }

    private static ruleAppliesToRole(rule: any, playerRole: string): boolean {
        return rule.roles.includes('any') || rule.roles.includes(playerRole)
    }

    private static evaluateRuleConditions(
        rule: any,
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[],
        heroAverageData: Record<string, any>
    ): boolean {
        console.log('Evaluating rule:', rule.id, 'for role:', playerData.role)
        console.log('Rule conditions:', rule.conditions)

        const result = rule.conditions.every((condition: RuleCondition) => {
            const value = this.resolveValue(condition.value, playerData, kpis, heroAverageData)
            const playerValue = this.getPlayerValue(condition.kpi, playerData, kpis, heroAverageData)

            console.log(`Condition ${condition.kpi} ${condition.op} ${value}: playerValue=${playerValue}`)

            switch (condition.op) {
                case 'lt': return playerValue < value
                case 'lte': return playerValue <= value
                case 'eq': return playerValue === value
                case 'gte': return playerValue >= value
                case 'gt': return playerValue > value
                default: return false
            }
        })

        console.log('Rule evaluation result:', result)
        return result
    }

    private static resolveValue(
        value: number | { $ref: string },
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[],
        heroAverageData: Record<string, any>
    ): number {
        console.log('Resolving value:', value)

        if (typeof value === 'number') {
            console.log('Direct number value:', value)
            return value
        }

        if (typeof value === 'object' && value.$ref) {
            const refPath = value.$ref.split('.')
            console.log('Reference path:', refPath)

            // Handle threshold references
            if (refPath[0] === 'thresholds' && refPath[1]) {
                const thresholdName = refPath[1]
                const thresholds: Record<string, number> = {
                    'gpm_vs_avg_poor': -20,
                    'gpm_vs_avg_good': 15,
                    'xpm_vs_avg_poor': -20,
                    'xpm_vs_avg_good': 15,
                    'kpct_vs_avg_poor': -25,
                    'kpct_vs_avg_good': 20,
                    'deaths_vs_avg_poor': 30,
                    'deaths_vs_avg_good': -20,
                    'lh_10_vs_avg_poor': -30,
                    'lh_10_vs_avg_good': 25,
                    'first_core_vs_avg_late': 120,
                    'first_core_vs_avg_early': -60,
                    'deaths_per10_high': 3.0,
                    'kpct_low': 35,
                    'lh_10_low': 40,
                    'obs_low': 3,
                    'sentries_low': 2,
                    'stacks_low': 1
                }
                const resolvedValue = thresholds[thresholdName] || 0
                console.log('Resolved threshold:', thresholdName, '=', resolvedValue)
                return resolvedValue
            }
        }

        console.log('No value resolved, returning 0')
        return 0
    }

    private static getPlayerValue(
        kpi: string,
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[],
        heroAverageData: Record<string, any>
    ): number {
        console.log('Getting player value for KPI:', kpi)

        // Check if it's a hero average comparison
        if (heroAverageData[kpi]) {
            const value = heroAverageData[kpi].percentageDiff
            console.log('Found hero average comparison:', kpi, '=', value)
            return value
        }

        // Check if it's a direct player data field
        if (kpi in playerData) {
            const value = (playerData as any)[kpi]
            console.log('Found player data field:', kpi, '=', value)
            return value
        }

        // Check if it's a KPI
        const kpiData = kpis.find(k => k.name === kpi)
        if (kpiData) {
            console.log('Found KPI:', kpi, '=', kpiData.value)
            return kpiData.value
        }

        console.log('No value found for KPI:', kpi, 'returning 0')
        return 0
    }

    private static generateDataSource(
        rule: any,
        playerData: ComputedPlayerData,
        heroAverageData: Record<string, any>
    ): string {
        const conditions = rule.conditions || []
        const dataSources: string[] = []

        conditions.forEach((condition: RuleCondition) => {
            if (heroAverageData[condition.kpi]) {
                const data = heroAverageData[condition.kpi]
                const timeStr = data.time === 10 ? '10 minutes' : `${data.time} minutes`

                switch (condition.kpi) {
                    case 'gpm_vs_avg':
                        dataSources.push(`your gold per minute compared to how other players perform on this hero`)
                        break
                    case 'xpm_vs_avg':
                        dataSources.push(`your experience per minute compared to how other players perform on this hero`)
                        break
                    case 'kpct_vs_avg':
                        dataSources.push(`your kill participation compared to how other players perform on this hero`)
                        break
                    case 'deaths_vs_avg':
                        dataSources.push(`your deaths per 10 minutes compared to how other players perform on this hero`)
                        break
                    case 'lh_10_vs_avg':
                        dataSources.push(`your last hits at 10 minutes compared to how other players perform on this hero`)
                        break
                    case 'first_core_vs_avg':
                        dataSources.push(`your first core item timing compared to when other players typically get their first core item on this hero`)
                        break
                    case 'stacks_vs_avg':
                        dataSources.push(`your camp stacking compared to how other support players perform on this hero`)
                        break
                    default:
                        dataSources.push(`your ${condition.kpi} compared to how other players perform on this hero`)
                }
            } else {
                // For non-hero average comparisons, provide plain English explanations
                switch (condition.kpi) {
                    case 'kpct':
                        dataSources.push(`your kill participation percentage from this match`)
                        break
                    case 'obs':
                        dataSources.push(`your observer ward placement count from this match`)
                        break
                    case 'sentries':
                        dataSources.push(`your sentry ward placement count from this match`)
                        break
                    case 'stacks':
                        dataSources.push(`your camp stacking count from this match`)
                        break
                    case 'lh_10':
                        dataSources.push(`your last hits at 10 minutes from this match`)
                        break
                    default:
                        dataSources.push(`your ${condition.kpi} from this match`)
                }
            }
        })

        return `Based on ${dataSources.join(' and ')}`
    }

    private static generateNumbersThatMatter(
        playerData: ComputedPlayerData,
        kpis: ComputedKPI[],
        heroAverageData: Record<string, any>,
        roleKpis: string[]
    ): NumbersThatMatter[] {
        const numbers: NumbersThatMatter[] = []

        roleKpis.forEach(kpiName => {
            if (heroAverageData[kpiName]) {
                const data = heroAverageData[kpiName]
                const timeStr = data.time === 10 ? '10 minutes' : `${data.time} minutes`

                numbers.push({
                    kpi: kpiName,
                    playerValue: data.playerValue,
                    averageValue: data.averageValue,
                    difference: data.difference,
                    percentageDiff: data.percentageDiff,
                    label: this.getKpiLabel(kpiName),
                    dataSource: `Based on how other players perform on ${playerData.heroName} in ${playerData.role}`
                })
            }
        })

        return numbers.slice(0, 4) // Limit to 4 numbers
    }

    private static generateTimeline(
        playerData: ComputedPlayerData,
        heroAverageData: Record<string, any>
    ): TimelineMarker[] {
        const timeline: TimelineMarker[] = []

        // Add first core item timing if available
        if (playerData.first_core_s > 0) {
            timeline.push({
                label: 'First Core Item',
                time: playerData.first_core_s,
                description: 'Core item timing',
                delta: heroAverageData.first_core_vs_avg?.difference || 0
            })
        }

        // Add 10-minute benchmarks
        if (playerData.lh_10 > 0) {
            timeline.push({
                label: '10-min Farm',
                time: 600, // 10 minutes in seconds
                description: `Last hits: ${playerData.lh_10}`,
                delta: heroAverageData.lh_10_vs_avg?.difference || 0
            })
        }

        return timeline
    }

    private static getKpiLabel(kpi: string): string {
        const labels: Record<string, string> = {
            'gpm_vs_avg': 'GPM vs Average',
            'xpm_vs_avg': 'XPM vs Average',
            'kpct_vs_avg': 'Kill Participation vs Average',
            'deaths_vs_avg': 'Deaths vs Average',
            'lh_10_vs_avg': 'Last Hits @10 vs Average',
            'first_core_vs_avg': 'First Core vs Average',
            'stacks_vs_avg': 'Camps Stacked vs Average',
            'obs': 'Observers Placed',
            'sentries': 'Sentries Placed',
            'stacks': 'Camps Stacked'
        }

        return labels[kpi] || kpi
    }

    private static generateSummary(
        focusArea: any,
        fixes: any[],
        wins: any[],
        playerData: ComputedPlayerData
    ): string {
        if (focusArea) {
            return `Focus on ${focusArea.advice.title.toLowerCase()} for your next game.`
        }

        if (wins.length > 0) {
            return `Strong performance in ${wins[0].advice.title.toLowerCase()}. Keep it up!`
        }

        if (fixes.length > 0) {
            return `Work on ${fixes[0].advice.title.toLowerCase()} to improve your game.`
        }

        return 'Overall solid performance with room for optimization.'
    }
} 