import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  href?: string
  hrefLabel?: string
}

export function SectionHeader({ title, subtitle, href, hrefLabel = 'Voir tout' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-[#E63946] rounded-full" />
        <div>
          <h2 className="text-[22px] font-bold text-[#1A1A2E] leading-none font-display">{title}</h2>
          {subtitle && <p className="text-sm text-[#868E96] mt-0.5 font-body">{subtitle}</p>}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-[#E63946] hover:text-[#C1121F] transition-colors group font-display"
        >
          {hrefLabel}
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}
