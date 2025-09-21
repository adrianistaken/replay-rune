<template>
    <div class="rounded-lg p-6 mb-8"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">

        <!-- Controls Header -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-[var(--text-primary)]">Analysis Controls</h3>
            <div class="text-sm text-[var(--text-secondary)]">
                Compare your performance across different ranks and time periods
            </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Rank Comparison Dropdown -->
            <div class="space-y-3">
                <label class="block text-sm font-medium text-[var(--text-primary)]">
                    Compare Against Rank
                </label>
                <select v-model="selectedBracketGrouping" @change="onBracketChange"
                    class="w-full px-4 py-3 bg-[var(--background-color)] border border-[var(--primary-color)]/30 rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200">
                    <option v-for="option in bracketOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <!-- Time Slider -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-[var(--text-primary)]">
                        Game Time
                    </label>
                    <div class="text-sm text-[var(--text-secondary)]">
                        {{ formatTime(selectedTime) }}
                    </div>
                </div>

                <div class="relative">
                    <input v-model="selectedTime" @input="onTimeChange" type="range" :min="0" :max="maxTime" step="1"
                        class="w-full h-2 bg-[var(--background-color)] rounded-lg appearance-none cursor-pointer slider" />

                </div>

                <!-- Match Count Display -->
                <div class="text-xs text-[var(--text-secondary)]">
                    <span v-if="isPastAvailableData" class="text-[var(--accent-warning)]">
                        Limited benchmark data beyond {{ latestAvailableDataTime }}min
                    </span>
                    <span v-else-if="matchCount > 0" class="text-[var(--accent-color)]">
                        Based on {{ matchCount.toLocaleString() }} matches
                    </span>
                    <span v-else-if="matchCount === 0" class="text-[var(--accent-error)]">
                        No data available for this bracket
                    </span>
                    <span v-else class="text-[var(--text-secondary)]">
                        <span
                            class="inline-block w-3 h-3 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mr-2"></span>
                        Loading match data...
                    </span>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="error"
            class="mt-4 p-3 bg-[var(--accent-error)]/20 border border-[var(--accent-error)]/30 rounded-md">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-[var(--accent-error)] mr-2" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-[var(--accent-error)]">{{ error }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getAvailableBracketGroupings, getBracketGroupingForQuery } from '../utils/heroUtils'

interface Props {
    heroId: number
    position: string
    matchDuration: number
    playerBracket: number
    bracketAveragesCache: any | null
}

const emit = defineEmits<{
    bracketChange: [bracketGrouping: string]
    timeChange: [time: number]
}>()

const props = defineProps<Props>()

// Debug logging for props
console.log('🔍 ReportControls props:', {
    heroId: props.heroId,
    position: props.position,
    matchDuration: props.matchDuration,
    playerBracket: props.playerBracket,
    bracketAveragesCache: props.bracketAveragesCache ? 'loaded' : 'null'
})

const selectedBracketGrouping = ref('')
const selectedTime = ref(0)
const error = ref('')

const bracketOptions = computed(() => getAvailableBracketGroupings())
const maxTime = computed(() => Math.floor(props.matchDuration / 60))

// Initialize with player's bracket
const initializeControls = () => {
    selectedBracketGrouping.value = getBracketGroupingForQuery(props.playerBracket)
    selectedTime.value = maxTime.value // Default to end of match
    console.log('🎯 Initialized controls:', {
        playerBracket: props.playerBracket,
        selectedBracketGrouping: selectedBracketGrouping.value,
        selectedTime: selectedTime.value
    })
}

// Initialize immediately if props are available
if (props.playerBracket !== undefined && props.playerBracket >= 0) {
    initializeControls()
}

const formatTime = (minutes: number): string => {
    return `${minutes}min`
}

const onBracketChange = () => {
    error.value = ''
    emit('bracketChange', selectedBracketGrouping.value)
}

const onTimeChange = () => {
    error.value = ''
    emit('timeChange', selectedTime.value)
}

// Watch for prop changes to reinitialize
watch(() => props.playerBracket, (newBracket) => {
    console.log('🔄 playerBracket changed:', newBracket)
    if (newBracket !== undefined && newBracket >= 0) {
        initializeControls()
    }
}, { immediate: true })

// Watch for bracketAveragesCache to become available
watch(() => props.bracketAveragesCache, (newCache) => {
    console.log('🔄 bracketAveragesCache changed:', newCache ? 'loaded' : 'null', 'selectedBracketGrouping:', selectedBracketGrouping.value)
    if (newCache && selectedBracketGrouping.value) {
        // Re-trigger the change event to update the analysis
        onBracketChange()
    }
}, { immediate: true })

// Computed match count for current selection
const matchCount = computed(() => {
    // If bracketAveragesCache is not loaded yet, show loading state
    if (!props.bracketAveragesCache) {
        return -1 // Loading state
    }

    // If no bracket selected yet, show loading state
    if (!selectedBracketGrouping.value) {
        return -1 // Loading state
    }

    // Convert position format from pos1 to POSITION_1 to match cache key format
    const positionKey = props.position.toUpperCase().replace('POS', 'POSITION_')
    const key = `${props.heroId}-${positionKey}-${selectedBracketGrouping.value}`
    const bracketData = props.bracketAveragesCache[key]

    console.log('🔍 Debug matchCount:', {
        key,
        bracketData: bracketData ? 'exists' : 'null',
        dataLength: bracketData?.data?.length || 0,
        selectedTime: selectedTime.value,
        selectedBracket: selectedBracketGrouping.value,
        heroId: props.heroId,
        originalPosition: props.position,
        convertedPosition: positionKey,
        cacheKeys: props.bracketAveragesCache ? Object.keys(props.bracketAveragesCache) : 'no cache'
    })

    if (!bracketData || !bracketData.data || bracketData.data.length === 0) {
        console.log('❌ No bracket data available for key:', key)
        return 0 // No data available
    }

    // Find data at or before the selected time (like your example - data at 35min should be used for 35min+)
    let closestData = null
    let isPastAvailableData = false

    console.log('📊 Available data times:', bracketData.data.map((d: any) => d.time).sort((a: number, b: number) => a - b))

    // First, try to find data at or before the selected time
    const dataAtOrBefore = bracketData.data
        .filter((data: any) => data.time <= selectedTime.value)
        .sort((a: any, b: any) => b.time - a.time) // Sort by time descending to get the latest available data

    console.log('🔍 Data at or before selected time:', dataAtOrBefore.length, 'items')

    if (dataAtOrBefore.length > 0) {
        closestData = dataAtOrBefore[0] // Use the latest data at or before the selected time
        console.log('✅ Using data at time:', closestData.time, 'for selected time:', selectedTime.value)
    } else {
        // If no data at or before the selected time, use the latest available data
        closestData = bracketData.data
            .sort((a: any, b: any) => b.time - a.time)[0]
        isPastAvailableData = true
        console.log('⚠️ No data at or before selected time, using latest:', closestData.time)
    }

    // Only return 0 (no data) if we truly have no data at all
    if (!closestData) {
        return 0 // No data available
    }

    const matchCount = closestData.matchCount || 0

    console.log('🎯 Final matchCount result:', matchCount, 'for time:', selectedTime.value)

    // Log the average data being used for comparison
    if (matchCount > 0 && closestData) {
        console.log(`📊 Comparing against ${selectedBracketGrouping.value} averages at ${closestData.time}min:`, {
            matches: matchCount,
            time: closestData.time,
            kills: closestData.kills?.toFixed(1) || 0,
            deaths: closestData.deaths?.toFixed(1) || 0,
            networth: closestData.networth?.toFixed(0) || 0,
            level: closestData.level?.toFixed(1) || 0,
            cs: closestData.cs?.toFixed(1) || 0,
            denies: closestData.dn?.toFixed(1) || 0,
            heroDamage: closestData.heroDamage?.toFixed(0) || 0,
            towerDamage: closestData.towerDamage?.toFixed(0) || 0,
            gpm: closestData.goldPerMinute?.toFixed(1) || 0,
            xpm: closestData.xp?.toFixed(1) || 0
        })
    } else {
        console.log('⚠️ No match data found for this time/bracket combination')
    }

    return matchCount
})

const isPastAvailableData = computed(() => {
    if (!props.bracketAveragesCache || !selectedBracketGrouping.value) {
        return false
    }

    const positionKey = props.position.toUpperCase().replace('POS', 'POSITION_')
    const key = `${props.heroId}-${positionKey}-${selectedBracketGrouping.value}`
    const bracketData = props.bracketAveragesCache[key]

    if (!bracketData || !bracketData.data || bracketData.data.length === 0) {
        return false
    }

    // Check if selected time is past the latest available data
    const latestDataTime = Math.max(...bracketData.data.map((d: any) => d.time))
    return selectedTime.value > latestDataTime
})

const latestAvailableDataTime = computed(() => {
    if (!props.bracketAveragesCache || !selectedBracketGrouping.value) {
        return 0
    }

    const positionKey = props.position.toUpperCase().replace('POS', 'POSITION_')
    const key = `${props.heroId}-${positionKey}-${selectedBracketGrouping.value}`
    const bracketData = props.bracketAveragesCache[key]

    if (!bracketData || !bracketData.data || bracketData.data.length === 0) {
        return 0
    }

    return Math.max(...bracketData.data.map((d: any) => d.time))
})

// Expose methods for parent component
defineExpose({
    setError: (message: string) => {
        error.value = message
    },
    clearError: () => {
        error.value = ''
    }
})
</script>

<style scoped>
/* Slider styling */
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: 2px solid var(--background-color);
    box-shadow: 0 0 10px rgba(207, 90, 44, 0.5);
}

.slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: 2px solid var(--background-color);
    box-shadow: 0 0 10px rgba(207, 90, 44, 0.5);
}
</style>
