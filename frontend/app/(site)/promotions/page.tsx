'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'
import { useOnSaleProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SortDropdown } from '@/components/catalog/SortDropdown'
import type { ProductFilters } from '@/types/api'

export default function PromotionsPage() {
  const [ordering, setOrdering] = useState<ProductFilters['ordering']>('-created_at')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useOnSaleProducts({ ordering, page })
  const products = data?.results ?? []
  const totalPages = data ? Math.ceil(data.count / 24) : 1

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 p-6 mb-6 flex items-center gap-4">
        <div className="bg-white/20 rounded-full p-3">
          <Tag className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Promotions</h1>
          <p className="text-white/90 text-sm">
            {data ? `${data.count} offre${data.count > 1 ? 's' : ''} en cours` : 'Chargement...'}
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <SortDropdown
          value={ordering ?? ''}
          onChange={(v) => {
            setOrdering(v as ProductFilters['ordering'])
            setPage(1)
          }}
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
