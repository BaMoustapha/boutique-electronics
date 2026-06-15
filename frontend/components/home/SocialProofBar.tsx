'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { Star, ShoppingBag, Users, Clock } from 'lucide-react'

interface Stat {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  decimals?: number
  color: string
}

const STATS: Stat[] = [
  {
    icon: ShoppingBag,
    value: 2500,
    suffix: '+',
    label: 'commandes livrées',
    color: '#E63946',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    label: 'satisfaction client',
    decimals: 1,
    color: '#F59E0B',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'produits en stock',
    color: '#2D9E5E',
  },
  {
    icon: Clock,
    value: 24,
    suffix: 'h',
    label: 'livraison Dakar moy.',
    color: '#25D366',
  },
]

function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
  color,
  isInView,
}: {
  value: number
  suffix: string
  decimals?: number
  color: string
  isInView: boolean
}) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) =>
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString('fr-FR')
  )
  const [display, setDisplay] = useState(decimals > 0 ? '0.0' : '0')

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionValue, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    })
    const unsubscribe = rounded.on('change', setDisplay)
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [isInView, motionValue, rounded, value])

  return (
    <span style={{ color }}>
      {display}{suffix}
    </span>
  )
}

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="bg-[#1A1A2E] rounded-xl px-4 pt-4 pb-3"
    >
      {/* Badge "boutique de confiance" */}
      <div className="flex items-center justify-center mb-3">
        <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E5E] animate-pulse" />
          <span className="text-[11px] font-display font-semibold text-white/80 uppercase tracking-[0.06em]">
            Boutique de confiance à Dakar
          </span>
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
              className="flex flex-col items-center text-center gap-1.5 bg-white/[0.06] rounded-lg px-2 py-3 border border-white/[0.07]"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}22` }}
              >
                <Icon size={16} style={{ color: stat.color }} />
              </div>

              <p className="text-[22px] font-display font-bold leading-none">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  color={stat.color}
                  isInView={isInView}
                />
              </p>

              <p className="text-[11px] font-body text-white/55 leading-tight">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Ligne d'étoiles */}
      <div className="flex items-center justify-center gap-0.5 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
        ))}
        <span className="text-[11px] font-body text-white/40 ml-2">
          Avis vérifiés de nos clients WhatsApp
        </span>
      </div>
    </motion.div>
  )
}
