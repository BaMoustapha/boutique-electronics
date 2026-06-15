'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useState } from 'react'

function RechercheContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProducts({ q, page })
  const products = data?.results ?? []
  const totalPages = data ? Math.ceil(data.count / 24) : 1

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Search size={16} />
          <span className="text-sm">Résultats pour</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          &ldquo;{q}&rdquo;
        </h1>
        {data && (
          <p className="text-sm text-gray-500 mt-1">
            {data.count} résultat{data.count > 1 ? 's' : ''} trouvé{data.count > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {!isLoading && products.length === 0 && q && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Aucun produit trouvé pour &ldquo;{q}&rdquo;</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez avec d&apos;autres mots-clés ou parcourez nos catégories
          </p>
        </div>
      )}

      {(isLoading || products.length > 0) && (
        <ProductGrid
          products={products}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-6 text-gray-500">Chargement...</div>}>
      <RechercheContent />
    </Suspense>
  )
}
