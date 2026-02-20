<template>
  <ClientOnly>
    <!-- Hero Slider -->
    <HeroSlider :movies="heroMovies" />

    <!-- Movie Rows by Category -->
    <!-- <MovieRowSlider title="In Theaters" category="now_playing" /> -->
    <MovieRowSlider title="Top Rated" category="top_rated" />
    <MovieRowSlider title="Coming Soon" category="upcoming" />
    <MovieRowSlider title="Popular Movies" category="popular" />
    <MovieRowSlider title="Popular TV Shows" category="tv" />
    <MovieRowSlider title="Streaming Now" category="streaming" />
  </ClientOnly>
</template>

<script setup lang="ts">
import HeroSlider from "~/components/hero/HeroSlider.vue"
import MovieRowSlider from "~/components/MovieRowSlider.vue"
import tmdbService from "~/services/tmdbService"
import { computed } from "vue"

// ------------------------------
// Hero Movies (Now Playing)
// ------------------------------
const { data: heroData, pending: heroPending } = useAsyncData("hero", () =>
  tmdbService.getMovies('now_playing'),
  {
    server: false,   
    lazy: true       
  }
)
const heroMovies = computed(() => heroData.value?.results.slice(0, 10) ?? [])
</script>
