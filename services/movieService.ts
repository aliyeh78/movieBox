import type { Movie, CastMember } from '@/types/movie'

interface MovieCredits {
  id: number
  cast: CastMember[]
}

export default {

  /** Get movie details by ID */
  async getMovieById(id: number): Promise<Movie> {
    const config = useRuntimeConfig();

    return await $fetch(`/movie/${id}`, {
      baseURL: config.public.tmdbBase,
      params: {
        api_key: config.public.tmdbKey,
        language: 'en-US'
      }
    })
  },

  /** Get movie cast */
  async getMovieCredits(id: number): Promise<MovieCredits> {
    const config = useRuntimeConfig();

    return await $fetch(`/movie/${id}/credits`, {
      baseURL: config.public.tmdbBase,
      params: {
        api_key: config.public.tmdbKey,
        language: 'en-US'
      }
    })
  }

}
