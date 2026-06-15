interface BadgeProps {
  children: React.ReactNode
  variant?: 'new' | 'promo' | 'featured' | 'outofstock' | 'lowstock' | 'onorder' | 'blue' | 'green' | 'red' | 'orange' | 'gray' | 'yellow'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  new:        'bg-[#7C3AED] text-white',
  promo:      'bg-[#E63946] text-white',
  featured:   'bg-[#F59E0B] text-white',
  outofstock: 'bg-[#6c757d] text-white',
  lowstock:   'bg-[#F59E0B] text-white',
  onorder:    'bg-[#0EA5E9] text-white',
  /* compat aliases */
  blue:   'bg-[#7C3AED] text-white',
  green:  'bg-[#2D9E5E] text-white',
  red:    'bg-[#E63946] text-white',
  orange: 'bg-[#F59E0B] text-white',
  gray:   'bg-[#6c757d] text-white',
  yellow: 'bg-[#F59E0B] text-white',
}

const sizes = {
  sm: 'px-2 py-[3px] text-[10px]',
  md: 'px-2.5 py-[4px] text-xs',
}

export function Badge({ children, variant = 'blue', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] font-semibold uppercase tracking-[0.04em] font-display ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
