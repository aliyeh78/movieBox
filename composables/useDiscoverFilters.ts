export const useDiscover = (
    type: "movie" | "tv",
    page: Ref<number>,
    filters: Ref<Record<string, any>>
) => {
    return useFetch('/api/tmdb/discover', {
        query: computed(() => ({
            type,
            page: page.value,
            ...filters.value
        })),
        key: () => `discover-${type}-${page.value}-${JSON.stringify(filters.value)}`,
        watch: [page, filters]
    })
}
