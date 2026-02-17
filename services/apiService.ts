export default function useApi() {
  const config = useRuntimeConfig();

  async function get<T>(endpoint: string, params: Record<string, any> = {}) {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.tmdbBase,
      params: {
        api_key: config.public.tmdbKey,
        language: "en-US",
        ...params,
      },
    });
  }

  return { get };
}
