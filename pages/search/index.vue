<template>
  <div class="max-w-7xl mx-auto px-6 pt-10">
    <h1 class="text-2xl font-bold mb-6">
      Search Results for "{{ searchQuery }}"
    </h1>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="results.length === 0">No results found.</div>

      <ul class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <li v-for="item in results" :key="item.id">
          <NuxtLink :to="getLink(item)">
            <img
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${item.poster_path}`"
              alt="poster"
              class="rounded-md"
            />
            <p class="mt-2 text-center">{{ item.title || item.name }}</p>
          </NuxtLink>
        </li>
      </ul>

      <!-- Pagination -->
      <div class="flex items-center justify-center py-6 gap-6">
        <!-- Previous -->
        <button
          @click="changePage(page - 1)"
          :disabled="page === 1"
          class="px-5 py-2 rounded-lg bg-surface border border-white/10 text-text-primary hover:bg-white/5 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>

        <!-- Page Indicator -->
        <span class="text-text-secondary text-sm tracking-wide">
          Page
          <span class="text-accent font-semibold">{{ page }}</span>
          of
          <span class="text-text-primary">{{ totalPages }}</span>
        </span>

        <!-- Next -->
        <button
          @click="changePage(page + 1)"
          :disabled="page === totalPages"
          class="px-5 py-2 rounded-lg bg-accent text-black font-medium hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-accent/20"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import searchTMDB from "~/services/searchApiService";
import type { SearchResponse } from "~/types/search";

const route = useRoute();
const router = useRouter();

const searchQuery = ref((route.query.q as string) || "");
const page = ref(Number(route.query.page) || 1);
const results = ref<any[]>([]);
const totalPages = ref(1);
const loading = ref(false);

// Fetch search results
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

// Update page
const changePage = (newPage: number) => {
  page.value = newPage;
  router.push({
    path: "/search",
    query: { q: searchQuery.value, page: page.value },
  });
};

// Watch query changes
watch(
  () => route.query,
  () => {
    searchQuery.value = (route.query.q as string) || "";
    page.value = Number(route.query.page) || 1;
    fetchResults();
  },
);

onMounted(fetchResults);

// Helper to link to movie or TV show
const getLink = (item: any) => {
  if (item.media_type === "movie") return `/movies/${item.id}`;
  if (item.media_type === "tv") return `/series/${item.id}`;
  return "#";
};
</script>
