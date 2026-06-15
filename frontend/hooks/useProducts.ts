'use client'

import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import type { ProductFilters } from '@/types/api'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured({ page_size: 8 }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useNewProducts(filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: ['products', 'new', filters],
    queryFn: () => productService.getNew({ page_size: 8, ...filters }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useOnSaleProducts(filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: ['products', 'on-sale', filters],
    queryFn: () => productService.getOnSale(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productService.getAll({ ordering: '-views_count', page_size: 12 }),
    staleTime: 5 * 60 * 1000,
  })
}
