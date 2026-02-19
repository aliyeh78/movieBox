<script setup lang="ts">
import { ref } from "vue"
import { useLazy } from "~/composables/useLazy"

const props = defineProps<{
  src: string
  alt?: string
  class?: string
  background?: boolean
}>()
const { el, hasLoaded } = useLazy(props.src)
const loaded = ref(false)

function onLoad() {
  loaded.value = true
}
</script>
<template>
  <!-- BACKGROUND MODE -->
  <div
    v-if="background"
    ref="el"
    class="absolute inset-0 overflow-hidden"
    :class="class"
  >
    <div v-if="!loaded" class="absolute inset-0 skeleton"></div>

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

  <!-- NORMAL MODE -->
  <div
    v-else
    ref="el"
    class="relative overflow-hidden bg-zinc-900"
    :class="class"
  >
    <div v-if="!loaded" class="absolute inset-0 skeleton"></div>

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
  to { background-position-x: -200%; }
}
</style>