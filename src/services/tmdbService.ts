import type { MovieResponse } from "@/types/movie";
import useApi from "./apiService";


const endpoints = {
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  tv: "/tv/popular",
  streaming: "/discover/movie",
} as const;

export default {
  async getMovies(
    category: keyof typeof endpoints = "now_playing"
  ): Promise<MovieResponse> {
    const { get } = useApi();

    const path = endpoints[category] ?? endpoints.now_playing;

    // streaming needs extra params
    const params =
      category === "streaming"
        ? { with_watch_providers: 8, watch_region: "US" }
        : {};

    return await get<MovieResponse>(path, params);
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
