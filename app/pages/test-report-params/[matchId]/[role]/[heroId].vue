<template>
    <div>
        <h1 style="background: darkblue; color: white; padding: 20px; margin: 20px;">
            REPORT PARAMETERS TEST
        </h1>

        <div style="background: lightblue; color: black; padding: 20px; margin: 20px;">
            <strong>Report-Style Parameters:</strong><br>
            Match ID: {{ $route.params.matchId }}<br>
            Role: {{ $route.params.role }}<br>
            Hero ID: {{ $route.params.heroId }}
        </div>

        <div style="background: orange; color: black; padding: 20px; margin: 20px;">
            <strong>Test Message:</strong><br>
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Report-style parameters are working!')
</script>