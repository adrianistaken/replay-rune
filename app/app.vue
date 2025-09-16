<template>
  <div class="min-h-screen bg-dark-bg scrollbar-dark">
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
    }
  ]
})
</script>

<style>
/* Force CSS variables to load */
:root {
  --primary-color: #2C3E50 !important;
  /* Gunmetal - for primary buttons and highlights */
  --secondary-color: #6C7A89 !important;
  /* Misty Harbor Dawn - for secondary elements */
  --accent-color: #F4E7D3 !important;
  /* Peach Cream Puff - for accent buttons */
  --background-color: #2C3E50 !important;
  /* Gunmetal - main background */
  --card-background: #34495E !important;
  /* Deep Slate - card backgrounds */
  --text-primary: #F4E7D3 !important;
  /* Peach Cream Puff - primary text */
  --text-secondary: #C5C1BB !important;
  /* Dusty Elephant Hide - secondary text */
  --border-glow: #6C7A89 !important;
  /* Misty Harbor Dawn - for glows */
  --team-radiant: #F4E7D3 !important;
  /* Peach Cream Puff - Radiant team */
  --team-dire: #C5C1BB !important;
  /* Dusty Elephant Hide - Dire team */
  --accent-success: #10B981 !important;
  /* Emerald-500 - success states */
  --accent-error: #EF4444 !important;
  /* Red-500 - error states */
}

/* Override existing styles */
body {
  background-color: var(--background-color) !important;
  color: var(--text-primary) !important;
  font-family: 'Roboto', sans-serif !important;
}

html {
  background-color: var(--background-color) !important;
}

/* Remove all default borders and outlines */
* {
  outline: none !important;
}

button,
input,
textarea,
select {
  outline: none !important;
  border: none !important;
}

button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: none !important;
  border: none !important;
}

/* Background image enhancements */
.bg-dota2 {
  background-image: url('https://cdn.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Ensure content is readable over background */
.content-overlay {
  position: relative;
  z-index: 10;
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
</style>
