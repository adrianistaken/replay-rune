<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">MVP Rule Engine Test</h1>
    
    <div class="space-y-4">
      <button @click="testRuleEngine" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Test Rule Engine
      </button>
      
      <div v-if="result" class="mt-4 p-4 bg-gray-100 rounded">
        <h3 class="font-bold">Result:</h3>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 rounded">
        <h3 class="font-bold">Error:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const result = ref(null)
const error = ref('')

const testRuleEngine = async () => {
  try {
    console.log('Testing MVP Rule Engine...')
    
    // Load example match data
    const response = await fetch('/example-stratz-api-response.json')
    const data = await response.json()
    const matchData = data
    
    console.log('Match data loaded:', matchData)
    
    // Test with first player
    const player = matchData.players[0]
    console.log('Using player:', player)
    
    // Import and test the rule engine
    const { MVPRuleEngine } = await import('../services/mvpRuleEngine')
    console.log('MVPRuleEngine imported successfully')
    
    const analysisResult = await MVPRuleEngine.analyze(matchData, player.playerSlot)
    console.log('Analysis completed:', analysisResult)
    
    result.value = analysisResult
    error.value = ''
    
  } catch (e) {
    console.error('Test failed:', e)
    error.value = e instanceof Error ? e.message : 'Unknown error'
    result.value = null
  }
}
</script>

