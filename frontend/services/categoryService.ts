import api from './api'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { PaginatedResponse, ProductFilters } from '@/types/api'

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<{ results: Category[] }>('/categories/')
    return data.results
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${slug}/`)
    return data
  },

  getProducts: async (slug: string, filters?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, v]) => v !== undefined && v !== '')
    )
    const { data } = await api.get<PaginatedResponse<Product>>(`/categories/${slug}/products/`, { params })
    return data
  },
}
