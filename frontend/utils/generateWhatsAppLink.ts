import type { Product } from '@/types/product'
import type { CartItem } from '@/store/cartStore'
import { formatPrice } from './formatPrice'

export function generateWhatsAppLink(product: Product, quantity = 1): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221771234567'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const qtyLine = quantity > 1 ? `📦 Quantité : ${quantity}\n` : ''
  const message = encodeURIComponent(
    `Bonjour ! Je souhaite commander :\n\n` +
    `📱 *${product.name}*\n` +
    `💰 Prix : ${formatPrice(product.price)}\n` +
    qtyLine +
    `🔗 ${siteUrl}/produit/${product.slug}\n\n` +
    `Merci de confirmer la disponibilité et les délais de livraison.`
  )
  return `https://wa.me/${phone}?text=${message}`
}

export function generateCartWhatsAppLink(items: CartItem[]): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221771234567'
  const lines = items
    .map((item, i) => {
      const qty = item.quantity > 1 ? ` (x${item.quantity})` : ''
      return `${i + 1}. *${item.product.name}*${qty} — ${formatPrice(item.product.price * item.quantity)}`
    })
    .join('\n')

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const message = encodeURIComponent(
    `Bonjour ! Je souhaite commander les articles suivants :\n\n` +
    `${lines}\n\n` +
    `💰 *Total : ${formatPrice(total)}*\n\n` +
    `Merci de confirmer les disponibilités et les délais de livraison.`
  )
  return `https://wa.me/${phone}?text=${message}`
}

export function generateWhatsAppLinkSimple(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221771234567'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
