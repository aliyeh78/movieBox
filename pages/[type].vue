<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DiscoverFilters from "~/components/discover/Filters.vue";
import type { MovieResponse } from "~/types/movie";
import { getList } from "~/services/list.get";
import LazyImage from "~/components/ui/LazyImage.vue";
import FavoriteButton from "~/components/ui/FavoriteButton.vue";

const route = useRoute();
const router = useRouter();

// Map route param to TMDB type
const type = computed<"movie" | "tv">(() => {
  const t = route.params.type as string;
  return t === "series" || t === "tv" ? "tv" : "movie";
});

// Build filters from query
const filters = computed(() => ({
  page: Number(route.query.page || 1),
  sort_by: route.query.sort_by || "popularity.desc",
  "vote_average.gte": route.query["vote_average.gte"] || undefined,
  year: route.query.year || undefined,
  runtime: route.query.runtime || undefined,
  with_genres: route.query.with_genres || undefined,
}));

// Fetch data using server service
const { data, pending, error } = await useAsyncData<MovieResponse>(
  `list-${type.value}-page-${filters.value.page}`,
  () => getList(type.value, filters.value),
  { watch: [() => route.fullPath] },
);

const results = computed(() => data.value?.results || []);
const currentPage = computed(() => data.value?.page || 1);
const totalPages = computed(() => data.value?.total_pages || 1);

// Pagination functions
function goToPage(page: number) {
  router.push({
    query: { ...route.query, page },
  });
}
function getColor(vote: number) {
  if (vote >= 7) return "#22c55e";
  if (vote >= 5) return "#facc15";
  return "#ef4444";
}
// Correct link for movie/series details
function goToPageLink(t: "movie" | "tv") {
  return t === "tv" ? "serie" : "movie";
}

const getItemTitle = (item: (typeof results.value)[0]) =>
  item.title || item.name || "Untitled";
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
    <!-- Filters -->
    <DiscoverFilters />

    <!-- Movie/TV List -->
    <div class="md:col-span-3">
      <!-- Loading / Error -->
      <div v-if="pending" class="text-center py-20 text-gray-400">
        Loading...
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-400">
        Something went wrong.
      </div>

      <!-- Results -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <NuxtLink
          v-for="item in results"
          :key="item.id"
          :to="`/${goToPageLink(type)}/${item.id}`"
          class="group relative cursor-pointer"
        >
          <!-- Poster -->
          <div class="relative rounded-xl overflow-hidden bg-zinc-900">
            <LazyImage
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-[260px] object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-3"
            >
              <!-- Vote circle -->
              <div class="absolute top-2 left-2 z-20">
                <div
                  class="relative w-9 h-9 bg-black/70 backdrop-blur rounded-full flex items-center justify-center"
                >
                  <svg class="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke="#3d3d3d"
                      stroke-width="3"
                      fill="transparent"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      :stroke="getColor(item.vote_average)"
                      stroke-width="3"
                      stroke-linecap="round"
                      fill="transparent"
                      :stroke-dasharray="100"
                      :stroke-dashoffset="100 - item.vote_average * 10"
                      class="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span class="absolute text-[10px] font-bold text-white">
                    {{ Math.round(item.vote_average * 10) }}
                  </span>
                </div>
              </div>

              <!-- Favorite button -->
              <div class="absolute top-2 right-2 z-20">
                <FavoriteButton
                  :id="item.id"
                  :media_type="type === 'tv' ? 'tv' : 'movie'"
                  :title="getItemTitle(item)"
                  :poster_path="item.poster_path"
                  :vote_average="item.vote_average"
                />
              </div>

              <!-- Title -->
              <p class="text-white text-sm font-medium line-clamp-2">
                {{ item.title || item.name }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
      <!-- Empty -->
      <div
        v-if="!pending && results.length === 0"
        class="text-center py-20 text-gray-400"
      >
        No results found.
      </div>

      <!-- Pagination -->
      <div
        v-if="!pending && totalPages > 1"
        class="flex justify-center mt-8 gap-2"
      >
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
