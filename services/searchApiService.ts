import useApi from './apiService'
import type { SearchResponse } from '~/types/search'

const endpoints = {
  search: '/search/multi'
}

export default {
  async search(query: string, page = 1): Promise<SearchResponse> { 
    const { get } = useApi()
    const params = { query, page }
    return await get<SearchResponse>(endpoints.search, params)
  }
}
