<template>
  <div class="min-h-screen bg-dark-bg scrollbar-dark">
    <header class="bg-dark-panel shadow-lg border-b border-dark-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-accent-primary">Replay Rune</h1>
            <span class="ml-2 text-sm text-text-secondary">Dota 2 Analysis</span>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink to="/"
              class="text-text-secondary hover:text-accent-primary px-3 py-2 rounded-md text-sm font-medium transition-colors focus-accent"
              active-class="text-accent-primary bg-accent-primary/10">
              Home
            </NuxtLink>
            <NuxtLink to="/history"
              class="text-text-secondary hover:text-accent-primary px-3 py-2 rounded-md text-sm font-medium transition-colors focus-accent"
              active-class="text-accent-primary bg-accent-primary/10">
              History
            </NuxtLink>
            <NuxtLink to="/subscribe"
              class="text-text-secondary hover:text-accent-primary px-3 py-2 rounded-md text-sm font-medium transition-colors focus-accent"
              active-class="text-accent-primary bg-accent-primary/10">
              Subscribe
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>
