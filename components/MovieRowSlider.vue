<template>
  <div class="movie-row my-8 py-8">
    <!-- Row title -->
    <h2 class="text-xl md:text-2xl font-bold mb-4 text-white p-1">
      {{ title }}
    </h2>

    <!-- Slider -->
    <div
      ref="sliderRef"
      class="keen-slider"
      @mouseenter="pauseAutoplay"
      @mouseleave="startAutoplay"
    >
      <NuxtLink
        v-for="movie in movies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="keen-slider__slide group cursor-pointer relative"
      >
        <!-- Poster container -->
        <div class="relative rounded-lg overflow-hidden">
          <!-- Movie Poster -->
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <!-- Circular vote -->
          <div class="absolute top-2 left-2 z-20">
            <div
              class="relative w-8 h-8 bg-black/70 rounded-full flex items-center justify-center"
            >
              <svg class="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" stroke="#3d3d3d" stroke-width="3" fill="transparent" />
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

          <!-- Hover overlay with title -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition duration-300 flex items-end p-3"
          >
            <div class="opacity-0 group-hover:opacity-100 transition">
              <p class="text-sm font-semibold text-white line-clamp-2">
                {{ movie.title }}
              </p>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";
import type { Movie } from "@/types/movie";
import tmdbService from "@/services/tmdbService";

// --------------------
// Props
// --------------------
const props = defineProps<{
  title: string;
  category?: "now_playing" | "popular" | "top_rated" | "upcoming" | "tv" | "streaming";
}>();

// --------------------
// State
// --------------------
const movies = ref<Movie[]>([]);
const sliderRef = ref<HTMLDivElement | null>(null);
let slider: KeenSliderInstance | null = null;
let autoplay: ReturnType<typeof setInterval>;

// --------------------
// Fetch movies
// --------------------
const fetchMovies = async () => {
  if (!props.category) return;
  const data = await tmdbService.getMovies(props.category);
  movies.value = data.results.slice(0, 12);
};

watch(() => props.category, fetchMovies, { immediate: true });

// --------------------
// Initialize slider
// --------------------
watch(
  movies,
  async (m) => {
    if (!m?.length) return;
    await nextTick();

    slider?.destroy();
    clearInterval(autoplay);

    if (sliderRef.value) {
      slider = new KeenSlider(sliderRef.value, {
        slides: { perView: 6, spacing: 12 },
        breakpoints: {
          "(max-width: 1400px)": { slides: { perView: 4 } },
          "(max-width: 1024px)": { slides: { perView: 4 } },
          "(max-width: 768px)": { slides: { perView: 3 } },
          "(max-width: 500px)": { slides: { perView: 2 } },
        },
        rubberband: true,
        mode: "free-snap",
        loop: true,
      });

      startAutoplay();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  slider?.destroy();
  clearInterval(autoplay);
});

// --------------------
// Autoplay
// --------------------
function startAutoplay() {
  stopAutoplay();
  autoplay = setInterval(() => {
    slider?.next();
  }, 3000);
}

function pauseAutoplay() {
  stopAutoplay();
}

function stopAutoplay() {
  clearInterval(autoplay);
}

// --------------------
// Vote circle color
// --------------------
function getColor(vote: number) {
  if (vote >= 7) return "#22c55e";
  if (vote >= 5) return "#facc15";
  return "#ef4444";
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
