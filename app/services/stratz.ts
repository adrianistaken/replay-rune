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
                            gameVersionId
                            regionId
                            sequenceNum
                            rank
                            bracket
                            analysisOutcome
                            predictedOutcomeWeight
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
                                position
                                partyId
                                towerDamage
                                heroDamage
                                playerSlot
                                isRadiant
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
                            }
                        }
                    }
                `,
                variables: {
                    matchId: parseInt(matchId)
                }
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
        }

        if (!data.data || !data.data.match) {
            throw new Error('Match not found')
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
            // Add networth field
            networth: player.networth,
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
                    tripsFountainPerMinute: [],
                    networthPerMinute: []
                },
                role: player.role,
                roleBasic: player.roleBasic,
                lane: player.lane
            }
        }

        return playerData
    }

    static computeKPIs(playerData: ComputedPlayerData): ComputedKPI[] {
        // This is a simplified version - in a real implementation,
        // you'd calculate percentiles against a database of similar matches
        const kpis: ComputedKPI[] = [
            {
                name: 'GPM',
                value: playerData.gpm,
                unit: 'gold/min',
                percentile: 50, // Placeholder
                median: 400, // Placeholder
                rawValue: playerData.gpm
            },
            {
                name: 'XPM',
                value: playerData.xpm,
                unit: 'xp/min',
                percentile: 50, // Placeholder
                median: 500, // Placeholder
                rawValue: playerData.xpm
            },
            {
                name: 'KDA',
                value: playerData.kpct,
                unit: '%',
                percentile: 50, // Placeholder
                median: 50, // Placeholder
                rawValue: playerData.kpct
            },
            {
                name: 'Net Worth',
                value: playerData.networth || 0,
                unit: 'gold',
                percentile: 50, // Placeholder
                median: 10000, // Placeholder
                rawValue: playerData.networth || 0
            }
        ]

        return kpis
    }
}
