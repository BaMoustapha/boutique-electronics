'use client'

import { useRef, useState, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSearch } from '@/hooks/useSearch'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatPrice } from '@/utils/formatPrice'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onClose?: () => void
}

export function SearchBar({ placeholder = 'Rechercher un produit...', className = '', onClose }: SearchBarProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const { query, setQuery, debouncedQuery, results } = useSearch()

  const products = results.data?.results ?? []
  const hasResults = products.length > 0
  const isLoading = results.isFetching

  useEffect(() => {
    if (debouncedQuery.length >= 2) setShowDropdown(true)
    else setShowDropdown(false)
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`)
      setShowDropdown(false)
      onClose?.()
    }
  }

  const handleSelect = (slug: string) => {
    router.push(`/produit/${slug}`)
    setQuery('')
    setShowDropdown(false)
    onClose?.()
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => debouncedQuery.length >= 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            autoComplete="off"
          />
          {isLoading && <Loader2 size={16} className="absolute right-3 animate-spin text-gray-400" />}
          {!isLoading && query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-3 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
          {hasResults ? (
            <>
              {products.slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onMouseDown={() => handleSelect(product.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {product.primary_image ? (
                      <Image src={getImageUrl(product.primary_image) ?? ''} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-blue-700 font-semibold">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
              {results.data && results.data.count > 6 && (
                <button
                  onMouseDown={() => { router.push(`/recherche?q=${encodeURIComponent(query)}`); setShowDropdown(false) }}
                  className="w-full px-4 py-3 text-sm text-blue-700 font-medium hover:bg-blue-50 transition text-center border-t border-gray-100"
                >
                  Voir tous les {results.data.count} résultats →
                </button>
              )}
            </>
          ) : (
            !isLoading && (
              <p className="px-4 py-4 text-sm text-gray-500 text-center">Aucun résultat pour « {debouncedQuery} »</p>
            )
          )}
        </div>
      )}
    </div>
  )
}
