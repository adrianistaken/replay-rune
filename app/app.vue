<template>
  <div class="min-h-screen bg-gray-900">
    <header class="bg-gray-800 shadow-lg border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-orange-400">Replay Rune</h1>
            <span class="ml-2 text-sm text-gray-400">Dota 2 Analysis</span>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink to="/"
              class="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-orange-400 bg-orange-900/20">
              Home
            </NuxtLink>
            <NuxtLink to="/history"
              class="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-orange-400 bg-orange-900/20">
              History
            </NuxtLink>
            <NuxtLink to="/subscribe"
              class="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-orange-400 bg-orange-900/20">
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
