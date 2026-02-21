export interface SearchResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  poster_path: string | null
  overview?: string
  release_date?: string
  first_air_date?: string
}

export interface SearchResponse {
  page: number
  results: SearchResult[]
  total_pages: number
  total_results: number
}
