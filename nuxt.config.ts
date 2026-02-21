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
  ],
 srcDir: 'src/',
   serverDir: 'src/server',
  dir: {
    public: 'src/public',
    modules: 'src/modules',
    shared: 'src/shared',
  },

})
