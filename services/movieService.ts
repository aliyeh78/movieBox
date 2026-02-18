import type { Movie, CastMember } from '@/types/movie'

interface CreditsResponse {
  id: number
  cast: CastMember[]
}

type MediaType = 'movie' | 'tv'

export default {

  /** Get details (movie or tv) */
  async getById(id: number, type: MediaType): Promise<Movie> {
    const config = useRuntimeConfig()

    return await $fetch(`/${type}/${id}`, {
      baseURL: config.public.tmdbBase,
      params: {
        api_key: config.public.tmdbKey,
        language: 'en-US'
      }
    })
  },

  /** Get credits (movie or tv) */
  async getCredits(id: number, type: MediaType): Promise<CreditsResponse> {
    const config = useRuntimeConfig()

    return await $fetch(`/${type}/${id}/credits`, {
      baseURL: config.public.tmdbBase,
      params: {
        api_key: config.public.tmdbKey,
        language: 'en-US'
      }
    })
  }

}
