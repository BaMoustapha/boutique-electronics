'use client'

import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ['product', slug, 'related'],
    queryFn: () => productService.getRelated(slug),
    enabled: !!slug,
  })
}
