import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types/product'

interface ProductBadgeProps {
  product: Product
  className?: string
}

export function ProductBadges({ product, className = '' }: ProductBadgeProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {product.is_new && <Badge variant="new">Nouveau</Badge>}
      {product.is_on_sale && product.discount_percent > 0 && (
        <Badge variant="promo">-{product.discount_percent}%</Badge>
      )}
      {product.status === 'out_of_stock' && <Badge variant="outofstock">Rupture</Badge>}
      {product.status === 'low_stock' && <Badge variant="lowstock">Stock limité</Badge>}
      {product.status === 'on_order' && <Badge variant="onorder">Sur commande</Badge>}
    </div>
  )
}
