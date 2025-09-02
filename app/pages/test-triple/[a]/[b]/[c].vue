<template>
    <div>
        <h1 style="background: darkgreen; color: white; padding: 20px; margin: 20px;">
            THREE-LEVEL NESTED DYNAMIC ROUTE TEST
        </h1>

        <div style="background: lightgreen; color: black; padding: 20px; margin: 20px;">
            <strong>Three-Level Parameters:</strong><br>
            A: {{ $route.params.a }}<br>
            B: {{ $route.params.b }}<br>
            C: {{ $route.params.c }}
        </div>

        <div style="background: yellow; color: black; padding: 20px; margin: 20px;">
            <strong>Test Message:</strong><br>
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Three-level nested dynamic route is working!')
</script>