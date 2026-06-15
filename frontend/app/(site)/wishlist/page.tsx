'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'

export default function WishlistPage() {
  const { items, clear } = useWishlist()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart size={22} className="text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">Ma liste de souhaits</h1>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-red-500 hover:text-red-600">
            Tout supprimer
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-600 font-medium text-lg mb-2">Votre liste est vide</p>
          <p className="text-gray-400 text-sm mb-6">
            Ajoutez des produits à votre wishlist pour les retrouver facilement
          </p>
          <Link href="/catalogue/all">
            <Button variant="primary">
              <ShoppingBag size={16} />
              Parcourir le catalogue
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {items.length} produit{items.length > 1 ? 's' : ''} sauvegardé{items.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
