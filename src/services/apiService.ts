import { useRuntimeConfig } from "nuxt/app";

export default function useApi() {
  const config = useRuntimeConfig();

  async function get<T>(endpoint: string, params: Record<string, any> = {}) {
    return await $fetch<T>(endpoint, {
      params: {
        baseURL: config.public.tmdbBase,
        api_key: config.public.tmdbKey,
        language: "en-US",
        ...params,
      },
    });
  }

  return { get };
}
