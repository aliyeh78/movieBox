// server/api/list.get.ts
import { useRuntimeConfig } from 'nuxt/app'
import type { MovieResponse } from '~/types/movie'

export async function getList(
  type: "movie" | "tv" = "movie",
  filters: Record<string, any> = {}
): Promise<MovieResponse> {
  const config = useRuntimeConfig()

  // Map TV filter year to TMDB's first_air_date_year
  if (type === "tv" && filters.year) {
    filters.first_air_date_year = filters.year
    delete filters.year
  }
    
  return await $fetch<MovieResponse>(`${config.public.tmdbBase}/discover/${type}`, {
    params: {
      api_key: config.public.tmdbKey,
      language: "en-US",
      include_adult: false,
      page: filters.page || 1,
      ...filters
    }
  })
}

export default getList
