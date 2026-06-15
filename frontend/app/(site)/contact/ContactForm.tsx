'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WHATSAPP_NUMBER } from '@/utils/constants'

const schema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  subject: z.string().min(3, 'Objet requis'),
  message: z.string().min(10, 'Message trop court (min 10 caractères)'),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    const text = encodeURIComponent(
      `Bonjour, je m'appelle ${data.name}.\n\n` +
        `*Objet :* ${data.subject}\n\n` +
        `${data.message}\n\n` +
        `📞 Mon numéro : ${data.phone}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
        <p className="font-bold text-gray-900 text-lg">Message envoyé !</p>
        <p className="text-gray-500 text-sm mt-1">
          Votre message a été transmis via WhatsApp. Nous vous répondrons rapidement.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-blue-700 hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
        <input
          {...register('name')}
          placeholder="Votre nom"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone / WhatsApp *</label>
        <input
          {...register('phone')}
          placeholder="+221 77 XXX XX XX"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objet *</label>
        <input
          {...register('subject')}
          placeholder="Ex: Demande de prix, disponibilité..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Votre message..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="whatsapp" className="w-full" loading={isSubmitting}>
        <Send size={16} />
        Envoyer via WhatsApp
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Le formulaire ouvre WhatsApp avec votre message pré-rempli
      </p>
    </form>
  )
}
