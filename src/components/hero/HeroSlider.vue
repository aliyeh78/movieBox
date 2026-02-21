<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import KeenSlider, { type KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";
import LazyImage from "~/components/ui/LazyImage.vue";
import useGenreService from "@/services/genreService";
import type { Movie } from "@/types/movie";

/* ================= TYPES ================= */

interface MovieWithGenres extends Movie {
  genreNames: string[];
}

/* ================= PROPS ================= */

const props = defineProps<{
  movies: Movie[] | null;
  pending?: boolean;
}>();

/* ================= ROUTER ================= */

const router = useRouter();
function goToDetails(movie: Movie) {
  router.push(`/movie/${movie.id}`);
}

/* ================= STATE ================= */

const mainRef = ref<HTMLDivElement | null>(null);
const thumbRef = ref<HTMLDivElement | null>(null);

let slider: KeenSliderInstance | null = null;
const activeIndex = ref(0);

const genreService = useGenreService();
const genreMap = ref<Record<number, string>>({});
const moviesWithGenres = ref<MovieWithGenres[]>([]);

const isLoading = computed(() => props.pending || !props.movies?.length);

/* ================= GENRE MAP ================= */

async function mapGenres(movies: Movie[]) {
  const genres = await genreService.getGenres();
  genres.forEach((g) => (genreMap.value[g.id] = g.name));

  moviesWithGenres.value = movies.map((m) => ({
    ...m,
    genreNames: m.genre_ids
      .map((id) => genreMap.value[id])
      .filter((name): name is string => typeof name === "string"),
  }));
}

/* ================= AUTOPLAY ================= */

function autoplayPlugin(interval = 4000) {
  return (slider: KeenSliderInstance) => {
    let timer: any;
    let hover = false;

    const clear = () => clearTimeout(timer);

    const next = () => {
      clear();
      if (hover) return;
      timer = setTimeout(() => slider.next(), interval);
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseenter", () => {
        hover = true;
        clear();
      });
      slider.container.addEventListener("mouseleave", () => {
        hover = false;
        next();
      });
      next();
    });

    slider.on("dragStarted", clear);
    slider.on("animationEnded", next);
    slider.on("updated", next);
  };
}

/* ================= INIT SLIDER ================= */

watch(
  () => props.movies,
  async (movies) => {
    if (!movies || !movies.length) return;

    await mapGenres(movies);
    await nextTick();

    slider?.destroy();

    if (!mainRef.value) return;

    slider = new KeenSlider(
      mainRef.value,
      {
        loop: true,
        slides: { perView: 1 },
        slideChanged(s) {
          activeIndex.value = s.track.details.rel;
          scrollThumbIntoView(activeIndex.value);
        },
      },
      [autoplayPlugin(4500)]
    );
  },
  { immediate: true }
);

/* ================= THUMB SCROLL ================= */

function scrollThumbIntoView(index: number) {
  const container = thumbRef.value;
  if (!container) return;

  const el = container.children[index] as HTMLElement;
  if (!el) return;

  const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
  container.scrollTo({ left: offset, behavior: "smooth" });
}

const goToSlide = (i: number) => slider?.moveToIdx(i);

onBeforeUnmount(() => slider?.destroy());
</script>

<template>
  <div class="hero-slider">
    <!-- LOADING -->
    <div
      v-if="isLoading"
      class="w-full h-[450px] rounded-xl overflow-hidden relative bg-zinc-900 animate-pulse"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shimmer"></div>

      <div class="absolute bottom-8 left-8 space-y-3">
        <div class="h-6 w-40 bg-zinc-700 rounded"></div>
        <div class="h-10 w-80 bg-zinc-700 rounded"></div>
        <div class="h-4 w-96 bg-zinc-700 rounded"></div>
      </div>
    </div>

    <!-- SLIDER -->
    <template v-else>
      <div ref="mainRef" class="keen-slider rounded-xl overflow-hidden">
        <div
          v-for="(movie, index) in moviesWithGenres"
          :key="movie.id"
          class="keen-slider__slide relative"
        >
          <!-- Background -->
          <LazyImage
            :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
            :alt="movie.title || movie.name"
            class="w-full h-[450px] object-cover"
          />

          <!-- Gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <!-- TEXT + POSTER -->
          <div
            v-if="activeIndex === index"
            class="absolute bottom-10 left-10 text-white animate-fade flex gap-6 items-end max-w-3xl"
          >
            <!-- POSTER -->
            <div class="hidden md:block shrink-0">
              <LazyImage
                v-if="movie.poster_path"
                :src="`https://image.tmdb.org/t/p/w342${movie.poster_path}`"
                :alt="movie.title || movie.name"
                class="w-40 h-60 object-cover rounded-lg shadow-lg"
              />

              <div
                v-else
                class="w-40 h-60 rounded-lg bg-zinc-800 flex items-center justify-center text-xs text-gray-400"
              >
                No Image
              </div>
            </div>

            <!-- INFO -->
            <div class="space-y-3 max-w-xl">
              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="g in movie.genreNames"
                  :key="g"
                  class="text-xs bg-black/50 px-2 py-1 rounded"
                >
                  {{ g }}
                </span>
              </div>

              <h2 class="text-4xl font-bold">
                {{ movie.title || movie.name }}
              </h2>

              <div class="flex items-center gap-2">
                <span class="bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
                  IMDb
                </span>
                <span class="bg-black px-2 py-1 text-xs rounded">
                  {{ movie.vote_average.toFixed(1) }}
                </span>
              </div>

              <p class="text-sm text-gray-300 line-clamp-3">
                {{ movie.overview }}
              </p>

              <button
                class="mt-3 px-5 py-2 rounded-md bg-red-500 hover:bg-red-500 hover:opacity-100 transition font-semibold text-sm opacity-75"
                @click="goToDetails(movie)"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- THUMBS -->
      <div ref="thumbRef" class="flex gap-3 mt-4 overflow-x-auto no-scrollbar p-2">
        <div
          v-for="(movie, i) in moviesWithGenres"
          :key="movie.id"
          class="cursor-pointer shrink-0 border-2 rounded-md overflow-hidden transition"
          :class="activeIndex === i ? 'border-white scale-105' : 'border-transparent opacity-50'"
          @click="goToSlide(i)"
        >
          <LazyImage
            :src="`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`"
            class="w-32 h-20 object-cover"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hero-slider {
  max-width: 1200px;
  margin: auto;
}

.shimmer {
  background: linear-gradient(110deg, #18181b 8%, #27272a 18%, #18181b 33%);
  background-size: 200% 100%;
  animation: shine 1.2s linear infinite;
}
@keyframes shine {
  to { background-position-x: -200%; }
}

.animate-fade {
  animation: fadeUp 0.6s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
</style>