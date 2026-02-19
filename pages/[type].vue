<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DiscoverFilters from '~/components/discover/Filters.vue'
import type { MovieResponse } from '~/types/movie'
import { getList } from '~/services/list.get'

const route = useRoute()
const router = useRouter()

// Map route param to TMDB type
const type = computed<"movie" | "tv">(() => {
  const t = route.params.type as string
  return t === "series" || t === "tv" ? "tv" : "movie"
})

// Build filters from query
const filters = computed(() => ({
  page: Number(route.query.page || 1),
  sort_by: route.query.sort_by || 'popularity.desc',
  'vote_average.gte': route.query['vote_average.gte'] || undefined,
  year: route.query.year || undefined,
  runtime: route.query.runtime || undefined,
  with_genres: route.query.with_genres || undefined
}))

// Fetch data using server service
const { data, pending, error } = await useAsyncData<MovieResponse>(
  `list-${type.value}-page-${filters.value.page}`,
  () => getList(type.value, filters.value),
  { watch: [() => route.fullPath] }
)

const results = computed(() => data.value?.results || [])
const currentPage = computed(() => data.value?.page || 1)
const totalPages = computed(() => data.value?.total_pages || 1)

// Pagination functions
function goToPage(page: number) {
  router.push({
    query: { ...route.query, page }
  })
}

// Correct link for movie/series details
function goToPageLink(t: "movie" | "tv") {
  return t === "tv" ? "serie" : "movie"
}
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8">

    <!-- Filters -->
    <DiscoverFilters />

    <!-- Movie/TV List -->
    <div class="md:col-span-3">

      <!-- Loading / Error -->
      <div v-if="pending" class="text-center py-20 text-gray-400">Loading...</div>
      <div v-else-if="error" class="text-center py-20 text-red-400">Something went wrong.</div>

      <!-- Results -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="item in results" :key="item.id" class="bg-surface rounded-xl overflow-hidden shadow hover:scale-105 transition">
          <NuxtLink :to="`/${goToPageLink(type)}/${item.id}`">
            <img v-if="item.poster_path" :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" class="w-full h-72 object-cover" />
            <div class="p-3 space-y-2">
              <h3 class="font-semibold text-sm line-clamp-1">{{ item.title  }}</h3>
              <p class="text-xs text-gray-400">⭐ {{ item.vote_average }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!pending && results.length === 0" class="text-center py-20 text-gray-400">No results found.</div>

      <!-- Pagination -->
      <div v-if="!pending && totalPages > 1" class="flex justify-center mt-8 gap-2">
        <button
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
          class="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"
        >
          Previous
        </button>

        <span class="px-4 py-2 bg-slate-900 rounded">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  </div>
</template>
