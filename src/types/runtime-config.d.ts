

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    // private (server only)
  }

  interface PublicRuntimeConfig {
    tmdbKey: string
    tmdbBase: string
  }
}

export {}