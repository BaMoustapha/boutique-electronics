'use client'

import { X } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

interface ActiveFilter {
  key: string
  label: string
  onRemove: () => void
}

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  onClearAll: () => void
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Filtres :</span>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={filter.onRemove}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition"
        >
          {filter.label}
          <X size={12} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-400 hover:text-red-500 transition underline ml-1"
      >
        Tout effacer
      </button>
    </div>
  )
}

// Helper to build active filters array from ProductFilters
export function buildActiveFilters(
  filters: Record<string, string | number | boolean | undefined>,
  onRemove: (key: string) => void,
  brands?: { slug: string; name: string }[],
  categories?: { slug: string; name: string }[]
): ActiveFilter[] {
  const result: ActiveFilter[] = []

  if (filters.brand) {
    const brandName = brands?.find((b) => b.slug === filters.brand)?.name ?? String(filters.brand)
    result.push({ key: 'brand', label: `Marque : ${brandName}`, onRemove: () => onRemove('brand') })
  }

  if (filters.category) {
    const catName = categories?.find((c) => c.slug === filters.category)?.name ?? String(filters.category)
    result.push({ key: 'category', label: `Catégorie : ${catName}`, onRemove: () => onRemove('category') })
  }

  if (filters.min_price || filters.max_price) {
    const label = filters.min_price && filters.max_price
      ? `${formatPrice(Number(filters.min_price))} – ${formatPrice(Number(filters.max_price))}`
      : filters.min_price
      ? `Min ${formatPrice(Number(filters.min_price))}`
      : `Max ${formatPrice(Number(filters.max_price))}`
    result.push({ key: 'price', label, onRemove: () => { onRemove('min_price'); onRemove('max_price') } })
  }

  if (filters.status) {
    const labels: Record<string, string> = {
      in_stock: 'En stock', low_stock: 'Stock limité', out_of_stock: 'Rupture', on_order: 'Sur commande',
    }
    result.push({ key: 'status', label: labels[String(filters.status)] ?? String(filters.status), onRemove: () => onRemove('status') })
  }

  return result
}
