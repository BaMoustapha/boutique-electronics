export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  total_pages: number
  current_page: number
  results: T[]
}

export interface ProductFilters {
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  status?: string
  is_featured?: boolean
  is_new?: boolean
  q?: string
  ordering?: 'price' | '-price' | '-created_at' | 'created_at' | '-views_count' | 'name' | '-name'
  page?: number
  page_size?: number
}
