<template>
  <div class="max-w-7xl mx-auto px-6 pt-10">
    <h1 class="text-2xl font-bold mb-6">
      Search Results for "{{ searchQuery }}"
    </h1>

    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <!-- Loading skeletons -->
      <div
        v-for="n in 10"
        :key="n"
        class="relative rounded-xl overflow-hidden bg-zinc-900 animate-pulse"
      >
        <div class="w-full h-[260px] bg-zinc-800"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-zinc-700 rounded w-3/4"></div>
          <div class="h-4 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <NuxtLink
        v-for="item in results"
        :key="item.id"
        :to="getLink(item)"
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
          <div  v-if="!item.poster_path"
            class="w-full h-[260px] bg-zinc-800 flex items-center justify-center text-gray-400 text-sm font-medium"
          >
            No Image
          </div>

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
                :title="item.title || item.name"
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

    <!-- Pagination -->
    <div class="flex items-center justify-center py-6 gap-6">
      <button
        @click="changePage(page - 1)"
        :disabled="page === 1"
        class="px-5 py-2 rounded-lg bg-surface border border-white/10 text-text-primary hover:bg-white/5 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        ← Previous
      </button>

      <span class="text-text-secondary text-sm tracking-wide">
        Page <span class="text-accent font-semibold">{{ page }}</span> of
        <span class="text-text-primary">{{ totalPages }}</span>
      </span>

      <button
        @click="changePage(page + 1)"
        :disabled="page === totalPages"
        class="px-5 py-2 rounded-lg bg-accent text-black font-medium hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-accent/20"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import searchTMDB from "~/services/searchApiService";
import type { SearchResponse } from "~/types/search";
import LazyImage from "~/components/ui/LazyImage.vue";
import FavoriteButton from "~/components/ui/FavoriteButton.vue";

const route = useRoute();
const router = useRouter();

const searchQuery = ref((route.query.q as string) || "");
const page = ref(Number(route.query.page) || 1);
const results = ref<any[]>([]);
const totalPages = ref(1);
const loading = ref(false);

const fetchResults = async () => {
  if (!searchQuery.value) return;
  loading.value = true;
  try {
    const data: SearchResponse = await searchTMDB.search(
      searchQuery.value,
      page.value,
    );
    results.value = data.results;
    totalPages.value = data.total_pages;
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  page.value = newPage;
  router.push({
    path: "/search",
    query: { q: searchQuery.value, page: page.value },
  });
};

watch(
  () => route.query,
  () => {
    searchQuery.value = (route.query.q as string) || "";
    page.value = Number(route.query.page) || 1;
    fetchResults();
  },
);

onMounted(fetchResults);

const getLink = (item: any) => {
  if (item.media_type === "movie") return `/movie/${item.id}`;
  if (item.media_type === "tv") return `/serie/${item.id}`;
  return "#";
};

// vote color helper
const getColor = (vote: number) => {
  if (vote >= 7) return "#22c55e";
  if (vote >= 5) return "#facc15";
  return "#ef4444";
};

const type = ref((route.query.type as string) || "movie");
</script>
