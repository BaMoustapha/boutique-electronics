'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <AlertTriangle size={48} className="text-[#E63946] mb-4" />
      <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">Une erreur est survenue</h1>
      <p className="text-sm text-[#868E96] mb-6 max-w-sm">
        Quelque chose s'est mal passé. Réessayez ou retournez à l'accueil.
      </p>
      {/* TEMP DEBUG — à retirer une fois la cause identifiée */}
      <pre className="text-[11px] text-left bg-[#1A1A2E] text-white/80 rounded-lg p-3 mb-6 max-w-md overflow-auto whitespace-pre-wrap">
        {error.message}
        {error.digest && `\ndigest: ${error.digest}`}
      </pre>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="h-10 px-5 bg-[#E63946] hover:bg-[#C1121F] text-white text-sm font-semibold rounded-md transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="h-10 px-5 flex items-center border border-[#DEE2E6] text-[#1A1A2E] text-sm font-semibold rounded-md hover:bg-surface-alt transition-colors"
        >
          Accueil
        </Link>
      </div>
    </div>
  )
}
