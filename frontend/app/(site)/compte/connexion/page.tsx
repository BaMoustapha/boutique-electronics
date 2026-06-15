// frontend/app/(site)/compte/connexion/page.tsx
'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full border border-border rounded-md px-3 py-2.5 text-sm text-text-primary bg-surface focus:outline-none focus:border-primary transition'

// Extracted so useSearchParams() is inside a Suspense boundary (Next.js 15 requirement)
function ConnexionForm() {
  const login        = useAuthStore((s) => s.login)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') ?? '/'
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      router.replace(next)
    } catch {
      setError('root', { message: 'Email ou mot de passe incorrect' })
      toast.error('Connexion échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-surface-alt rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Connexion</h1>
          <p className="text-sm text-text-muted mt-1">Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input {...register('email')} type="email" placeholder="vous@exemple.com" className={inputClass} />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Mot de passe</label>
            <input {...register('password')} type="password" placeholder="••••••••" className={inputClass} />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className="text-danger text-sm text-center">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-md text-sm transition font-display"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-4">
          Pas encore de compte ?{' '}
          <Link href="/compte/inscription" className="text-primary font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  )
}
