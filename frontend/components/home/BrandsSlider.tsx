'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useBrands } from '@/hooks/useBrands'
import { getImageUrl } from '@/utils/getImageUrl'

interface BrandsSliderProps {
  variant?: 'light' | 'dark'
}

export function BrandsSlider({ variant = 'light' }: BrandsSliderProps) {
  const { data: brands = [], isLoading } = useBrands()
  const featured = brands.filter((b) => b.is_featured)
  const isDark = variant === 'dark'

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className={`h-5 w-32 rounded animate-pulse ${isDark ? 'bg-white/20' : 'bg-gray-200'}`} />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-16 w-28 rounded-xl shrink-0 animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />
          ))}
        </div>
      </div>
    )
  }

  if (featured.length === 0) return null

  // Duplicate for seamless marquee loop (same technique as Navbar top bar)
  const items = [...featured, ...featured]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#E63946] rounded-full shrink-0" />
          <div>
            <h2 className={`text-[18px] font-display font-bold leading-tight ${isDark ? 'text-white' : 'text-text-primary'}`}>
              Nos marques
            </h2>
            <p className={`text-[12px] font-body mt-0.5 ${isDark ? 'text-white/50' : 'text-text-muted'}`}>
              Toutes les grandes marques officielles
            </p>
          </div>
        </div>
        <Link
          href="/catalogue/all"
          className={`text-[12px] font-display font-semibold transition-colors hidden sm:block ${
            isDark ? 'text-white/50 hover:text-white' : 'text-text-muted hover:text-primary'
          }`}
        >
          Voir tous les produits →
        </Link>
      </div>

      {/* Auto-scrolling marquee */}
      <div className="overflow-hidden">
        <div className="flex animate-marquee gap-3">
          {items.map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={`/marques/${brand.slug}`}
              className={`group shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-xl px-5 py-3 h-[72px] w-28 transition-all duration-200 ${
                isDark
                  ? 'bg-white/[0.07] border border-white/10 hover:bg-white/[0.14] hover:border-white/25'
                  : 'bg-white border border-border hover:border-primary/40 hover:shadow-sm'
              }`}
            >
              {getImageUrl(brand.logo) ? (
                <div className={`relative w-full h-9 transition-opacity ${isDark ? 'opacity-60 group-hover:opacity-100' : ''}`}>
                  <Image
                    src={getImageUrl(brand.logo)!}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className={`text-[11px] font-black tracking-tight text-center leading-tight ${
                  isDark ? 'text-white/70 group-hover:text-white' : 'text-text-primary'
                }`}>
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
