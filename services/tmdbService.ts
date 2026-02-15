// services/tmdbService.ts
import type { MovieResponse } from "@/types/movie";

const endpoints: Record<string, string> = {
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  tv: "/tv/popular",
  streaming: "/discover/movie?with_watch_providers=8&watch_region=US",
};

export default {
  async getMovies(category: keyof typeof endpoints = "now_playing"): Promise<MovieResponse> {
    const config = useRuntimeConfig();
    const API_KEY = config.public.tmdbKey;
    const BASE_URL = config.public.tmdbBase;

    // ✅ default to now_playing if invalid category
    const pathRaw = endpoints[category];
    const path = pathRaw ?? endpoints.now_playing;

    // ✅ now path is guaranteed string
    const url = `${BASE_URL}${path}${path?.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

    return await $fetch<MovieResponse>(url);
  },

  async getNowPlaying() {
    return this.getMovies("now_playing");
  },
  async getPopular() {
    return this.getMovies("popular");
  },
  async getTopRated() {
    return this.getMovies("top_rated");
  },
  async getUpcoming() {
    return this.getMovies("upcoming");
  },
  async getTV() {
    return this.getMovies("tv");
  },
  async getStreaming() {
    return this.getMovies("streaming");
  },
};
