// frontend/app/(site)/compte/inscription/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

const schema = z.object({
  first_name: z.string().min(1, 'Prénom requis'),
  last_name:  z.string().min(1, 'Nom requis'),
  phone:      z.string().min(8, 'Numéro invalide'),
  email:      z.string().email('Email invalide'),
  password:   z.string().min(8, 'Minimum 8 caractères'),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full border border-border rounded-md px-3 py-2.5 text-sm text-text-primary bg-surface focus:outline-none focus:border-primary transition'

export default function InscriptionPage() {
  const register_ = useAuthStore((s) => s.register)
  const router     = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await register_(data)
      toast.success('Compte créé !')
      router.replace('/')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { email?: string[] } } })?.response?.data?.email?.[0]
        ?? 'Erreur lors de la création du compte'
      setError('email', { message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-surface-alt rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Créer un compte</h1>
          <p className="text-sm text-text-muted mt-1">Suivez vos commandes facilement</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Prénom</label>
              <input {...register('first_name')} placeholder="Mamadou" className={inputClass} />
              {errors.first_name && <p className="text-danger text-xs mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Nom</label>
              <input {...register('last_name')} placeholder="Diallo" className={inputClass} />
              {errors.last_name && <p className="text-danger text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Téléphone</label>
            <input {...register('phone')} type="tel" placeholder="77 123 45 67" className={inputClass} />
            {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input {...register('email')} type="email" placeholder="vous@exemple.com" className={inputClass} />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Mot de passe</label>
            <input {...register('password')} type="password" placeholder="Minimum 8 caractères" className={inputClass} />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-md text-sm transition font-display"
          >
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-4">
          Déjà un compte ?{' '}
          <Link href="/compte/connexion" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
