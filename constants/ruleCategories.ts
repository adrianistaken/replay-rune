/**
 * Rule Categories Configuration
 * 
 * This file defines all available categories for rules in the system.
 * Categories help organize rules and can be used for:
 * - Filtering rules by type
 * - Grouping rules in the UI
 * - Prioritizing certain categories
 * - Analytics and reporting
 */

export const RULE_CATEGORIES = {
    // Core gameplay categories
    LANING: 'Laning',
    FIGHTING: 'Fighting',
    ECONOMY: 'Economy',
    TEAMPLAY: 'Teamplay',
    OBJECTIVES: 'Objectives',
    IMPACT: 'Impact',
    SUPPORT: 'Support',
    PRESSURE: 'Pressure',

    // Specialized categories
    POSITIONING: 'Positioning',
    TIMING: 'Timing',
    RESOURCE_MANAGEMENT: 'Resource Management',
    MAP_AWARENESS: 'Map Awareness',
    ITEM_BUILD: 'Item Build',
    SKILL_USAGE: 'Skill Usage',
    VISION: 'Vision',
    COMMUNICATION: 'Communication',

    // Meta categories
    GENERAL: 'General',
    ADVANCED: 'Advanced',
    BEGINNER: 'Beginner',
    PRO: 'Pro'
} as const

export type RuleCategory = typeof RULE_CATEGORIES[keyof typeof RULE_CATEGORIES]

/**
 * Category descriptions for UI display
 */
export const CATEGORY_DESCRIPTIONS: Record<RuleCategory, string> = {
    [RULE_CATEGORIES.LANING]: 'Early game performance and lane efficiency',
    [RULE_CATEGORIES.FIGHTING]: 'Combat effectiveness and team fight participation',
    [RULE_CATEGORIES.ECONOMY]: 'Gold management and farming efficiency',
    [RULE_CATEGORIES.TEAMPLAY]: 'Team coordination and support activities',
    [RULE_CATEGORIES.OBJECTIVES]: 'Objective control and map pressure',
    [RULE_CATEGORIES.IMPACT]: 'Overall game impact and contribution',
    [RULE_CATEGORIES.SUPPORT]: 'Support-specific responsibilities and activities',
    [RULE_CATEGORIES.PRESSURE]: 'Map pressure and space creation',
    [RULE_CATEGORIES.POSITIONING]: 'Positioning in fights and on the map',
    [RULE_CATEGORIES.TIMING]: 'Timing of actions and item purchases',
    [RULE_CATEGORIES.RESOURCE_MANAGEMENT]: 'Management of health, mana, and cooldowns',
    [RULE_CATEGORIES.MAP_AWARENESS]: 'Awareness of enemy positions and map state',
    [RULE_CATEGORIES.ITEM_BUILD]: 'Item choices and build optimization',
    [RULE_CATEGORIES.SKILL_USAGE]: 'Ability usage and skill combinations',
    [RULE_CATEGORIES.VISION]: 'Ward placement and vision control',
    [RULE_CATEGORIES.COMMUNICATION]: 'Team communication and coordination',
    [RULE_CATEGORIES.GENERAL]: 'General gameplay improvements',
    [RULE_CATEGORIES.ADVANCED]: 'Advanced techniques and strategies',
    [RULE_CATEGORIES.BEGINNER]: 'Basic gameplay concepts',
    [RULE_CATEGORIES.PRO]: 'Professional-level gameplay'
}

/**
 * Category priorities for sorting and display
 * Lower numbers = higher priority
 */
export const CATEGORY_PRIORITIES: Record<RuleCategory, number> = {
    [RULE_CATEGORIES.LANING]: 1,
    [RULE_CATEGORIES.FIGHTING]: 2,
    [RULE_CATEGORIES.ECONOMY]: 3,
    [RULE_CATEGORIES.TEAMPLAY]: 4,
    [RULE_CATEGORIES.OBJECTIVES]: 5,
    [RULE_CATEGORIES.IMPACT]: 6,
    [RULE_CATEGORIES.SUPPORT]: 7,
    [RULE_CATEGORIES.PRESSURE]: 8,
    [RULE_CATEGORIES.POSITIONING]: 9,
    [RULE_CATEGORIES.TIMING]: 10,
    [RULE_CATEGORIES.RESOURCE_MANAGEMENT]: 11,
    [RULE_CATEGORIES.MAP_AWARENESS]: 12,
    [RULE_CATEGORIES.ITEM_BUILD]: 13,
    [RULE_CATEGORIES.SKILL_USAGE]: 14,
    [RULE_CATEGORIES.VISION]: 15,
    [RULE_CATEGORIES.COMMUNICATION]: 16,
    [RULE_CATEGORIES.GENERAL]: 17,
    [RULE_CATEGORIES.ADVANCED]: 18,
    [RULE_CATEGORIES.BEGINNER]: 19,
    [RULE_CATEGORIES.PRO]: 20
}

/**
 * Category colors for UI theming
 */
export const CATEGORY_COLORS: Record<RuleCategory, string> = {
    [RULE_CATEGORIES.LANING]: 'text-blue-400',
    [RULE_CATEGORIES.FIGHTING]: 'text-red-400',
    [RULE_CATEGORIES.ECONOMY]: 'text-yellow-400',
    [RULE_CATEGORIES.TEAMPLAY]: 'text-green-400',
    [RULE_CATEGORIES.OBJECTIVES]: 'text-purple-400',
    [RULE_CATEGORIES.IMPACT]: 'text-orange-400',
    [RULE_CATEGORIES.SUPPORT]: 'text-teal-400',
    [RULE_CATEGORIES.PRESSURE]: 'text-pink-400',
    [RULE_CATEGORIES.POSITIONING]: 'text-indigo-400',
    [RULE_CATEGORIES.TIMING]: 'text-cyan-400',
    [RULE_CATEGORIES.RESOURCE_MANAGEMENT]: 'text-amber-400',
    [RULE_CATEGORIES.MAP_AWARENESS]: 'text-emerald-400',
    [RULE_CATEGORIES.ITEM_BUILD]: 'text-violet-400',
    [RULE_CATEGORIES.SKILL_USAGE]: 'text-rose-400',
    [RULE_CATEGORIES.VISION]: 'text-sky-400',
    [RULE_CATEGORIES.COMMUNICATION]: 'text-lime-400',
    [RULE_CATEGORIES.GENERAL]: 'text-gray-400',
    [RULE_CATEGORIES.ADVANCED]: 'text-red-500',
    [RULE_CATEGORIES.BEGINNER]: 'text-green-500',
    [RULE_CATEGORIES.PRO]: 'text-purple-500'
}

/**
 * Helper function to validate if a category is valid
 */
export function isValidCategory(category: string): category is RuleCategory {
    return Object.values(RULE_CATEGORIES).includes(category as RuleCategory)
}

/**
 * Helper function to get category info
 */
export function getCategoryInfo(category: RuleCategory) {
    return {
        name: category,
        description: CATEGORY_DESCRIPTIONS[category],
        priority: CATEGORY_PRIORITIES[category],
        color: CATEGORY_COLORS[category]
    }
} 