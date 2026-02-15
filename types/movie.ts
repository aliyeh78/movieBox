export interface Movie {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string       
  vote_average: number      
  genre_ids: [];

}
export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}
export interface Genre {
  id: number;
  name: string;
}