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
    league: StratzLeague | null
    radiantTeamId: number | null
    radiantTeam: StratzTeam | null
    direTeamId: number | null
    direTeam: StratzTeam | null
    seriesId: number | null
    series: StratzSeries | null
    gameVersionId: number
    regionId: number
    sequenceNum: number
    rank: number
    bracket: number
    analysisOutcome: string
    predictedOutcomeWeight: number
    players: StratzPlayer[]
}

export interface StratzLeague {
    id: number
    name: string
    displayName: string
    tier: string
    region: string
    url: string
    description: string
    isProCircuit: boolean
    imageUri: string
    color: string
}

export interface StratzTeam {
    id: number
    name: string
    tag: string
    dateCreated: number
    isPro: boolean
    countryCode: string
    url: string
    logo: string
    baseUri: string
    lastMatchDateTime: number
    teamCaptainId: number
    homeLeagueId: number
    homeLeague: StratzLeague | null
}

export interface StratzSeries {
    id: number
    name: string
    type: string
    leagueId: number
    league: StratzLeague | null
    startDateTime: number
    endDateTime: number
    matches: StratzMatch[]
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
    stats: StratzPlayerStats
    heroAverage: StratzHeroAverage[]
    lane: string
    isRadiant: boolean
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
    roleId: string
    level: number
}

export interface StratzHeroTalent {
    abilityId: number
    slot: number
}

export interface StratzHeroFacet {
    abilityId: number | null
    facetId: number
    slot: number
}

export interface StratzHeroStats {
    team: boolean
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

// Computed KPI Data
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

    // Carry-specific KPIs
    early_deaths_0_10?: number
    early_deaths_0_15?: number
    idle_time_30s?: number
    last_hits_10?: number
    denies_10?: number
    gpm_10?: number
    xpm_10?: number

    // STRATZ-specific data

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
    priority: number
    category: string
    confidence?: number
}

export interface Win {
    title: string
    description: string
    kpi: string
    confidence?: number
}

export interface TimelineMarker {
    label: string
    time: number
    delta?: number
    description: string
    itemImg?: string
    details?: string
}

export interface AnalysisReport {
    id: string
    matchId: string
    heroName: string
    heroId: number
    heroImg?: string
    role: string
    summary: string
    kpis: KPI[]
    fixes: Fix[]
    wins: Win[]
    timeline: TimelineMarker[]
    timestamp: number
    matchDuration: number
    radiantWin: boolean
    playerSlot: number

    // New hero average analysis fields
    focusArea?: FocusArea
    numbersThatMatter?: NumbersThatMatter[]
    isCoreVersion?: boolean
}

export interface FocusArea {
    id: string
    title: string
    description: string
    severity: number
    category: string
}

export interface NumbersThatMatter {
    kpi: string
    playerValue: number
    averageValue: number
    difference: number
    percentageDiff: number
    label: string
}

export interface ReportSummary {
    id: string
    matchId: string
    heroName: string
    role: string
    summary: string
    timestamp: number
}

// Hero Data Interfaces
export interface HeroMedian {
    hero_id: number
    name: string
    pos1?: HeroPositionData
    pos2?: HeroPositionData
    pos3?: HeroPositionData
    pos4?: HeroPositionData
    pos5?: HeroPositionData
}

export interface HeroPositionData {
    last_hits_10: number
    gpm: number
    xpm: number
    kill_participation: number
    hero_damage_per_min: number
    tower_damage_per_min: number
    deaths_per_10: number
    first_core_item_timing: number
    observers_placed: number
    sentries_placed: number
    stacks: number
}

// Rule Engine Interfaces
export interface Rule {
    id: string
    condition: RuleCondition
    fix: Fix
    priority: number
    roles: string[]
}

export interface RuleCondition {
    kpi: string
    operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt'
    value: number | string
    percentile?: boolean
}

// Hard-coded median values for now
export interface MedianValues {
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
}

// Replay Parsing Interfaces
export interface ParsingJobResponse {
    job: {
        jobId: number
    }
}

export interface JobStatusResponse {
    id: number
    type: string
    timestamp: string
    attempts: number
    data: {
        match_id: number
    }
    next_attempt_time: string
    priority: number
    jobId: number
}

export interface MatchParsingStatus {
    matchId: string
    isParsing: boolean
    jobId?: number
    lastChecked: number
} 