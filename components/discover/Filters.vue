<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const type = computed(() => {
  const t = route.params.type as string
  return t === "series" ? "tv" : (t as "movie" | "tv")
})

// Filters
const sort = ref(route.query.sort_by || 'popularity.desc')
const rating = ref(route.query['vote_average.gte'] || null)
const year = ref(route.query.year || null)
const runtime = ref(route.query.runtime || null)
const genres = ref<string[]>(route.query.with_genres?.toString().split(',') || [])

const genreList = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
]

function updateQuery(){
  router.push({
    params: { type: route.params.type },
    query:{
      sort_by: sort.value,
      'vote_average.gte': rating.value || undefined,
      year: year.value || undefined,
      runtime: runtime.value || undefined,
      with_genres: genres.value.length ? genres.value.join(',') : undefined
    }
  })
}

function toggleGenre(id:number){
  const s = id.toString()
  genres.value.includes(s)
    ? genres.value = genres.value.filter(g=>g!==s)
    : genres.value.push(s)

  updateQuery()
}
</script>

<template>
<div class="w-64 bg-slate-900 p-4 rounded-xl border border-white/10 space-y-6 text-white">

  <div>
    <h3 class="font-semibold mb-2">Sort</h3>
    <select v-model="sort" @change="updateQuery" class="input">
      <option value="popularity.desc">Popular</option>
      <option value="vote_average.desc">Top Rated</option>
      <option :value="type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'">Newest</option>
    </select>
  </div>

  <div>
    <h3 class="font-semibold mb-2">Rating {{ rating ?? 'Any' }}</h3>
    <input type="range" min="1" max="10" v-model="rating" @change="updateQuery" class="w-full"/>
  </div>

  <div>
    <h3 class="font-semibold mb-2">
      {{ type === 'movie' ? 'Release Year' : 'First Air Year' }}
    </h3>
    <input type="number" v-model="year" @change="updateQuery" class="input"/>
  </div>

  <div>
    <h3 class="font-semibold mb-2">
      {{ type === 'movie' ? 'Min Runtime' : 'Episode Runtime' }}
    </h3>
    <input type="number" v-model="runtime" @change="updateQuery" class="input"/>
  </div>

  <div>
    <h3 class="font-semibold mb-2">Genres</h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="g in genreList"
        :key="g.id"
        @click="toggleGenre(g.id)"
        :class="[
          'px-3 py-1 rounded-full border transition',
          genres.includes(String(g.id))
            ? 'bg-blue-500 text-black'
            : 'bg-slate-800 hover:bg-slate-700'
        ]"
      >
        {{ g.name }}
      </button>
    </div>
  </div>

</div>
</template>

<style scoped>
.input{
  @apply w-full bg-slate-800 border border-white/10 rounded px-2 py-1;
}
</style>
