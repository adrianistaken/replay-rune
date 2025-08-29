// Item image utilities for CDN integration and optimization

const CDN_BASE_URL = 'https://cdn.cloudflare.steamstatic.com'
const FALLBACK_IMAGE = '/hero-fallback.svg'

/**
 * Converts a relative item image path to a full CDN URL
 * Strips trailing query parameters for stable cache keys
 */
export function normalizeItemImageUrl(relativePath: string): string {
    if (!relativePath) return FALLBACK_IMAGE

    // Remove trailing query parameter if present
    const cleanPath = relativePath.replace(/\?.*$/, '')

    // If it's already a full URL, return as is
    if (cleanPath.startsWith('http')) {
        return cleanPath
    }

    // Prepend CDN base URL
    return `${CDN_BASE_URL}${cleanPath}`
}

/**
 * Gets item image URL with fallback
 */
export function getItemImageUrl(itemData: any): string {
    if (!itemData || !itemData.img) {
        return FALLBACK_IMAGE
    }

    return normalizeItemImageUrl(itemData.img)
}

/**
 * Creates optimized image attributes for item images
 */
export function getOptimizedItemImageAttributes(src: string, alt: string, width: number = 48, height: number = 48) {
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