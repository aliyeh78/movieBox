<script setup lang="ts">
import { ref } from "vue"
import { useLazy } from "~/composables/useLazy"

const props = defineProps<{
  src: string
  alt?: string
  class?: string
}>()

const { el, hasLoaded } = useLazy()

const loaded = ref(false)

function onLoad() {
  loaded.value = true
}
</script>

<template>
  <div
    ref="el"
    class="relative overflow-hidden bg-zinc-900"
    :class="class"
  >
    <!-- Skeleton shimmer -->
    <div
      v-if="!loaded"
      class="absolute inset-0 skeleton"
    ></div>

    <!-- Image -->
    <img
      v-show="hasLoaded"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
/* ===== Netflix shimmer skeleton ===== */
.skeleton {
  background: linear-gradient(
    110deg,
    #18181b 8%,
    #27272a 18%,
    #18181b 33%
  );
  background-size: 200% 100%;
  animation: shine 1.2s linear infinite;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>