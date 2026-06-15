'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Metadata exportée via layout.tsx voisin (page 'use client' ne peut pas exporter metadata)
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import {
  Search, Package, CheckCircle, Truck, XCircle, Clock,
  Phone, MessageCircle, MapPin, ChevronRight, RotateCcw,
} from 'lucide-react'
import { useOrder } from '@/hooks/useOrder'
import { formatPrice } from '@/utils/formatPrice'
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/utils/constants'
import type { Order } from '@/types/order'

/* ── Schéma de validation ── */
const schema = z.object({
  numero: z
    .string()
    .min(1, 'Entrez votre numéro de commande')
    .regex(/^CMD-[A-F0-9]{8}$/i, 'Format invalide — ex : CMD-A3F7B2C1'),
})
type FormData = z.infer<typeof schema>

/* ── Timeline statuts ── */
const STEPS = [
  { key: 'pending',   label: 'Reçue',      icon: Clock },
  { key: 'confirmed', label: 'Confirmée',   icon: CheckCircle },
  { key: 'delivered', label: 'Livrée',      icon: Truck },
] as const

const STATUS_ORDER = ['pending', 'confirmed', 'delivered']

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.FC<{ size?: number; className?: string }> }> = {
  pending:   { label: 'En attente',  color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-200',  icon: Clock },
  confirmed: { label: 'Confirmée',   color: 'text-blue-600',   bg: 'bg-blue-50   border-blue-200',   icon: CheckCircle },
  delivered: { label: 'Livrée',      color: 'text-green-600',  bg: 'bg-green-50  border-green-200',  icon: Truck },
  cancelled: { label: 'Annulée',     color: 'text-red-600',    bg: 'bg-red-50    border-red-200',    icon: XCircle },
}

/* ─────────────────────────────────────────── */
/*  Composant résultat                         */
/* ─────────────────────────────────────────── */
function OrderResult({ order, onReset }: { order: Order; onReset: () => void }) {
  const meta    = STATUS_META[order.status]
  const StatusIcon = meta.icon
  const stepIndex = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour, je voudrais des informations sur ma commande *${order.order_number}*. Merci.`
  )}`

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* En-tête commande */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Numéro de commande</p>
            <p className="text-2xl font-bold text-[#E63946] font-mono">{order.order_number}</p>
            <p className="text-xs text-gray-400 mt-1">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-SN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${meta.bg} ${meta.color}`}>
            <StatusIcon size={14} />
            {meta.label}
          </span>
        </div>

        {/* Timeline — masquée si annulée */}
        {!isCancelled && (
          <div className="mt-5">
            <div className="flex items-center">
              {STEPS.map((step, i) => {
                const done    = i <= stepIndex
                const active  = i === stepIndex
                const StepIcon = step.icon
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        done
                          ? active
                            ? 'bg-[#E63946] border-[#E63946] text-white shadow-md shadow-red-200'
                            : 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}>
                        <StepIcon size={16} />
                      </div>
                      <span className={`text-[11px] font-medium whitespace-nowrap ${done ? 'text-gray-700' : 'text-gray-300'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-5 rounded ${i < stepIndex ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Message annulation */}
        {isCancelled && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Cette commande a été annulée. Contactez-nous sur WhatsApp pour plus d'informations.
          </div>
        )}
      </div>

      {/* Client + Livraison */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900 text-sm">Informations de livraison</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Client</p>
            <p className="font-medium text-gray-800">{order.customer_name}</p>
            <p className="text-gray-500">{order.customer_phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Adresse</p>
            <p className="font-medium text-gray-800">{order.delivery_zone}</p>
            <p className="text-gray-500">{order.delivery_address}</p>
          </div>
        </div>
        {order.note && (
          <p className="mt-2 text-xs text-gray-400 italic">Note : {order.note}</p>
        )}
      </div>

      {/* Articles */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900 text-sm">Articles ({order.items.length})</h2>
        </div>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-700">
                {item.product_name}
                {item.quantity > 1 && <span className="text-gray-400 ml-1.5">×{item.quantity}</span>}
              </span>
              <span className="font-semibold text-gray-900 shrink-0 ml-4">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-[#E63946] text-lg">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold rounded-xl transition text-sm"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <a
          href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
          className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
        >
          <Phone size={18} />
          Appeler
        </a>
      </div>

      {/* Rechercher une autre commande */}
      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition"
      >
        <RotateCcw size={14} />
        Suivre une autre commande
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/*  Composant formulaire de recherche          */
/* ─────────────────────────────────────────── */
function SearchForm({ onSubmit, isLoading }: { onSubmit: (numero: string) => void; isLoading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d.numero.toUpperCase()))}
      className="space-y-3"
    >
      <div className="relative">
        <input
          {...register('numero')}
          placeholder="CMD-A3F7B2C1"
          autoComplete="off"
          spellCheck={false}
          className="w-full border-2 border-gray-200 focus:border-[#E63946] focus:ring-0 rounded-xl px-4 py-3.5 pr-12 text-base font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-gray-300 outline-none transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E63946] hover:bg-[#c9303c] disabled:opacity-60 text-white rounded-lg flex items-center justify-center transition"
        >
          {isLoading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Search size={16} />
          }
        </button>
      </div>
      {errors.numero && (
        <p className="text-red-500 text-sm pl-1">{errors.numero.message}</p>
      )}
    </form>
  )
}

/* ─────────────────────────────────────────── */
/*  Contenu (useSearchParams requiert Suspense) */
/* ─────────────────────────────────────────── */
function SuiviContent() {
  const searchParams = useSearchParams()
  const [numero, setNumero]     = useState('')
  const [searched, setSearched] = useState(false)

  // Pré-remplir depuis ?numero=CMD-XXXXXXXX (lien depuis page confirmation)
  useEffect(() => {
    const param = searchParams.get('numero')
    if (param) {
      setNumero(param.toUpperCase())
      setSearched(true)
    }
  }, [searchParams])

  const { data: order, isLoading, isError } = useOrder(searched ? numero : '')

  const handleSearch = (value: string) => {
    setNumero(value)
    setSearched(true)
  }

  const handleReset = () => {
    setNumero('')
    setSearched(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#FFF0F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-[#E63946]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Suivi de commande</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Entrez votre numéro de commande reçu par email ou SMS
        </p>
      </div>

      {/* Formulaire (toujours visible) */}
      {!order && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <SearchForm onSubmit={handleSearch} isLoading={isLoading} />

          {/* Exemple */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Format : <span className="font-mono font-semibold text-gray-500">CMD-A3F7B2C1</span>
            &nbsp;— reçu dans votre email de confirmation
          </p>
        </div>
      )}

      {/* Erreur not found */}
      {searched && isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
          <XCircle size={36} className="mx-auto text-red-400 mb-3" />
          <p className="font-semibold text-red-700 mb-1">Commande introuvable</p>
          <p className="text-sm text-red-500 mb-4">
            Vérifiez le numéro et réessayez, ou contactez-nous directement.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition"
            >
              <RotateCcw size={14} /> Réessayer
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-whatsapp text-white text-sm font-medium rounded-xl hover:bg-whatsapp-dark transition"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Résultat */}
      {order && <OrderResult order={order} onReset={handleReset} />}

      {/* Lien retour */}
      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 transition">
          <ChevronRight size={14} className="rotate-180" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default function SuiviPage() {
  return (
    <Suspense fallback={null}>
      <SuiviContent />
    </Suspense>
  )
}
