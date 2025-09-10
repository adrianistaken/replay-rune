// Simple test script to verify the data comparison functionality
const fs = require("fs");

// Load the example data
const exampleData = JSON.parse(
  fs.readFileSync("example-stratz-api-response.json", "utf8")
);
const match = exampleData.data.match;
const player = match.players[0];

console.log("Testing data comparison functionality...");
console.log("Player:", player.hero.displayName);
console.log("Role:", player.role);

// Simulate the data comparison logic
function generateTimeSpecificDataComparison(
  metricName,
  time,
  playerData,
  heroAverageData
) {
  // Get player value at specific time (simplified)
  let playerValue;
  switch (metricName) {
    case "cs":
      playerValue = (playerData.lh_10 * time) / 10; // Estimate
      break;
    case "deaths":
      playerValue = (playerData.deaths_per10 * time) / 10; // Estimate
      break;
    default:
      playerValue = 0;
  }

  // Get hero average value at specific time
  const heroAvgData = heroAverageData
    .filter((avg) => avg.time <= time)
    .sort((a, b) => b.time - a.time)[0];

  if (!heroAvgData) {
    return `Your ${metricName} at ${time} minutes compared to similar players`;
  }

  let heroAverageValue;
  switch (metricName) {
    case "cs":
      heroAverageValue = heroAvgData.cs || 0;
      break;
    case "deaths":
      heroAverageValue =
        (heroAvgData.deaths / Math.max(heroAvgData.time, 1)) * time;
      break;
    default:
      heroAverageValue = 0;
  }

  if (heroAverageValue === null || heroAverageValue === 0) {
    return `Your ${metricName} at ${time} minutes compared to similar players`;
  }

  const delta = ((playerValue - heroAverageValue) / heroAverageValue) * 100;
  const deltaText =
    delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;

  return `Your ${metricName} at ${time} minutes: ${Math.round(
    playerValue
  )} vs Average: ${Math.round(heroAverageValue)} (${deltaText})`;
}

// Test the comparison
const playerData = {
  lh_10: player.stats?.lastHitsPerMinute?.[10] || 0,
  deaths_per10: (player.deaths / match.durationSeconds) * 600,
  heroName: player.hero.displayName,
};

const heroAverageData = player.heroAverage || [];

console.log("\n=== Test Results ===");
console.log("Player CS at 10 minutes:", playerData.lh_10);
console.log("Player deaths per 10:", playerData.deaths_per10);

// Test CS at 10 minutes
const csComparison = generateTimeSpecificDataComparison(
  "cs",
  10,
  playerData,
  heroAverageData
);
console.log("\nCS at 10 minutes comparison:");
console.log(csComparison);

// Test deaths at 20 minutes
const deathsComparison = generateTimeSpecificDataComparison(
  "deaths",
  20,
  playerData,
  heroAverageData
);
console.log("\nDeaths at 20 minutes comparison:");
console.log(deathsComparison);

console.log("\n=== Hero Average Data Sample ===");
if (heroAverageData.length > 0) {
  const sample10 = heroAverageData.find((avg) => avg.time === 10);
  const sample20 = heroAverageData.find((avg) => avg.time === 20);

  if (sample10) {
    console.log("Hero average at 10 minutes:");
    console.log("  CS:", sample10.cs);
    console.log("  Deaths:", sample10.deaths);
  }

  if (sample20) {
    console.log("Hero average at 20 minutes:");
    console.log("  CS:", sample20.cs);
    console.log("  Deaths:", sample20.deaths);
  }
}
