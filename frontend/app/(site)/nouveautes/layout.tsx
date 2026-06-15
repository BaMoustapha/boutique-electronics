import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouveautés — Derniers smartphones, TV et PC arrivés à Dakar',
  description:
    'Découvrez les derniers produits high-tech arrivés en boutique à Dakar : nouveaux smartphones, téléviseurs, ordinateurs et accessoires. Paiement à la livraison.',
  openGraph: {
    title: 'Nouveautés — Boutique Electronics Sénégal',
    description: 'Les dernières nouveautés high-tech disponibles à Dakar, Sénégal.',
    type: 'website',
  },
}

export default function NouveautesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
