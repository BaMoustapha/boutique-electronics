import type { Metadata } from 'next'
import { brandService } from '@/services/brandService'
import { MarqueClient } from './MarqueClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const brand = await brandService.getBySlug(slug)
    const logoUrl = brand.logo ?? undefined
    return {
      title: `${brand.name} à Dakar — Prix FCFA | Boutique Electronics Sénégal`,
      description:
        `Découvrez tous les produits ${brand.name} disponibles à Dakar. Meilleurs prix, livraison rapide, paiement à la livraison.`,
      openGraph: {
        title: `${brand.name} — Boutique Electronics Sénégal`,
        description: `Achetez ${brand.name} au meilleur prix à Dakar, Sénégal.`,
        url: `${siteUrl}/marques/${slug}`,
        images: logoUrl ? [{ url: logoUrl, alt: brand.name }] : [],
        type: 'website',
      },
      alternates: { canonical: `${siteUrl}/marques/${slug}` },
    }
  } catch {
    return { title: 'Marque — Boutique Electronics Sénégal' }
  }
}

export default function MarquePage() {
  return <MarqueClient />
}
