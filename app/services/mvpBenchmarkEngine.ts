import type { StratzMatch, StratzPlayer, StratzHeroAverage } from '~/types'

export interface BenchmarkComparison {
    metric: string
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
    displayName: string
    unit: string
}

export interface LaningPhaseComparison {
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
}

export interface LaningPhaseData {
    csComparison: LaningPhaseComparison
    deniesComparison: LaningPhaseComparison
    summary: string
}

export interface MidGameData {
    networthComparison: LaningPhaseComparison
    lastHitsComparison: LaningPhaseComparison
    summary: string
    midGameMinute: number
}

export interface SupportData {
    campsStackedComparison: LaningPhaseComparison
    summary: string
}

export interface MVPBenchmarkReport {
    summary: string
    comparisons: BenchmarkComparison[]
    laningPhase: LaningPhaseData
    midGame: MidGameData
    support: SupportData
}

export class MVPBenchmarkEngine {
    static analyze(matchData: StratzMatch, playerSlot: number): MVPBenchmarkReport {
        const player = matchData.players.find(p => p.playerSlot === playerSlot)

        if (!player) {
            console.error('Player not found for slot:', playerSlot)
            throw new Error(`Player with slot ${playerSlot} not found`)
        }

        // Get hero average data for the player's hero and position
        const heroAverage = this.getHeroAverageData(matchData, player)
        console.log('Hero average data:', heroAverage)

        if (!heroAverage) {
            console.error('No hero average data available')
            throw new Error('No hero average data available for this hero and position')
        }

        // Calculate all benchmark comparisons
        const comparisons = this.calculateComparisons(player, heroAverage, matchData.durationSeconds)
        console.log('Calculated comparisons:', comparisons.length)

        // Get 10-minute hero average data for laning phase
        const heroAverageAt10 = this.getHeroAverageDataAt10(matchData, player)

        // Calculate laning phase data
        const laningPhase = heroAverageAt10 ? this.calculateLaningPhase(player, heroAverageAt10, matchData.durationSeconds) : {
            csComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
            deniesComparison: { playerValue: 0, averageValue: 0, difference: 0, percentageDiff: 0 },
            summary: 'Laning phase data not available.'
        }
        console.log('Calculated laning phase:', laningPhase)
        console.log('Hero average at 10:', heroAverageAt10)

        // Calculate mid game data
        const midGame = this.calculateMidGame(player, matchData.durationSeconds)
        console.log('Calculated mid game:', midGame)

        // Calculate support data
        const support = this.calculateSupport(player)
        console.log('Calculated support:', support)

        // Generate summary
        const summary = this.generateSummary(comparisons, player.hero.displayName)
        console.log('Generated summary:', summary)

        return {
            summary,
            comparisons,
            laningPhase,
            midGame,
            support
        }
    }

    private static getHeroAverageData(matchData: StratzMatch, player: StratzPlayer): StratzHeroAverage | null {
        // Check if player has heroAverage data
        if (!player.heroAverage || player.heroAverage.length === 0) {
            console.log('No heroAverage data found for player, using mock data')
            // Fallback to mock data if no heroAverage is available
            const matchMinutes = Math.floor(matchData.durationSeconds / 60)

            const mockHeroAverage: StratzHeroAverage = {
                heroId: player.hero.id,
                week: 2904,
                time: matchMinutes,
                position: player.position,
                bracketBasicIds: null,
                matchCount: 4168,
                remainingMatchCount: 4168,
                winCount: 1833,
                mvp: 0.05,
                topCore: 0.14,
                topSupport: 0,
                courierKills: 0.08,
                apm: 160.54,
                goldPerMinute: null,
                xp: 21642.07,
                kills: 6.13,
                deaths: 6.91,
                networth: 15419.45,
                level: 19.35,
                cs: 181.46,
                dn: 7.45,
                healingSelf: 0.4,
                healingAllies: 0.04,
                campsStacked: 0.4,
                damage: 24055.35,
                heroDamage: 21879.84,
                towerDamage: 135.0,
                supportGold: 81.56,
                casts: 232.07,
                abilityCasts: 119.66,
                goldFed: 4646.5,
                goldLost: -1294.87
            }

            return mockHeroAverage
        }

        // Find the heroAverage entry with the highest time value (end of game)
        const heroAverageArray = player.heroAverage
        const finalHeroAverage = heroAverageArray.reduce((latest, current) => {
            return current.time > latest.time ? current : latest
        })

        console.log('Using heroAverage data at time:', finalHeroAverage.time, 'for final stats')
        console.log('Final kills average:', finalHeroAverage.kills)
        console.log('Final XP average:', finalHeroAverage.xp, 'at time:', finalHeroAverage.time)
        console.log('XPM calculation: (', finalHeroAverage.xp, '/', finalHeroAverage.time, ') =', finalHeroAverage.xp / finalHeroAverage.time)

        return finalHeroAverage
    }

    private static getHeroAverageDataAt10(matchData: StratzMatch, player: StratzPlayer): StratzHeroAverage | null {
        // Check if player has heroAverage data
        if (!player.heroAverage || player.heroAverage.length === 0) {
            console.log('No heroAverage data found for player, using mock data for 10-minute mark')
            // Fallback to mock data if no heroAverage is available
            const mockHeroAverageAt10: StratzHeroAverage = {
                heroId: player.hero.id,
                week: 2904,
                time: 10,
                position: player.position,
                bracketBasicIds: null,
                matchCount: 4168,
                remainingMatchCount: 4168,
                winCount: 1833,
                mvp: 0.05,
                topCore: 0.14,
                topSupport: 0,
                courierKills: 0.08,
                apm: 160.54,
                goldPerMinute: null,
                xp: 2164.21, // Roughly 10% of final XP
                kills: 0.61, // Roughly 10% of final kills
                deaths: 0.69, // Roughly 10% of final deaths
                networth: 1541.95, // Roughly 10% of final networth
                level: 1.94, // Roughly 10% of final level
                cs: 18.15, // Roughly 10% of final CS
                dn: 0.75, // Roughly 10% of final denies
                healingSelf: 0.04,
                healingAllies: 0.004,
                campsStacked: 0.04,
                damage: 2405.54, // Roughly 10% of final damage
                heroDamage: 2187.98, // Roughly 10% of final hero damage
                towerDamage: 13.5, // Roughly 10% of final tower damage
                supportGold: 8.16, // Roughly 10% of final support gold
                casts: 23.21, // Roughly 10% of final casts
                abilityCasts: 11.97, // Roughly 10% of final ability casts
                goldFed: 464.65, // Roughly 10% of final gold fed
                goldLost: -129.49 // Roughly 10% of final gold lost
            }

            return mockHeroAverageAt10
        }

        // Find the heroAverage entry at time 10 (10th minute)
        console.log('Available heroAverage times:', player.heroAverage.map(entry => entry.time))
        const heroAverageAt10 = player.heroAverage.find(entry => entry.time === 10)

        if (heroAverageAt10) {
            console.log('Using heroAverage data at time 10 for laning phase')
            console.log('10-minute data:', heroAverageAt10)
            return heroAverageAt10
        }

        // If no 10-minute data found, use the first available entry as fallback
        console.log('No 10-minute heroAverage data found, using first available entry')
        const fallbackEntry = player.heroAverage[0] || null
        console.log('Fallback entry:', fallbackEntry)
        return fallbackEntry
    }

    private static calculateComparisons(player: StratzPlayer, heroAverage: StratzHeroAverage, matchDurationSeconds: number): BenchmarkComparison[] {
        const comparisons: BenchmarkComparison[] = []
        const matchMinutes = matchDurationSeconds / 60

        // Kills comparison
        comparisons.push({
            metric: 'kills',
            playerValue: player.kills || 0,
            averageValue: heroAverage.kills || 0,
            difference: (player.kills || 0) - (heroAverage.kills || 0),
            percentageDiff: (heroAverage.kills || 0) > 0 ? (((player.kills || 0) - (heroAverage.kills || 0)) / (heroAverage.kills || 0)) * 100 : 0,
            displayName: 'Kills',
            unit: ''
        })

        // Deaths comparison
        comparisons.push({
            metric: 'deaths',
            playerValue: player.deaths || 0,
            averageValue: heroAverage.deaths || 0,
            difference: (player.deaths || 0) - (heroAverage.deaths || 0),
            percentageDiff: (heroAverage.deaths || 0) > 0 ? (((player.deaths || 0) - (heroAverage.deaths || 0)) / (heroAverage.deaths || 0)) * 100 : 0,
            displayName: 'Deaths',
            unit: ''
        })

        // Networth comparison
        comparisons.push({
            metric: 'networth',
            playerValue: player.networth || 0,
            averageValue: heroAverage.networth || 0,
            difference: (player.networth || 0) - (heroAverage.networth || 0),
            percentageDiff: (heroAverage.networth || 0) > 0 ? (((player.networth || 0) - (heroAverage.networth || 0)) / (heroAverage.networth || 0)) * 100 : 0,
            displayName: 'Networth',
            unit: ''
        })

        // Level comparison (use direct level field from player)
        comparisons.push({
            metric: 'level',
            playerValue: player.level || 0,
            averageValue: heroAverage.level || 0,
            difference: (player.level || 0) - (heroAverage.level || 0),
            percentageDiff: (heroAverage.level || 0) > 0 ? (((player.level || 0) - (heroAverage.level || 0)) / (heroAverage.level || 0)) * 100 : 0,
            displayName: 'Level',
            unit: ''
        })

        // CS (Last Hits) comparison
        comparisons.push({
            metric: 'cs',
            playerValue: player.numLastHits || 0,
            averageValue: heroAverage.cs || 0,
            difference: (player.numLastHits || 0) - (heroAverage.cs || 0),
            percentageDiff: (heroAverage.cs || 0) > 0 ? (((player.numLastHits || 0) - (heroAverage.cs || 0)) / (heroAverage.cs || 0)) * 100 : 0,
            displayName: 'CS',
            unit: ''
        })

        // Denies comparison
        comparisons.push({
            metric: 'denies',
            playerValue: player.numDenies || 0,
            averageValue: heroAverage.dn || 0,
            difference: (player.numDenies || 0) - (heroAverage.dn || 0),
            percentageDiff: (heroAverage.dn || 0) > 0 ? (((player.numDenies || 0) - (heroAverage.dn || 0)) / (heroAverage.dn || 0)) * 100 : 0,
            displayName: 'Denies',
            unit: ''
        })

        // Hero Damage comparison
        comparisons.push({
            metric: 'heroDamage',
            playerValue: player.heroDamage || 0,
            averageValue: heroAverage.heroDamage || 0,
            difference: (player.heroDamage || 0) - (heroAverage.heroDamage || 0),
            percentageDiff: (heroAverage.heroDamage || 0) > 0 ? (((player.heroDamage || 0) - (heroAverage.heroDamage || 0)) / (heroAverage.heroDamage || 0)) * 100 : 0,
            displayName: 'Hero Damage',
            unit: ''
        })

        // Tower Damage comparison
        comparisons.push({
            metric: 'towerDamage',
            playerValue: player.towerDamage || 0,
            averageValue: heroAverage.towerDamage || 0,
            difference: (player.towerDamage || 0) - (heroAverage.towerDamage || 0),
            percentageDiff: (heroAverage.towerDamage || 0) > 0 ? (((player.towerDamage || 0) - (heroAverage.towerDamage || 0)) / (heroAverage.towerDamage || 0)) * 100 : 0,
            displayName: 'Tower Damage',
            unit: ''
        })

        // GPM comparison (calculated from networth and time)
        const playerGpm = player.goldPerMinute || (player.networth / matchMinutes) * 60
        const averageGpm = (heroAverage.networth / heroAverage.time) * 60
        comparisons.push({
            metric: 'gpm',
            playerValue: playerGpm || 0,
            averageValue: averageGpm || 0,
            difference: (playerGpm || 0) - (averageGpm || 0),
            percentageDiff: (averageGpm || 0) > 0 ? (((playerGpm || 0) - (averageGpm || 0)) / (averageGpm || 0)) * 100 : 0,
            displayName: 'GPM',
            unit: ''
        })

        // XPM comparison (calculated from final XP and time from last heroAverage entry)
        const playerXpm = player.experiencePerMinute || 0
        const averageXpm = heroAverage.xp / heroAverage.time
        comparisons.push({
            metric: 'xpm',
            playerValue: playerXpm || 0,
            averageValue: averageXpm || 0,
            difference: (playerXpm || 0) - (averageXpm || 0),
            percentageDiff: (averageXpm || 0) > 0 ? (((playerXpm || 0) - (averageXpm || 0)) / (averageXpm || 0)) * 100 : 0,
            displayName: 'XPM',
            unit: ''
        })

        // Camp Stacking comparison (use last item from campStack array)
        if (player.stats?.campStack) {
            const playerCampsStacked = player.stats.campStack[player.stats.campStack.length - 1] || 0
            comparisons.push({
                metric: 'campsStacked',
                playerValue: playerCampsStacked || 0,
                averageValue: heroAverage.campsStacked || 0,
                difference: (playerCampsStacked || 0) - (heroAverage.campsStacked || 0),
                percentageDiff: (heroAverage.campsStacked || 0) > 0 ? (((playerCampsStacked || 0) - (heroAverage.campsStacked || 0)) / (heroAverage.campsStacked || 0)) * 100 : 0,
                displayName: 'Camps Stacked',
                unit: ''
            })
        }

        return comparisons
    }

    private static calculateLaningPhase(player: StratzPlayer, heroAverage: StratzHeroAverage, matchDurationSeconds?: number): LaningPhaseData {
        console.log('Calculating laning phase for player:', player.hero.displayName)
        console.log('Player stats:', player.stats)
        console.log('Hero average:', heroAverage)
        console.log('Match duration (seconds):', matchDurationSeconds)

        // Calculate CS @ 10 mins
        const playerCsAt10 = this.calculatePlayerCsAt10(player, matchDurationSeconds)
        const averageCsAt10 = this.calculateAverageCsAt10(heroAverage)

        console.log('Player CS @ 10:', playerCsAt10)
        console.log('Average CS @ 10:', averageCsAt10)

        const csComparison: LaningPhaseComparison = {
            playerValue: playerCsAt10,
            averageValue: averageCsAt10,
            difference: playerCsAt10 - averageCsAt10,
            percentageDiff: averageCsAt10 > 0 ? ((playerCsAt10 - averageCsAt10) / averageCsAt10) * 100 : 0
        }

        // Calculate Denies @ 10 mins
        const playerDeniesAt10 = this.calculatePlayerDeniesAt10(player, matchDurationSeconds)
        const averageDeniesAt10 = this.calculateAverageDeniesAt10(heroAverage)

        console.log('Player Denies @ 10:', playerDeniesAt10)
        console.log('Average Denies @ 10:', averageDeniesAt10)

        const deniesComparison: LaningPhaseComparison = {
            playerValue: playerDeniesAt10,
            averageValue: averageDeniesAt10,
            difference: playerDeniesAt10 - averageDeniesAt10,
            percentageDiff: averageDeniesAt10 > 0 ? ((playerDeniesAt10 - averageDeniesAt10) / averageDeniesAt10) * 100 : 0
        }

        // Generate laning phase summary
        const summary = this.generateLaningPhaseSummary(csComparison, deniesComparison)

        const result = {
            csComparison,
            deniesComparison,
            summary
        }

        console.log('Laning phase result:', result)
        return result
    }

    private static calculateMidGame(player: StratzPlayer, matchDurationSeconds: number): MidGameData {
        const matchMinutes = matchDurationSeconds / 60
        const midGameMinute = Math.round(10 + (matchMinutes - 10) / 2)

        console.log('Calculating mid game for player:', player.hero.displayName)
        console.log('Match duration (minutes):', matchMinutes)
        console.log('Mid game minute:', midGameMinute)

        // Calculate Net Worth @ Mid Game
        const playerNetworthAtMidGame = this.calculatePlayerNetworthAtMidGame(player, midGameMinute)
        const averageNetworthAtMidGame = this.calculateAverageNetworthAtMidGame(player, midGameMinute)

        console.log('Player Net Worth @ Mid Game:', playerNetworthAtMidGame)
        console.log('Average Net Worth @ Mid Game:', averageNetworthAtMidGame)

        const networthComparison: LaningPhaseComparison = {
            playerValue: playerNetworthAtMidGame,
            averageValue: averageNetworthAtMidGame,
            difference: playerNetworthAtMidGame - averageNetworthAtMidGame,
            percentageDiff: averageNetworthAtMidGame > 0 ? ((playerNetworthAtMidGame - averageNetworthAtMidGame) / averageNetworthAtMidGame) * 100 : 0
        }

        // Calculate Last Hits @ Mid Game
        const playerLastHitsAtMidGame = this.calculatePlayerLastHitsAtMidGame(player, midGameMinute, matchDurationSeconds)
        const averageLastHitsAtMidGame = this.calculateAverageLastHitsAtMidGame(player, midGameMinute)

        console.log('Player Last Hits @ Mid Game:', playerLastHitsAtMidGame)
        console.log('Average Last Hits @ Mid Game:', averageLastHitsAtMidGame)

        const lastHitsComparison: LaningPhaseComparison = {
            playerValue: playerLastHitsAtMidGame,
            averageValue: averageLastHitsAtMidGame,
            difference: playerLastHitsAtMidGame - averageLastHitsAtMidGame,
            percentageDiff: averageLastHitsAtMidGame > 0 ? ((playerLastHitsAtMidGame - averageLastHitsAtMidGame) / averageLastHitsAtMidGame) * 100 : 0
        }

        // Generate mid game summary
        const summary = this.generateMidGameSummary(networthComparison, lastHitsComparison, midGameMinute)

        const result = {
            networthComparison,
            lastHitsComparison,
            summary,
            midGameMinute
        }

        console.log('Mid game result:', result)
        return result
    }

    private static calculateSupport(player: StratzPlayer): SupportData {
        console.log('Calculating support for player:', player.hero.displayName)

        // Calculate Camps Stacked
        const playerCampsStacked = this.calculatePlayerCampsStacked(player)
        const averageCampsStacked = this.calculateAverageCampsStacked(player)

        console.log('Player Camps Stacked:', playerCampsStacked)
        console.log('Average Camps Stacked:', averageCampsStacked)

        const campsStackedComparison: LaningPhaseComparison = {
            playerValue: playerCampsStacked,
            averageValue: averageCampsStacked,
            difference: playerCampsStacked - averageCampsStacked,
            percentageDiff: averageCampsStacked > 0 ? ((playerCampsStacked - averageCampsStacked) / averageCampsStacked) * 100 : 0
        }

        // Generate support summary
        const summary = this.generateSupportSummary(campsStackedComparison)

        const result = {
            campsStackedComparison,
            summary
        }

        console.log('Support result:', result)
        return result
    }

    private static calculatePlayerCsAt10(player: StratzPlayer, matchDurationSeconds?: number): number {
        // Sum of lastHitsPerMinute from index 0 to 10 (inclusive)
        if (player.stats?.lastHitsPerMinute && player.stats.lastHitsPerMinute.length >= 11) {
            return player.stats.lastHitsPerMinute
                .slice(0, 11) // Get indices 0-10 (inclusive)
                .reduce((sum, value) => sum + (value || 0), 0)
        }

        // Fallback: estimate based on total last hits and match duration
        // Use a more realistic estimation for CS at 10 minutes
        const totalLastHits = player.numLastHits || 0
        const matchMinutes = matchDurationSeconds ? matchDurationSeconds / 60 : 30 // Default to 30 minutes if not provided

        // More realistic estimation: CS at 10 minutes is typically 15-25% of total CS
        // This varies by role and hero, but 20% is a reasonable average
        const estimatedCsAt10 = Math.round((totalLastHits / matchMinutes) * 10 * 0.8) // 0.8 factor for more realistic early game CS

        console.log(`CS estimation: total=${totalLastHits}, matchMinutes=${matchMinutes}, estimated@10=${estimatedCsAt10}`)
        return estimatedCsAt10
    }

    private static calculateAverageCsAt10(heroAverage: StratzHeroAverage): number {
        // The heroAverage parameter should now be the 10-minute entry
        console.log('Hero average CS at 10:', heroAverage.cs, 'Time:', heroAverage.time)
        return heroAverage.cs || 0
    }

    private static calculatePlayerDeniesAt10(player: StratzPlayer, matchDurationSeconds?: number): number {
        // Sum of deniesPerMinute from index 0 to 10 (inclusive)
        if (player.stats?.deniesPerMinute && player.stats.deniesPerMinute.length >= 11) {
            return player.stats.deniesPerMinute
                .slice(0, 11) // Get indices 0-10 (inclusive)
                .reduce((sum, value) => sum + (value || 0), 0)
        }

        // Fallback: estimate based on total denies and match duration
        // Denies are more concentrated in the early game, so use a higher percentage
        const totalDenies = player.numDenies || 0
        const matchMinutes = matchDurationSeconds ? matchDurationSeconds / 60 : 30 // Default to 30 minutes if not provided

        // Denies are typically more concentrated in early game (30-40% in first 10 minutes)
        const estimatedDeniesAt10 = Math.round((totalDenies / matchMinutes) * 10 * 1.2) // 1.2 factor for early game concentration

        console.log(`Denies estimation: total=${totalDenies}, matchMinutes=${matchMinutes}, estimated@10=${estimatedDeniesAt10}`)
        return estimatedDeniesAt10
    }

    private static calculateAverageDeniesAt10(heroAverage: StratzHeroAverage): number {
        // The heroAverage parameter should now be the 10-minute entry
        console.log('Hero average denies at 10:', heroAverage.dn, 'Time:', heroAverage.time)
        return heroAverage.dn || 0
    }

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

    // Mid Game calculation methods
    private static calculatePlayerNetworthAtMidGame(player: StratzPlayer, midGameMinute: number): number {
        // Use networthPerMinute array at the mid game minute index
        if (player.stats?.networthPerMinute && player.stats.networthPerMinute.length > midGameMinute) {
            return player.stats.networthPerMinute[midGameMinute] || 0
        }

        // Fallback: estimate based on final networth and mid game timing
        const totalNetworth = player.networth || 0
        const midGameProgress = midGameMinute / 30 // Assume 30 minute average game
        return Math.round(totalNetworth * midGameProgress)
    }

    private static calculateAverageNetworthAtMidGame(player: StratzPlayer, midGameMinute: number): number {
        // Find the heroAverage entry closest to the mid game minute
        if (!player.heroAverage || player.heroAverage.length === 0) {
            return 0
        }

        // Find the closest heroAverage entry to the mid game minute
        const closestEntry = player.heroAverage.reduce((closest, current) => {
            const currentDiff = Math.abs(current.time - midGameMinute)
            const closestDiff = Math.abs(closest.time - midGameMinute)
            return currentDiff < closestDiff ? current : closest
        })

        console.log('Using heroAverage entry at time:', closestEntry.time, 'for mid game networth')
        return closestEntry.networth || 0
    }

    private static calculatePlayerLastHitsAtMidGame(player: StratzPlayer, midGameMinute: number, matchDurationSeconds: number): number {
        // Sum of lastHitsPerMinute from index 0 to midGameMinute (inclusive)
        if (player.stats?.lastHitsPerMinute && player.stats.lastHitsPerMinute.length > midGameMinute) {
            return player.stats.lastHitsPerMinute
                .slice(0, midGameMinute + 1) // Get indices 0 to midGameMinute (inclusive)
                .reduce((sum, value) => sum + (value || 0), 0)
        }

        // Fallback: estimate based on total last hits and mid game timing
        const totalLastHits = player.numLastHits || 0
        const matchMinutes = matchDurationSeconds / 60
        const midGameProgress = midGameMinute / matchMinutes

        // More realistic estimation: last hits are more concentrated in early-mid game
        const estimatedLastHitsAtMidGame = Math.round(totalLastHits * midGameProgress * 1.1) // 1.1 factor for early-mid game concentration

        console.log(`Last hits estimation: total=${totalLastHits}, midGameProgress=${midGameProgress}, estimated@${midGameMinute}=${estimatedLastHitsAtMidGame}`)
        return estimatedLastHitsAtMidGame
    }

    private static calculateAverageLastHitsAtMidGame(player: StratzPlayer, midGameMinute: number): number {
        // Find the heroAverage entry closest to the mid game minute
        if (!player.heroAverage || player.heroAverage.length === 0) {
            return 0
        }

        // Find the closest heroAverage entry to the mid game minute
        const closestEntry = player.heroAverage.reduce((closest, current) => {
            const currentDiff = Math.abs(current.time - midGameMinute)
            const closestDiff = Math.abs(closest.time - midGameMinute)
            return currentDiff < closestDiff ? current : closest
        })

        console.log('Using heroAverage entry at time:', closestEntry.time, 'for mid game last hits')
        return closestEntry.cs || 0
    }

    private static generateMidGameSummary(networthComparison: LaningPhaseComparison, lastHitsComparison: LaningPhaseComparison, midGameMinute: number): string {
        const networthAbove = networthComparison.percentageDiff > 0
        const lastHitsAbove = lastHitsComparison.percentageDiff > 0

        if (networthAbove && lastHitsAbove) {
            return `Excellent mid game performance! You exceeded average net worth and last hits at ${midGameMinute} minutes, showing strong farming and item progression.`
        } else if (networthAbove && !lastHitsAbove) {
            return `Good net worth progression at ${midGameMinute} minutes, but consider improving your last hitting to maximize your gold income during mid game.`
        } else if (!networthAbove && lastHitsAbove) {
            return `Solid last hitting performance, but work on converting your farm into better item timings and net worth efficiency.`
        } else {
            return `Mid game needs improvement. Focus on both farming efficiency and item progression to gain better map control and teamfight presence.`
        }
    }

    // Support calculation methods
    private static calculatePlayerCampsStacked(player: StratzPlayer): number {
        // Get the last value from the campStack array (total camps stacked by end of game)
        if (player.stats?.campStack && player.stats.campStack.length > 0) {
            return player.stats.campStack[player.stats.campStack.length - 1] || 0
        }

        console.log('No campStack data available for player')
        return 0
    }

    private static calculateAverageCampsStacked(player: StratzPlayer): number {
        // Find the last heroAverage entry (end of game)
        if (!player.heroAverage || player.heroAverage.length === 0) {
            return 0
        }

        // Get the last entry which represents end of game
        const lastEntry = player.heroAverage[player.heroAverage.length - 1]

        if (!lastEntry) {
            console.log('No heroAverage entries available')
            return 0
        }

        console.log('Using heroAverage entry at time:', lastEntry.time, 'for camps stacked')
        return lastEntry.campsStacked || 0
    }

    private static generateSupportSummary(campsStackedComparison: LaningPhaseComparison): string {
        const campsStackedAbove = campsStackedComparison.percentageDiff > 0

        if (campsStackedAbove) {
            return `Excellent support performance! You stacked more camps than average, showing strong map control and team support.`
        } else {
            return `Consider improving your camp stacking to better support your team's farming and map control.`
        }
    }
}