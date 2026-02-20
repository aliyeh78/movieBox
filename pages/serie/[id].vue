<template>
  <div class="movie-page">
    <!-- Background -->

    <div class="" v-if="movie">
      <div
        ref="mainRef"
        class="keen-slider rounded-lg overflow-hidden relative"
      >
        <div class="keen-slider__slide relative">
          <!-- Background -->
          <LazyImage
          eager
            :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
            :alt="movie.title || movie.name"
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
            <!-- Content -->
            <div class="absolute bottom-16 left-10 right-10 text-white">
              <div class="flex gap-8 items-end max-w-5xl">
                <!-- Poster -->
            <LazyImage
                  v-if="movie"
                  :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                  :alt="movie.title || movie.name"
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
                    {{ movie.title || movie.name }}
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
                      {{ movie.vote_average.toFixed(1) }}
                    </span>
                  </div>

                  <!-- Overview -->
                  <p
                    class="hidden md:block text-gray-300 max-w-xl leading-relaxed"
                  >
                    {{ movie.overview }}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
       <LazyImage
        v-if="movie"
        background
        :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
        class="-z-10 opacity-40 blur-xl"
        :alt="movie.title || movie.name"
      />
    </div>

    <div class="py-10" v-if="cast && cast.length>0">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import movieService from "~/services/movieService";
import useGenreService from "~/services/genreService";
import type { Movie, Genre, CastMember } from "@/types/movie";
import BaseSlider from '~/components/ui/BaseSlider.vue'
import LazyImage from "~/components/ui/LazyImage.vue";

const route = useRoute();
const movieId = route.params.id as string;

const movie = ref<Movie | null>(null);
const genreNames = ref<string[]>([]);
const cast = ref<CastMember[]>([]);

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

  // Fetch movie details
  movie.value = await movieService.getById(Number(movieId),'tv');

  // ⭐ Fetch cast
  const credits = await movieService.getCredits(Number(movieId),'tv');
  cast.value = credits.cast.slice(0, 10);

  // Fetch genres
  const genres: Genre[] = await getGenres();

  // Map genre IDs to names
  genreNames.value = movie.value.genre_ids.map(
    (id) => genres.find((g) => g.id === id)?.name || "Unknown",
  );
});
</script>

<style scoped></style>
