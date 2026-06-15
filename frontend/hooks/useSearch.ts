import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 350)

  const results = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => productService.search(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  })

  const reset = useCallback(() => setQuery(''), [])

  return { query, setQuery, debouncedQuery, results, reset }
}
