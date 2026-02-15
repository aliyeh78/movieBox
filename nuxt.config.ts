// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
      public: {
        tmdbKey: process.env.TMDB_API_KEY,
        tmdbBase: process.env.TMDB_BASE_URL
      
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    'keen-slider/keen-slider.min.css'
  ]

})
