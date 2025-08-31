import { ref, computed, readonly } from 'vue'
import type { NormalizedHero, RawHero } from '~/utils/heroUtils'
import { normalizeHeroesData, getHeroById, getHeroImageUrl, getHeroIconUrl } from '~/utils/heroUtils'

// Global state for hero data
const heroes = ref<Record<string, NormalizedHero>>({})
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useHeroes() {
    /**
     * Load and normalize hero data from the constants file
     */
    async function loadHeroes() {
        if (Object.keys(heroes.value).length > 0) {
            return heroes.value // Already loaded
        }

        isLoading.value = true
        error.value = null

        try {
            const response = await fetch('/constants/heroes.json')
            if (!response.ok) {
                throw new Error(`Failed to load heroes: ${response.status}`)
            }

            const rawHeroes: Record<string, RawHero> = await response.json()
            heroes.value = normalizeHeroesData(rawHeroes)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load hero data'
            console.error('Error loading heroes:', err)
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Get hero by ID
     */
    function getHero(heroId: number): NormalizedHero | null {
        return getHeroById(heroes.value, heroId)
    }

    /**
     * Get hero image URL with fallback
     */
    function getHeroImg(heroId: number): string {
        // If heroes haven't been loaded yet, return fallback
        if (Object.keys(heroes.value).length === 0) {
            return '/hero-fallback.svg'
        }
        return getHeroImageUrl(heroes.value, heroId)
    }

    /**
     * Get hero icon URL with fallback
     */
    function getHeroIcon(heroId: number): string {
        // If heroes haven't been loaded yet, return fallback
        if (Object.keys(heroes.value).length === 0) {
            return '/hero-fallback.svg'
        }
        return getHeroIconUrl(heroes.value, heroId)
    }

    /**
     * Get all heroes as an array
     */
    const allHeroes = computed(() => {
        return Object.values(heroes.value)
    })

    /**
     * Get hero by name (case-insensitive)
     */
    function getHeroByName(name: string): NormalizedHero | null {
        const normalizedName = name.toLowerCase()
        return allHeroes.value.find(hero =>
            hero.name.toLowerCase().includes(normalizedName) ||
            hero.localized_name.toLowerCase().includes(normalizedName)
        ) || null
    }

    /**
     * Get heroes by role
     */
    function getHeroesByRole(role: string): NormalizedHero[] {
        const normalizedRole = role.toLowerCase()
        return allHeroes.value.filter(hero =>
            hero.roles.some(heroRole => heroRole.toLowerCase() === normalizedRole)
        )
    }

    return {
        // State
        heroes: readonly(heroes),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        allHeroes,

        // Methods
        loadHeroes,
        getHero,
        getHeroImg,
        getHeroIcon,
        getHeroByName,
        getHeroesByRole
    }
} 