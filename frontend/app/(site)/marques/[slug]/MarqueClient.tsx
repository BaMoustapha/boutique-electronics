'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useBrand, useBrandProducts } from '@/hooks/useBrands'
import { getImageUrl } from '@/utils/getImageUrl'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SortDropdown } from '@/components/catalog/SortDropdown'
import type { ProductFilters } from '@/types/api'

export function MarqueClient() {
  const { slug } = useParams<{ slug: string }>()
  const [filters, setFilters] = useState<ProductFilters>({})
  const [page, setPage] = useState(1)

  const { data: brand } = useBrand(slug)
  const { data, isLoading } = useBrandProducts(slug, { ...filters, page })

  const products = data?.results ?? []
  const totalPages = data ? Math.ceil(data.count / 24) : 1

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {brand && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-100">
          {brand.logo && (
            <div className="relative w-16 h-16 shrink-0">
              <Image src={getImageUrl(brand.logo) ?? ''} alt={brand.name} fill className="object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
            {data && (
              <p className="text-sm text-gray-500">
                {data.count} produit{data.count > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <SortDropdown
          value={filters.ordering ?? ''}
          onChange={(ordering) =>
            setFilters((f) => ({ ...f, ordering: ordering as ProductFilters['ordering'] }))
          }
        />
      </div>

      <ProductGrid
        products={products}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
