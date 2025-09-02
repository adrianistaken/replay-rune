<template>
    <div v-if="heroesLoading" class="bg-gray-600 animate-pulse rounded"
        :style="{ width: `${width}px`, height: `${height}px` }"></div>
    <img v-else :src="imageUrl" :alt="alt" :width="width" :height="height" :class="imageClass" loading="lazy"
        decoding="async" @error="handleImageError" @load="handleImageLoad"
        :style="{ opacity: imageLoaded ? 1 : 0.7 }" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHeroes } from '../composables/useHeroes'

interface Props {
    heroId: number
    type?: 'img' | 'icon'
    width?: number
    height?: number
    class?: string
    alt?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'img',
    width: 64,
    height: 64,
    class: '',
    alt: 'Hero'
})

const { getHeroImg, getHeroIcon, isLoading: heroesLoading } = useHeroes()

const imageLoaded = ref(false)
const imageError = ref(false)

const imageUrl = computed(() => {
    // If heroes are still loading, show fallback
    if (heroesLoading.value) {
        return '/hero-fallback.svg'
    }

    const url = props.type === 'icon' ? getHeroIcon(props.heroId) : getHeroImg(props.heroId)

    // Debug: Log the generated URL for troubleshooting
    if (process.env.NODE_ENV === 'development') {
        console.log(`HeroImage: Hero ${props.heroId}, Type: ${props.type}, URL: ${url}`)
    }

    return url
})

// Watch for when hero data becomes available and reload image
watch(heroesLoading, (newLoading) => {
    if (!newLoading) {
        // Reset image state when heroes finish loading
        imageLoaded.value = false
        imageError.value = false
    }
})

const imageClass = computed(() => {
    return `rounded ${props.class}`.trim()
})

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    console.warn(`Failed to load hero image for hero ${props.heroId}, falling back to default`)
    img.src = '/hero-fallback.svg'
    imageLoaded.value = true
    imageError.value = true
}

const handleImageLoad = () => {
    imageLoaded.value = true
}
</script>