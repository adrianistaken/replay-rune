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
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap'
    }
  ]
})
</script>

<style>
/* Force CSS variables to load */
:root {
  --primary-color: #cf5a2c !important;
  --secondary-color: #8a2be2 !important;
  --accent-color: #cf5a2c !important;
  --background-color: #1a1a2e !important;
  --card-background: #2a2a4a !important;
  --text-primary: #e0e0e0 !important;
  --text-secondary: #b0b0b0 !important;
  --border-glow: #0df2f2 !important;
  --team-radiant: #2ECCB0 !important;
  --team-dire: #E5534B !important;
  --accent-success: #2ECCB0 !important;
  --accent-error: #E5534B !important;
}

/* Override existing styles */
body {
  background-color: var(--background-color) !important;
  color: var(--text-primary) !important;
  font-family: 'Space Grotesk', sans-serif !important;
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
