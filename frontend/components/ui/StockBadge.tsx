import { STATUS_LABELS } from '@/utils/constants'

interface StockBadgeProps {
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order'
  quantity?: number | null
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  in_stock:     'bg-green-50 text-green-700 border-green-200',
  low_stock:    'bg-amber-50 text-amber-700 border-amber-200',
  out_of_stock: 'bg-gray-100 text-gray-500 border-gray-200',
  on_order:     'bg-blue-50 text-blue-700 border-blue-200',
}

const DOT_STYLES: Record<string, string> = {
  in_stock:     'bg-green-500',
  low_stock:    'bg-amber-500',
  out_of_stock: 'bg-gray-400',
  on_order:     'bg-blue-500',
}

export function StockBadge({ status, quantity, className }: StockBadgeProps) {
  const label = STATUS_LABELS[status] ?? status
  const isPulsing = status === 'low_stock'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] ?? STATUS_STYLES.out_of_stock} ${className ?? ''}`}
    >
      <span className="relative flex h-2 w-2">
        {isPulsing && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${DOT_STYLES[status] ?? DOT_STYLES.out_of_stock}`} />
      </span>
      {label}
      {status === 'low_stock' && quantity != null && quantity > 0 && (
        <span className="font-bold">({quantity} restants)</span>
      )}
    </span>
  )
}
