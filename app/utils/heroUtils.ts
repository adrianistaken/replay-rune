// Hero image utilities for CDN integration and optimization

const CDN_BASE_URL = 'https://cdn.cloudflare.steamstatic.com'
const FALLBACK_IMAGE = '/hero-fallback.svg'

export interface NormalizedHero {
    id: number
    name: string
    localized_name: string
    img: string
    icon: string
    primary_attr: string
    attack_type: string
    roles: string[]
    [key: string]: any
}

export interface RawHero {
    id: number
    name: string
    localized_name: string
    img: string
    icon: string
    primary_attr: string
    attack_type: string
    roles: string[]
    [key: string]: any
}

/**
 * Normalizes hero data by converting relative image paths to full CDN URLs
 * and stripping trailing query parameters for stable cache keys
 */
export function normalizeHeroData(rawHero: RawHero): NormalizedHero {
    return {
        ...rawHero,
        img: normalizeImageUrl(rawHero.img),
        icon: normalizeImageUrl(rawHero.icon)
    }
}

/**
 * Converts a relative image path to a full CDN URL
 * Strips trailing query parameters for stable cache keys
 */
export function normalizeImageUrl(relativePath: string): string {
    if (!relativePath) return FALLBACK_IMAGE

    // Remove trailing query parameter if present
    const cleanPath = relativePath.replace(/\?$/, '')

    // If it's already a full URL, return as is
    if (cleanPath.startsWith('http')) {
        return cleanPath
    }

    // Prepend CDN base URL
    return `${CDN_BASE_URL}${cleanPath}`
}

/**
 * Normalizes an entire heroes object
 */
export function normalizeHeroesData(heroes: Record<string, RawHero>): Record<string, NormalizedHero> {
    const normalized: Record<string, NormalizedHero> = {}

    for (const [id, hero] of Object.entries(heroes)) {
        normalized[id] = normalizeHeroData(hero)
    }

    return normalized
}

/**
 * Creates optimized image attributes for Vue components
 */
export function getOptimizedImageAttributes(src: string, alt: string, width: number, height: number) {
    return {
        src,
        alt,
        width,
        height,
        loading: 'lazy' as const,
        decoding: 'async' as const,
        onerror: `this.src='${FALLBACK_IMAGE}'`
    }
}

/**
 * Gets hero data by ID with normalized image URLs
 */
export function getHeroById(heroes: Record<string, NormalizedHero>, heroId: number): NormalizedHero | null {
    return heroes[heroId.toString()] || null
}

/**
 * Gets hero image URL with fallback
 */
export function getHeroImageUrl(heroes: Record<string, NormalizedHero>, heroId: number): string {
    const hero = getHeroById(heroes, heroId)
    return hero?.img || FALLBACK_IMAGE
}

/**
 * Gets hero icon URL with fallback
 */
export function getHeroIconUrl(heroes: Record<string, NormalizedHero>, heroId: number): string {
    const hero = getHeroById(heroes, heroId)
    return hero?.icon || FALLBACK_IMAGE
} 