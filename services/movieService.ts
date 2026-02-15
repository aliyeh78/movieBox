// services/movieService.ts
import type { Movie, Genre } from '@/types/movie'

export default {
    /** Get movie details by ID */
    async getMovieById(id: number): Promise<Movie> {
        const config = useRuntimeConfig();
        const API_KEY = config.public.tmdbKey;
        const BASE_URL = config.public.tmdbBase;
        return await $fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`)
    }


}
