'use client'

import { useState } from 'react'
import { Heart, Share2, ChevronDown, ChevronUp, ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { ProductImages } from './ProductImages'
import { ProductSpecs } from './ProductSpecs'
import { ProductBadges } from './ProductBadge'
import { PriceTag } from '@/components/ui/PriceTag'
import { StockBadge } from '@/components/ui/StockBadge'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { notify } from '@/utils/toasts'
import Link from 'next/link'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { toggle: toggleWishlist, isInWishlist } = useWishlist()
  const { addItem, isInCart } = useCart()
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const inCart = isInCart(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      notify.copyLink()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <ProductImages images={product.images} productName={product.name} />

      {/* Info */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          {product.brand && (
            <>
              <Link href={`/marques/${product.brand.slug}`} className="hover:text-blue-700">{product.brand.name}</Link>
              <span>/</span>
            </>
          )}
          <Link href={`/catalogue/${product.category.slug}`} className="hover:text-blue-700">{product.category.name}</Link>
        </div>

        {/* Title */}
        <div>
          <ProductBadges product={product} className="flex-row mb-2" />
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <PriceTag price={product.price} oldPrice={product.old_price} size="xl" />
          {product.is_on_sale && product.discount_percent > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
              -{product.discount_percent}%
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <StockBadge status={product.status} quantity={product.stock_quantity} />

          {/* Bannière urgence */}
          {product.status === 'low_stock' && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <span className="relative flex h-2.5 w-2.5 mt-0.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <p className="font-medium">
                {product.stock_quantity != null && product.stock_quantity > 0
                  ? <>Plus que <strong>{product.stock_quantity} exemplaire{product.stock_quantity > 1 ? 's' : ''}</strong> en stock — commandez vite !</>
                  : 'Stock très limité — commandez vite !'}
              </p>
            </div>
          )}

          {product.status === 'out_of_stock' && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
              <span className="text-gray-400 shrink-0 mt-0.5">ℹ️</span>
              <p>
                Ce produit est actuellement en rupture de stock.{' '}
                <span className="font-medium">Contactez-nous sur WhatsApp</span> pour être informé du réapprovisionnement.
              </p>
            </div>
          )}
        </div>

        {/* Sélecteur de quantité */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm text-gray-600">Quantité :</span>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              aria-label="Diminuer"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              aria-label="Augmenter"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Actions principales */}
        <div className="space-y-2 pt-1">
          {/* WhatsApp — commande directe */}
          <WhatsAppButton product={product} quantity={quantity} size="lg" fullWidth label="Commander sur WhatsApp" />

          {/* Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={product.status === 'out_of_stock'}
            className={`flex items-center justify-center gap-2 w-full h-11 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
              addedToCart
                ? 'bg-green-50 border-2 border-green-500 text-green-700'
                : inCart
                ? 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900'
                : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
            }`}
          >
            {addedToCart ? (
              <><Check size={18} /> Ajouté au panier !</>
            ) : (
              <><ShoppingCart size={18} /> {inCart ? 'Ajouter encore' : 'Ajouter au panier'}</>
            )}
          </button>

          <PhoneButton size="lg" fullWidth />
        </div>

        {/* Secondary actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition border ${
              inWishlist
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            {inWishlist ? 'Dans la wishlist' : 'Wishlist'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Share2 size={16} />
            Partager
          </button>
        </div>

        {/* Tabs: description + specs */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            {(['description', 'specs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'description' ? 'Description' : 'Caractéristiques'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div>
              <p className={`text-sm text-gray-600 leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`}>
                {product.description}
              </p>
              {product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-sm text-blue-700 flex items-center gap-1 hover:underline"
                >
                  {showFullDesc ? (<><ChevronUp size={14} /> Voir moins</>) : (<><ChevronDown size={14} /> Voir plus</>)}
                </button>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <ProductSpecs specifications={product.specifications} />
          )}
        </div>
      </div>
    </div>
  )
}
