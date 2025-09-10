// MVP Rules Engine for ruleset.v3.jsonc
// Implements the exact specification from the user requirements

import type { StratzMatch, StratzPlayer, StratzHeroAverage } from '../types'

// Types matching the v3 ruleset structure exactly
export interface V3Rule {
    id: string
    roles: string[]
    atMin?: number
    endOfGame?: boolean
    when: {
        operator: 'delta_less_than' | 'delta_greater_than' | 'lt' | 'lte' | 'gt' | 'gte' | 'eq'
        kpi: string
        value: number
    }
    severity: number | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    type: 'win' | 'fix'
    category: string
    header: string
    description: string
    context?: V3Context[]
}

export interface V3Context {
    if: {
        operator: 'delta_less_than' | 'delta_greater_than' | 'lt' | 'lte' | 'gt' | 'gte' | 'eq'
        kpi: string
        value: number
    }
    effect: 'dampenLevel' | 'attachNote'
    value?: string // For attachNote
}

export interface V3Ruleset {
    rulesVersion: string
    categories: Record<string, string>
    rules: V3Rule[]
}

// Signals layer - computed facts from match data
export interface Signals {
    // Time-based signals with clear naming convention
    timeToLevel6?: number
    pre10minuteAssists?: number
    pre12minuteStacks?: number
    pre15minuteDeaths?: number
    pre20minuteDeaths?: number
    gpmAt20minutes?: number
    wardUptimePctAt15minutes?: number
    towerDamageEnd?: number
    dewardEventsPre15minutes?: number

    // Benchmark equivalents
    bench?: {
        gpmAt20minutes?: number
        xpAt10minutes?: number
        [key: string]: number | undefined
    }

    // Raw metrics from match data
    [key: string]: number | { [key: string]: number | undefined } | undefined
}

// Rule evaluation result
export interface RuleResult {
    id: string
    type: 'win' | 'fix'
    category: string
    header: string
    description: string
    evidence: Array<{ kpi: string; playerValue: number; benchmarkValue: number; delta: number }>
    severityBucket: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    severityWeight: number
    absDelta: number
    triggered: boolean
}

// Analysis result
export interface AnalysisResult {
    summary: string
    findings: RuleResult[]
}

// Severity mapping
const SEVERITY_WEIGHTS = {
    'LOW': 0.30,
    'MEDIUM': 0.55,
    'HIGH': 0.80,
    'CRITICAL': 1.00
} as const

const SEVERITY_BUCKETS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const

export class MVPRuleEngine {
    private static ruleset: V3Ruleset | null = null

    static async loadRuleset(): Promise<V3Ruleset> {
        if (!this.ruleset) {
            try {
                const response = await fetch('/ruleset.v3.jsonc')

                if (!response.ok) {
                    throw new Error(`Failed to fetch ruleset: ${response.status} ${response.statusText}`)
                }

                const text = await response.text()

                // Parse JSONC (remove comments)
                let jsonText = text
                    .replace(/\/\/.*$/gm, '') // Remove single-line comments
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                    .replace(/,\s*}/g, '}') // Remove trailing commas
                    .replace(/,\s*]/g, ']') // Remove trailing commas in arrays

                this.ruleset = JSON.parse(jsonText)
            } catch (error) {
                console.error('Failed to load v3 ruleset:', error)
                throw new Error('Failed to load analysis ruleset')
            }
        }
        return this.ruleset!
    }

    static async analyze(matchData: StratzMatch, playerSlot: number, options?: {
        maxFindings?: number
        maxPerCategory?: number
        requireWinAndFix?: boolean
    }): Promise<AnalysisResult> {
        const ruleset = await this.loadRuleset()
        const player = matchData.players.find(p => p.playerSlot === playerSlot)

        if (!player) {
            throw new Error(`Player with slot ${playerSlot} not found`)
        }

        // Compute signals from match data
        const signals = this.computeSignals(matchData, player)

        // Evaluate all applicable rules
        const applicableRules = ruleset.rules.filter(rule =>
            rule.roles.includes('ALL') || rule.roles.includes(player.role)
        )

        const triggeredRules: RuleResult[] = []

        for (const rule of applicableRules) {
            const result = this.evalRule(rule, signals, player)
            if (result.triggered) {
                triggeredRules.push(result)
            }
        }

        // Apply selection policy
        const selectedFindings = this.selectFindings(triggeredRules, options)

        // Generate summary
        const summary = this.renderSummary(selectedFindings)

        return {
            summary,
            findings: selectedFindings
        }
    }

    private static computeSignals(matchData: StratzMatch, player: StratzPlayer): Signals {
        const signals: Signals = {}
        const playerStats = player.stats
        const heroAverage = player.heroAverage

        // Compute time-based signals
        const matchMinutes = Math.floor(matchData.durationSeconds / 60)

        // Level 6 timing
        if (playerStats.level && playerStats.level.length > 0) {
            const level6Index = playerStats.level.findIndex(level => level >= 6)
            if (level6Index !== -1) {
                signals.timeToLevel6 = level6Index
            }
        }

        // Pre-minute signals (cumulative up to that minute)
        for (let minute = 5; minute <= 20; minute += 5) {
            const minuteIndex = Math.min(minute - 1, playerStats.goldPerMinute.length - 1)

            if (minuteIndex >= 0) {
                // GPM at specific minutes
                signals[`gpmAt${minute}minutes`] = playerStats.goldPerMinute[minuteIndex] || 0

                // XP at specific minutes
                signals[`xpAt${minute}minutes`] = playerStats.experiencePerMinute[minuteIndex] || 0

                // Level at specific minutes
                signals[`levelAt${minute}minutes`] = playerStats.level[minuteIndex] || 0

                // CS at specific minutes (cumulative)
                signals[`csAt${minute}minutes`] = this.accumulateArrayValues(playerStats.lastHitsPerMinute, minuteIndex)

                // Stacks at specific minutes (cumulative)
                signals[`stacksAt${minute}minutes`] = this.accumulateArrayValues(playerStats.campStack, minuteIndex)
            }
        }

        // Pre-minute signals (before X minutes)
        for (let minute = 10; minute <= 20; minute += 5) {
            const minuteIndex = Math.min(minute - 1, playerStats.goldPerMinute.length - 1)

            if (minuteIndex >= 0) {
                // Assists before X minutes (estimated from KDA)
                signals[`pre${minute}minuteAssists`] = Math.max(0, (player.kills + player.assists) * minute / matchMinutes)

                // Stacks before X minutes
                signals[`pre${minute}minuteStacks`] = this.accumulateArrayValues(playerStats.campStack, minuteIndex)

                // Deaths before X minutes (estimated)
                signals[`pre${minute}minuteDeaths`] = (player.deaths * minute / matchMinutes)
            }
        }

        // End of game signals
        signals.towerDamageEnd = player.towerDamage
        signals.heroDamageEnd = player.heroDamage
        signals.networthEnd = player.networth
        signals.courierKillsEnd = 0 // Not available in current data structure
        signals.abilityCastsEnd = 0 // Not available in current data structure
        signals.healingAlliesEnd = 0 // Not available in current data structure
        signals.supportGoldEnd = 0 // Not available in current data structure

        // Ward uptime percentage (estimated)
        signals.wardUptimePctAt15minutes = Math.min(100, (player.obs || 0) * 10)

        // Deward events (estimated)
        signals.dewardEventsPre15minutes = (player.sentries || 0) * 0.5

        // Compute benchmark signals
        signals.bench = this.computeBenchmarkSignals(heroAverage, matchMinutes)

        return signals
    }

    private static computeBenchmarkSignals(heroAverage: StratzHeroAverage[], matchMinutes: number): Signals['bench'] {
        const bench: Signals['bench'] = {}

        if (!heroAverage || heroAverage.length === 0) {
            return bench
        }

        // Find the most recent hero average data
        const latestAvg = heroAverage.sort((a, b) => b.time - a.time)[0]

        if (!latestAvg) return bench

        // Compute benchmark values for different time points
        for (let minute = 5; minute <= 20; minute += 5) {
            const timeRatio = Math.min(minute / latestAvg.time, 1)

            bench[`gpmAt${minute}minutes`] = (latestAvg.goldPerMinute || 0) * timeRatio
            bench[`xpAt${minute}minutes`] = (latestAvg.xp || 0) * timeRatio
            bench[`levelAt${minute}minutes`] = (latestAvg.level || 0) * timeRatio
            bench[`csAt${minute}minutes`] = (latestAvg.cs || 0) * timeRatio
            bench[`stacksAt${minute}minutes`] = (latestAvg.campsStacked || 0) * timeRatio
        }

        // End of game benchmarks
        bench.gpmEnd = latestAvg.goldPerMinute || 0
        bench.xpEnd = latestAvg.xp || 0
        bench.levelEnd = latestAvg.level || 0
        bench.csEnd = latestAvg.cs || 0
        bench.stacksEnd = latestAvg.campsStacked || 0
        bench.heroDamageEnd = latestAvg.damage || 0
        bench.networthEnd = latestAvg.networth || 0
        bench.courierKillsEnd = latestAvg.courierKills || 0
        bench.abilityCastsEnd = latestAvg.abilityCasts || 0
        bench.healingAlliesEnd = latestAvg.healingAllies || 0
        bench.supportGoldEnd = latestAvg.supportGold || 0

        return bench
    }

    private static evalRule(rule: V3Rule, signals: Signals, player: StratzPlayer): RuleResult {
        const { operator, kpi, value } = rule.when

        // Determine the time point for this rule
        let targetTime: number | null = null
        let metricName = kpi

        if (rule.atMin) {
            targetTime = rule.atMin
            // Handle @time format
            if (kpi.includes('@')) {
                const parts = kpi.split('@')
                metricName = parts[0]
                targetTime = parseInt(parts[1]) || rule.atMin
            }
        } else if (rule.endOfGame) {
            targetTime = null // Use end of game values
        }

        // Get player value
        const playerValue = this.getSignalValue(signals, metricName, targetTime)
        const benchmarkValue = this.getBenchmarkValue(signals, metricName, targetTime)

        if (playerValue === undefined || benchmarkValue === undefined) {
            return {
                id: rule.id,
                type: rule.type,
                category: rule.category,
                header: rule.header,
                description: rule.description,
                evidence: [],
                severityBucket: this.mapSeverityToBucket(rule.severity),
                severityWeight: this.mapSeverityToWeight(rule.severity),
                absDelta: 0,
                triggered: false
            }
        }

        // Calculate delta for delta operators
        let delta = 0
        let absDelta = 0
        let triggered = false

        if (operator.startsWith('delta_')) {
            delta = (playerValue - benchmarkValue) / Math.max(benchmarkValue, 1e-6)
            absDelta = Math.abs(delta)

            if (operator === 'delta_less_than') {
                triggered = delta < value
            } else if (operator === 'delta_greater_than') {
                triggered = delta > value
            }
        } else {
            // Raw number operators
            absDelta = Math.abs(playerValue - value)

            switch (operator) {
                case 'lt':
                    triggered = playerValue < value
                    break
                case 'lte':
                    triggered = playerValue <= value
                    break
                case 'gt':
                    triggered = playerValue > value
                    break
                case 'gte':
                    triggered = playerValue >= value
                    break
                case 'eq':
                    triggered = Math.abs(playerValue - value) < 0.01
                    break
            }
        }

        // Apply context effects
        let finalDescription = rule.description
        let finalSeverity = this.mapSeverityToBucket(rule.severity)

        if (rule.context && triggered) {
            for (const context of rule.context.slice(0, 2)) { // Limit to 2 context checks
                const contextValue = this.getSignalValue(signals, context.if.kpi, targetTime)
                const contextBenchmark = this.getBenchmarkValue(signals, context.if.kpi, targetTime)

                if (contextValue !== undefined && contextBenchmark !== undefined) {
                    let contextTriggered = false

                    if (context.if.operator.startsWith('delta_')) {
                        const contextDelta = (contextValue - contextBenchmark) / Math.max(contextBenchmark, 1e-6)
                        if (context.if.operator === 'delta_less_than') {
                            contextTriggered = contextDelta < context.if.value
                        } else if (context.if.operator === 'delta_greater_than') {
                            contextTriggered = contextDelta > context.if.value
                        }
                    } else {
                        switch (context.if.operator) {
                            case 'lt':
                                contextTriggered = contextValue < context.if.value
                                break
                            case 'lte':
                                contextTriggered = contextValue <= context.if.value
                                break
                            case 'gt':
                                contextTriggered = contextValue > context.if.value
                                break
                            case 'gte':
                                contextTriggered = contextValue >= context.if.value
                                break
                            case 'eq':
                                contextTriggered = Math.abs(contextValue - context.if.value) < 0.01
                                break
                        }
                    }

                    if (contextTriggered) {
                        if (context.effect === 'dampenLevel') {
                            finalSeverity = this.dampenSeverity(finalSeverity)
                        } else if (context.effect === 'attachNote' && context.value) {
                            finalDescription += ` ${context.value}`
                        }
                    }
                }
            }
        }

        return {
            id: rule.id,
            type: rule.type,
            category: rule.category,
            header: rule.header,
            description: finalDescription,
            evidence: [{
                kpi: metricName,
                playerValue,
                benchmarkValue,
                delta
            }],
            severityBucket: finalSeverity,
            severityWeight: this.mapSeverityToWeight(finalSeverity),
            absDelta,
            triggered
        }
    }

    private static getSignalValue(signals: Signals, kpi: string, targetTime: number | null): number | undefined {
        // Handle time-specific KPIs
        if (targetTime !== null) {
            const timeSpecificKpi = `${kpi}At${targetTime}minutes`
            if (signals[timeSpecificKpi] !== undefined) {
                return signals[timeSpecificKpi] as number
            }
        }

        // Handle end-of-game KPIs
        if (targetTime === null) {
            const endKpi = `${kpi}End`
            if (signals[endKpi] !== undefined) {
                return signals[endKpi] as number
            }
        }

        // Handle pre-minute KPIs
        if (kpi.startsWith('pre') && kpi.includes('minute')) {
            if (signals[kpi] !== undefined) {
                return signals[kpi] as number
            }
        }

        // Direct KPI lookup
        return signals[kpi] as number | undefined
    }

    private static getBenchmarkValue(signals: Signals, kpi: string, targetTime: number | null): number | undefined {
        if (!signals.bench) return undefined

        // Handle time-specific KPIs
        if (targetTime !== null) {
            const timeSpecificKpi = `${kpi}At${targetTime}minutes`
            return signals.bench[timeSpecificKpi]
        }

        // Handle end-of-game KPIs
        if (targetTime === null) {
            const endKpi = `${kpi}End`
            return signals.bench[endKpi]
        }

        // Direct benchmark lookup
        return signals.bench[kpi]
    }

    private static mapSeverityToBucket(severity: number | string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        if (typeof severity === 'string') {
            return severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
        }

        // Convert numeric severity to bucket
        if (severity <= 0.3) return 'LOW'
        if (severity <= 0.55) return 'MEDIUM'
        if (severity <= 0.8) return 'HIGH'
        return 'CRITICAL'
    }

    private static mapSeverityToWeight(severity: number | string): number {
        if (typeof severity === 'string') {
            return SEVERITY_WEIGHTS[severity] || 0.5
        }

        // Convert numeric severity to weight
        if (severity <= 0.3) return 0.30
        if (severity <= 0.55) return 0.55
        if (severity <= 0.8) return 0.80
        return 1.00
    }

    private static dampenSeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        const currentIndex = SEVERITY_BUCKETS.indexOf(severity)
        if (currentIndex > 0) {
            return SEVERITY_BUCKETS[currentIndex - 1]
        }
        return 'LOW' // LOW stays LOW
    }

    private static selectFindings(
        triggeredRules: RuleResult[],
        options?: {
            maxFindings?: number
            maxPerCategory?: number
            requireWinAndFix?: boolean
        }
    ): RuleResult[] {
        const maxFindings = options?.maxFindings || 3
        const maxPerCategory = options?.maxPerCategory || 2
        const requireWinAndFix = options?.requireWinAndFix !== false

        // Sort by severity weight descending, then by absDelta descending
        const sorted = triggeredRules.sort((a, b) => {
            if (a.severityWeight !== b.severityWeight) {
                return b.severityWeight - a.severityWeight
            }
            return b.absDelta - a.absDelta
        })

        const selected: RuleResult[] = []
        const categoryCounts: Record<string, number> = {}
        const typeCounts = { win: 0, fix: 0 }

        for (const rule of sorted) {
            // Check category limit
            if (categoryCounts[rule.category] >= maxPerCategory) {
                continue
            }

            // Check total limit
            if (selected.length >= maxFindings) {
                break
            }

            // Check win/fix requirement
            if (requireWinAndFix && selected.length > 0) {
                const hasWin = typeCounts.win > 0
                const hasFix = typeCounts.fix > 0
                const needsWin = !hasWin && rule.type === 'win'
                const needsFix = !hasFix && rule.type === 'fix'

                if (!needsWin && !needsFix && (hasWin || hasFix)) {
                    continue
                }
            }

            selected.push(rule)
            categoryCounts[rule.category] = (categoryCounts[rule.category] || 0) + 1
            typeCounts[rule.type]++
        }

        return selected
    }

    private static renderSummary(findings: RuleResult[]): string {
        if (findings.length === 0) {
            return "Your performance was average. Focus on improving your overall game mechanics and decision making."
        }

        const topFinding = findings[0]
        return `${topFinding.category} ${topFinding.type === 'win' ? 'strength' : 'area for improvement'}: ${topFinding.header}`
    }

    private static accumulateArrayValues(array: number[], timeIndex: number): number {
        if (!array || array.length === 0) return 0

        let sum = 0
        for (let i = 0; i <= Math.min(timeIndex, array.length - 1); i++) {
            sum += array[i] || 0
        }
        return sum
    }
}
