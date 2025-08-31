// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // Enable server-side API routes
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side only
    stratzApiToken: process.env.STRATZ_API_TOKEN,

    // Public (client-side)
    public: {
      // Add any public config here if needed
    }
  }
})