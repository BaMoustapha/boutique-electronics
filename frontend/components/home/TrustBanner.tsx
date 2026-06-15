import { Truck, CreditCard, ShieldCheck, Headphones } from 'lucide-react'

const ITEMS = [
  {
    icon: Truck,
    title: 'Livraison Dakar',
    subtitle: 'Plateau, Mermoz, Pikine, Guédiawaye…',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    icon: CreditCard,
    title: 'Paiement livraison',
    subtitle: 'Cash ou Mobile Money à réception',
    iconColor: 'text-[#2D9E5E]',
    iconBg: 'bg-green-50',
  },
  {
    icon: ShieldCheck,
    title: 'Produits garantis',
    subtitle: 'Tous nos articles sont garantis',
    iconColor: 'text-[#E63946]',
    iconBg: 'bg-red-50',
  },
  {
    icon: Headphones,
    title: 'Service client',
    subtitle: 'Disponible 7j/7 sur WhatsApp',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
]

export function TrustBanner() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="flex items-center gap-3 bg-white border border-border rounded-lg p-3"
          >
            <div className={`shrink-0 w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
              <Icon size={20} className={item.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-tight font-display">{item.title}</p>
              <p className="text-xs text-text-muted leading-tight mt-0.5 line-clamp-1 font-body">{item.subtitle}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
