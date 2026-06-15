import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function PromoBanner() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1A1A2E]">
      {/* Bande rouge diagonale signature */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(-55deg, #E63946 0px, #E63946 12px, transparent 12px, transparent 32px)',
          opacity: 0.12,
        }}
      />
      {/* Bloc rouge plein à droite */}
      <div className="absolute top-0 right-0 bottom-0 w-2/5 bg-[#E63946] hidden sm:block" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6">
        {/* Gauche : texte */}
        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-[#E63946] rounded flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-[0.08em] font-display">
              Offres limitées
            </p>
          </div>
          <h3 className="text-white text-[26px] font-bold leading-tight font-display">
            Promotions en cours
          </h3>
          <p className="text-white/60 text-sm mt-1.5 font-body">
            Jusqu'à <span className="text-[#E63946] font-bold text-base">-40%</span> sur une sélection de produits
          </p>
        </div>

        {/* Droite : CTA */}
        <div className="z-10 shrink-0">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 h-11 px-6 bg-white text-[#E63946] hover:bg-gray-100 font-bold text-sm rounded-lg transition-colors font-display shadow-lg"
          >
            Voir les promos
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
