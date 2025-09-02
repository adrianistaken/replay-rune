<template>
    <div>
        <h1 style="background: purple; color: white; padding: 20px; margin: 20px;">
            STATIC REPORT TEST PAGE
        </h1>

        <div style="background: cyan; color: black; padding: 20px; margin: 20px;">
            <strong>Static Test:</strong><br>
            This is a static page without dynamic routes<br>
            Message: {{ message }}<br>
            Count: {{ count }}
        </div>

        <button @click="increment" style="background: green; color: white; padding: 10px; margin: 10px;">
            Click me: {{ count }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Static report test working!')
const count = ref(0)

const increment = () => {
    count.value++
    console.log('Static page button clicked! Count:', count.value)
}
</script>