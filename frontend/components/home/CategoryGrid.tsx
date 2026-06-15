'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Smartphone, Laptop, Home, Music, Gamepad2, Wind,
  Tv, Zap, Camera, Cable, HardDrive, Package,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { getImageUrl } from '@/utils/getImageUrl'

type IconComponent = React.ComponentType<LucideProps>

const CATEGORY_CONFIG: Record<string, { color: string; Icon: IconComponent }> = {
  'smartphones':          { color: '#2563EB', Icon: Smartphone },
  'telephonie':           { color: '#3B82F6', Icon: Smartphone },
  'informatique':         { color: '#4F46E5', Icon: Laptop },
  'electromenager':       { color: '#0D9488', Icon: Home },
  'audio-video':          { color: '#9333EA', Icon: Music },
  'jeux-video':           { color: '#DC2626', Icon: Gamepad2 },
  'climatiseurs':         { color: '#0891B2', Icon: Wind },
  'televiseurs':          { color: '#475569', Icon: Tv },
  'onduleurs-solaire':    { color: '#D97706', Icon: Zap },
  'cameras-surveillance': { color: '#374151', Icon: Camera },
  'accessoires':          { color: '#EC4899', Icon: Cable },
  'stockage':             { color: '#16A34A', Icon: HardDrive },
}

function getConfig(slug: string) {
  return CATEGORY_CONFIG[slug] ?? { color: '#6B7280', Icon: Package }
}

export function CategoryGrid() {
  const { data: categories = [], isLoading } = useCategories()
  const rootCategories = categories.filter((c) => c.parent === null).slice(0, 8)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 sm:h-40 bg-surface-alt rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {rootCategories.map((cat) => {
        const { color, Icon } = getConfig(cat.slug)
        const imageUrl = getImageUrl(cat.image)

        return (
          <Link
            key={cat.id}
            href={`/catalogue/${cat.slug}`}
            className="group relative h-36 sm:h-40 rounded-lg overflow-hidden block"
            style={!imageUrl ? { backgroundColor: color } : undefined}
          >
            {/* Background image */}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ) : (
              /* Fallback sans image : icône géante centrée + gradient diagonal */
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${color}cc 0%, ${color}99 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon size={96} className="text-white opacity-[0.18] group-hover:opacity-25 transition-opacity" strokeWidth={1} />
                </div>
              </>
            )}

            {/* Gradient overlay — texte lisible */}
            <div
              className="absolute inset-0"
              style={{
                background: imageUrl
                  ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.0) 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 60%)',
              }}
            />

            {/* Petit badge icône — top-right */}
            <div
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <Icon size={15} className="text-white" />
            </div>

            {/* Nom catégorie + compteur — bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
              <span className="text-[15px] font-semibold text-white leading-tight font-display line-clamp-2 drop-shadow-sm">
                {cat.name}
              </span>
              {cat.product_count != null && cat.product_count > 0 && (
                <span className="block text-[11px] text-white/70 font-body mt-0.5">
                  {cat.product_count} produits
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
