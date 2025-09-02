import type { StratzMatch, StratzPlayer, ComputedPlayerData, ComputedKPI } from '~/types'

export class StratzService {
    private static readonly GRAPHQL_URL = '/api/stratz/graphql' // Proxy endpoint

    static async fetchMatch(matchId: string): Promise<StratzMatch> {
        if (matchId === 'test') {
            const response = await fetch('/example-stratz-api-response.json')
            if (!response.ok) {
                throw new Error('Failed to load example data')
            }
            const data = await response.json()

            // Modify the example data to use the provided matchId
            const modifiedMatch = { ...data }
            modifiedMatch.id = parseInt(matchId) || 12345

            return modifiedMatch
        }

        // Real STRATZ API call
        const response = await fetch(this.GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetMatch($matchId: Long!) {
                        match(id: $matchId) {
                            id
                            didRadiantWin
                            durationSeconds
                            startDateTime
                            endDateTime
                            towerStatusRadiant
                            towerStatusDire
                            barracksStatusRadiant
                            barracksStatusDire
                            clusterId
                            firstBloodTime
                            lobbyType
                            numHumanPlayers
                            gameMode
                            replaySalt
                            isStats
                            tournamentId
                            tournamentRound
                            actualRank
                            averageRank
                            averageImp
                            parsedDateTime
                            statsDateTime
                            leagueId
                            players {
                                steamAccount {
                                    id
                                    name
                                }
                                hero {
                                    id
                                    displayName
                                    shortName
                                    aliases
                                    roles {
                                        roleId
                                        level
                                    }
                                    talents {
                                        abilityId
                                        slot
                                    }
                                    facets {
                                        abilityId
                                        facetId
                                        slot
                                    }
                                    stats {
                                        team
                                        complexity
                                    }
                                }
                                kills
                                deaths
                                assists
                                networth
                                goldPerMinute
                                experiencePerMinute
                                imp
                                role
                                roleBasic
                                numLastHits
                                numDenies
                                stats {
                                    impPerMinute
                                    goldPerMinute
                                    experiencePerMinute
                                    level
                                    lastHitsPerMinute
                                    campStack
                                    deniesPerMinute
                                    tripsFountainPerMinute
                                    networthPerMinute
                                }
                                heroAverage {
                                    heroId
                                    week
                                    time
                                    position
                                    bracketBasicIds
                                    matchCount
                                    remainingMatchCount
                                    winCount
                                    mvp
                                    topCore
                                    topSupport
                                    courierKills
                                    apm
                                    goldPerMinute
                                    xp
                                    kills
                                    deaths
                                    networth
                                    level
                                    cs
                                    dn
                                    healingSelf
                                    healingAllies
                                    campsStacked
                                    damage
                                    supportGold
                                    casts
                                    abilityCasts
                                    goldFed
                                    goldLost
                                }
                                lane
                                isRadiant
                            }
                        }
                    }
                `,
                variables: { matchId: parseInt(matchId) }
            })
        })

        if (!response.ok) {
            throw new Error(`STRATZ API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            throw new Error(`STRATZ API errors: ${JSON.stringify(data.errors)}`)
        }

        // Log the STRATZ API response data
        console.log('STRATZ API Response:', data.data.match)

        return data.data.match
    }

    static computePlayerData(match: StratzMatch, heroId: number, role: string): ComputedPlayerData {
        const player = match.players.find(p => p.hero.id === heroId)
        if (!player) {
            throw new Error(`Player with hero ID ${heroId} not found`)
        }

        const playerData: ComputedPlayerData = {
            matchId: match.id.toString(),
            heroId: player.hero.id,
            heroName: player.hero.displayName,
            role: player.role || role,
            playerSlot: 0, // Not available in STRATZ data
            radiantWin: match.didRadiantWin,
            matchDuration: match.durationSeconds,
            lh_10: player.stats?.lastHitsPerMinute?.[10] || 0,
            gpm: player.goldPerMinute,
            xpm: player.experiencePerMinute,
            kpct: ((player.kills + player.assists) / Math.max(match.players.filter(p => p.isRadiant === player.isRadiant).reduce((sum, p) => sum + p.kills, 0), 1)) * 100,
            dpm: 0, // Not directly available, would need to calculate from damage events
            tdpm: 0, // Not available in STRATZ data
            deaths_per10: (player.deaths / match.durationSeconds) * 600,
            first_core_s: 0, // Would need to calculate from item purchase events
            obs: 0, // Not available in STRATZ data
            sentries: 0, // Not available in STRATZ data
            dewards: 0, // Not available in STRATZ data
            stacks: player.stats?.campStack?.reduce((sum, val) => sum + val, 0) || 0,
            smokes_used: 0, // Not available in STRATZ data
            lane_nw_delta10: 0, // Would need to calculate from networth progression
            match_minutes: Math.floor(match.durationSeconds / 60),
            win_minutes: 0, // Not applicable for end-of-match analysis
            minute_bucket: 'end',
            stratzData: {
                imp: player.imp,
                heroAverage: player.heroAverage || [],
                playerStats: player.stats || {
                    impPerMinute: [],
                    goldPerMinute: [],
                    experiencePerMinute: [],
                    level: [],
                    lastHitsPerMinute: [],
                    campStack: [],
                    deniesPerMinute: [],
                    tripsFountainPerMinute: []
                },
                role: player.role,
                roleBasic: player.roleBasic,
                lane: player.lane
            }
        }

        return playerData
    }

    static computeKPIs(playerData: ComputedPlayerData): ComputedKPI[] {
        const kpis: ComputedKPI[] = []

        // Get hero average data for benchmarking
        const heroAvg = playerData.stratzData?.heroAverage.find(avg =>
            avg.time === Math.floor(playerData.match_minutes)
        )

        // GPM
        const gpmMedian = heroAvg?.goldPerMinute || 540
        kpis.push(this.createKPI('GPM', playerData.gpm, '', gpmMedian, this.calculatePercentile(playerData.gpm, gpmMedian)))

        // XPM
        const xpmMedian = heroAvg?.xp || 580
        kpis.push(this.createKPI('XPM', playerData.xpm, '', xpmMedian, this.calculatePercentile(playerData.xpm, xpmMedian)))

        // Hero damage per minute
        const dpmMedian = heroAvg?.damage || 420
        kpis.push(this.createKPI('Hero Damage/min', playerData.dpm, '', dpmMedian, this.calculatePercentile(playerData.dpm, dpmMedian)))

        // Last hits per minute
        const lhMedian = heroAvg?.cs || 52
        kpis.push(this.createKPI('Last Hits/min', playerData.lh_10 / playerData.match_minutes, '', lhMedian, this.calculatePercentile(playerData.lh_10 / playerData.match_minutes, lhMedian)))

        // Kill participation
        kpis.push(this.createKPI('Kill Participation', playerData.kpct, '%', 50, this.calculatePercentile(playerData.kpct, 50)))

        // Deaths per 10 minutes
        kpis.push(this.createKPI('Deaths/10min', playerData.deaths_per10, '', 2.5, this.calculatePercentile(playerData.deaths_per10, 2.5)))

        // IMP (Impact) - STRATZ-specific metric
        kpis.push(this.createKPI('IMP', playerData.stratzData?.imp || 0, '', 1, this.calculatePercentile(playerData.stratzData?.imp || 0, 1)))

        return kpis
    }

    private static createKPI(name: string, value: number, unit: string, median: number, percentile: number): ComputedKPI {
        return {
            name,
            value: Math.round(value * 100) / 100,
            unit,
            percentile: Math.round(percentile),
            median: Math.round(median * 100) / 100,
            delta: Math.round((value - median) * 100) / 100,
            rawValue: value
        }
    }

    private static calculatePercentile(value: number, median: number): number {
        // Simple percentile calculation based on deviation from median
        const deviation = (value - median) / median
        const percentile = 50 + (deviation * 25) // 25% per standard deviation
        return Math.max(0, Math.min(100, percentile))
    }

    private static estimateFirstCoreItem(player: StratzPlayer, matchDuration: number): number {
        // Simplified estimation - in a real implementation, you'd analyze item purchases
        return matchDuration * 0.3 // Assume first core item around 30% of match duration
    }
} 