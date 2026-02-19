import { ref, onMounted, onUnmounted } from "vue"

/* global memory (important!) */
const loadedImages = new Set<string>()

export function useLazy(src?: string) {
  const el = ref<HTMLElement | null>(null)
  const hasLoaded = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // if already loaded before → skip observer
    if (src && loadedImages.has(src)) {
      hasLoaded.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          hasLoaded.value = true
          if (src) loadedImages.add(src)
          observer?.disconnect()
        }
      },
      { rootMargin: "200px" } // preload before visible
    )

    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { el, hasLoaded }
}