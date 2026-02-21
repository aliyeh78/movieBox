<template>
  <div class="movie-page relative">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="py-10 space-y-8 max-w-7xl mx-auto">
      <!-- Hero skeleton -->
      <div class="relative w-full rounded-lg overflow-hidden animate-pulse">
        <div class="w-full h-[450px] bg-gray-700 rounded-lg"></div>
        <div
          class="absolute bottom-0 left-0 pb-16 px-10 flex gap-8 max-w-5xl mx-auto"
        >
          <!-- Poster -->
          <div
            class="w-40 md:w-56 h-60 md:h-80 bg-gray-600 rounded-xl shadow-2xl flex-shrink-0"
          ></div>
          <!-- Info -->
          <div class="flex-1 flex flex-col justify-end space-y-4 pt-5">
            <div class="flex flex-wrap gap-2">
              <div class="h-5 bg-gray-500 rounded w-16"></div>
              <div class="h-5 bg-gray-500 rounded w-20"></div>
              <div class="h-5 bg-gray-500 rounded w-12"></div>
            </div>
            <div class="h-8 md:h-12 bg-gray-500 rounded w-3/4"></div>
            <div class="flex gap-2 items-center mt-2">
              <div class="h-5 w-12 bg-gray-600 rounded"></div>
              <div class="h-5 w-8 bg-gray-600 rounded"></div>
            </div>
            <div class="space-y-2 mt-2">
              <div class="h-3 bg-gray-500 rounded w-full"></div>
              <div class="h-3 bg-gray-500 rounded w-5/6"></div>
              <div class="h-3 bg-gray-500 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast slider skeleton -->
      <div class="space-y-2 max-w-7xl mx-auto">
        <div class="h-8 w-48 bg-gray-700 rounded animate-pulse mb-4"></div>
        <div class="flex gap-4 overflow-x-auto">
          <div
            v-for="i in 8"
            :key="i"
            class="w-[120px] animate-pulse space-y-2 flex-shrink-0"
          >
            <div class="h-[180px] bg-gray-600 rounded-lg"></div>
            <div class="h-4 bg-gray-500 rounded"></div>
            <div class="h-3 bg-gray-500 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Movie Content -->
    <div v-else>
      <div
        ref="mainRef"
        class="keen-slider rounded-lg overflow-hidden relative pb-7"
      >
        <div class="keen-slider__slide relative">
          <!-- Background -->
          <LazyImage
            eager
            :src="`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`"
            :alt="movie?.title || movie?.name"
            class="w-full h-[450px] object-cover"
          />

          <!-- Gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent"
          ></div>

          <!-- Text Content -->
          <transition
            mode="out-in"
            appear
            :css="false"
            @enter="(el, done) => enterAnimation(el, done)"
          >
            <div class="absolute bottom-16 left-10 right-10 text-white">
              <div class="flex gap-8 items-end max-w-5xl">
                <!-- Poster -->
                <LazyImage
                  :src="`https://image.tmdb.org/t/p/w500${movie?.poster_path}`"
                  :alt="movie?.title || movie?.name"
                  class="w-40 md:w-56 rounded-xl shadow-2xl shrink-0"
                />

                <!-- Movie Info -->
                <div class="space-y-4">
                  <!-- Genres -->
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="genre in genreNames"
                      :key="genre"
                      class="bg-black/60 px-3 py-1 rounded text-xs backdrop-blur"
                    >
                      {{ genre }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h1 class="text-3xl md:text-5xl font-bold leading-tight">
                    {{ movie?.title || movie?.name }}
                  </h1>

                  <!-- IMDb -->
                  <div class="flex items-center gap-3">
                    <span
                      class="bg-black text-yellow-400 font-bold rounded px-2 py-1 text-xs"
                    >
                      IMDb
                    </span>
                    <span
                      class="bg-yellow-400 text-black font-bold rounded px-2 py-1 text-xs"
                    >
                      {{ movie?.vote_average.toFixed(1) }}
                    </span>
                  </div>

                  <!-- Overview -->
                  <p
                    class="hidden md:block text-gray-300 max-w-xl leading-relaxed"
                  >
                    {{ movie?.overview }}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Blurred background -->
      <LazyImage
        background
        :src="`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`"
        class="-z-10 opacity-40 blur-xl"
        :alt="movie?.title || movie?.name"
      />

      <!-- Cast Slider -->
      <div class="py-5" v-if="cast?.length">
        <h2 class="text-2xl font-semibold mb-4">Cast</h2>

        <BaseSlider :items="cast" :perView="8">
          <template #default="{ item: actor }">
            <div class="w-[120px] text-center">
              <LazyImage
                :src="
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : '/no-image.png'
                "
                class="rounded-lg mb-2 aspect-[2/3]"
              />
              <p class="text-sm font-medium">{{ actor.name }}</p>
              <p class="text-xs text-gray-400">{{ actor.character }}</p>
            </div>
          </template>
        </BaseSlider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import movieService from "~/services/movieService";
import useGenreService from "~/services/genreService";
import type { Movie, Genre, CastMember } from "@/types/movie";
import BaseSlider from "~/components/ui/BaseSlider.vue";
import LazyImage from "~/components/ui/LazyImage.vue";

const route = useRoute();
const movieId = route.params.id as string;

const movie = ref<Movie | null>(null);
const genreNames = ref<string[]>([]);
const cast = ref<CastMember[]>([]);
const loading = ref(true);

const { getGenres } = useGenreService();

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

onMounted(async () => {
  if (!movieId) return;

  loading.value = true;
  await nextTick();

  try {
    // Fetch movie details
    const type: "movie" | "tv" = "tv"; // adjust dynamically if needed
    const data = await movieService.getById(Number(movieId), type);

    // Map response to Movie type
    movie.value = {
      id: data.id,
      title: data.title,
      name: data.name,
      overview: data.overview,
      backdrop_path: data.backdrop_path,
      poster_path: data.poster_path,
      vote_average: data.vote_average,
      genre_ids: data.genres?.map((g) => g.id) || [],
    };

    // Map genre IDs to names
    const genres: Genre[] = await getGenres();
    genreNames.value = movie.value.genre_ids.map(
      (id) => genres.find((g) => g.id === id)?.name || "Unknown",
    );

    // Fetch cast
    const credits = await movieService.getCredits(Number(movieId), type);
    cast.value = credits.cast.slice(0, 10);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>