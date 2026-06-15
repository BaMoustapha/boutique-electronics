'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Loader2, CheckCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useCreateOrder } from '@/hooks/useOrder'
import { notify } from '@/utils/toasts'
import { formatPrice } from '@/utils/formatPrice'
import { getImageUrl } from '@/utils/getImageUrl'
import { DELIVERY_ZONES } from '@/utils/constants'

const schema = z.object({
  customer_name:    z.string().min(2, 'Nom requis (min 2 caractères)'),
  customer_phone:   z.string().min(8, 'Numéro invalide (min 8 chiffres)'),
  customer_email:   z.string().email('Email invalide').or(z.literal('')).optional(),
  delivery_zone:    z.string().min(1, 'Choisissez une zone de livraison'),
  delivery_address: z.string().min(5, 'Adresse requise (min 5 caractères)'),
  note:             z.string().optional(),
})

type FormData = z.infer<typeof schema>

const inputClass = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface'

export default function CommanderPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clear } = useCart()
  const { mutate: createOrder, isPending, isSuccess, data: order } = useCreateOrder()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isSuccess && order) {
      notify.orderSuccess(order.order_number)
      clear()
      router.push(`/commande/confirmation/${order.order_number}`)
    }
  }, [isSuccess, order, clear, router])

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={48} className="mx-auto text-text-muted mb-4" />
        <h1 className="text-xl font-bold text-text-primary mb-2">Votre panier est vide</h1>
        <Link href="/panier" className="text-primary hover:underline text-sm">
          Retour au panier
        </Link>
      </div>
    )
  }

  const onSubmit = (data: FormData) => {
    createOrder({
      ...data,
      customer_email: data.customer_email || '',
      note: data.note || '',
      items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/panier" className="text-text-muted hover:text-text-primary transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Passer la commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-4">

          {/* Infos client */}
          <div className="bg-surface border border-border-light rounded-lg p-5">
            <h2 className="font-bold text-text-primary mb-4">Vos coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Nom complet <span className="text-primary">*</span>
                </label>
                <input
                  {...register('customer_name')}
                  placeholder="Prénom et nom"
                  className={inputClass}
                />
                {errors.customer_name && (
                  <p className="text-danger text-xs mt-1">{errors.customer_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Téléphone / WhatsApp <span className="text-primary">*</span>
                </label>
                <input
                  {...register('customer_phone')}
                  placeholder="+221 77 XXX XX XX"
                  className={inputClass}
                />
                {errors.customer_phone && (
                  <p className="text-danger text-xs mt-1">{errors.customer_phone.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email <span className="text-text-muted font-normal">(optionnel — pour recevoir la confirmation)</span>
                </label>
                <input
                  {...register('customer_email')}
                  type="email"
                  placeholder="exemple@gmail.com"
                  className={inputClass}
                />
                {errors.customer_email && (
                  <p className="text-danger text-xs mt-1">{errors.customer_email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-surface border border-border-light rounded-lg p-5">
            <h2 className="font-bold text-text-primary mb-4">Livraison</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Zone de livraison <span className="text-primary">*</span>
                </label>
                <select
                  {...register('delivery_zone')}
                  className={inputClass}
                >
                  <option value="">Sélectionnez votre zone</option>
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
                {errors.delivery_zone && (
                  <p className="text-danger text-xs mt-1">{errors.delivery_zone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Adresse précise <span className="text-primary">*</span>
                </label>
                <textarea
                  {...register('delivery_address')}
                  rows={2}
                  placeholder="Rue, quartier, point de repère..."
                  className={`${inputClass} resize-none`}
                />
                {errors.delivery_address && (
                  <p className="text-danger text-xs mt-1">{errors.delivery_address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Note <span className="text-text-muted font-normal">(optionnel)</span>
                </label>
                <textarea
                  {...register('note')}
                  rows={2}
                  placeholder="Instructions spéciales, disponibilités..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition text-base"
          >
            {isPending ? (
              <><Loader2 size={20} className="animate-spin" /> Envoi en cours...</>
            ) : (
              <><CheckCircle size={20} /> Confirmer la commande</>
            )}
          </button>

          <p className="text-xs text-text-muted text-center">
            Paiement à la livraison · Nous vous contacterons pour confirmer
          </p>
        </form>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border-light rounded-lg p-5 sticky top-24">
            <h2 className="font-bold text-text-primary mb-4">
              Récapitulatif <span className="text-text-muted font-normal">({totalItems} article{totalItems > 1 ? 's' : ''})</span>
            </h2>

            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-alt rounded-lg overflow-hidden shrink-0">
                    {product.primary_image && (
                      <Image
                        src={getImageUrl(product.primary_image) ?? ''}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{product.name}</p>
                    <p className="text-xs text-text-muted">×{quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-text-primary shrink-0">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Hors frais de livraison</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
