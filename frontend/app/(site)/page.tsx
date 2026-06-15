import type { Metadata } from 'next'
import { HeroBanner } from '@/components/home/HeroBanner'
import { TrustBanner } from '@/components/home/TrustBanner'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PromoBanner } from '@/components/home/PromoBanner'
import { BrandsSlider } from '@/components/home/BrandsSlider'
import { NewArrivals } from '@/components/home/NewArrivals'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SocialProofBar } from '@/components/home/SocialProofBar'
import { BestSellers } from '@/components/home/BestSellers'

export const metadata: Metadata = {
  title: 'Boutique Electronics Sénégal — Smartphones, TV, PC à Dakar',
  description:
    'Votre boutique high-tech à Dakar : smartphones, ordinateurs, électroménager et accessoires. Commandez via WhatsApp. Livraison Dakar et banlieue.',
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
        <HeroBanner />
      </div>

      {/* TrustBanner — white, contraste immédiat après le hero sombre */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <TrustBanner />
      </div>

      {/* BestSellers — surface-alt full-width band */}
      <div className="bg-surface-alt border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <BestSellers />
        </div>
      </div>

      {/* CategoryGrid — white */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <SectionHeader title="Nos catégories" subtitle="Explorez notre catalogue complet" />
        <CategoryGrid />
      </div>

      {/* FeaturedProducts — surface-alt full-width band */}
      <div className="bg-surface-alt border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <FeaturedProducts />
        </div>
      </div>

      {/* PromoBanner — white, constrained */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <PromoBanner />
      </div>

      {/* NewArrivals — surface-alt full-width band */}
      <div className="bg-surface-alt border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <NewArrivals />
        </div>
      </div>

      {/* SocialProofBar + BrandsSlider — dark full-width band combiné */}
      <div className="bg-text-primary">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
          <SocialProofBar />
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <BrandsSlider variant="dark" />
        </div>
      </div>
    </div>
  )
}
