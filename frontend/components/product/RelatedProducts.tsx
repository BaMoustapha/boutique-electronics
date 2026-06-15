'use client'

import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { useRelatedProducts } from '@/hooks/useProduct'

interface RelatedProductsProps {
  slug: string
}

export function RelatedProducts({ slug }: RelatedProductsProps) {
  const { data: products, isLoading } = useRelatedProducts(slug)

  if (!isLoading && (!products || products.length === 0)) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Produits similaires</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </section>
  )
}
