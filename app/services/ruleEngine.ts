import type { ComputedPlayerData, ComputedKPI, Fix, Win, TimelineMarker } from '~/types'

// Load ruleset data from the JSONC file
const RULESET = {
    "rulesVersion": "2.0.0",
    "kpis": [
        "benchmarks.gold_per_min.pct",
        "benchmarks.xp_per_min.pct",
        "benchmarks.kills_per_min.pct",
        "benchmarks.last_hits_per_min.pct",
        "benchmarks.hero_damage_per_min.pct",
        "benchmarks.hero_healing_per_min.pct",
        "benchmarks.tower_damage.pct",
        "benchmarks.denies_per_min.pct",
        "first_core_s",
        "deaths_per10",
        "kpct",
        "obs", "sentries",
        "stacks", "smokes_used",
        "match_minutes",
        "role",
        "early_deaths_0_10",
        "early_deaths_0_15",
        "idle_time_30s",
        "last_hits_10",
        "denies_10",
        "gpm_10",
        "xpm_10"
    ],
    "bands": {
        "great": 0.75,
        "ok": 0.40,
        "poor": 0.25
    },
    "thresholds": {
        "firstCoreLate_s": 960,
        "firstCoreVeryLate_s": 1080,
        "deathsPer10High": 2.0,
        "deathsPer10VeryHigh": 2.4,
        "visionBaseDivisor": 6,
        "sentriesExpectAt30": 4,
        "stacksExpectBy20_pos4": 2,
        "smokesExpectBy16_pos5": 1,
        "carryEarlyDeaths0_10": 2,
        "carryEarlyDeaths0_15": 3,
        "carryIdleTime30s": 180,
        "carryLastHits10": 50,
        "carryDenies10": 5,
        "carryGpm10": 400,
        "carryXpm10": 500,
        "carryKpctLow": 35,
        "carryDamageLow": 0.30,
        "carryGpmLow": 0.35,
        "carryXpmLow": 0.35,
        "carryLhLow": 0.30
    },
    "guards": [
        {
            "id": "short_game",
            "any": [{ "op": "lt", "kpi": "match_minutes", "value": 25 }],
            "effect": "downgrade"
        },
        {
            "id": "deaths_but_high_damage",
            "any": [{ "op": "gte", "kpi": "benchmarks.hero_damage_per_min.pct", "value": 0.75 }],
            "effect": "downgrade"
        },
        {
            "id": "core_low_tower_but_high_damage",
            "any": [{ "op": "gte", "kpi": "benchmarks.hero_damage_per_min.pct", "value": 0.75 }],
            "effect": "downgrade"
        },
        {
            "id": "carry_high_damage_compensation",
            "any": [{ "op": "gte", "kpi": "benchmarks.hero_damage_per_min.pct", "value": 0.80 }],
            "effect": "downgrade"
        }
    ],
    "roleRules": {
        "pos1": [
            {
                "id": "carry_early_deaths_critical",
                "all": [
                    { "op": "gt", "kpi": "early_deaths_0_10", "value": { "$ref": "thresholds.carryEarlyDeaths0_10" } }
                ],
                "bigGap": { "kpi": "early_deaths_0_10", "over": 3 },
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Critical early game deaths",
                    "detail": "You died too much in the first 10 minutes. Focus on staying alive - don't trade deaths for farm. Ask for support rotations if needed."
                }
            },
            {
                "id": "carry_low_kill_participation",
                "all": [
                    { "op": "lt", "kpi": "kpct", "value": { "$ref": "thresholds.carryKpctLow" } },
                    { "op": "gte", "kpi": "match_minutes", "value": 20 }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Low fight participation",
                    "detail": "Your kill participation is too low for a carry. Join important fights after your first core item, especially around objectives."
                }
            },
            {
                "id": "carry_high_deaths_low_damage",
                "all": [
                    { "op": "gt", "kpi": "deaths_per10", "value": { "$ref": "thresholds.deathsPer10High" } },
                    { "op": "lt", "kpi": "benchmarks.hero_damage_per_min.pct", "value": { "$ref": "thresholds.carryDamageLow" } }
                ],
                "bigGap": { "kpi": "deaths_per10", "over": { "$ref": "thresholds.deathsPer10VeryHigh" } },
                "guardsRef": ["carry_high_damage_compensation", "short_game"],
                "advice": {
                    "title": "High deaths with low impact",
                    "detail": "You're dying too much without dealing significant damage. Improve positioning, farm safer areas, and only fight when you have item advantages."
                }
            },
            {
                "id": "carry_late_first_core",
                "all": [
                    { "op": "gt", "kpi": "first_core_s", "value": { "$ref": "thresholds.firstCoreLate_s" } }
                ],
                "bigGap": { "kpi": "first_core_s", "over": { "$ref": "thresholds.firstCoreVeryLate_s" } },
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Late first core item",
                    "detail": "Your first core item was too late. Focus on efficient farming patterns, avoid unnecessary skirmishes, and prioritize last hits over denies early."
                }
            },
            {
                "id": "carry_low_gpm",
                "all": [
                    { "op": "lt", "kpi": "benchmarks.gold_per_min.pct", "value": { "$ref": "thresholds.carryGpmLow" } }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Low gold per minute",
                    "detail": "Your GPM is below average for this hero. Improve farming efficiency by stacking camps, taking safer farm, and avoiding downtime."
                }
            },
            {
                "id": "carry_low_xpm",
                "all": [
                    { "op": "lt", "kpi": "benchmarks.xp_per_min.pct", "value": { "$ref": "thresholds.carryXpmLow" } }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Low experience per minute",
                    "detail": "Your XPM is below average. Stay in lane longer, take safer farm, and avoid dying to maintain experience advantage."
                }
            },
            {
                "id": "carry_low_last_hits",
                "all": [
                    { "op": "lt", "kpi": "benchmarks.last_hits_per_min.pct", "value": { "$ref": "thresholds.carryLhLow" } }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Low last hit efficiency",
                    "detail": "Your last hit rate is below average. Practice last hitting, focus on timing, and prioritize CS over harassing in lane."
                }
            },
            {
                "id": "carry_low_denies",
                "all": [
                    { "op": "lt", "kpi": "benchmarks.denies_per_min.pct", "value": 0.20 }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Low deny rate",
                    "detail": "You're not denying enough creeps. Denying denies enemy XP and gold while securing lane control."
                }
            },
            {
                "id": "carry_high_idle_time",
                "all": [
                    { "op": "gt", "kpi": "idle_time_30s", "value": { "$ref": "thresholds.carryIdleTime30s" } }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Too much idle time",
                    "detail": "You spent too much time without getting CS. Always be farming or moving to farm - avoid standing around or waiting for fights."
                }
            },
            {
                "id": "carry_poor_10min_benchmarks",
                "all": [
                    { "op": "lt", "kpi": "last_hits_10", "value": { "$ref": "thresholds.carryLastHits10" } },
                    { "op": "lt", "kpi": "gpm_10", "value": { "$ref": "thresholds.carryGpm10" } }
                ],
                "guardsRef": ["short_game"],
                "advice": {
                    "title": "Poor 10-minute benchmarks",
                    "detail": "Your 10-minute farm is below expectations. Focus on last hitting, avoid dying, and secure safe farm in the early game."
                }
            }
        ]
    },
    "rules": [
        {
            "id": "high_deaths_low_impact",
            "roles": ["any"],
            "all": [
                { "op": "gt", "kpi": "deaths_per10", "value": { "$ref": "thresholds.deathsPer10High" } },
                { "op": "lt", "kpi": "kpct", "value": 40 }
            ],
            "bigGap": { "kpi": "deaths_per10", "over": { "$ref": "thresholds.deathsPer10VeryHigh" } },
            "guardsRef": ["deaths_but_high_damage", "short_game"],
            "advice": {
                "title": "Too many low impact deaths",
                "detail": "Play farther back, TP to reset when low, and only fight on smoke or item timings."
            }
        },
        {
            "id": "late_first_core_and_low_farm",
            "roles": ["pos1", "pos2"],
            "all": [
                { "op": "gt", "kpi": "first_core_s", "value": { "$ref": "thresholds.firstCoreLate_s" } },
                { "op": "lt", "kpi": "benchmarks.gold_per_min.pct", "value": 0.45 }
            ],
            "bigGap": { "kpi": "first_core_s", "over": { "$ref": "thresholds.firstCoreVeryLate_s" } },
            "guardsRef": ["short_game"],
            "advice": {
                "title": "First core item was late",
                "detail": "Commit 2 minutes to safe farm after minute 8 and skip skirmishes until your timing."
            }
        },
        {
            "id": "low_tower_pressure_core",
            "roles": ["pos1", "pos2"],
            "all": [
                { "op": "lt", "kpi": "benchmarks.tower_damage.pct", "value": 0.35 },
                { "op": "gte", "kpi": "match_minutes", "value": 20 }
            ],
            "guardsRef": ["core_low_tower_but_high_damage", "short_game"],
            "advice": {
                "title": "Not converting farm to objectives",
                "detail": "After first core, convert one wave per minute into safe chip on outer towers."
            }
        },
        {
            "id": "offlane_low_damage_low_kp",
            "roles": ["pos3"],
            "all": [
                { "op": "lt", "kpi": "benchmarks.hero_damage_per_min.pct", "value": 0.40 },
                { "op": "lt", "kpi": "kpct", "value": 40 },
                { "op": "gte", "kpi": "match_minutes", "value": 15 }
            ],
            "guardsRef": ["short_game"],
            "advice": {
                "title": "Low fight impact after lane",
                "detail": "Group on your first aura timing and force a tower or smoke to a gate to pressure the map."
            }
        },
        {
            "id": "roam_low_setup",
            "roles": ["pos4"],
            "all": [
                { "op": "lt", "kpi": "kpct", "value": 45 },
                { "op": "lt", "kpi": "stacks", "value": { "$ref": "thresholds.stacksExpectBy20_pos4" } },
                { "op": "lt", "kpi": "match_minutes", "value": 20 }
            ],
            "advice": {
                "title": "Low early setup",
                "detail": "Guarantee one stack by 7 and another by 12, then rotate on rune minutes."
            }
        },
        {
            "id": "low_vision_tempo",
            "roles": ["pos4", "pos5"],
            "all": [
                { "op": "ltDynamic", "kpi": "obs", "formula": "ceil(match_minutes / thresholds.visionBaseDivisor)" },
                { "op": "lt", "kpi": "sentries", "value": { "$ref": "thresholds.sentriesExpectAt30" } }
            ],
            "guardsRef": ["short_game"],
            "advice": {
                "title": "Raise your vision tempo",
                "detail": "Place 2 observers before minute 10 and pair 2 sentries with your next 3 observers."
            }
        },
        {
            "id": "no_smoke_timing",
            "roles": ["pos5"],
            "all": [
                { "op": "eq", "kpi": "smokes_used", "value": 0 },
                { "op": "gte", "kpi": "match_minutes", "value": 16 }
            ],
            "advice": {
                "title": "No smoke timing created",
                "detail": "Lead one smoke between minutes 12 and 16 when your cores hit items."
            }
        },
        {
            "id": "win_great_farm",
            "type": "win",
            "roles": ["pos1", "pos2"],
            "all": [{ "op": "gte", "kpi": "benchmarks.gold_per_min.pct", "value": { "$ref": "bands.great" } }],
            "advice": {
                "title": "Great farm speed",
                "detail": "Your GPM ranked top 25 percent for this hero."
            }
        },
        {
            "id": "win_high_lh",
            "type": "win",
            "roles": ["pos1", "pos2"],
            "all": [{ "op": "gte", "kpi": "benchmarks.last_hits_per_min.pct", "value": { "$ref": "bands.great" } }],
            "advice": {
                "title": "Strong CS",
                "detail": "Your last hits per minute were among the best for this hero."
            }
        },
        {
            "id": "win_high_kp",
            "type": "win",
            "roles": ["any"],
            "all": [{ "op": "gte", "kpi": "kpct", "value": 60 }],
            "advice": {
                "title": "High fight participation",
                "detail": "Excellent involvement in early skirmishes. Keep syncing with power rune minutes."
            }
        },
        {
            "id": "win_carry_clean_early",
            "type": "win",
            "roles": ["pos1"],
            "all": [
                { "op": "eq", "kpi": "early_deaths_0_10", "value": 0 },
                { "op": "gte", "kpi": "last_hits_10", "value": 60 }
            ],
            "advice": {
                "title": "Clean early game",
                "detail": "Excellent early game - no deaths and strong CS at 10 minutes. This sets up a great mid-game."
            }
        },
        {
            "id": "win_carry_efficient_farming",
            "type": "win",
            "roles": ["pos1"],
            "all": [
                { "op": "lt", "kpi": "idle_time_30s", "value": 60 },
                { "op": "gte", "kpi": "benchmarks.gold_per_min.pct", "value": { "$ref": "bands.ok" } }
            ],
            "advice": {
                "title": "Efficient farming",
                "detail": "Great farming efficiency with minimal idle time. You maximized your gold income."
            }
        }
    ],
    "selection": {
        "maxFixes": 3,
        "maxWins": 2,
        "tieBreakers": ["higherConfidenceFirst", "roleSpecificOverGeneric"],
        "roleSpecificPriority": {
            "pos1": ["carry_early_deaths_critical", "carry_high_deaths_low_damage", "carry_late_first_core", "carry_low_gpm", "carry_low_last_hits"]
        }
    },
    "confidence": {
        "basePerCondition": 1,
        "bigGapBonus": 1,
        "guardPenalty": 1,
        "roleSpecificBonus": 0.5,
        "labels": [
            { "min": -99, "max": 2, "label": "low" },
            { "min": 3, "max": 4, "label": "medium" },
            { "min": 5, "max": 99, "label": "high" }
        ]
    }
}

export class RuleEngine {
    static analyzePlayer(playerData: ComputedPlayerData, kpis: ComputedKPI[]): {
        fixes: Fix[]
        wins: Win[]
        timeline: TimelineMarker[]
        summary: string
    } {
        const fixes: Fix[] = []
        const wins: Win[] = []
        const timeline: TimelineMarker[] = []

        // Apply role-specific rules first (higher priority)
        const roleSpecificRules = (RULESET.roleRules as any)[playerData.role] || []
        for (const rule of roleSpecificRules) {
            if (this.shouldApplyRule(rule, playerData, kpis)) {
                const result = this.applyRule(rule, playerData, kpis, true) // true = role-specific
                if (result) {
                    if (rule.type === 'win') {
                        wins.push(result as Win)
                    } else {
                        fixes.push(result as Fix)
                    }
                }
            }
        }

        // Apply general rules
        for (const rule of RULESET.rules) {
            if (this.shouldApplyRule(rule, playerData, kpis)) {
                const result = this.applyRule(rule, playerData, kpis, false) // false = general rule
                if (result) {
                    if (rule.type === 'win') {
                        wins.push(result as Win)
                    } else {
                        fixes.push(result as Fix)
                    }
                }
            }
        }

        // Sort by confidence and role-specific priority
        const sortedFixes = this.sortByConfidenceAndPriority(fixes as Fix[], playerData, kpis)
        const sortedWins = this.sortByConfidence(wins as Win[], playerData, kpis)

        // Always return exactly 3 fixes and 2 wins (fill with defaults if needed)
        const finalFixes = this.ensureFixCount(sortedFixes, playerData, kpis)
        const finalWins = this.ensureWinCount(sortedWins, playerData, kpis)

        // Generate timeline
        timeline.push({
            label: 'First Core Item',
            time: playerData.first_core_s,
            delta: playerData.first_core_s - 720, // vs 12 minute median
            description: 'Core item timing'
        })

        // Add carry-specific timeline markers
        if (playerData.role === 'pos1') {
            timeline.push({
                label: '10-min Farm',
                time: 600,
                delta: (playerData.lh_10 || 0) - 50,
                description: `Last hits: ${playerData.lh_10 || 0}`
            })
        }

        // Generate summary
        const summary = this.generateSummary(playerData, finalFixes, finalWins)

        return { fixes: finalFixes, wins: finalWins, timeline, summary }
    }

    private static shouldApplyRule(rule: any, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        // Check role applicability (only for general rules, role-specific rules are already filtered)
        if (rule.roles) {
            if (!rule.roles.includes('any') && !rule.roles.includes(playerData.role)) {
                return false
            }
        }

        // Check guards
        if (rule.guardsRef) {
            for (const guardId of rule.guardsRef) {
                const guard = RULESET.guards.find(g => g.id === guardId)
                if (guard && this.evaluateGuard(guard, playerData, kpis)) {
                    return false
                }
            }
        }

        // Check conditions
        if (rule.all && !this.evaluateConditions(rule.all, playerData, kpis)) {
            return false
        }

        if (rule.any && !this.evaluateAnyConditions(rule.any, playerData, kpis)) {
            return false
        }

        return true
    }

    private static evaluateGuard(guard: any, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        if (guard.any) {
            return this.evaluateAnyConditions(guard.any, playerData, kpis)
        }
        if (guard.all) {
            return this.evaluateConditions(guard.all, playerData, kpis)
        }
        return false
    }

    private static evaluateConditions(conditions: any[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        return conditions.every(condition => this.evaluateCondition(condition, playerData, kpis))
    }

    private static evaluateAnyConditions(conditions: any[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        return conditions.some(condition => this.evaluateCondition(condition, playerData, kpis))
    }

    private static evaluateCondition(condition: any, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        const kpiName = condition.kpi
        const value = this.getKPIValue(kpiName, playerData, kpis)
        const targetValue = this.resolveValue(condition.value, playerData, kpis)

        switch (condition.op) {
            case 'lt':
                return value < targetValue
            case 'lte':
                return value <= targetValue
            case 'eq':
                return value === targetValue
            case 'gte':
                return value >= targetValue
            case 'gt':
                return value > targetValue
            case 'ltDynamic':
                return this.evaluateDynamicCondition(condition, playerData, kpis)
            default:
                return false
        }
    }

    private static resolveValue(value: any, playerData: ComputedPlayerData, kpis: ComputedKPI[]): number {
        if (typeof value === 'object' && value.$ref) {
            const path = value.$ref.split('.')
            let current: any = RULESET
            for (const key of path) {
                current = current[key]
            }
            return current as number
        }
        return value
    }

    private static evaluateDynamicCondition(condition: any, playerData: ComputedPlayerData, kpis: ComputedKPI[]): boolean {
        if (condition.formula) {
            const formula = condition.formula
            const matchMinutes = playerData.match_minutes
            const visionBaseDivisor = RULESET.thresholds.visionBaseDivisor

            // Simple formula evaluation
            if (formula.includes('ceil(match_minutes / thresholds.visionBaseDivisor)')) {
                const expectedObs = Math.ceil(matchMinutes / visionBaseDivisor)
                return playerData.obs < expectedObs
            }
        }
        return false
    }

    private static getKPIValue(kpiName: string, playerData: ComputedPlayerData, kpis: ComputedKPI[]): number {
        // Handle benchmark KPIs
        if (kpiName.startsWith('benchmarks.')) {
            const benchmarkKey = kpiName.replace('benchmarks.', '').replace('.pct', '')
            const kpi = kpis.find(k => k.name.toLowerCase().includes(benchmarkKey.toLowerCase()))
            return kpi?.percentile ? kpi.percentile / 100 : 0.5 // Convert to 0-1 scale
        }

        // Map KPI names to player data properties
        const kpiMap: { [key: string]: number } = {
            'first_core_s': playerData.first_core_s,
            'deaths_per10': playerData.deaths_per10,
            'kpct': playerData.kpct,
            'obs': playerData.obs,
            'sentries': playerData.sentries,
            'stacks': playerData.stacks,
            'smokes_used': playerData.smokes_used,
            'match_minutes': playerData.match_minutes,
            'role': 0, // Special handling for string comparison

            // New carry-specific KPIs (with fallbacks)
            'early_deaths_0_10': playerData.early_deaths_0_10 || 0,
            'early_deaths_0_15': playerData.early_deaths_0_15 || 0,
            'idle_time_30s': playerData.idle_time_30s || 0,
            'last_hits_10': playerData.last_hits_10 || playerData.lh_10 || 0,
            'denies_10': playerData.denies_10 || 0,
            'gpm_10': playerData.gpm_10 || 0,
            'xpm_10': playerData.xpm_10 || 0
        }

        return kpiMap[kpiName] || 0
    }

    private static applyRule(rule: any, playerData: ComputedPlayerData, kpis: ComputedKPI[], isRoleSpecific: boolean = false): Fix | Win | null {
        if (!rule.advice) return null

        const confidence = this.calculateConfidence(rule, playerData, kpis, isRoleSpecific)

        const baseResult = {
            title: rule.advice.title,
            description: rule.advice.detail,
            confidence
        }

        if (rule.type === 'win') {
            return {
                ...baseResult,
                kpi: this.getPrimaryKPI(rule)
            } as Win
        } else {
            return {
                ...baseResult,
                priority: this.calculatePriority(rule, playerData),
                category: this.getCategory(rule)
            } as Fix
        }
    }

    private static calculateConfidence(rule: any, playerData: ComputedPlayerData, kpis: ComputedKPI[], isRoleSpecific: boolean = false): number {
        let confidence = RULESET.confidence.basePerCondition * (rule.all?.length || 1)

        // Add big gap bonus
        if (rule.bigGap) {
            const kpiValue = this.getKPIValue(rule.bigGap.kpi, playerData, kpis)
            const threshold = this.resolveValue(rule.bigGap.over, playerData, kpis)
            if (kpiValue > threshold) {
                confidence += RULESET.confidence.bigGapBonus
            }
        }

        // Apply guard penalties
        if (rule.guardsRef) {
            confidence -= RULESET.confidence.guardPenalty * rule.guardsRef.length
        }

        // Add role-specific bonus
        if (isRoleSpecific) {
            confidence += RULESET.confidence.roleSpecificBonus
        }

        return confidence
    }

    private static sortByConfidenceAndPriority<T extends { confidence?: number; title?: string }>(items: T[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): T[] {
        const rolePriority = (RULESET.selection.roleSpecificPriority as any)[playerData.role] || []

        return items.sort((a, b) => {
            const aConf = a.confidence || 0
            const bConf = b.confidence || 0

            // First sort by confidence
            if (Math.abs(aConf - bConf) > 0.5) {
                return bConf - aConf
            }

            // Then by role-specific priority
            const aPriority = rolePriority.findIndex((id: string) => a.title?.toLowerCase().includes(id.replace(/_/g, ' ')))
            const bPriority = rolePriority.findIndex((id: string) => b.title?.toLowerCase().includes(id.replace(/_/g, ' ')))

            if (aPriority !== -1 && bPriority !== -1) {
                return aPriority - bPriority
            }
            if (aPriority !== -1) return -1
            if (bPriority !== -1) return 1

            return 0
        })
    }

    private static sortByConfidence<T extends { confidence?: number }>(items: T[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): T[] {
        return items.sort((a, b) => {
            const aConf = a.confidence || 0
            const bConf = b.confidence || 0
            return bConf - aConf
        })
    }

    private static ensureFixCount(fixes: Fix[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): Fix[] {
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

    private static ensureWinCount(wins: Win[], playerData: ComputedPlayerData, kpis: ComputedKPI[]): Win[] {
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

    private static getPrimaryKPI(rule: any): string {
        if (rule.all && rule.all.length > 0 && rule.all[0]) {
            return rule.all[0].kpi ?? 'general'
        }
        return 'general'
    }

    private static calculatePriority(rule: any, playerData: ComputedPlayerData): number {
        if (rule.id.includes('deaths')) return 1
        if (rule.id.includes('core')) return 2
        if (rule.id.includes('vision')) return 3
        return 4
    }

    private static getCategory(rule: any): string {
        if (rule.id.includes('deaths')) return 'positioning'
        if (rule.id.includes('core')) return 'timing'
        if (rule.id.includes('vision')) return 'support'
        if (rule.id.includes('tower')) return 'objectives'
        if (rule.id.includes('carry_')) return 'carry_specific'
        return 'general'
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