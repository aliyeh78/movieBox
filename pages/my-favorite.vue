<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h2 class="text-2xl font-bold mb-6 text-white">My Favorites</h2>

    <div v-if="favorites.length === 0" class="text-gray-400 text-center py-20">
      You have no favorite movies or series yet.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="item in favorites"
        :key="item.id + item.media_type"
        class="relative rounded-xl overflow-hidden shadow hover:scale-105 transition"
      >
        <NuxtLink :to="getLink(item)">
          <!-- Poster -->
          <img
            v-if="item.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
            :alt="item.title"
            class="w-full h-72 object-cover"
          />

          <!-- Info overlay -->
          <div class="absolute inset-0 flex items-end justify-between p-3 bg-black/30 opacity-0 hover:opacity-100 transition">
            <p class="text-white text-sm font-medium line-clamp-1">{{ item.title }}</p>

            <!-- Heart button -->
            <button
              @click.stop.prevent="toggleFavorite(item)"
              class="w-8 h-8 flex items-center justify-center text-red-500 hover:scale-110 transition"
            >
              <span v-if="isFavorite(item)">❤️</span>
              <span v-else>🤍</span>
            </button>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFavorites } from "~/composables/useFavorites";
import type { FavoriteItem } from "~/composables/useFavorites";

const fav = useFavorites();

// Use the reactive ref directly
const favorites = computed(() => fav.favorites.value as FavoriteItem[]);

// Toggle favorite on click
function toggleFavorite(item: FavoriteItem) {
  fav.toggle(item);
}

// Check if an item is favorite
function isFavorite(item: FavoriteItem) {
  return fav.isFavorite(item.id, item.media_type);
}

// Generate link for movie or tv
function getLink(item: FavoriteItem) {
  return item.media_type === "tv" ? `/serie/${item.id}` : `/movie/${item.id}`;
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
