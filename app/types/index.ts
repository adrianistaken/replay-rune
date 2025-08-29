// Dota 2 Match Data Interfaces
export interface OpenDotaMatch {
    match_id: number
    radiant_win: boolean
    duration: number
    players: OpenDotaPlayer[]
    picks_bans?: OpenDotaPickBan[]
    objectives?: OpenDotaObjective[]
    od_data?: OpenDotaData
}

export interface OpenDotaData {
    has_api: boolean
    has_gcdata: boolean
    has_parsed: boolean
    has_archive: boolean
}

export interface OpenDotaPlayer {
    account_id: number
    player_slot: number
    hero_id: number
    item_0: number
    item_1: number
    item_2: number
    item_3: number
    item_4: number
    item_5: number
    kills: number
    deaths: number
    assists: number
    leaver_status: number
    last_hits: number
    denies: number
    gold_per_min: number
    xp_per_min: number
    level: number
    gold: number
    gold_spent: number
    hero_damage: number
    tower_damage: number
    hero_healing: number
    obs_placed?: number
    sen_placed?: number
    creeps_stacked?: number
    camps_stacked?: number
    rune_pickups?: number
    firstblood_claimed?: number
    stuns?: number
    max_hero_hit?: string
    max_hero_hit_value?: number
    teamfight_participation?: number
    tower_kills?: number
    roshan_kills?: number
    observers_placed?: number
    sentries_placed?: number
    purchase_log?: PurchaseLogEntry[]
    benchmarks?: { [key: string]: { raw: number; pct: number } }
}

export interface OpenDotaPickBan {
    is_pick: boolean
    hero_id: number
    team: number
    order: number
}

export interface OpenDotaObjective {
    time: number
    type: string
    slot: number
    key: number
    player_slot: number
}

export interface PurchaseLogEntry {
    time: number
    key: string
    charges?: number
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

    // Benchmark data from OpenDota
    benchmarks?: { [key: string]: { raw: number; pct: number } }
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