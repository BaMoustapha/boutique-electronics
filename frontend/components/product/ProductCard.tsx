'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatPrice } from '@/utils/formatPrice'
import { ProductBadges } from './ProductBadge'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle: toggleWishlist, isInWishlist } = useWishlist()
  const { addItem, isInCart } = useCart()

  const inWishlist = isInWishlist(product.id)
  const inCart = isInCart(product.id)
  const imageUrl = getImageUrl(product.primary_image)

  return (
    <motion.div
      className="group bg-white rounded-lg border border-[#DEE2E6] hover:border-[#E63946] transition-all duration-200 flex flex-col overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link href={`/produit/${product.slug}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F8F9FA]">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#E9ECEF"/>
                <path d="M14 18l10-6 10 6v12l-10 6-10-6V18z" stroke="#ADB5BD" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <path d="M24 12v12M14 18l10 6 10-6" stroke="#ADB5BD" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-[#CED4DA]">
                Photo à venir
              </span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 pointer-events-none flex flex-col gap-1">
          <ProductBadges product={product} />
        </div>

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleWishlist(product)}
            title={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all duration-150 ${
              inWishlist
                ? 'bg-[#E63946] border-[#E63946] text-white'
                : 'bg-white border-[#DEE2E6] text-[#868E96] hover:border-[#E63946] hover:text-[#E63946]'
            }`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => addItem(product)}
            title={inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all duration-150 ${
              inCart
                ? 'bg-[#E63946] border-[#E63946] text-white'
                : 'bg-white border-[#DEE2E6] text-[#868E96] hover:border-[#E63946] hover:text-[#E63946]'
            }`}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5 border-t border-[#F1F3F5]">
        {/* Brand */}
        {product.brand && (
          <Link
            href={`/marques/${product.brand.slug}`}
            className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#868E96] hover:text-[#E63946] transition-colors font-display"
          >
            {product.brand.name}
          </Link>
        )}

        {/* Name */}
        <Link href={`/produit/${product.slug}`} className="flex-1">
          <h3 className="text-[15px] font-semibold text-[#1A1A2E] line-clamp-2 hover:text-[#E63946] transition-colors leading-snug font-display">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
          <span className="text-[20px] font-bold text-[#E63946] font-display leading-none">
            {formatPrice(product.price)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-[14px] text-[#868E96] line-through font-body">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>

        {/* Stock urgence */}
        {product.status === 'low_stock' && (
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            {product.stock_quantity != null && product.stock_quantity > 0
              ? `Plus que ${product.stock_quantity} en stock`
              : 'Stock limité'}
          </p>
        )}
        {product.status === 'out_of_stock' && (
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Rupture de stock</p>
        )}

        {/* WhatsApp CTA */}
        <WhatsAppButton
          product={product}
          size="sm"
          variant="solid"
          fullWidth
          label="Commander"
          className="mt-1 rounded-md"
        />
      </div>
    </motion.div>
  )
}
