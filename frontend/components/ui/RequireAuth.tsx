// frontend/components/ui/RequireAuth.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router          = useRouter()
  const pathname        = usePathname()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand persist to rehydrate before checking auth state.
  // Without this, isAuthenticated is false on first render and causes a
  // redirect loop for logged-in users on hard reload.
  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/compte/connexion?next=${encodeURIComponent(pathname)}`)
    }
  }, [hydrated, isAuthenticated, pathname, router])

  if (!hydrated || !isAuthenticated) return null
  return <>{children}</>
}
