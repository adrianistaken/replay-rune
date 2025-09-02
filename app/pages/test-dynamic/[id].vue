<template>
    <div>
        <h1 style="background: purple; color: white; padding: 20px; margin: 20px;">
            SIMPLE DYNAMIC ROUTE TEST
        </h1>

        <div style="background: orange; color: black; padding: 20px; margin: 20px;">
            <strong>ID Parameter:</strong><br>
            ID: {{ $route.params.id }}
        </div>

        <div style="background: cyan; color: black; padding: 20px; margin: 20px;">
            <strong>Test Message:</strong><br>
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Simple dynamic route is working!')
</script>