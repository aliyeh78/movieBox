/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NUXT_PUBLIC_TMDB_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
