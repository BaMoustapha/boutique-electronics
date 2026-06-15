import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: 'Boutique Electronics Sénégal — High-tech & Électroménager à Dakar',
    template: '%s | Boutique Electronics Sénégal',
  },
  description:
    'Achetez smartphones, ordinateurs, téléviseurs et électroménagers au meilleur prix à Dakar, Sénégal. Livraison rapide, paiement à la livraison.',
  keywords: ['électronique Dakar', 'smartphones Sénégal', 'prix FCFA', 'high-tech Dakar',
    'boutique informatique Dakar', 'achat téléphone Sénégal', 'électroménager Dakar'],
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'Boutique Electronics Sénégal',
    locale: 'fr_SN',
    type: 'website',
    url: siteUrl,
    title: 'Boutique Electronics Sénégal — High-tech & Électroménager à Dakar',
    description: 'Smartphones, ordinateurs, TV et électroménagers au meilleur prix à Dakar. Paiement à la livraison.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boutique Electronics Sénégal',
    description: 'High-tech & Électroménager au meilleur prix à Dakar, Sénégal.',
  },
  alternates: { canonical: siteUrl },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${plusJakartaSans.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
