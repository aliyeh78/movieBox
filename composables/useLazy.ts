import { ref, onMounted, onBeforeUnmount } from "vue"

export function useLazy() {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const hasLoaded = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          isVisible.value = true
          hasLoaded.value = true
          observer?.disconnect()
        }
      },
      { rootMargin: "200px" } // preload earlier
    )

    if (el.value) observer.observe(el.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { el, isVisible, hasLoaded }
}