import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Promotions & Bons Plans — Smartphones, TV, PC en promo à Dakar',
  description:
    'Découvrez toutes nos offres et réductions du moment : smartphones, téléviseurs, ordinateurs et électroménager en promotion à Dakar. Paiement à la livraison.',
  openGraph: {
    title: 'Promotions — Boutique Electronics Sénégal',
    description: 'Meilleures offres du moment sur la high-tech à Dakar. Jusqu\'à -50% sur une sélection de produits.',
    type: 'website',
  },
}

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
