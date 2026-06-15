'use client'

import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts()
  const products = data?.results ?? []

  return (
    <section>
      <SectionHeader
        title="Produits vedette"
        subtitle="Nos meilleures sélections"
        href="/catalogue/all"
        hrefLabel="Voir tout le catalogue"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  )
}
