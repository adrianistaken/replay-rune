import { ref, computed } from 'vue'
import type { MatchParsingStatus, OpenDotaMatch } from '~/types'

const parsingStatuses = ref<Map<string, MatchParsingStatus>>(new Map())
const parsedMatchData = ref<Map<string, OpenDotaMatch>>(new Map())

// Load parsing statuses from localStorage on initialization
if (process.client) {
    try {
        const stored = localStorage.getItem('replay-checker-parsing-status')
        if (stored) {
            const statuses = JSON.parse(stored)
            parsingStatuses.value = new Map(Object.entries(statuses))
        }
    } catch (error) {
        console.error('Failed to load parsing statuses:', error)
    }
}

// Save parsing statuses to localStorage whenever they change
const saveStatuses = () => {
    if (process.client) {
        try {
            const statusesObject = Object.fromEntries(parsingStatuses.value)
            localStorage.setItem('replay-checker-parsing-status', JSON.stringify(statusesObject))
        } catch (error) {
            console.error('Failed to save parsing statuses:', error)
        }
    }
}

export const useParsingStatus = () => {
    const isParsing = (matchId: string): boolean => {
        const status = parsingStatuses.value.get(matchId)
        return status?.isParsing || false
    }

    const setParsing = (matchId: string, jobId?: number) => {
        parsingStatuses.value.set(matchId, {
            matchId,
            isParsing: true,
            jobId,
            lastChecked: Date.now()
        })
        saveStatuses()
    }

    const setParsed = (matchId: string) => {
        parsingStatuses.value.set(matchId, {
            matchId,
            isParsing: false,
            lastChecked: Date.now()
        })
        saveStatuses()
    }

    const removeStatus = (matchId: string) => {
        parsingStatuses.value.delete(matchId)
        saveStatuses()
    }

    const getStatus = (matchId: string): MatchParsingStatus | undefined => {
        return parsingStatuses.value.get(matchId)
    }

    const getJobId = (matchId: string): number | undefined => {
        const status = parsingStatuses.value.get(matchId)
        return status?.jobId
    }

    const getAllParsingMatches = computed(() => {
        return Array.from(parsingStatuses.value.values()).filter(status => status.isParsing)
    })

    // Match data caching methods
    const cacheMatchData = (matchId: string, data: OpenDotaMatch) => {
        parsedMatchData.value.set(matchId, data)
    }

    const getCachedMatchData = (matchId: string): OpenDotaMatch | undefined => {
        return parsedMatchData.value.get(matchId)
    }

    const hasCachedMatchData = (matchId: string): boolean => {
        return parsedMatchData.value.has(matchId)
    }

    const clearCachedMatchData = (matchId: string) => {
        parsedMatchData.value.delete(matchId)
    }

    return {
        isParsing,
        setParsing,
        setParsed,
        removeStatus,
        getStatus,
        getJobId,
        getAllParsingMatches,
        cacheMatchData,
        getCachedMatchData,
        hasCachedMatchData,
        clearCachedMatchData
    }
} 