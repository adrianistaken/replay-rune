import type { StratzPlayer, StratzHeroAverage, BracketAveragesCache } from '~/types'
import type { BenchmarkComparison, LaningPhaseComparison, LaningPhaseData, MidGameData, SupportData } from './mvpBenchmarkEngine'

export class DynamicAnalysisEngine {
    /**
     * Recalculates analysis data based on new bracket grouping and time
     */
    static recalculateAnalysis(
        player: StratzPlayer,
        matchDurationSeconds: number,
        bracketAveragesCache: BracketAveragesCache,
        bracketGrouping: string,
        timeMinutes: number
    ): {
        comparisons: BenchmarkComparison[]
        laningPhase: LaningPhaseData
        midGame: MidGameData
        support: SupportData
        summary: string
    } {
        // Get bracket averages data for the specified time
        const bracketData = this.getBracketAveragesAtTime(
            bracketAveragesCache,
            player.hero.id,
            player.position,
            bracketGrouping,
            timeMinutes
        )

        if (!bracketData) {
            console.warn(`No bracket averages data available for ${bracketGrouping} at ${timeMinutes} minutes`)
            // Return a fallback analysis with zero values
            return this.getFallbackAnalysis(player.hero.displayName, timeMinutes)
        }

        // Calculate comparisons using bracket data
        const comparisons = this.calculateComparisons(player, bracketData.data, matchDurationSeconds, timeMinutes)

        // Calculate laning phase data (always at 10 minutes)
        const laningPhase = this.calculateLaningPhase(player, bracketAveragesCache, bracketGrouping, matchDurationSeconds)

        // Calculate mid game data at the specified time
        const midGame = this.calculateMidGame(player, bracketAveragesCache, bracketGrouping, timeMinutes, matchDurationSeconds)

        // Calculate support data at the specified time
        const support = this.calculateSupport(player, bracketAveragesCache, bracketGrouping, timeMinutes)

        // Generate summary
        const summary = this.generateSummary(comparisons, player.hero.displayName)

        return {
            comparisons,
            laningPhase,
            midGame,
            support,
            summary
        }
    }

    /**
     * Gets bracket averages data for a specific time
     */
    private static getBracketAveragesAtTime(
        bracketAveragesCache: BracketAveragesCache,
        heroId: number,
        position: string,
        bracketGrouping: string,
        timeMinutes: number
    ): { data: StratzHeroAverage; matchCount: number } | null {
        const key = `${heroId}-${position}-${bracketGrouping}`
        const bracketData = bracketAveragesCache[key]

        if (!bracketData || !bracketData.data || bracketData.data.length === 0) {
            return null
        }

        // Find data at or before the specified time (like the match count logic)
        let timeData = null
        let isPastAvailableData = false

        // First, try to find data at or before the specified time
        const dataAtOrBefore = bracketData.data
            .filter(data => data.time <= timeMinutes)
            .sort((a, b) => b.time - a.time) // Sort by time descending to get the latest available data

        if (dataAtOrBefore.length > 0) {
            timeData = dataAtOrBefore[0] // Use the latest data at or before the specified time
        } else {
            // If no data at or before the specified time, use the latest available data
            timeData = bracketData.data
                .sort((a, b) => b.time - a.time)[0]
            isPastAvailableData = true
        }

        if (!timeData) {
            return null
        }

        // Log the average data being used for comparison
        if (timeData.matchCount > 0) {
            console.log(`📊 Comparing against ${bracketGrouping} averages at ${timeData.time}min:`, {
                matches: timeData.matchCount,
                time: timeData.time,
                kills: timeData.kills?.toFixed(1) || 0,
                deaths: timeData.deaths?.toFixed(1) || 0,
                networth: timeData.networth?.toFixed(0) || 0,
                level: timeData.level?.toFixed(1) || 0,
                cs: timeData.cs?.toFixed(1) || 0,
                denies: timeData.dn?.toFixed(1) || 0,
                heroDamage: timeData.heroDamage?.toFixed(0) || 0,
                towerDamage: timeData.towerDamage?.toFixed(0) || 0,
                gpm: timeData.goldPerMinute?.toFixed(1) || 0,
                xpm: timeData.xp?.toFixed(1) || 0
            })
        }

        return {
            data: timeData,
            matchCount: timeData.matchCount
        }
    }

    /**
     * Calculates benchmark comparisons using bracket data
     */
    private static calculateComparisons(
        player: StratzPlayer,
        heroAverage: StratzHeroAverage,
        matchDurationSeconds: number,
        timeMinutes: number
    ): BenchmarkComparison[] {
        const comparisons: BenchmarkComparison[] = []
        const matchMinutes = matchDurationSeconds / 60

        // Calculate player values at the specified time
        const playerValues = this.getPlayerValuesAtTime(player, timeMinutes, matchDurationSeconds)
        const averageValues = this.getAverageValuesAtTime(heroAverage, timeMinutes)

        // Kills comparison
        comparisons.push({
            metric: 'kills',
            playerValue: playerValues.kills,
            averageValue: averageValues.kills,
            difference: playerValues.kills - averageValues.kills,
            percentageDiff: averageValues.kills > 0 ? ((playerValues.kills - averageValues.kills) / averageValues.kills) * 100 : 0,
            displayName: 'Kills',
            unit: ''
        })

        // Deaths comparison
        comparisons.push({
            metric: 'deaths',
            playerValue: playerValues.deaths,
            averageValue: averageValues.deaths,
            difference: playerValues.deaths - averageValues.deaths,
            percentageDiff: averageValues.deaths > 0 ? ((playerValues.deaths - averageValues.deaths) / averageValues.deaths) * 100 : 0,
            displayName: 'Deaths',
            unit: ''
        })

        // Networth comparison
        comparisons.push({
            metric: 'networth',
            playerValue: playerValues.networth,
            averageValue: averageValues.networth,
            difference: playerValues.networth - averageValues.networth,
            percentageDiff: averageValues.networth > 0 ? ((playerValues.networth - averageValues.networth) / averageValues.networth) * 100 : 0,
            displayName: 'Networth',
            unit: ''
        })

        // Level comparison
        comparisons.push({
            metric: 'level',
            playerValue: playerValues.level,
            averageValue: averageValues.level,
            difference: playerValues.level - averageValues.level,
            percentageDiff: averageValues.level > 0 ? ((playerValues.level - averageValues.level) / averageValues.level) * 100 : 0,
            displayName: 'Level',
            unit: ''
        })

        // CS comparison
        comparisons.push({
            metric: 'cs',
            playerValue: playerValues.cs,
            averageValue: averageValues.cs,
            difference: playerValues.cs - averageValues.cs,
            percentageDiff: averageValues.cs > 0 ? ((playerValues.cs - averageValues.cs) / averageValues.cs) * 100 : 0,
            displayName: 'CS',
            unit: ''
        })

        // Denies comparison
        comparisons.push({
            metric: 'denies',
            playerValue: playerValues.denies,
            averageValue: averageValues.denies,
            difference: playerValues.denies - averageValues.denies,
            percentageDiff: averageValues.denies > 0 ? ((playerValues.denies - averageValues.denies) / averageValues.denies) * 100 : 0,
            displayName: 'Denies',
            unit: ''
        })

        // Hero Damage comparison
        comparisons.push({
            metric: 'heroDamage',
            playerValue: playerValues.heroDamage,
            averageValue: averageValues.heroDamage,
            difference: playerValues.heroDamage - averageValues.heroDamage,
            percentageDiff: averageValues.heroDamage > 0 ? ((playerValues.heroDamage - averageValues.heroDamage) / averageValues.heroDamage) * 100 : 0,
            displayName: 'Hero Damage',
            unit: ''
        })

        // Tower Damage comparison
        comparisons.push({
            metric: 'towerDamage',
            playerValue: playerValues.towerDamage,
            averageValue: averageValues.towerDamage,
            difference: playerValues.towerDamage - averageValues.towerDamage,
            percentageDiff: averageValues.towerDamage > 0 ? ((playerValues.towerDamage - averageValues.towerDamage) / averageValues.towerDamage) * 100 : 0,
            displayName: 'Tower Damage',
            unit: ''
        })

        // GPM comparison
        comparisons.push({
            metric: 'gpm',
            playerValue: playerValues.gpm,
            averageValue: averageValues.gpm,
            difference: playerValues.gpm - averageValues.gpm,
            percentageDiff: averageValues.gpm > 0 ? ((playerValues.gpm - averageValues.gpm) / averageValues.gpm) * 100 : 0,
            displayName: 'GPM',
            unit: ''
        })

        // XPM comparison
        comparisons.push({
            metric: 'xpm',
            playerValue: playerValues.xpm,
            averageValue: averageValues.xpm,
            difference: playerValues.xpm - averageValues.xpm,
            percentageDiff: averageValues.xpm > 0 ? ((playerValues.xpm - averageValues.xpm) / averageValues.xpm) * 100 : 0,
            displayName: 'XPM',
            unit: ''
        })

        // Camps Stacked comparison
        comparisons.push({
            metric: 'campsStacked',
            playerValue: playerValues.campsStacked,
            averageValue: averageValues.campsStacked,
            difference: playerValues.campsStacked - averageValues.campsStacked,
            percentageDiff: averageValues.campsStacked > 0 ? ((playerValues.campsStacked - averageValues.campsStacked) / averageValues.campsStacked) * 100 : 0,
            displayName: 'Camps Stacked',
            unit: ''
        })

        return comparisons
    }

    /**
     * Gets player values at a specific time
     */
    private static getPlayerValuesAtTime(player: StratzPlayer, timeMinutes: number, matchDurationSeconds: number): any {
        const matchMinutes = matchDurationSeconds / 60
        const timeIndex = Math.floor(timeMinutes)

        // Calculate CS at time
        let cs = 0
        if (player.stats?.lastHitsPerMinute && player.stats.lastHitsPerMinute.length > timeIndex) {
            cs = player.stats.lastHitsPerMinute
                .slice(0, timeIndex + 1)
                .reduce((sum, value) => sum + (value || 0), 0)
        } else {
            // Fallback estimation
            cs = Math.round((player.numLastHits || 0) * (timeMinutes / matchMinutes))
        }

        // Calculate denies at time
        let denies = 0
        if (player.stats?.deniesPerMinute && player.stats.deniesPerMinute.length > timeIndex) {
            denies = player.stats.deniesPerMinute
                .slice(0, timeIndex + 1)
                .reduce((sum, value) => sum + (value || 0), 0)
        } else {
            // Fallback estimation
            denies = Math.round((player.numDenies || 0) * (timeMinutes / matchMinutes))
        }

        // Calculate networth at time
        let networth = 0
        if (player.stats?.networthPerMinute && player.stats.networthPerMinute.length > timeIndex) {
            networth = player.stats.networthPerMinute[timeIndex] || 0
        } else {
            // Fallback estimation
            networth = Math.round((player.networth || 0) * (timeMinutes / matchMinutes))
        }

        // Calculate level at time
        let level = 0
        if (player.stats?.level && player.stats.level.length > timeIndex) {
            level = player.stats.level[timeIndex] || 0
        } else {
            // Fallback estimation
            level = Math.min(25, Math.floor((player.level || 0) * (timeMinutes / matchMinutes)))
        }

        // Calculate camps stacked at time
        let campsStacked = 0
        if (player.stats?.campStack && player.stats.campStack.length > timeIndex) {
            campsStacked = player.stats.campStack[timeIndex] || 0
        } else {
            // Fallback estimation
            campsStacked = Math.round((player.stats?.campStack?.[player.stats.campStack.length - 1] || 0) * (timeMinutes / matchMinutes))
        }

        return {
            kills: Math.round((player.kills || 0) * (timeMinutes / matchMinutes)),
            deaths: Math.round((player.deaths || 0) * (timeMinutes / matchMinutes)),
            networth,
            level,
            cs,
            denies,
            heroDamage: Math.round((player.heroDamage || 0) * (timeMinutes / matchMinutes)),
            towerDamage: Math.round((player.towerDamage || 0) * (timeMinutes / matchMinutes)),
            gpm: (networth / timeMinutes) * 60,
            xpm: (player.experiencePerMinute || 0) * (timeMinutes / matchMinutes),
            campsStacked
        }
    }

    /**
     * Gets average values at a specific time from bracket data
     * Note: The bracket data already contains values for the specific time, no scaling needed
     */
    private static getAverageValuesAtTime(heroAverage: StratzHeroAverage, timeMinutes: number): any {
        return {
            kills: heroAverage.kills || 0,
            deaths: heroAverage.deaths || 0,
            networth: heroAverage.networth || 0,
            level: heroAverage.level || 0,
            cs: heroAverage.cs || 0,
            denies: heroAverage.dn || 0,
            heroDamage: heroAverage.heroDamage || 0,
            towerDamage: heroAverage.towerDamage || 0,
            gpm: heroAverage.goldPerMinute || 0,
            xpm: heroAverage.xp || 0,
            campsStacked: heroAverage.campsStacked || 0
        }
    }

    /**
     * Calculates laning phase data (always at 10 minutes)
     */
    private static calculateLaningPhase(
        player: StratzPlayer,
        bracketAveragesCache: BracketAveragesCache,
        bracketGrouping: string,
        matchDurationSeconds: number
    ): LaningPhaseData {
        const bracketData = this.getBracketAveragesAtTime(
            bracketAveragesCache,
            player.hero.id,
            player.position,
            bracketGrouping,
            10
        )

        if (!bracketData) {
            return {
                csComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                deniesComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Laning phase data not available for this bracket.'
            }
        }

        // Calculate CS @ 10 mins
        const playerCsAt10 = this.getPlayerValuesAtTime(player, 10, matchDurationSeconds).cs
        const averageCsAt10 = bracketData.data.cs || 0

        const csComparison: LaningPhaseComparison = {
            playerValue: playerCsAt10,
            averageValue: averageCsAt10,
            difference: playerCsAt10 - averageCsAt10,
            percentageDiff: averageCsAt10 > 0 ? ((playerCsAt10 - averageCsAt10) / averageCsAt10) * 100 : 0
        }

        // Calculate Denies @ 10 mins
        const playerDeniesAt10 = this.getPlayerValuesAtTime(player, 10, matchDurationSeconds).denies
        const averageDeniesAt10 = bracketData.data.dn || 0

        const deniesComparison: LaningPhaseComparison = {
            playerValue: playerDeniesAt10,
            averageValue: averageDeniesAt10,
            difference: playerDeniesAt10 - averageDeniesAt10,
            percentageDiff: averageDeniesAt10 > 0 ? ((playerDeniesAt10 - averageDeniesAt10) / averageDeniesAt10) * 100 : 0
        }

        // Generate summary
        const summary = this.generateLaningPhaseSummary(csComparison, deniesComparison)

        return {
            csComparison,
            deniesComparison,
            summary
        }
    }

    /**
     * Calculates mid game data at the specified time
     */
    private static calculateMidGame(
        player: StratzPlayer,
        bracketAveragesCache: BracketAveragesCache,
        bracketGrouping: string,
        timeMinutes: number,
        matchDurationSeconds: number
    ): MidGameData {
        const bracketData = this.getBracketAveragesAtTime(
            bracketAveragesCache,
            player.hero.id,
            player.position,
            bracketGrouping,
            timeMinutes
        )

        if (!bracketData) {
            return {
                networthComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                lastHitsComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Mid game data not available for this bracket.',
                midGameMinute: timeMinutes
            }
        }

        // Calculate Net Worth at time
        const playerValues = this.getPlayerValuesAtTime(player, timeMinutes, matchDurationSeconds)
        const averageValues = this.getAverageValuesAtTime(bracketData.data, timeMinutes)

        const networthComparison: LaningPhaseComparison = {
            playerValue: playerValues.networth,
            averageValue: averageValues.networth,
            difference: playerValues.networth - averageValues.networth,
            percentageDiff: averageValues.networth > 0 ? ((playerValues.networth - averageValues.networth) / averageValues.networth) * 100 : 0
        }

        // Calculate Last Hits at time
        const lastHitsComparison: LaningPhaseComparison = {
            playerValue: playerValues.cs,
            averageValue: averageValues.cs,
            difference: playerValues.cs - averageValues.cs,
            percentageDiff: averageValues.cs > 0 ? ((playerValues.cs - averageValues.cs) / averageValues.cs) * 100 : 0
        }

        // Generate summary
        const summary = this.generateMidGameSummary(networthComparison, lastHitsComparison, timeMinutes)

        return {
            networthComparison,
            lastHitsComparison,
            summary,
            midGameMinute: timeMinutes
        }
    }

    /**
     * Calculates support data at the specified time
     */
    private static calculateSupport(
        player: StratzPlayer,
        bracketAveragesCache: BracketAveragesCache,
        bracketGrouping: string,
        timeMinutes: number
    ): SupportData {
        const bracketData = this.getBracketAveragesAtTime(
            bracketAveragesCache,
            player.hero.id,
            player.position,
            bracketGrouping,
            timeMinutes
        )

        if (!bracketData) {
            return {
                campsStackedComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
                summary: 'Support data not available for this bracket.'
            }
        }

        // Calculate Camps Stacked at time
        const playerValues = this.getPlayerValuesAtTime(player, timeMinutes, 0) // matchDuration not needed for camps
        const averageValues = this.getAverageValuesAtTime(bracketData.data, timeMinutes)

        const campsStackedComparison: LaningPhaseComparison = {
            playerValue: playerValues.campsStacked,
            averageValue: averageValues.campsStacked,
            difference: playerValues.campsStacked - averageValues.campsStacked,
            percentageDiff: averageValues.campsStacked > 0 ? ((playerValues.campsStacked - averageValues.campsStacked) / averageValues.campsStacked) * 100 : 0
        }

        // Generate summary
        const summary = this.generateSupportSummary(campsStackedComparison)

        return {
            campsStackedComparison,
            summary
        }
    }

    /**
     * Generates laning phase summary
     */
    private static generateLaningPhaseSummary(csComparison: LaningPhaseComparison, deniesComparison: LaningPhaseComparison): string {
        const csAbove = csComparison.percentageDiff > 0
        const deniesAbove = deniesComparison.percentageDiff > 0

        if (csAbove && deniesAbove) {
            return `Strong laning performance! You exceeded average CS and denies at 10 minutes, showing excellent last-hitting and lane control.`
        } else if (csAbove && !deniesAbove) {
            return `Good CS performance at 10 minutes, but consider focusing more on denying creeps to gain lane advantage.`
        } else if (!csAbove && deniesAbove) {
            return `Solid deny performance, but work on improving your last-hitting to maximize your gold income during laning.`
        } else {
            return `Laning phase needs improvement. Focus on both last-hitting and denying to gain better lane control and farm efficiency.`
        }
    }

    /**
     * Generates mid game summary
     */
    private static generateMidGameSummary(networthComparison: LaningPhaseComparison, lastHitsComparison: LaningPhaseComparison, timeMinutes: number): string {
        const networthAbove = networthComparison.percentageDiff > 0
        const lastHitsAbove = lastHitsComparison.percentageDiff > 0

        if (networthAbove && lastHitsAbove) {
            return `Excellent mid game performance! You exceeded average net worth and last hits at ${timeMinutes} minutes, showing strong farming and item progression.`
        } else if (networthAbove && !lastHitsAbove) {
            return `Good net worth progression at ${timeMinutes} minutes, but consider improving your last hitting to maximize your gold income during mid game.`
        } else if (!networthAbove && lastHitsAbove) {
            return `Solid last hitting performance, but work on converting your farm into better item timings and net worth efficiency.`
        } else {
            return `Mid game needs improvement. Focus on both farming efficiency and item progression to gain better map control and teamfight presence.`
        }
    }

    /**
     * Generates support summary
     */
    private static generateSupportSummary(campsStackedComparison: LaningPhaseComparison): string {
        const campsStackedAbove = campsStackedComparison.percentageDiff > 0

        if (campsStackedAbove) {
            return `Excellent support performance! You stacked more camps than average, showing strong map control and team support.`
        } else {
            return `Consider improving your camp stacking to better support your team's farming and map control.`
        }
    }

    /**
     * Generates overall summary
     */
    private static generateSummary(comparisons: BenchmarkComparison[], heroName: string): string {
        const aboveAverage = comparisons.filter(c => c.percentageDiff > 0)
        const belowAverage = comparisons.filter(c => c.percentageDiff < 0)

        const aboveCount = aboveAverage.length
        const belowCount = belowAverage.length

        if (aboveCount > belowCount) {
            return `${heroName} performed above average in ${aboveCount} out of ${comparisons.length} key metrics. Strong performance overall!`
        } else if (belowCount > aboveCount) {
            return `${heroName} performed below average in ${belowCount} out of ${comparisons.length} key metrics. There's room for improvement.`
        } else {
            return `${heroName} had a mixed performance, with some metrics above and some below average.`
        }
    }

    /**
     * Returns fallback analysis when bracket data is not available
     */
    private static getFallbackAnalysis(heroName: string, timeMinutes: number): {
        comparisons: BenchmarkComparison[]
        laningPhase: LaningPhaseData
        midGame: MidGameData
        support: SupportData
        summary: string
    } {
        const emptyComparison: LaningPhaseComparison = {
            playerValue: 0,
            averageValue: 0,
            difference: 0,
            percentageDiff: 0
        }

        return {
            comparisons: [],
            laningPhase: {
                csComparison: emptyComparison,
                deniesComparison: emptyComparison,
                summary: `No comparison data available for this bracket at ${timeMinutes} minutes.`
            },
            midGame: {
                networthComparison: emptyComparison,
                lastHitsComparison: emptyComparison,
                summary: `No comparison data available for this bracket at ${timeMinutes} minutes.`,
                midGameMinute: timeMinutes
            },
            support: {
                campsStackedComparison: emptyComparison,
                summary: `No comparison data available for this bracket at ${timeMinutes} minutes.`
            },
            summary: `No comparison data available for ${heroName} at ${timeMinutes} minutes for this bracket.`
        }
    }
}
