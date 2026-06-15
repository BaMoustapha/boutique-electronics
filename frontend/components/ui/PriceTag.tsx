import { formatPrice } from '@/utils/formatPrice'

interface PriceTagProps {
  price: number
  oldPrice?: number | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const priceSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

export function PriceTag({ price, oldPrice, size = 'md', className = '' }: PriceTagProps) {
  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`font-bold text-[#E63946] font-display ${priceSizes[size]}`}>
        {formatPrice(price)}
      </span>
      {oldPrice && oldPrice > price && (
        <span className="text-sm text-text-muted line-through font-body">
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  )
}
