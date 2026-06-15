'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import type { ProductFilters } from '@/types/api'
import { useBrands } from '@/hooks/useBrands'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/utils/formatPrice'

interface FilterSidebarProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  showCategory?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

const PRICE_RANGES = [
  { label: 'Moins de 100 000 FCFA', min: 0, max: 100000 },
  { label: '100 000 – 300 000 FCFA', min: 100000, max: 300000 },
  { label: '300 000 – 500 000 FCFA', min: 300000, max: 500000 },
  { label: 'Plus de 500 000 FCFA', min: 500000, max: undefined },
]

const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'low_stock', label: 'Stock limité' },
  { value: 'out_of_stock', label: 'Rupture' },
  { value: 'on_order', label: 'Sur commande' },
]

export function FilterSidebar({ filters, onChange, showCategory = false }: FilterSidebarProps) {
  const { data: brands = [] } = useBrands()
  const [minPrice, setMinPrice] = useState(filters.min_price?.toString() ?? '')
  const [maxPrice, setMaxPrice] = useState(filters.max_price?.toString() ?? '')

  const update = (key: keyof ProductFilters, value: string | number | boolean | undefined) => {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  const applyCustomPrice = () => {
    onChange({
      ...filters,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
    })
  }

  const clearAll = () => {
    setMinPrice('')
    setMaxPrice('')
    onChange({ ordering: filters.ordering, page: 1 })
  }

  return (
    <aside className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filtres
          </h3>
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition">
            Réinitialiser
          </button>
        </div>

        {/* Marques */}
        <FilterSection title="Marque">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-1">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand.slug}
                  onChange={() => update('brand', filters.brand === brand.slug ? undefined : brand.slug)}
                  className="accent-blue-700"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Prix prédéfinis */}
        <FilterSection title="Prix">
          <div className="space-y-1">
            {PRICE_RANGES.map((range) => {
              const active = filters.min_price === range.min && filters.max_price === range.max
              return (
                <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-1">
                  <input
                    type="radio"
                    name="price_range"
                    checked={active}
                    onChange={() => {
                      if (active) {
                        onChange({ ...filters, min_price: undefined, max_price: undefined, page: 1 })
                      } else {
                        setMinPrice(range.min.toString())
                        setMaxPrice(range.max?.toString() ?? '')
                        onChange({ ...filters, min_price: range.min, max_price: range.max, page: 1 })
                      }
                    }}
                    className="accent-blue-700"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              )
            })}
          </div>

          {/* Prix personnalisé */}
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 font-medium">Prix personnalisé (FCFA)</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400 text-xs">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button size="sm" variant="outline" fullWidth onClick={applyCustomPrice}>
              Appliquer
            </Button>
          </div>
        </FilterSection>

        {/* Disponibilité */}
        <FilterSection title="Disponibilité">
          <div className="space-y-1">
            {STATUS_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-1">
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === opt.value}
                  onChange={() => update('status', filters.status === opt.value ? undefined : opt.value)}
                  className="accent-blue-700"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Autres */}
        <FilterSection title="Autres" defaultOpen={false}>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.is_new === true}
                onChange={(e) => update('is_new', e.target.checked ? true : undefined)}
                className="accent-blue-700 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Nouveautés uniquement</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.is_featured === true}
                onChange={(e) => update('is_featured', e.target.checked ? true : undefined)}
                className="accent-blue-700 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Produits vedette</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </aside>
  )
}
