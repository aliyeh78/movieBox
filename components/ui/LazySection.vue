<script setup lang="ts">
import { useLazy } from "~/composables/useLazy"

const { el, isVisible } = useLazy()
</script>

<template>
  <div ref="el">
    <slot v-if="isVisible" />
    <div v-else class="h-64 flex items-center justify-center text-gray-400">
      Loading section...
    </div>
  </div>
</template>
