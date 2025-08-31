import type { StratzMatch, StratzPlayer, ComputedPlayerData, ComputedKPI } from '~/types'

export class StratzService {
    private static readonly GRAPHQL_URL = '/api/stratz/graphql' // Proxy endpoint

    static async fetchMatch(matchId: string): Promise<StratzMatch> {
        console.log('STRATZ Service: Starting fetchMatch for matchId:', matchId)

        // For testing purposes, use example data if API fails
        const useExampleData = false // Set to true to use example data

        if (useExampleData) {
            console.log('STRATZ Service: Using example data for testing')
            try {
                const response = await fetch('/example-stratz-api-response.json')
                console.log('STRATZ Service: Example data response status:', response.status)
                if (!response.ok) {
                    throw new Error(`Failed to fetch example data: ${response.status}`)
                }
                const data = await response.json()
                console.log('STRATZ Service: Example data loaded successfully')
                console.log('STRATZ Service: Example data structure:', Object.keys(data))
                return data.data.match
            } catch (error) {
                console.error('STRATZ Service: Failed to load example data:', error)
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                throw new Error(`Failed to load example data: ${errorMessage}`)
            }
        }

        try {
            const query = `{ match(id: ${parseInt(matchId)}) { id didRadiantWin durationSeconds startDateTime endDateTime towerStatusRadiant towerStatusDire barracksStatusRadiant barracksStatusDire clusterId firstBloodTime lobbyType numHumanPlayers gameMode replaySalt isStats tournamentId tournamentRound actualRank averageRank averageImp parsedDateTime statsDateTime leagueId league { id displayName name tier region } radiantTeamId radiantTeam { id name tag } direTeamId direTeam { id name tag } seriesId series { id type } gameVersionId regionId sequenceNum rank bracket analysisOutcome predictedOutcomeWeight players { steamAccount { id name } hero { id displayName shortName aliases roles { roleId level } talents { abilityId slot } facets { abilityId facetId slot } stats { team complexity } } kills deaths assists networth goldPerMinute experiencePerMinute imp role roleBasic numLastHits numDenies stats { impPerMinute goldPerMinute } heroAverage { heroId week time position bracketBasicIds matchCount remainingMatchCount winCount mvp topCore topSupport courierKills apm goldPerMinute xp kills deaths networth level cs dn healingSelf healingAllies campsStacked damage supportGold casts abilityCasts goldFed goldLost } lane isRadiant } } }`

            console.log('STRATZ Service: Making GraphQL request to:', this.GRAPHQL_URL)
            console.log('STRATZ Service: Request variables:', { matchId: parseInt(matchId) })

            const response = await fetch(this.GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query
                })
            })

            console.log('STRATZ Service: Response status:', response.status)
            console.log('STRATZ Service: Response ok:', response.ok)

            if (!response.ok) {
                console.error('STRATZ Service: HTTP error response:', response.status, response.statusText)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('STRATZ Service: Response data received:', data)

            if (data.errors) {
                console.error('STRATZ Service: GraphQL errors:', data.errors)
                throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
            }

            if (!data.data?.match) {
                console.error('STRATZ Service: No match data found in response')
                throw new Error('Match not found or not parsed')
            }

            console.log('STRATZ Service: Successfully returning match data')
            return data.data.match
        } catch (error) {
            console.error('Error fetching match from STRATZ:', error)
            throw new Error('Failed to fetch match data from STRATZ')
        }
    }

    static computePlayerData(match: StratzMatch, heroId: number, role: string): ComputedPlayerData {
        console.log('STRATZ Service: Computing player data for heroId:', heroId, 'role:', role)
        const player = match.players.find(p => p.hero.id === heroId)
        if (!player) {
            console.error('STRATZ Service: Player not found for heroId:', heroId)
            throw new Error(`Player with hero ID ${heroId} not found in match`)
        }

        console.log('STRATZ Service: Found player:', player.hero.displayName)

        const matchMinutes = match.durationSeconds / 60
        const winMinutes = match.didRadiantWin === player.isRadiant ? matchMinutes : null

        // Calculate kill participation
        const teamKills = match.players
            .filter(p => p.isRadiant === player.isRadiant)
            .reduce((sum, p) => sum + p.kills, 0)
        const kpct = teamKills > 0 ? ((player.kills + player.assists) / teamKills) * 100 : 0

        // Calculate deaths per 10 minutes
        const deathsPer10 = (player.deaths / matchMinutes) * 10

        // Calculate damage per minute (estimate from hero average data)
        const heroAvg = player.heroAverage.find(avg => avg.time === Math.floor(matchMinutes))
        const dpm = heroAvg ? heroAvg.damage : 0

        // Calculate tower damage per minute (estimate)
        const tdpm = 0 // Not directly available in STRATZ data

        // Calculate first core item timing (estimate)
        const firstCoreItem = match.durationSeconds // Simplified for now

        // Calculate stacks from hero average data
        const stacks = heroAvg ? heroAvg.campsStacked : 0

        // Determine minute bucket
        let minuteBucket = '0-10'
        if (matchMinutes > 20) minuteBucket = '20+'
        else if (matchMinutes > 15) minuteBucket = '15-20'
        else if (matchMinutes > 10) minuteBucket = '10-15'

        const playerData = {
            matchId: match.id.toString(),
            heroId: player.hero.id,
            heroName: player.hero.displayName,
            role,
            playerSlot: player.isRadiant ? 0 : 128, // Simplified slot mapping
            radiantWin: match.didRadiantWin,
            matchDuration: match.durationSeconds,

            // Computed KPIs
            lh_10: player.numLastHits || 0,
            gpm: player.goldPerMinute,
            xpm: player.experiencePerMinute,
            kpct,
            dpm: 0, // Will be calculated from heroAverage data
            tdpm: 0, // Not directly available
            deaths_per10: deathsPer10,
            first_core_s: firstCoreItem,
            obs: 0, // Not available in STRATZ data
            sentries: 0, // Not available in STRATZ data
            dewards: 0, // Not available in STRATZ data
            stacks: 0, // Simplified
            smokes_used: 0, // Not available in STRATZ data
            lane_nw_delta10: 0, // Not available in STRATZ data

            // Additional computed fields
            match_minutes: matchMinutes,
            win_minutes: winMinutes || 0,
            minute_bucket: minuteBucket,

            // STRATZ-specific data
            stratzData: {
                imp: player.imp,
                heroAverage: player.heroAverage || [],
                role: player.role,
                roleBasic: player.roleBasic,
                lane: player.lane
            }
        }

        console.log('STRATZ Service: Computed player data:', playerData)
        return playerData
    }

    static computeKPIs(playerData: ComputedPlayerData): ComputedKPI[] {
        console.log('STRATZ Service: Computing KPIs for player data:', playerData)
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

        console.log('STRATZ Service: Computed KPIs:', kpis)
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