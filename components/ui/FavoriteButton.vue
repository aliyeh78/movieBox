<template>
  <button
    @click="toggle"
    class="  z-30 w-9 h-9 rounded-full
           bg-black/60 backdrop-blur flex items-center justify-center
           hover:scale-110 transition"
  >
    <!-- Show filled heart if favorite, outline if not -->
    <span v-if="isFav">❤️</span>
    <span v-else>🤍</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFavorites } from "~/composables/useFavorites";

const props = defineProps<{
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average?: number;
}>();

const fav = useFavorites();

// Reactive computed to check if this item is a favorite
const isFav = computed(() => fav.isFavorite(props.id, props.media_type));

// Toggle favorite when button clicked
function toggle(e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();

  fav.toggle({
    id: props.id,
    media_type: props.media_type,
    title: props.title,
    poster_path: props.poster_path,
    vote_average: props.vote_average,
  });
}
</script>
