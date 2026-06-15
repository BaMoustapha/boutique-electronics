import { useQuery } from '@tanstack/react-query'
import { brandService } from '@/services/brandService'
import type { ProductFilters } from '@/types/api'

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: () => brandService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useBrandProducts(slug: string, filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: ['brand', slug, 'products', filters],
    queryFn: () => brandService.getProducts(slug, filters),
    enabled: !!slug,
  })
}
