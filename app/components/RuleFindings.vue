<template>
  <div class="rule-findings">
    <!-- Summary -->
    <div class="summary-card mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Analysis Summary</h3>
      <p class="text-blue-800">{{ summary }}</p>
    </div>

    <!-- Findings Cards -->
    <div class="findings-grid space-y-4">
      <div
        v-for="finding in findings"
        :key="finding.id"
        class="finding-card p-4 border rounded-lg"
        :class="getCardClasses(finding)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <h4 class="text-lg font-semibold">{{ finding.header }}</h4>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getSeverityClasses(finding.severityBucket)"
            >
              {{ finding.severityBucket }}
            </span>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getTypeClasses(finding.type)"
            >
              {{ finding.type === 'win' ? 'Strength' : 'Improvement' }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-700 mb-3">{{ finding.description }}</p>

        <!-- Evidence -->
        <div v-if="finding.evidence.length > 0" class="evidence-section">
          <h5 class="text-sm font-medium text-gray-600 mb-2">Evidence:</h5>
          <div class="space-y-1">
            <div
              v-for="(evidence, index) in finding.evidence"
              :key="index"
              class="text-sm text-gray-600"
            >
              <span class="font-medium">{{ evidence.kpi }}:</span>
              <span class="ml-1">{{ formatValue(evidence.playerValue) }}</span>
              <span class="text-gray-500">vs</span>
              <span class="ml-1">{{ formatValue(evidence.benchmarkValue) }}</span>
              <span
                class="ml-2 px-1 py-0.5 text-xs rounded"
                :class="evidence.delta >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ formatDelta(evidence.delta) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Category -->
        <div class="mt-3 pt-3 border-t border-gray-200">
          <span class="text-xs text-gray-500">{{ finding.category }}</span>
        </div>
      </div>
    </div>

    <!-- No findings message -->
    <div v-if="findings.length === 0" class="text-center py-8 text-gray-500">
      <p>No specific findings to report. Your performance was within normal ranges.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RuleResult } from '../services/mvpRuleEngine'

interface Props {
  summary: string
  findings: RuleResult[]
}

defineProps<Props>()

const getCardClasses = (finding: RuleResult) => {
  const baseClasses = 'border-l-4'
  
  if (finding.type === 'win') {
    return `${baseClasses} border-green-400 bg-green-50`
  } else {
    return `${baseClasses} border-red-400 bg-red-50`
  }
}

const getSeverityClasses = (severity: string) => {
  switch (severity) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800'
    case 'CRITICAL':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeClasses = (type: string) => {
  if (type === 'win') {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  } else if (value < 1) {
    return value.toFixed(3)
  } else {
    return Math.round(value).toString()
  }
}

const formatDelta = (delta: number): string => {
  const percentage = (delta * 100).toFixed(1)
  return delta >= 0 ? `+${percentage}%` : `${percentage}%`
}
</script>

<style scoped>
.rule-findings {
  max-width: 800px;
  margin: 0 auto;
}

.finding-card {
  transition: all 0.2s ease;
}

.finding-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.evidence-section {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}
</style>

