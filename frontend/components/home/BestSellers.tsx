'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useBestSellers } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatPrice } from '@/utils/formatPrice'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductBadges } from '@/components/product/ProductBadge'

function SkeletonCard() {
  return (
    <div className="shrink-0 w-36 sm:w-44 bg-white border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-alt" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-3 bg-surface-alt rounded w-3/4" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
        <div className="h-4 bg-surface-alt rounded w-2/3 mt-1" />
      </div>
    </div>
  )
}

export function BestSellers() {
  const { data, isLoading } = useBestSellers()
  const { addItem, isInCart } = useCart()
  const products = data?.results ?? []

  if (!isLoading && products.length === 0) return null

  return (
    <section>
      <SectionHeader title="Meilleures ventes" href="/catalogue" />

      <div className="relative">
        {/* Fade hint on right edge to signal scrollability */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide scroll-smooth">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => {
                const imageUrl = getImageUrl(product.primary_image)
                const inCart = isInCart(product.id)

                return (
                  <div
                    key={product.id}
                    className="group shrink-0 w-36 sm:w-44 bg-white border border-border hover:border-[#E63946] rounded-lg overflow-hidden transition-colors duration-200 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-white overflow-hidden">
                      <Link href={`/produit/${product.slug}`}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            sizes="176px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-3xl bg-surface-alt">
                            📦
                          </div>
                        )}
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-1.5 left-1.5 pointer-events-none flex flex-col gap-1">
                        <ProductBadges product={product} />
                      </div>

                      {/* Cart button on hover */}
                      <button
                        onClick={() => addItem(product)}
                        title={inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                        className={`absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border transition-all duration-150 opacity-0 group-hover:opacity-100 ${
                          inCart
                            ? 'bg-[#E63946] border-[#E63946] text-white'
                            : 'bg-white border-border text-text-muted hover:border-[#E63946] hover:text-[#E63946]'
                        }`}
                      >
                        <ShoppingCart size={13} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-2.5 flex flex-col gap-1 flex-1 border-t border-[#F1F3F5]">
                      <Link href={`/produit/${product.slug}`}>
                        <p className="text-[12px] font-semibold text-text-primary line-clamp-2 leading-snug hover:text-[#E63946] transition-colors font-display">
                          {product.name}
                        </p>
                      </Link>
                      <div className="flex items-baseline gap-1.5 flex-wrap mt-auto pt-1">
                        <span className="text-[14px] font-bold text-[#E63946] font-display leading-none">
                          {formatPrice(product.price)}
                        </span>
                        {product.old_price && product.old_price > product.price && (
                          <span className="text-[11px] text-text-muted line-through font-body">
                            {formatPrice(product.old_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
