<template>
  <div class="movie-row my-6 py-6">
    <!-- Row title -->
    <h2 class="text-xl md:text-2xl font-bold mb-4 text-white p-1">
      {{ title }}
    </h2>

    <!-- Slider -->
    <BaseSlider :items="movies">
      <template #default="{ item: movie }">
        <NuxtLink
          :to="getLink(movie)"
          class="group cursor-pointer relative"
        >
          <div class="relative rounded-lg overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-110"
            />



            <!-- title hover -->
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-end p-3"
            >

              <!-- Circular vote -->
              <div class="absolute top-2 opacity-0 group-hover:opacity-100 left-2 z-20">
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
                      :stroke="getColor(movie.vote_average)"
                      stroke-width="3"
                      stroke-linecap="round"
                      fill="transparent"
                      :stroke-dasharray="100"
                      :stroke-dashoffset="100 - movie.vote_average * 10"
                      class="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span class="absolute text-[10px] font-bold text-white">
                    {{ Math.round(movie.vote_average * 10) }}
                  </span>
                </div>
              </div>
          
               <div
                class="absolute top-2 opacity-0 group-hover:opacity-100 right-2 z-20"
              >
                <FavoriteButton
                  :id="movie.id"
                  :media_type="movie.media_type"
                  :title="movie.title"
                  :poster_path="movie.poster_path"
                  :vote_average="movie.vote_average"
                />
              </div>
              <p class="opacity-0 group-hover:opacity-100 text-white text-sm">
                {{ movie.title }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </template>
    </BaseSlider>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Movie } from "@/types/movie";
import tmdbService from "@/services/tmdbService";
import BaseSlider from "@/components/ui/BaseSlider.vue";
import FavoriteButton from "@/components/ui/FavoriteButton.vue";

const props = defineProps<{
  title: string;
  category?:
    | "now_playing"
    | "popular"
    | "top_rated"
    | "upcoming"
    | "tv"
    | "streaming";
}>();

const movies = ref<Movie[]>([]);

const fetchMovies = async () => {
  if (!props.category) return;

  const data = await tmdbService.getMovies(props.category);

  movies.value = data.results.slice(0, 12).map((item) => ({
    ...item,
    media_type: props.category === "tv" ? "tv" : "movie", 
  }));
};


watch(() => props.category, fetchMovies, { immediate: true });

function getColor(vote: number) {
  if (vote >= 7) return "#22c55e";
  if (vote >= 5) return "#facc15";
  return "#ef4444";
}
function getLink(item: any) {
  if (item.media_type === "tv") return `/serie/${item.id}`;
  return `/movie/${item.id}`;
}

</script>

<style scoped>
.keen-slider::-webkit-scrollbar {
  display: none;
}
.keen-slider {
  scrollbar-width: none;
}
</style>
