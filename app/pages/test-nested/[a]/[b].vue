<template>
    <div>
        <h1 style="background: brown; color: white; padding: 20px; margin: 20px;">
            NESTED DYNAMIC ROUTE TEST
        </h1>

        <div style="background: pink; color: black; padding: 20px; margin: 20px;">
            <strong>Nested Parameters:</strong><br>
            A: {{ $route.params.a }}<br>
            B: {{ $route.params.b }}
        </div>

        <div style="background: lightblue; color: black; padding: 20px; margin: 20px;">
            <strong>Test Message:</strong><br>
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Nested dynamic route is working!')
</script>