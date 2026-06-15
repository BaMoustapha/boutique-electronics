'use client'

import { Trash2, Plus, Minus, ShoppingCart, Phone, MessageCircle, ArrowLeft, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { PriceTag } from '@/components/ui/PriceTag'
import { formatPrice } from '@/utils/formatPrice'
import { getImageUrl } from '@/utils/getImageUrl'
import { generateCartWhatsAppLink } from '@/utils/generateWhatsAppLink'
import { PHONE_NUMBER } from '@/utils/constants'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, clear, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={36} className="text-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Votre panier est vide</h1>
        <p className="text-text-secondary mb-8">Parcourez notre catalogue et ajoutez des produits à votre panier.</p>
        <Link
          href="/catalogue/smartphones"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
        >
          <ArrowLeft size={18} />
          Voir le catalogue
        </Link>
      </div>
    )
  }

  const whatsappUrl = generateCartWhatsAppLink(items)
  const phoneUrl = `tel:${PHONE_NUMBER.replace(/\s/g, '')}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mon panier</h1>
          <p className="text-sm text-text-muted mt-0.5">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={clear}
          className="text-sm text-text-muted hover:text-danger flex items-center gap-1 transition"
        >
          <Trash2 size={14} />
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-surface border border-border-light rounded-lg p-4"
            >
              {/* Image */}
              <Link href={`/produit/${product.slug}`} className="shrink-0">
                <div className="w-20 h-20 bg-surface-alt rounded-lg overflow-hidden">
                  {product.primary_image ? (
                    <Image
                      src={getImageUrl(product.primary_image) ?? ''}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <ShoppingCart size={24} />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/produit/${product.slug}`}
                  className="text-sm font-semibold text-text-primary hover:text-primary line-clamp-2 leading-snug"
                >
                  {product.name}
                </Link>
                {product.brand && (
                  <p className="text-xs text-text-muted mt-0.5">{product.brand.name}</p>
                )}
                <div className="mt-2">
                  <PriceTag price={product.price} size="sm" />
                </div>
              </div>

              {/* Quantité + Suppr */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeItem(product)}
                  className="text-text-muted hover:text-danger transition"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-surface-alt transition"
                    aria-label="Diminuer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-surface-alt transition"
                    aria-label="Augmenter"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <p className="text-sm font-bold text-text-primary">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border-light rounded-lg p-5 sticky top-24">
            <h2 className="text-base font-bold text-text-primary mb-4">Récapitulatif</h2>

            <div className="space-y-2 text-sm text-text-secondary mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between">
                  <span className="truncate pr-2 max-w-[60%]">
                    {product.name} {quantity > 1 && <span className="text-text-muted">×{quantity}</span>}
                  </span>
                  <span className="font-medium text-text-primary shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light pt-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Hors frais de livraison</p>
            </div>

            {/* CTA principal — commande en ligne */}
            <Link
              href="/commander"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition mb-2"
            >
              <ClipboardList size={20} />
              Passer la commande
            </Link>

            {/* Séparateur */}
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-border-light" />
              <span className="text-xs text-text-muted">ou</span>
              <div className="flex-1 h-px bg-border-light" />
            </div>

            {/* CTA WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-lg transition mb-2"
            >
              <MessageCircle size={20} />
              Commander sur WhatsApp
            </a>

            {/* CTA Téléphone */}
            <a
              href={phoneUrl}
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-border text-text-secondary font-semibold rounded-lg hover:bg-surface-alt transition"
            >
              <Phone size={18} />
              Appeler pour commander
            </a>

            <p className="text-xs text-text-muted text-center mt-3 leading-relaxed">
              Paiement à la livraison · Livraison à Dakar et environs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
