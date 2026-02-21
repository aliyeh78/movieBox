import { ref, watch } from "vue"

export interface FavoriteItem {
  id: number
  media_type: "movie" | "tv"
  title: string
  poster_path: string | null
  vote_average?: number
  release_date?:string
}

/* ---------- GLOBAL STATE (shared across whole app) ---------- */
const favorites = ref<FavoriteItem[]>(load())

function load(): FavoriteItem[] {
  if (process.server) return []
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]")
  } catch {
    return []
  }
}

/* ---------- Sync to localStorage automatically ---------- */
if (process.client) {
  watch(
    favorites,
    (val) => localStorage.setItem("favorites", JSON.stringify(val)),
    { deep: true }
  )
}

export function useFavorites() {
  function isFavorite(id: number, type: "movie" | "tv") {
    return favorites.value.some(
      (f) => f.id === id && f.media_type === type
    )
  }

  function toggle(item: FavoriteItem) {
    const index = favorites.value.findIndex(
      (f) => f.id === item.id && f.media_type === item.media_type
    )

    if (index === -1) {
      favorites.value.push(item)   // ❤️ add
      console.log("Added to favorites", item.title)
    } else {
      favorites.value.splice(index, 1) // 🤍 remove
      console.log("Removed from favorites", item.title)
    }
  }

  return {
    favorites,
    isFavorite,
    toggle
  }
}
