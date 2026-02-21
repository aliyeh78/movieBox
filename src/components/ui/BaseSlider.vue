<template>
  <!-- ================= SLIDER CONTAINER ================= -->
  <div class="relative">

    <!-- ===== Skeleton (shows real slider layout) ===== -->
    <div
      v-if="loading"
      class="keen-slider opacity-100"
    >
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="keen-slider__slide"
      >
        <div class="skeleton-card">
          <div class="skeleton-img shimmer"></div>
          <div class="skeleton-line shimmer w-3/4"></div>
          <div class="skeleton-line shimmer w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- ===== REAL SLIDER ===== -->
    <div
      v-else
      ref="sliderRef"
      class="keen-slider transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
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

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed } from "vue";
import KeenSlider, { type KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";

/* ================= PROPS ================= */

const props = defineProps<{
  items: any[];
  perView?: number;
  loading?: boolean;
}>();

/* ================= STATE ================= */

const sliderRef = ref<HTMLDivElement | null>(null);
const ready = ref(false);

let slider: KeenSliderInstance | null = null;
let autoplay: ReturnType<typeof setInterval> | null = null;

const skeletonCount = computed(() => props.perView ?? 6);

/* ================= BUILD SLIDER ================= */

async function buildSlider() {
  await nextTick();

  ready.value = false;
  slider?.destroy();
  stopAutoplay();

  if (!sliderRef.value) return;

  slider = new KeenSlider(sliderRef.value, {
    renderMode: "performance",

    created() {
      // wait one frame so browser calculates sizes
      requestAnimationFrame(() => {
        ready.value = true;
      });
    },

    slides: { perView: props.perView ?? 6, spacing: 12 },

    breakpoints: {
      "(max-width: 1400px)": { slides: { perView: 4 } },
      "(max-width: 768px)": { slides: { perView: 3 } },
      "(max-width: 500px)": { slides: { perView: 2 } },
    },

    loop: true,
    mode: "free-snap",
  });

  if (!props.loading) startAutoplay();
}

/* ================= WATCH ================= */

watch(
  () => props.items,
  async (list) => {
    if (!list || props.loading) return;
    await buildSlider();
  },
  { immediate: true }
);

/* ================= AUTOPLAY ================= */

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

/* ================= DESTROY ================= */

onBeforeUnmount(() => {
  slider?.destroy();
  stopAutoplay();
});
</script>

<style scoped>
/* hide scrollbar */
.keen-slider::-webkit-scrollbar { display: none; }
.keen-slider { scrollbar-width: none; }

/* ================= SKELETON ================= */

.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 10px;
  background: #27272a;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #27272a;
}

/* shimmer */
.shimmer {
  background: linear-gradient(
    110deg,
    #27272a 8%,
    #3f3f46 18%,
    #27272a 33%
  );
  background-size: 200% 100%;
  animation: shine 1.2s linear infinite;
}

@keyframes shine {
  to { background-position-x: -200%; }
}
</style>