// STRATZ GraphQL API Types

// STRATZ GraphQL API Types
export interface StratzMatch {
    id: number
    didRadiantWin: boolean
    durationSeconds: number
    startDateTime: number
    endDateTime: number
    towerStatusRadiant: number
    towerStatusDire: number
    barracksStatusRadiant: number
    barracksStatusDire: number
    clusterId: number
    firstBloodTime: number
    lobbyType: string
    numHumanPlayers: number
    gameMode: string
    replaySalt: string | null
    isStats: boolean
    tournamentId: number | null
    tournamentRound: number | null
    actualRank: number
    averageRank: number | null
    averageImp: number
    parsedDateTime: number
    statsDateTime: number
    leagueId: number | null
    gameVersionId: number
    regionId: number
    sequenceNum: number
    rank: number
    bracket: number
    analysisOutcome: string
    predictedOutcomeWeight: number
    players: StratzPlayer[]
}

export interface StratzPlayer {
    steamAccount: StratzSteamAccount
    hero: StratzHero
    kills: number
    deaths: number
    assists: number
    networth: number
    goldPerMinute: number
    experiencePerMinute: number
    imp: number
    role: string
    roleBasic: string
    numLastHits: number
    numDenies: number
    position: string
    partyId: number
    towerDamage: number
    heroDamage: number
    playerSlot: number
    isRadiant: boolean
    stats: StratzPlayerStats
    heroAverage: StratzHeroAverage[]
    lane: string
}

export interface StratzSteamAccount {
    id: number
    name: string
}

export interface StratzHero {
    id: number
    displayName: string
    shortName: string
    aliases: string[]
    roles: StratzHeroRole[]
    talents: StratzHeroTalent[]
    facets: StratzHeroFacet[]
    stats: StratzHeroStats
}

export interface StratzHeroRole {
    roleId: number
    level: number
}

export interface StratzHeroTalent {
    abilityId: number
    slot: number
}

export interface StratzHeroFacet {
    abilityId: number
    facetId: number
    slot: number
}

export interface StratzHeroStats {
    team: number
    complexity: number
}

export interface StratzPlayerStats {
    impPerMinute: number[]
    goldPerMinute: number[]
    experiencePerMinute: number[]
    level: number[]
    lastHitsPerMinute: number[]
    campStack: number[]
    deniesPerMinute: number[]
    tripsFountainPerMinute: number[]
    networthPerMinute: number[]
}

export interface StratzHeroAverage {
    heroId: number
    week: number
    time: number
    position: string
    bracketBasicIds: number[] | null
    matchCount: number
    remainingMatchCount: number
    winCount: number
    mvp: number
    topCore: number
    topSupport: number
    courierKills: number
    apm: number
    goldPerMinute: number | null
    xp: number
    kills: number
    deaths: number
    networth: number
    level: number
    cs: number
    dn: number
    healingSelf: number
    healingAllies: number
    campsStacked: number
    damage: number
    supportGold: number
    casts: number
    abilityCasts: number
    goldFed: number
    goldLost: number
}

// Computed Data Types
export interface ComputedKPI {
    name: string
    value: number
    unit: string
    percentile: number
    median: number
    delta?: number
    rawValue: number
}

export interface ComputedPlayerData {
    // Basic match info
    matchId: string
    heroId: number
    heroName: string
    role: string
    playerSlot: number
    radiantWin: boolean
    matchDuration: number

    // Computed KPIs
    lh_10: number
    gpm: number
    xpm: number
    kpct: number
    dpm: number
    tdpm: number
    deaths_per10: number
    first_core_s: number
    obs: number
    sentries: number
    dewards: number
    stacks: number
    smokes_used: number
    lane_nw_delta10: number

    // Additional computed fields
    match_minutes: number
    win_minutes: number
    minute_bucket: string

    // Add networth field
    networth: number

    // Carry-specific KPIs
    early_deaths_0_10?: number
    early_deaths_0_15?: number
    idle_time_30s?: number
    last_hits_10?: number
    denies_10?: number
    gpm_10?: number
    xpm_10?: number

    // STRATZ-specific data
    stratzData?: {
        imp: number
        heroAverage: StratzHeroAverage[]
        playerStats: StratzPlayerStats
        role: string
        roleBasic: string
        lane: string
    }
}

// Analysis Results Interfaces
export interface KPI {
    name: string
    value: number
    unit: string
    percentile: number
    median: number
    delta?: number
    benchmark?: number
    description?: string
}

export interface Fix {
    title: string
    description: string
    dataComparison?: string
    priority: number
    category: string
    confidence?: number
}

export interface Win {
    title: string
    description: string
    dataComparison?: string
    priority: number
    category: string
    confidence?: number
}

export interface TimelineMarker {
    time: number
    title: string
    description: string
    type: 'positive' | 'negative' | 'neutral'
    category: string
}

// Rule Engine Types
export interface V3Rule {
    id: string
    title: string
    description: string
    category: string
    priority: number
    when: V3RuleCondition
    then: V3RuleAction
    confidence?: number
}

export interface V3RuleCondition {
    operator: string
    kpi: string
    value: number
    time?: number
}

export interface V3RuleAction {
    type: 'fix' | 'win'
    message: string
    dataComparison?: string
}

// Hero Average Rule Engine Types
export interface HeroAverageRule {
    id: string
    title: string
    description: string
    category: string
    priority: number
    when: HeroAverageRuleCondition
    then: HeroAverageRuleAction
    confidence?: number
}

export interface HeroAverageRuleCondition {
    operator: string
    kpi: string
    value: number
    time?: number
}

export interface HeroAverageRuleAction {
    type: 'fix' | 'win'
    message: string
    dataComparison?: string
}

// Analysis Result Types
export interface AnalysisResult {
    summary: string
    fixes: Fix[]
    wins: Win[]
    timeline: TimelineMarker[]
}

// Utility Types
export interface TimeRange {
    start: number
    end: number
}

export interface MetricValue {
    time: number
    value: number
}

export interface ComparisonData {
    playerValue: number
    averageValue: number
    percentile: number
    delta: number
}

// Rule Categories
export const RULE_CATEGORIES = {
    FARMING: 'farming',
    TEAMFIGHT: 'teamfight',
    MAP_CONTROL: 'map_control',
    ITEMIZATION: 'itemization',
    POSITIONING: 'positioning',
    VISION: 'vision',
    OBJECTIVES: 'objectives',
    LATE_GAME: 'late_game',
    EARLY_GAME: 'early_game',
    MID_GAME: 'mid_game'
} as const

export type RuleCategory = typeof RULE_CATEGORIES[keyof typeof RULE_CATEGORIES]

// KPI Names
export const KPI_NAMES = {
    GPM: 'gpm',
    XPM: 'xpm',
    KDA: 'kda',
    NETWORTH: 'networth',
    CS: 'cs',
    XP: 'xp',
    LEVEL: 'level',
    DEATHS: 'deaths',
    HERO_DAMAGE: 'heroDamage',
    TOWER_DAMAGE: 'towerDamage',
    CAMPS_STACKED: 'campsStacked',
    ABILITY_CASTS: 'abilityCasts',
    SUPPORT_GOLD: 'supportGold',
    KILL_CONTRIBUTION: 'killContribution',
    COURIER_KILLS: 'courierKills'
} as const

export type KPIName = typeof KPI_NAMES[keyof typeof KPI_NAMES]

// Operator Types
export const OPERATORS = {
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    EQUALS: 'equals',
    DELTA_GREATER_THAN: 'delta_greater_than',
    DELTA_LESS_THAN: 'delta_less_than',
    PERCENTILE_GREATER_THAN: 'percentile_greater_than',
    PERCENTILE_LESS_THAN: 'percentile_less_than'
} as const

export type Operator = typeof OPERATORS[keyof typeof OPERATORS]

// Time-specific KPI parsing
export interface TimeSpecificKPI {
    metric: string
    time: number
    operator: string
    value: number
}

// Rule evaluation result
export interface RuleEvaluationResult {
    rule: V3Rule
    passed: boolean
    playerValue: number
    expectedValue: number
    delta: number
    confidence: number
}

// Hero average data structure
export interface HeroAverageData {
    heroId: number
    position: string
    rank: number
    data: StratzHeroAverage[]
}

// Position mapping
export const POSITION_MAP = {
    'POSITION_1': 'Carry',
    'POSITION_2': 'Mid',
    'POSITION_3': 'Offlane',
    'POSITION_4': 'Soft Support',
    'POSITION_5': 'Hard Support'
} as const

export type Position = keyof typeof POSITION_MAP

// Role mapping
export const ROLE_MAP = {
    'pos1': 'Carry',
    'pos2': 'Mid',
    'pos3': 'Offlane',
    'pos4': 'Soft Support',
    'pos5': 'Hard Support'
} as const

export type Role = keyof typeof ROLE_MAP
