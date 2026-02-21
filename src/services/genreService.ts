import type { Genre } from "@/types/movie";
import { useRuntimeConfig } from "nuxt/app";

export default function useGenreService() {
  const config = useRuntimeConfig();
  const API_KEY = config.public.tmdbKey;
  const BASE_URL = config.public.tmdbBase;

  // Fetch all movie genres from TMDB
  const getGenres = async (): Promise<Genre[]> => {
    const data = await $fetch<{ genres: Genre[] }>(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return data.genres;
  };

  return { getGenres };
}

