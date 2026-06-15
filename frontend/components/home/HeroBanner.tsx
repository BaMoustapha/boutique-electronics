'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Smartphone, Tv, Wind, Truck, ShieldCheck, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatPrice } from '@/utils/formatPrice'

interface Slide {
  id: number
  tag: string
  title: string
  subtitle: string
  cta: string
  href: string
  bg: string
  accent: string
  productIndex: number
  DecoIcon: React.ElementType
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'Nouveautés 2025',
    title: 'Smartphones & Téléphonie',
    subtitle: 'Samsung, Tecno, Infinix — meilleurs prix à Dakar',
    cta: 'Voir les smartphones',
    href: '/catalogue/smartphones',
    bg: '#1A1A2E',
    accent: '#2563EB',
    productIndex: 0,
    DecoIcon: Smartphone,
  },
  {
    id: 2,
    tag: 'Top ventes',
    title: 'Téléviseurs 4K Smart TV',
    subtitle: 'LG, Samsung, Haier — écrans grand format à partir de 55"',
    cta: 'Découvrir les TV',
    href: '/catalogue/televiseurs',
    bg: '#16213E',
    accent: '#475569',
    productIndex: 2,
    DecoIcon: Tv,
  },
  {
    id: 3,
    tag: 'Promotion en cours',
    title: 'Climatiseurs Inverter',
    subtitle: 'LG, Midea — économiques et silencieux, installation incluse',
    cta: 'Voir les clims',
    href: '/catalogue/climatiseurs',
    bg: '#0F3460',
    accent: '#0891B2',
    productIndex: 6,
    DecoIcon: Wind,
  },
]

const TRUST_BADGES = [
  { icon: Truck, label: 'Livraison Dakar' },
  { icon: CreditCard, label: 'Paiement livraison' },
  { icon: ShieldCheck, label: 'Garantie incluse' },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const { data, isLoading } = useFeaturedProducts()
  const products = data?.results ?? []

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [paused])

  const go = (idx: number) => { setPaused(true); setCurrent(idx) }
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length)
  const next = () => go((current + 1) % SLIDES.length)

  const slide = SLIDES[current]
  const { DecoIcon } = slide
  const product = products[slide.productIndex] ?? products[0]
  const imageUrl = product ? getImageUrl(product.primary_image) : null

  return (
    <div className="relative rounded-xl overflow-hidden h-72 md:h-[420px] select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 flex"
          style={{ backgroundColor: slide.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Decorative background icon */}
          <div className="absolute -right-8 -bottom-8 opacity-[0.05] pointer-events-none">
            <DecoIcon size={320} strokeWidth={0.8} />
          </div>

          {/* Accent stripe top-left */}
          <div
            className="absolute top-0 left-0 w-1 h-full opacity-60"
            style={{ backgroundColor: slide.accent }}
          />

          {/* Left: text */}
          <div className="flex-1 flex flex-col justify-center pl-8 pr-4 md:pl-12 md:pr-6 z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="inline-block bg-[#E63946] text-white text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded mb-3 w-fit font-display"
            >
              {slide.tag}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="text-2xl md:text-[36px] font-bold text-white leading-tight mb-2 font-display max-w-xs md:max-w-sm"
            >
              {slide.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/55 text-sm mb-5 max-w-xs font-body hidden sm:block"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="flex items-center gap-3"
            >
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 h-10 px-5 bg-[#E63946] hover:bg-[#C1121F] text-white text-sm font-semibold rounded-[6px] transition-colors font-display"
              >
                {slide.cta}
              </Link>
            </motion.div>

            {/* Trust micro-badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center gap-4 mt-5"
            >
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-white/50" />
                  <span className="text-[12px] text-white/50 font-body">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: product image */}
          <div className="flex w-44 sm:w-64 md:w-80 lg:w-96 items-end justify-center pb-0 relative shrink-0">
            <AnimatePresence mode="wait">
              {imageUrl && !isLoading ? (
                <motion.div
                  key={`img-${slide.id}`}
                  className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80"
                  initial={{ opacity: 0, scale: 0.88, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, type: 'spring', stiffness: 130 }}
                >
                  <Image
                    src={imageUrl}
                    alt={product?.name ?? ''}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 208px, 300px"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-white/5 rounded-lg animate-pulse" />
              )}
            </AnimatePresence>

            {/* Product price chip */}
            {product && (
              <motion.div
                key={`chip-${slide.id}`}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 }}
                className="absolute bottom-4 right-3 md:right-5 bg-white rounded-lg px-3 py-2 shadow-xl"
              >
                <p className="text-[11px] text-[#868E96] font-body line-clamp-1 max-w-[120px]">{product.name}</p>
                <p className="text-[15px] font-bold text-[#E63946] font-display leading-tight mt-0.5">
                  {formatPrice(product.price)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition z-20"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition z-20"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#E63946] w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
