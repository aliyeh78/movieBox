<template>
  <header class="bg-surface border-b border-white/5 relative z-50">
    <div
      class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between"
    >
      <!-- Logo -->
      <h1 class="text-2xl font-bold text-accent">MovieBox</h1>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <nav class="flex items-center gap-8 text-text-secondary">
          <NuxtLink to="/" class="hover:text-accent transition">Home</NuxtLink>
          <NuxtLink to="/movies" class="hover:text-accent transition"
            >Movies</NuxtLink
          >
          <NuxtLink to="/series" class="hover:text-accent transition"
            >Series</NuxtLink
          >
        </nav>

        <!-- Desktop Search -->
        <div class="relative w-64">
          <input
            v-model="query"
            type="text"
            placeholder="Search movies, series..."
            class="w-full bg-base text-text-primary placeholder-text-secondary border border-white/10 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
          />

          <button
            @click="onSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent"
          >
            🔍
          </button>

          <!-- Live Results -->
          <ul
            v-if="liveResults.length"
            class="absolute left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <li
              v-for="item in liveResults"
              :key="item.id"
              @click="goToItem(item)"
              class="px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-white/5"
            >
              <img
                v-if="item.poster_path"
                :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`"
                class="w-10 h-14 object-cover rounded"
              />
              <div class="flex flex-col">
                <span class="text-sm text-text-primary">
                  {{ item.title || item.name }}
                </span>
                <span class="text-xs text-text-secondary">
                  {{ item.media_type === "movie" ? "Movie" : "TV Series" }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/auth"
            class="px-4 py-1 rounded bg-accent text-black font-semibold"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth"
            class="px-4 py-1 rounded border border-accent text-accent font-semibold"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>

      <!-- Hamburger -->
      <button
        class="md:hidden text-3xl text-text-primary"
        @click="mobileOpen = !mobileOpen"
      >
        ☰
      </button>
    </div>

    <!-- MOBILE MENU -->
    <transition name="slide">
      <div
        v-if="mobileOpen"
        class="md:hidden bg-surface border-t border-white/5 px-4 py-4 space-y-4"
      >
        <!-- Mobile Search -->
        <div class="relative">
          <input
            v-model="query"
            type="text"
            placeholder="Search movies..."
            class="w-full bg-base border border-white/10 rounded-lg px-4 py-2"
          />
        </div>

        <!-- Links -->
        <nav class="flex flex-col gap-4 text-lg">
          <NuxtLink @click="closeMobile" to="/">Home</NuxtLink>
          <NuxtLink @click="closeMobile" to="/movies">Movies</NuxtLink>
          <NuxtLink @click="closeMobile" to="/series">Series</NuxtLink>
          <NuxtLink @click="closeMobile" to="/my-favorite">Favorites</NuxtLink>
        </nav>

        <!-- Auth -->
        <div class="flex gap-3 pt-2">
          <NuxtLink
            to="/auth"
            class="flex-1 text-center py-2 rounded bg-accent text-black font-semibold"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth"
            class="flex-1 text-center py-2 rounded border border-accent text-accent font-semibold"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </transition>
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
const mobileOpen = ref(false);

function closeMobile() {
  mobileOpen.value = false;
}

function debounce(fn: Function, delay = 700) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function fetchLiveResults(q: string) {
  if (!q.trim()) {
    liveResults.value = [];
    return;
  }

  const data = await searchTMDB.search(q, 1);
  liveResults.value = data.results.slice(0, 5);
}

const debouncedSearch = debounce(() => fetchLiveResults(query.value), 700);
watch(query, () => debouncedSearch());

function onSearch() {
  if (!query.value.trim()) return;
  router.push({ path: "/search", query: { q: query.value } });
  liveResults.value = [];
}

function goToItem(item: SearchResult) {
  if (item.media_type === "movie") router.push(`/movie/${item.id}`);
  else router.push(`/serie/${item.id}`);

  liveResults.value = [];
  query.value = "";
  mobileOpen.value = false;
}
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
