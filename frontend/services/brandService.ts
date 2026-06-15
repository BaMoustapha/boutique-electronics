import api from './api'
import type { Brand } from '@/types/brand'
import type { Product } from '@/types/product'
import type { PaginatedResponse, ProductFilters } from '@/types/api'

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await api.get<{ results: Brand[] }>('/brands/')
    return data.results
  },

  getBySlug: async (slug: string): Promise<Brand> => {
    const { data } = await api.get<Brand>(`/brands/${slug}/`)
    return data
  },

  getProducts: async (slug: string, filters?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, v]) => v !== undefined && v !== '')
    )
    const { data } = await api.get<PaginatedResponse<Product>>(`/brands/${slug}/products/`, { params })
    return data
  },
}
