<template>
    <img :src="imageUrl" :alt="alt" :width="width" :height="height" :class="imageClass" loading="lazy" decoding="async"
        @error="handleImageError" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const { getHeroImg, getHeroIcon } = useHeroes()

const imageUrl = computed(() => {
    if (props.type === 'icon') {
        return getHeroIcon(props.heroId)
    }
    return getHeroImg(props.heroId)
})

const imageClass = computed(() => {
    return `rounded ${props.class}`.trim()
})

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/hero-fallback.webp'
}
</script>