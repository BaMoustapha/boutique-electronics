// frontend/app/(site)/compte/profil/page.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User } from 'lucide-react'
import { RequireAuth } from '@/components/ui/RequireAuth'
import { useAuthStore } from '@/store/authStore'
import { DELIVERY_ZONES } from '@/utils/constants'
import { toast } from 'sonner'

const schema = z.object({
  first_name:      z.string().min(1, 'Prénom requis'),
  last_name:       z.string().min(1, 'Nom requis'),
  phone:           z.string().min(8, 'Numéro invalide'),
  default_address: z.string().optional(),
  default_zone:    z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full border border-border rounded-md px-3 py-2.5 text-sm text-text-primary bg-surface focus:outline-none focus:border-primary transition'

function ProfilForm() {
  const customer      = useAuthStore((s) => s.customer)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (customer) reset({
      first_name:      customer.first_name,
      last_name:       customer.last_name,
      phone:           customer.phone,
      default_address: customer.default_address,
      default_zone:    customer.default_zone,
    })
  }, [customer, reset])

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data)
      toast.success('Profil mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Infos personnelles */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="font-semibold text-text-primary font-display mb-4">Informations personnelles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Prénom</label>
            <input {...register('first_name')} className={inputClass} />
            {errors.first_name && <p className="text-danger text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Nom</label>
            <input {...register('last_name')} className={inputClass} />
            {errors.last_name && <p className="text-danger text-xs mt-1">{errors.last_name.message}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <input value={customer?.email ?? ''} disabled className={`${inputClass} bg-surface-alt text-text-muted cursor-not-allowed`} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Téléphone</label>
          <input {...register('phone')} type="tel" className={inputClass} />
          {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Adresse par défaut */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="font-semibold text-text-primary font-display mb-4">Adresse par défaut</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Zone de livraison</label>
            <select {...register('default_zone')} className={inputClass}>
              <option value="">— Choisir une zone —</option>
              {DELIVERY_ZONES.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Adresse complète</label>
            <textarea {...register('default_address')} rows={3} className={inputClass} placeholder="Ex: Rue 10, Villa 5, Mermoz" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 px-6 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-md text-sm transition font-display"
      >
        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}

export default function ProfilPage() {
  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-surface-alt rounded-xl flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Mon profil</h1>
        </div>
        <ProfilForm />
      </div>
    </RequireAuth>
  )
}
