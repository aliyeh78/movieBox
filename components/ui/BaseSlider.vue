<template>
  <div
    ref="sliderRef"
    class="keen-slider"
    @mouseenter="pauseAutoplay"
    @mouseleave="startAutoplay"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      class="keen-slider__slide"
    >
      <slot :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import KeenSlider, { type KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";

const props = defineProps<{
  items: any[];
  perView?: number;
}>();

const sliderRef = ref<HTMLDivElement | null>(null);
let slider: KeenSliderInstance | null = null;
let autoplay: ReturnType<typeof setInterval> | null = null;

watch(
  () => props.items,
  async (list) => {
    if (!list?.length) return;
    await nextTick();

    slider?.destroy();
    stopAutoplay();

    if (!sliderRef.value) return;

slider = new KeenSlider(sliderRef.value, {
  slides: { perView: props.perView ?? 6, spacing: 12 },
  breakpoints: {
    "(max-width: 1400px)": { slides: { perView: 4 } },
    "(max-width: 768px)": { slides: { perView: 3 } },
    "(max-width: 500px)": { slides: { perView: 2 } },
  },
  loop: true,
  mode: "free-snap",

  slideChanged(s) {
    // preload next 4 slides
    const rel = s.track.details.rel
    const slides = sliderRef.value?.querySelectorAll("img[data-src]")

    slides?.forEach((img: any, i: number) => {
      if (Math.abs(i - rel) < 4 && img.dataset.src) {
        img.src = img.dataset.src
        delete img.dataset.src
      }
    })
  }
})

    startAutoplay();
  },
  { immediate: true }
);

function startAutoplay() {
  stopAutoplay();
  autoplay = setInterval(() => slider?.next(), 3000);
}

function pauseAutoplay() {
  stopAutoplay();
}

function stopAutoplay() {
  if (autoplay) clearInterval(autoplay);
}

onBeforeUnmount(() => {
  slider?.destroy();
  stopAutoplay();
});
</script>

<style scoped>
.keen-slider::-webkit-scrollbar {
  display: none;
}
.keen-slider {
  scrollbar-width: none;
}
</style>
