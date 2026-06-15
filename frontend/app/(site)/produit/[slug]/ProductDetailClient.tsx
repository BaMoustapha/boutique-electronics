'use client'

import { ProductDetail } from '@/components/product/ProductDetail'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { CategoryBreadcrumb } from '@/components/catalog/CategoryBreadcrumb'
import type { Product } from '@/types/product'

interface Props {
  product: Product
}

export function ProductDetailClient({ product }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <CategoryBreadcrumb
        items={[
          { label: product.category.name, href: `/catalogue/${product.category.slug}` },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <RelatedProducts slug={product.slug} />
    </div>
  )
}
