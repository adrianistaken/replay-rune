import type { OpenDotaMatch, OpenDotaPlayer, ComputedPlayerData, ComputedKPI, MedianValues, ParsingJobResponse, MatchParsingStatus, JobStatusResponse } from '~/types'

// Hard-coded median values for now (these would come from a database in production)
const MEDIAN_VALUES: MedianValues = {
    lh_10: 52,
    gpm: 540,
    xpm: 580,
    kpct: 72,
    dpm: 420,
    tdpm: 150,
    deaths_per10: 2.5,
    first_core_s: 720, // 12 minutes
    obs: 6,
    sentries: 4,
    dewards: 2,
    stacks: 3,
    smokes_used: 2,
    lane_nw_delta10: 0
}

// Core item IDs (simplified for now)
const CORE_ITEMS = [
    1,    // Blink Dagger
    2,    // Blade Mail
    3,    // Blade of Alacrity
    4,    // Blades of Attack
    5,    // Blight Stone
    6,    // Blink Dagger
    7,    // Bloodstone
    8,    // Boots of Speed
    9,    // Bottle
    10,   // Bracer
    11,   // Buckler
    12,   // Butterfly
    13,   // Chainmail
    14,   // Circlet
    15,   // Claymore
    16,   // Cloak
    17,   // Crystalys
    18,   // Demon Edge
    19,   // Desolator
    20,   // Divine Rapier
    21,   // Eaglesong
    22,   // Energy Booster
    23,   // Force Staff
    24,   // Gauntlets of Strength
    25,   // Gem of True Sight
    26,   // Ghost Scepter
    27,   // Gloves of Haste
    28,   // Hand of Midas
    29,   // Headdress
    30,   // Helm of Iron Will
    31,   // Helm of the Dominator
    32,   // Hyperstone
    33,   // Iron Branch
    34,   // Javelin
    35,   // Magic Stick
    36,   // Magic Wand
    37,   // Mantle of Intelligence
    38,   // Mask of Madness
    39,   // Mekansm
    40,   // Mithril Hammer
    41,   // Mystic Staff
    42,   // Null Talisman
    43,   // Ogre Axe
    44,   // Orb of Venom
    45,   // Perseverance
    46,   // Phase Boots
    47,   // Platemail
    48,   // Point Booster
    49,   // Power Treads
    50,   // Quarterstaff
    51,   // Quelling Blade
    52,   // Radiance
    53,   // Reaver
    54,   // Refresher Orb
    55,   // Ring of Aquila
    56,   // Ring of Basilius
    57,   // Ring of Health
    58,   // Ring of Protection
    59,   // Ring of Regen
    60,   // Sacred Relic
    61,   // Sage's Mask
    62,   // Sange
    63,   // Sange and Yasha
    64,   // Scythe of Vyse
    65,   // Shadow Amulet
    66,   // Shadow Blade
    67,   // Shivas Guard
    68,   // Skull Basher
    69,   // Slippers of Agility
    70,   // Smoked Meat
    71,   // Soul Booster
    72,   // Soul Ring
    73,   // Staff of Wizardry
    74,   // Stout Shield
    75,   // Talisman of Evasion
    76,   // Tango
    77,   // Town Portal Scroll
    78,   // Ultimate Orb
    79,   // Urn of Shadows
    80,   // Vanguard
    81,   // Veil of Discord
    82,   // Vitality Booster
    83,   // Void Stone
    84,   // Wind Lace
    85,   // Witch Blade
    86,   // Yasha
    87,   // Yasha and Kaya
    88,   // Aghanim's Scepter
    89,   // Aghanim's Shard
    90,   // Arcane Blink
    91,   // Armlet of Mordiggian
    92,   // Assault Cuirass
    93,   // Battle Fury
    94,   // Black King Bar
    95,   // Bloodthorn
    96,   // Butterfly
    97,   // Crimson Guard
    98,   // Daedalus
    99,   // Desolator
    100,  // Diffusal Blade
    101,  // Dragon Lance
    102,  // Echo Sabre
    103,  // Ethereal Blade
    104,  // Eye of Skadi
    105,  // Force Staff
    106,  // Gleipnir
    107,  // Guardian Greaves
    108,  // Heart of Tarrasque
    109,  // Heaven's Halberd
    110,  // Hurricane Pike
    111,  // Linken's Sphere
    112,  // Lotus Orb
    113,  // Maelstrom
    114,  // Manta Style
    115,  // Mask of Madness
    116,  // Mekansm
    117,  // Meteor Hammer
    118,  // Mjollnir
    119,  // Monkey King Bar
    120,  // Moon Shard
    121,  // Nullifier
    122,  // Octarine Core
    123,  // Orchid Malevolence
    124,  // Overwhelming Blink
    125,  // Parasma
    126,  // Pipe of Insight
    127,  // Refresher Orb
    128,  // Rod of Atos
    129,  // Sange
    130,  // Scythe of Vyse
    131,  // Shadow Blade
    132,  // Shiva's Guard
    133,  // Silver Edge
    134,  // Skull Basher
    135,  // Solar Crest
    136,  // Spirit Vessel
    137,  // Swift Blink
    138,  // Vladmir's Offering
    139,  // Witch Blade
    140,  // Yasha
    141,  // Abyssal Blade
    142,  // Aeon Disk
    143,  // Aghanim's Blessing
    144,  // Arcane Blink
    145,  // Armlet of Mordiggian
    146,  // Assault Cuirass
    147,  // Battle Fury
    148,  // Black King Bar
    149,  // Bloodthorn
    150,  // Butterfly
    151,  // Crimson Guard
    152,  // Daedalus
    153,  // Desolator
    154,  // Diffusal Blade
    155,  // Dragon Lance
    156,  // Echo Sabre
    157,  // Ethereal Blade
    158,  // Eye of Skadi
    159,  // Force Staff
    160,  // Gleipnir
    161,  // Guardian Greaves
    162,  // Heart of Tarrasque
    163,  // Heaven's Halberd
    164,  // Hurricane Pike
    165,  // Linken's Sphere
    166,  // Lotus Orb
    167,  // Maelstrom
    168,  // Manta Style
    169,  // Mask of Madness
    170,  // Mekansm
    171,  // Meteor Hammer
    172,  // Mjollnir
    173,  // Monkey King Bar
    174,  // Moon Shard
    175,  // Nullifier
    176,  // Octarine Core
    177,  // Orchid Malevolence
    178,  // Overwhelming Blink
    179,  // Parasma
    180,  // Pipe of Insight
    181,  // Refresher Orb
    182,  // Rod of Atos
    183,  // Sange
    184,  // Scythe of Vyse
    185,  // Shadow Blade
    186,  // Shiva's Guard
    187,  // Silver Edge
    188,  // Skull Basher
    189,  // Solar Crest
    190,  // Spirit Vessel
    191,  // Swift Blink
    192,  // Vladmir's Offering
    193,  // Witch Blade
    194,  // Yasha
    195,  // Abyssal Blade
    196,  // Aeon Disk
    197,  // Aghanim's Blessing
    198,  // Arcane Blink
    199,  // Armlet of Mordiggian
    200,  // Assault Cuirass
]

export class OpenDotaService {
    private static readonly BASE_URL = 'https://api.opendota.com/api'

    static async fetchMatch(matchId: string): Promise<OpenDotaMatch> {
        try {
            const response = await fetch(`${this.BASE_URL}/matches/${matchId}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (!data.match_id) {
                throw new Error('Invalid match data received')
            }

            return data
        } catch (error) {
            console.error('Error fetching match:', error)
            throw new Error('Failed to fetch match data from OpenDota')
        }
    }

    static async requestParsing(matchId: string): Promise<ParsingJobResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/request/${matchId}`, {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error requesting replay parsing:', error)
            throw new Error('Failed to request replay parsing from OpenDota')
        }
    }

    static async checkJobStatus(jobId: number): Promise<JobStatusResponse | null> {
        try {
            const response = await fetch(`${this.BASE_URL}/request/${jobId}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // If job is complete, API returns null
            if (!data) {
                return null
            }

            return data
        } catch (error) {
            console.error('Error checking job status:', error)
            throw new Error('Failed to check job status from OpenDota')
        }
    }

    static async checkParsingStatus(matchId: string): Promise<boolean> {
        try {
            const match = await this.fetchMatch(matchId)
            return match.od_data?.has_parsed || false
        } catch (error) {
            console.error('Error checking parsing status:', error)
            return false
        }
    }

    static async waitForParsing(matchId: string, jobId?: number, maxAttempts: number = 30, delayMs: number = 2000): Promise<boolean> {
        // If we have a jobId, use the more efficient job status API
        if (jobId) {
            return this.waitForParsingWithJobId(jobId, maxAttempts, delayMs)
        }

        // Fallback to the old method if no jobId
        return this.waitForParsingWithMatchId(matchId, maxAttempts, delayMs)
    }

    private static async waitForParsingWithJobId(jobId: number, maxAttempts: number = 30, delayMs: number = 2000): Promise<boolean> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const jobStatus = await this.checkJobStatus(jobId)

                // If jobStatus is null, the job is complete
                if (jobStatus === null) {
                    console.log(`Job ${jobId} completed after ${attempt + 1} attempts`)
                    return true
                }

                console.log(`Job ${jobId} still processing (attempt ${attempt + 1}/${maxAttempts})`)

                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, delayMs))
            } catch (error) {
                console.error(`Error checking job status (attempt ${attempt + 1}):`, error)
                // Continue trying even if one check fails
            }
        }

        console.log(`Job ${jobId} timed out after ${maxAttempts} attempts`)
        return false
    }

    private static async waitForParsingWithMatchId(matchId: string, maxAttempts: number = 30, delayMs: number = 2000): Promise<boolean> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const isParsed = await this.checkParsingStatus(matchId)
                if (isParsed) {
                    return true
                }

                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, delayMs))
            } catch (error) {
                console.error(`Error checking parsing status (attempt ${attempt + 1}):`, error)
                // Continue trying even if one check fails
            }
        }

        return false
    }

    static computePlayerData(match: OpenDotaMatch, playerSlot: number, role: string): ComputedPlayerData {
        const player = match.players.find(p => p.player_slot === playerSlot)
        if (!player) {
            throw new Error(`Player with slot ${playerSlot} not found in match`)
        }

        const matchMinutes = match.duration / 60
        const winMinutes = match.radiant_win === (player.player_slot < 128) ? matchMinutes : null

        // Calculate kill participation
        const teamKills = match.players
            .filter(p => (p.player_slot < 128) === (player.player_slot < 128))
            .reduce((sum, p) => sum + p.kills, 0)
        const kpct = teamKills > 0 ? ((player.kills + player.assists) / teamKills) * 100 : 0

        // Calculate deaths per 10 minutes
        const deathsPer10 = (player.deaths / matchMinutes) * 10

        // Calculate damage per minute
        const dpm = player.hero_damage / matchMinutes
        const tdpm = player.tower_damage / matchMinutes

        // Calculate first core item timing
        const firstCoreItem = this.findFirstCoreItem(player, match.duration)

        // Calculate stacks (creeps + camps)
        const stacks = (player.creeps_stacked || 0) + (player.camps_stacked || 0)

        // Calculate lane net worth delta at 10 (simplified - would need detailed match data)
        const laneNwDelta10 = 0 // Placeholder

        // Determine minute bucket
        let minuteBucket = '0-10'
        if (matchMinutes > 20) minuteBucket = '20+'
        else if (matchMinutes > 15) minuteBucket = '15-20'
        else if (matchMinutes > 10) minuteBucket = '10-15'

        return {
            matchId: match.match_id.toString(),
            heroId: player.hero_id,
            heroName: this.getHeroName(player.hero_id),
            role,
            playerSlot: player.player_slot,
            radiantWin: match.radiant_win,
            matchDuration: match.duration,

            // Computed KPIs
            lh_10: this.estimateLastHitsAt10(player.last_hits, matchMinutes), // Estimate
            gpm: player.gold_per_min,
            xpm: player.xp_per_min,
            kpct,
            dpm,
            tdpm,
            deaths_per10: deathsPer10,
            first_core_s: firstCoreItem,
            obs: player.observers_placed || 0,
            sentries: player.sentries_placed || 0,
            dewards: 0, // Not available in basic match data
            stacks,
            smokes_used: 0, // Not available in basic match data
            lane_nw_delta10: laneNwDelta10,

            // Additional computed fields
            match_minutes: matchMinutes,
            win_minutes: winMinutes || 0,
            minute_bucket: minuteBucket,

            // Benchmark data from OpenDota
            benchmarks: player.benchmarks
        }
    }

    static computeKPIs(playerData: ComputedPlayerData): ComputedKPI[] {
        const kpis: ComputedKPI[] = []

        // Use benchmark data from OpenDota API if available, otherwise use hardcoded medians
        const benchmarks = playerData.benchmarks || {}

        // Helper function to get benchmark data
        const getBenchmarkData = (key: string) => {
            const benchmark = benchmarks[key]
            if (benchmark) {
                return {
                    raw: benchmark.raw,
                    percentile: Math.round(benchmark.pct * 100)
                }
            }
            return null
        }

        // GPM
        const gpmData = getBenchmarkData('gold_per_min')
        kpis.push(this.createKPI('GPM', playerData.gpm, '', gpmData?.raw || MEDIAN_VALUES.gpm, gpmData?.percentile || 50))

        // XPM
        const xpmData = getBenchmarkData('xp_per_min')
        kpis.push(this.createKPI('XPM', playerData.xpm, '', xpmData?.raw || MEDIAN_VALUES.xpm, xpmData?.percentile || 50))

        // Hero damage per minute
        const dpmData = getBenchmarkData('hero_damage_per_min')
        kpis.push(this.createKPI('Hero Damage/min', playerData.dpm, '', dpmData?.raw || MEDIAN_VALUES.dpm, dpmData?.percentile || 50))

        // Last hits per minute
        const lhData = getBenchmarkData('last_hits_per_min')
        const lhPerMin = playerData.lh_10 * (playerData.match_minutes / 10) // Estimate
        kpis.push(this.createKPI('Last Hits/min', lhPerMin, '', lhData?.raw || MEDIAN_VALUES.lh_10, lhData?.percentile || 50))

        // Tower damage
        const tdData = getBenchmarkData('tower_damage')
        kpis.push(this.createKPI('Tower Damage', playerData.tdpm, '', tdData?.raw || MEDIAN_VALUES.tdpm, tdData?.percentile || 50))

        // Kill participation
        kpis.push(this.createKPI('Kill Participation', playerData.kpct, '%', MEDIAN_VALUES.kpct, this.calculatePercentile(playerData.kpct, MEDIAN_VALUES.kpct)))

        // Deaths per 10 minutes
        kpis.push(this.createKPI('Deaths/10min', playerData.deaths_per10, '', MEDIAN_VALUES.deaths_per10, this.calculatePercentile(playerData.deaths_per10, MEDIAN_VALUES.deaths_per10, true)))

        // First core item timing
        kpis.push(this.createKPI('First Core Item', playerData.first_core_s, 's', MEDIAN_VALUES.first_core_s, this.calculatePercentile(playerData.first_core_s, MEDIAN_VALUES.first_core_s, true)))

        // Observers placed
        kpis.push(this.createKPI('Observers Placed', playerData.obs, '', MEDIAN_VALUES.obs, this.calculatePercentile(playerData.obs, MEDIAN_VALUES.obs)))

        // Sentries placed
        kpis.push(this.createKPI('Sentries Placed', playerData.sentries, '', MEDIAN_VALUES.sentries, this.calculatePercentile(playerData.sentries, MEDIAN_VALUES.sentries)))

        // Stacks
        kpis.push(this.createKPI('Stacks', playerData.stacks, '', MEDIAN_VALUES.stacks, this.calculatePercentile(playerData.stacks, MEDIAN_VALUES.stacks)))

        return kpis
    }

    private static createKPI(name: string, value: number, unit: string, median: number, percentile: number): ComputedKPI {
        const delta = value - median

        return {
            name,
            value: Math.round(value * 100) / 100, // Round to 2 decimal places
            unit,
            percentile,
            median: Math.round(median * 100) / 100,
            delta: Math.round(delta * 100) / 100,
            rawValue: value
        }
    }

    private static calculatePercentile(value: number, median: number, lowerIsBetter: boolean = false): number {
        // Simple percentile calculation based on median
        // In a real implementation, this would use actual distribution data
        const deviation = (value - median) / median

        if (lowerIsBetter) {
            // For metrics where lower is better (deaths, timing)
            if (deviation <= -0.5) return 90
            if (deviation <= -0.3) return 80
            if (deviation <= -0.1) return 70
            if (deviation <= 0.1) return 50
            if (deviation <= 0.3) return 30
            if (deviation <= 0.5) return 20
            return 10
        } else {
            // For metrics where higher is better (GPM, XPM, etc.)
            if (deviation >= 0.5) return 90
            if (deviation >= 0.3) return 80
            if (deviation >= 0.1) return 70
            if (deviation >= -0.1) return 50
            if (deviation >= -0.3) return 30
            if (deviation >= -0.5) return 20
            return 10
        }
    }

    private static findFirstCoreItem(player: OpenDotaPlayer, matchDuration: number): number {
        // Check if player has any core items
        const items = [player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5]
        const coreItems = items.filter(item => CORE_ITEMS.includes(item))

        if (coreItems.length === 0) {
            return matchDuration // No core items found
        }

        // For now, estimate timing based on match duration and item count
        // In a real implementation, you'd use purchase_log data
        const estimatedTiming = Math.min(matchDuration * 0.3, 900) // 30% of match time, max 15 minutes
        return Math.round(estimatedTiming)
    }

    private static estimateLastHitsAt10(totalLastHits: number, matchMinutes: number): number {
        // Simple estimation: assume 60% of last hits happen in first 10 minutes
        // This is a rough approximation - real data would be better
        return Math.round(totalLastHits * 0.6 * (10 / matchMinutes))
    }

    private static getHeroName(heroId: number): string {
        // Hero name mapping (simplified)
        const heroNames: { [key: number]: string } = {
            1: 'Anti-Mage', 2: 'Axe', 3: 'Bane', 4: 'Bloodseeker', 5: 'Crystal Maiden',
            6: 'Drow Ranger', 7: 'Earthshaker', 8: 'Juggernaut', 9: 'Mirana', 10: 'Morphling',
            11: 'Shadow Fiend', 12: 'Phantom Lancer', 13: 'Puck', 14: 'Pudge', 15: 'Razor',
            16: 'Sand King', 17: 'Storm Spirit', 18: 'Sven', 19: 'Tiny', 20: 'Vengeful Spirit',
            21: 'Windranger', 22: 'Zeus', 23: 'Kunkka', 25: 'Lina', 26: 'Lion',
            27: 'Shadow Shaman', 28: 'Slardar', 29: 'Tidehunter', 30: 'Witch Doctor',
            31: 'Lich', 32: 'Riki', 33: 'Enigma', 34: 'Tinker', 35: 'Sniper',
            36: 'Necrophos', 37: 'Warlock', 38: 'Beastmaster', 39: 'Queen of Pain', 40: 'Venomancer',
            41: 'Faceless Void', 42: 'Wraith King', 43: 'Death Prophet', 44: 'Phantom Assassin', 45: 'Pugna',
            46: 'Templar Assassin', 47: 'Viper', 48: 'Luna', 49: 'Dragon Knight', 50: 'Dazzle',
            51: 'Clockwerk', 52: 'Leshrac', 53: 'Nature\'s Prophet', 54: 'Lifestealer', 55: 'Dark Seer',
            56: 'Clinkz', 57: 'Omniknight', 58: 'Enchantress', 59: 'Huskar', 60: 'Night Stalker',
            61: 'Broodmother', 62: 'Bounty Hunter', 63: 'Weaver', 64: 'Jakiro', 65: 'Batrider',
            66: 'Chen', 67: 'Spectre', 68: 'Ancient Apparition', 69: 'Doom', 70: 'Ursa',
            71: 'Spirit Breaker', 72: 'Gyrocopter', 73: 'Alchemist', 74: 'Invoker', 75: 'Silencer',
            76: 'Outworld Destroyer', 77: 'Lycan', 78: 'Brewmaster', 79: 'Shadow Demon', 80: 'Lone Druid',
            81: 'Chaos Knight', 82: 'Meepo', 83: 'Treant Protector', 84: 'Ogre Magi', 85: 'Undying',
            86: 'Rubick', 87: 'Disruptor', 88: 'Nyx Assassin', 89: 'Naga Siren', 90: 'Keeper of the Light',
            91: 'Io', 92: 'Visage', 93: 'Slark', 94: 'Medusa', 95: 'Troll Warlord',
            96: 'Centaur Warrunner', 97: 'Magnus', 98: 'Timbersaw', 99: 'Bristleback', 100: 'Tusk',
            101: 'Skywrath Mage', 102: 'Abaddon', 103: 'Elder Titan', 104: 'Legion Commander', 105: 'Techies',
            106: 'Ember Spirit', 107: 'Earth Spirit', 108: 'Underlord', 109: 'Terrorblade', 110: 'Phoenix',
            111: 'Oracle', 112: 'Winter Wyvern', 113: 'Arc Warden', 114: 'Monkey King', 115: 'Dark Willow',
            116: 'Pangolier', 117: 'Grimstroke', 118: 'Hoodwink', 119: 'Void Spirit', 120: 'Snapfire',
            121: 'Mars', 123: 'Dawnbreaker', 126: 'Marci', 128: 'Primal Beast', 129: 'Muerta'
        }

        return heroNames[heroId] || 'Unknown Hero'
    }
} 