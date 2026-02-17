<template>
  <header class="bg-surface border-b border-white/5">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <h1 class="text-2xl font-bold text-accent">MovieBox</h1>

      <div class="flex items-center gap-6">
        <!-- Navigation -->
        <nav class="flex items-center gap-8 text-text-secondary">
          <NuxtLink to="/" class="hover:text-accent transition">Home</NuxtLink>
          <NuxtLink to="/movies" class="hover:text-accent transition"
            >Movies</NuxtLink
          >
          <NuxtLink to="/series" class="hover:text-accent transition"
            >Series</NuxtLink
          >
        </nav>

        <!-- Search -->
      <div class="relative w-64">
  <!-- INPUT -->
  <input
    v-model="query"
    type="text"
    placeholder="Search movies, series..."
    class="w-full bg-base text-text-primary placeholder-text-secondary
           border border-white/10 rounded-lg px-4 py-1 
           focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
           transition"
  />

  <!-- SEARCH BUTTON -->
  <button
    @click="onSearch"
    class="absolute right-2 top-1/2 -translate-y-1/2
           text-text-secondary hover:text-accent transition"
  >
    🔍
  </button>

  <!-- DROPDOWN -->
  <ul
    v-if="liveResults.length"
    class="absolute left-0 right-0 mt-2 bg-surface border border-white/10
           rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur"
  >
    <li
      v-for="item in liveResults"
      :key="item.id"
      @click="goToItem(item)"
      class="px-4 py-3 cursor-pointer flex items-center gap-3
             hover:bg-white/5 transition"
    >
      <!-- Poster -->
      <img
        v-if="item.poster_path"
        :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`"
        class="w-10 h-14 object-cover rounded"
      />

      <!-- Title -->
      <div class="flex flex-col">
        <span class="text-sm text-text-primary">
          {{ item.title || item.name }}
        </span>

        <span class="text-xs text-text-secondary">
          {{ item.media_type === 'movie' ? 'Movie' : 'TV Series' }}
        </span>
      </div>
    </li>
  </ul>
</div>

      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import searchTMDB from "~/services/searchApiService";
import type { SearchResult } from "~/types/search";

const router = useRouter();

const query = ref("");
const liveResults = ref<SearchResult[]>([]);
const loading = ref(false);

// -------------------------
// Debounce helper
// -------------------------
function debounce(fn: Function, delay = 700) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// -------------------------
// Fetch live search results
// -------------------------
async function fetchLiveResults(q: string) {
  if (!q.trim()) {
    liveResults.value = [];
    return;
  }

  loading.value = true;
  try {
    const data = await searchTMDB.search(q, 1);
    liveResults.value = data.results.slice(0, 5); // top 5 results
  } catch (e) {
    console.error("Search error:", e);
  } finally {
    loading.value = false;
  }
}

const debouncedSearch = debounce(() => fetchLiveResults(query.value), 700);

// watch typing
watch(query, () => {
  debouncedSearch();
});

// -------------------------
// Submit full search page
// -------------------------
function onSearch() {
  if (!query.value.trim()) return;
  router.push({ path: "/search", query: { q: query.value } });
  liveResults.value = [];
}

// -------------------------
// Go to result (movie or tv)
// -------------------------
function goToItem(item: SearchResult) {
  if (item.media_type === "movie") router.push(`/movies/${item.id}`);
  else if (item.media_type === "tv") router.push(`/series/${item.id}`);

  liveResults.value = [];
  query.value = "";
}
</script>
