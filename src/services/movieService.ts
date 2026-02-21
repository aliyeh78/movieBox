import type { Movie, CastMember } from '@/types/movie'
import useApi from './apiService'

interface CreditsResponse {
  id: number
  cast: CastMember[]
}

type MediaType = 'movie' | 'tv'

export default {

  /** Get details (movie or tv) */
  async getById(id: number, type: MediaType): Promise<Movie> {
    const { get } = useApi()
    return await get<Movie>(`/${type}/${id}`)
  },

  /** Get credits (movie or tv) */
  async getCredits(id: number, type: MediaType): Promise<CreditsResponse> {
    const { get } = useApi()
    return await get<CreditsResponse>(`/${type}/${id}/credits`)
  }

}