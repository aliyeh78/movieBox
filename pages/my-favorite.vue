<template>
  <div class="max-w-7xl mx-auto py-10 px-4">
    <!-- Title -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-text-primary tracking-wide">
        My Favorites
      </h2>
      <span class="text-sm text-text-secondary">
        {{ favorites.length }} items
      </span>
    </div>

    <!-- Empty state -->
    <div
      v-if="favorites.length === 0"
      class="flex flex-col items-center justify-center text-center py-28 text-text-secondary"
    >
      <div class="text-6xl mb-4">💔</div>
      <p class="text-lg font-medium">No favorites yet</p>
      <p class="text-sm opacity-70 mt-1">
        Start adding movies or series to see them here
      </p>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7"
    >
      <div
        v-for="item in favorites"
        :key="item.id + item.media_type"
        class="group relative rounded-2xl overflow-hidden bg-surface shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <NuxtLink :to="getLink(item)">
          <!-- Poster -->
          <img
            v-if="item.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
            :alt="item.title"
            class="w-full h-[270px] object-cover"
          />

          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition"
          />

          <!-- Rating -->
       <!-- Circular vote -->
              <div v-if="item.vote_average" class="absolute top-2 opacity-0 group-hover:opacity-100 left-2 z-20">
                <div
                  class="relative w-8 h-8 bg-black/70 rounded-full flex items-center justify-center"
                >
                  <svg class="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
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

          <!-- Favorite Button (always visible) -->
          <button
            @click.stop.prevent="toggleFavorite(item)"
            class="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition"
          >
            <span v-if="isFavorite(item)" class="text-red-500 text-lg">❤️</span>
            <span v-else class="text-white/70 text-lg">🤍</span>
          </button>

          <!-- Title -->
          <div class="absolute bottom-0 p-3 w-full">
            <p class="text-sm font-semibold text-white line-clamp-2">
              {{ item.title }}
            </p>
            <p class="text-xs text-text-secondary capitalize mt-1">
              {{ item.media_type }}
            </p>
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
const favorites = computed(() => fav.favorites.value as FavoriteItem[]);

function toggleFavorite(item: FavoriteItem) {
  fav.toggle(item);
}

function isFavorite(item: FavoriteItem) {
  return fav.isFavorite(item.id, item.media_type);
}

function getLink(item: FavoriteItem) {
  return item.media_type === "tv" ? `/series/${item.id}` : `/movie/${item.id}`;
}
function getColor(vote: number) {
  if (vote >= 7) return "#22c55e";
  if (vote >= 5) return "#facc15";
  return "#ef4444";
}
</script>
<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
