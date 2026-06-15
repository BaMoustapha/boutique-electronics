import api from './api'
import type { Product } from '@/types/product'
import type { PaginatedResponse, ProductFilters } from '@/types/api'

export const productService = {
  getAll: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const { data } = await api.get<PaginatedResponse<Product>>('/products/', { params })
    return data
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${slug}/`)
    return data
  },

  getRelated: async (slug: string): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(`/products/${slug}/related/`)
    return data
  },

  getFeatured: async (params?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products/featured/', { params })
    return data
  },

  getNew: async (params?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products/new/', { params })
    return data
  },

  getOnSale: async (params?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products/on-sale/', { params })
    return data
  },

  search: async (q: string, filters?: Partial<ProductFilters>): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/search/', { params: { q, ...filters } })
    return data
  },
}
