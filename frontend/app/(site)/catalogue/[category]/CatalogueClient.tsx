'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useCategory, useCategoryProducts } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/catalog/FilterSidebar'
import { SortDropdown } from '@/components/catalog/SortDropdown'
import { ActiveFilters, buildActiveFilters } from '@/components/catalog/ActiveFilters'
import { CategoryBreadcrumb } from '@/components/catalog/CategoryBreadcrumb'
import { useBrands } from '@/hooks/useBrands'
import type { ProductFilters } from '@/types/api'

export function CatalogueClient() {
  const { category: slug } = useParams<{ category: string }>()
  const isAll = slug === 'all'

  const [filters, setFilters] = useState<ProductFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data: category } = useCategory(isAll ? '' : slug)
  const { data: brands = [] } = useBrands()

  const categoryQuery = useCategoryProducts(isAll ? '' : slug, { ...filters, page })
  const allQuery = useProducts({ ...filters, page })
  const { data, isLoading } = isAll ? allQuery : categoryQuery

  const products = data?.results ?? []
  const totalPages = data ? Math.ceil(data.count / 24) : 1

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const breadcrumbItems = isAll
    ? [{ label: 'Catalogue' }]
    : [{ label: category?.name ?? slug }]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <CategoryBreadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-4 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAll ? 'Catalogue' : (category?.name ?? slug)}
          </h1>
          {data && (
            <p className="text-sm text-gray-500 mt-1">
              {data.count} produit{data.count > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 transition lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filtres
          </button>
          <SortDropdown
            value={filters.ordering ?? ''}
            onChange={(ordering) =>
              handleFiltersChange({ ...filters, ordering: ordering as ProductFilters['ordering'] })
            }
          />
        </div>
      </div>

      <ActiveFilters
        filters={buildActiveFilters(
          filters as Record<string, string | number | boolean | undefined>,
          (key) => handleFiltersChange({ ...filters, [key]: undefined }),
          brands
        )}
        onClearAll={() => handleFiltersChange({})}
      />

      <div className="flex gap-6 mt-4">
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar filters={filters} onChange={handleFiltersChange} />
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold">Filtres</span>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <div className="p-4">
                <FilterSidebar filters={filters} onChange={handleFiltersChange} />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
