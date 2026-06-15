import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
import type { ProductFilters } from '@/types/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCategoryProducts(slug: string, filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: ['category', slug, 'products', filters],
    queryFn: () => categoryService.getProducts(slug, filters),
    enabled: !!slug,
  })
}
