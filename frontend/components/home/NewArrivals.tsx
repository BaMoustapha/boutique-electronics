'use client'

import { useNewProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function NewArrivals() {
  const { data, isLoading } = useNewProducts()
  const products = data?.results ?? []

  return (
    <section>
      <SectionHeader
        title="Nouveautés"
        subtitle="Derniers arrivages en stock"
        href="/nouveautes"
        hrefLabel="Voir tout"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  )
}
