'use client'

import { use } from 'react'
import Link from 'next/link'
import { CheckCircle, Phone, MessageCircle, Package, MapPin, Loader2 } from 'lucide-react'
import { useOrder } from '@/hooks/useOrder'
import { formatPrice } from '@/utils/formatPrice'
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/utils/constants'

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente de confirmation',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

interface Props {
  params: Promise<{ numero: string }>
}

export default function ConfirmationPage({ params }: Props) {
  const { numero } = use(params)
  const { data: order, isLoading } = useOrder(numero)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Commande introuvable.</p>
        <Link href="/" className="text-[#E63946] hover:underline text-sm mt-2 inline-block">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const whatsappConfirm = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour, j'ai passé la commande *${order.order_number}*. Pouvez-vous confirmer la livraison ? Merci.`
  )}`

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Succès */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Commande reçue !</h1>
        <p className="text-gray-500 text-sm">
          Nous vous contacterons au <strong>{order.customer_phone}</strong> pour confirmer et organiser la livraison.
        </p>
        {order.customer_email && (
          <p className="text-gray-400 text-xs mt-1">Un email de confirmation a été envoyé à {order.customer_email}.</p>
        )}
      </div>

      {/* Numéro commande */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Numéro de commande</p>
        <p className="text-2xl font-bold text-[#E63946] font-mono">{order.order_number}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Articles */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-gray-500" />
          <h2 className="font-bold text-gray-900">Articles commandés</h2>
        </div>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.product_name}
                {item.quantity > 1 && (
                  <span className="text-gray-400 ml-1">×{item.quantity}</span>
                )}
              </span>
              <span className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-[#E63946] text-lg">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Livraison */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} className="text-gray-500" />
          <h2 className="font-bold text-gray-900">Livraison</h2>
        </div>
        <p className="text-sm text-gray-700">{order.delivery_zone}</p>
        <p className="text-sm text-gray-500 mt-0.5">{order.delivery_address}</p>
        {order.note && <p className="text-sm text-gray-400 mt-1 italic">Note : {order.note}</p>}
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <Link
          href={`/suivi?numero=${order.order_number}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#E63946] hover:bg-[#c9303c] text-white font-bold rounded-xl transition"
        >
          <Package size={20} />
          Suivre ma commande
        </Link>
        <a
          href={whatsappConfirm}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-xl transition"
        >
          <MessageCircle size={20} />
          Confirmer sur WhatsApp
        </a>
        <a
          href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
        >
          <Phone size={18} />
          Appeler la boutique
        </a>
        <Link
          href="/"
          className="flex items-center justify-center w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
