import type { Metadata } from 'next'
import { categoryService } from '@/services/categoryService'
import { CatalogueClient } from './CatalogueClient'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (slug === 'all') {
    return {
      title: 'Catalogue — Tous nos produits électroniques à Dakar',
      description:
        'Parcourez notre catalogue complet : smartphones, ordinateurs, TV, électroménager et accessoires. Meilleurs prix à Dakar, paiement à la livraison.',
      openGraph: {
        title: 'Catalogue — Boutique Electronics Sénégal',
        description: 'Tous nos produits high-tech au meilleur prix à Dakar.',
        url: `${siteUrl}/catalogue/all`,
        type: 'website',
      },
    }
  }

  try {
    const category = await categoryService.getBySlug(slug)
    return {
      title: `${category.name} à Dakar — Prix FCFA | Boutique Electronics Sénégal`,
      description:
        `Achetez ${category.name} au meilleur prix à Dakar, Sénégal. Large choix, livraison rapide, paiement à la livraison.`,
      openGraph: {
        title: `${category.name} — Boutique Electronics Sénégal`,
        description: `Meilleurs prix sur ${category.name} à Dakar. Commandez via WhatsApp.`,
        url: `${siteUrl}/catalogue/${slug}`,
        type: 'website',
      },
      alternates: { canonical: `${siteUrl}/catalogue/${slug}` },
    }
  } catch {
    return { title: 'Catalogue — Boutique Electronics Sénégal' }
  }
}

export default function CataloguePage() {
  return <CatalogueClient />
}
