import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suivi de commande — Boutique Electronics Sénégal',
  description:
    'Suivez l\'état de votre commande en temps réel. Entrez votre numéro de commande (CMD-XXXXXXXX) pour connaître le statut de votre livraison à Dakar.',
  openGraph: {
    title: 'Suivi de commande — Boutique Electronics Sénégal',
    description: 'Suivez votre commande en temps réel.',
    type: 'website',
  },
}

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
