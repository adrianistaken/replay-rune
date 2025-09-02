<template>
    <div>
        <h1 style="background: green; color: white; padding: 20px; margin: 20px;">
            VUE IS WORKING - TEST PAGE
        </h1>

        <div style="background: orange; color: black; padding: 20px; margin: 20px;">
            <strong>Test Values:</strong><br>
            Message: {{ message }}<br>
            Count: {{ count }}<br>
            <button @click="increment" style="background: blue; color: white; padding: 10px; margin: 10px;">
                Click me to increment: {{ count }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello from Vue!')
const count = ref(0)

const increment = () => {
    count.value++
    console.log('Button clicked! Count is now:', count.value)
}
</script>