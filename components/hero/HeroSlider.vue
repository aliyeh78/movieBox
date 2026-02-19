<template>
  <div class="hero-slider relative">
    <!-- ================= MAIN SLIDER ================= -->
    <div ref="mainRef" class="keen-slider rounded-lg overflow-hidden relative">
      <div
        v-for="(movie, index) in moviesWithGenres"
        :key="movie.id"
        class="keen-slider__slide relative"
      >
        <!-- Background -->
        <!-- First slide loads immediately -->
        <img
          v-if="index === 0"
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
          :alt="movie.title"
          class="w-full h-[450px] object-cover"
        />

        <!-- Other slides lazy -->
        <LazyImage
          v-else
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
          :alt="movie.title"
          class="w-full h-[450px] object-cover"
        />

        <!-- Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
        ></div>

        <!-- Text Content -->
        <transition
          mode="out-in"
          appear
          :css="false"
          @enter="(el, done) => enterAnimation(el, done)"
        >
          <div
            v-if="activeIndex === index"
            class="absolute bottom-8 left-8 text-white max-w-lg"
          >
            <!-- Genre tags -->
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="genre in movie.genreNames"
                :key="genre"
                class="bg-black/50 px-2 py-1 rounded text-xs"
              >
                {{ genre }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-3xl md:text-4xl font-bold mb-2 pb-6">
              {{ movie.title }}
            </h2>

            <!-- IMDb -->
            <div class="inline-flex items-center space-x-2 py-2">
              <div
                class="bg-black text-yellow-400 font-bold rounded px-2 py-1 text-xs tracking-wider"
              >
                IMDb
              </div>
              <div
                class="bg-yellow-400 text-black font-bold rounded px-2 py-1 text-xs"
              >
                {{ movie.vote_average.toFixed(1) }}
              </div>
            </div>

            <p class="hidden md:block text-sm text-gray-300">
              {{ movie.overview }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- ================= THUMBNAILS ================= -->
    <div
      ref="thumbRef"
      class="mt-4 flex gap-3 overflow-x-auto scroll-smooth pb-2 no-scrollbar"
    >
      <div
        v-for="(movie, index) in moviesWithGenres"
        :key="movie.id"
        class="shrink-0 cursor-pointer relative border-2 m-1 rounded-md overflow-hidden transition-all duration-300"
        :class="{
          'border-white scale-105': activeIndex === index,
          'border-transparent opacity-60': activeIndex !== index,
        }"
        @click="goToSlide(index)"
      >
        <LazyImage
          :src="`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`"
          :alt="movie.title"
          class="w-28 h-16 md:w-36 md:h-20 object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import KeenSlider from "keen-slider";
import type { KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";
import useGenreService from "@/services/genreService";
import type { Movie } from "@/types/movie";
import LazyImage from "~/components/ui/LazyImage.vue";

interface MovieWithGenres extends Movie {
  genreNames: string[];
}

const props = defineProps<{ movies: Movie[] }>();

const mainRef = ref<HTMLDivElement | null>(null);
const thumbRef = ref<HTMLDivElement | null>(null);

let mainSlider: KeenSliderInstance | null = null;
const activeIndex = ref(0);

/* ================= AUTOPLAY PLUGIN ================= */
function AutoplayPlugin(interval = 4000) {
  return (slider: KeenSliderInstance) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;

      timeout = setTimeout(() => slider.next(), interval);
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });

      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });

      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
}

/* ================= SCROLL THUMB INTO VIEW ================= */
function scrollThumbIntoView(index: number) {
  const container = thumbRef.value;
  if (!container) return;

  const el = container.children[index] as HTMLElement;
  if (!el) return;

  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  const offset =
    elRect.left -
    containerRect.left -
    containerRect.width / 2 +
    elRect.width / 2;

  container.scrollBy({ left: offset, behavior: "smooth" });
}

/* ================= GO TO SLIDE ================= */
const goToSlide = (index: number) => {
  mainSlider?.moveToIdx(index);
};

/* ================= TEXT ANIMATION ================= */
const enterAnimation = (el: Element, done: () => void) => {
  const anim = el.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0px)" },
    ],
    { duration: 600, easing: "ease-out" },
  );
  anim.onfinish = done;
};

/* ================= GENRE MAPPING ================= */
const genreMap = ref<Record<number, string>>({});
const genreService = useGenreService();
const moviesWithGenres = ref<MovieWithGenres[]>([]);

async function loadGenresAndMap(movies: Movie[]) {
  const genres = await genreService.getGenres();
  genres.forEach((g) => (genreMap.value[g.id] = g.name));

  moviesWithGenres.value = movies.map((m) => ({
    ...m,
    genreNames: m.genre_ids
      .map((id) => genreMap.value[id])
      .filter((name): name is string => !!name), // ensure string[]
  }));
}

/* ================= INIT MAIN SLIDER ================= */
watch(
  () => props.movies,
  async (movies) => {
    if (!movies || movies.length === 0) return;
    await nextTick();

    await loadGenresAndMap(movies);

    mainSlider?.destroy();
    if (mainRef.value) {
      mainSlider = new KeenSlider(
        mainRef.value,
        {
          loop: true,
          slides: { perView: 1 },
          slideChanged(s) {
            activeIndex.value = s.track.details.rel;
            scrollThumbIntoView(activeIndex.value);
          },
        },
        [AutoplayPlugin(4000)],
      );
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => mainSlider?.destroy());
</script>

<style scoped>
.hero-slider {
  max-width: 1200px;
  margin: auto;
}

/* hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  scrollbar-width: none;
}
</style>
