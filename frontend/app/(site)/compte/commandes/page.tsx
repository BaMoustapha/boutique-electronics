// frontend/app/(site)/compte/commandes/page.tsx
'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { RequireAuth } from '@/components/ui/RequireAuth'
import { useMyOrders } from '@/hooks/useCustomer'
import { formatPrice } from '@/utils/formatPrice'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Order } from '@/types/order'

const STATUS_LABEL: Record<Order['status'], string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_CLASS: Record<Order['status'], string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-surface-alt text-text-muted border-border',
}

function OrderRow({ order }: { order: Order }) {
  return (
    <Link
      href={`/suivi?numero=${order.order_number}`}
      className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary transition group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono font-semibold text-sm text-text-primary">{order.order_number}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${STATUS_CLASS[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>
        <p className="text-xs text-text-muted">
          {new Date(order.created_at).toLocaleDateString('fr-SN', { day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}{order.items.length} article{order.items.length > 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <span className="font-bold text-primary font-display">{formatPrice(order.total_amount)}</span>
        <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition" />
      </div>
    </Link>
  )
}

function CommandesList() {
  const { data: orders, isLoading } = useMyOrders()

  if (isLoading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
    </div>
  )

  if (!orders?.length) return (
    <div className="text-center py-16">
      <Package size={40} className="mx-auto text-text-muted mb-4" />
      <p className="font-semibold text-text-primary mb-1">Aucune commande</p>
      <p className="text-sm text-text-muted mb-6">Vos commandes apparaîtront ici</p>
      <Link href="/" className="inline-flex h-10 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md text-sm transition items-center font-display">
        Voir le catalogue
      </Link>
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map((order) => <OrderRow key={order.id} order={order} />)}
    </div>
  )
}

export default function CommandesPage() {
  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-surface-alt rounded-xl flex items-center justify-center">
            <Package size={20} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Mes commandes</h1>
        </div>
        <CommandesList />
      </div>
    </RequireAuth>
  )
}
