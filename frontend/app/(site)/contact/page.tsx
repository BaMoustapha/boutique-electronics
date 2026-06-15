import type { Metadata } from 'next'
import { Phone, MessageCircle, MapPin, Clock, Mail, Facebook, Instagram } from 'lucide-react'
import { PHONE_NUMBER, WHATSAPP_NUMBER, CONTACT_EMAIL, DELIVERY_ZONES, OPENING_HOURS } from '@/utils/constants'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Boutique Electronics Sénégal Dakar',
  description:
    'Contactez-nous via WhatsApp, téléphone ou e-mail. Livraison à Dakar et banlieue. Boutique physique à Dakar.',
}

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite avoir des informations sur vos produits.')}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Contactez-nous</h1>
        <p className="text-gray-500 mt-2">
          Nous sommes disponibles pour répondre à toutes vos questions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Infos */}
        <div className="space-y-6">
          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-green-500 rounded-full p-3">
              <MessageCircle className="text-white" size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">WhatsApp (recommandé)</p>
              <p className="text-sm text-gray-600 mb-3">
                Le moyen le plus rapide de nous joindre. Réponse en quelques minutes.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                <MessageCircle size={16} />
                Écrire sur WhatsApp
              </a>
            </div>
          </div>

          {/* Téléphone */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-blue-700 rounded-full p-3">
              <Phone className="text-white" size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Téléphone</p>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                className="text-blue-700 font-semibold hover:underline"
              >
                {PHONE_NUMBER}
              </a>
              <p className="text-sm text-gray-500 mt-1">Appel direct pendant les heures d&apos;ouverture</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-red-50 rounded-full p-3">
              <Mail className="text-[#E63946]" size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#E63946] font-semibold hover:underline text-sm"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-gray-100 rounded-full p-3">
              <Clock className="text-gray-600" size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">Horaires d&apos;ouverture</p>
              <ul className="space-y-1">
                <li className="text-sm text-gray-700">{OPENING_HOURS.weekdays}</li>
                <li className="text-sm text-gray-700">{OPENING_HOURS.sunday}</li>
              </ul>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-orange-100 rounded-full p-3">
              <MapPin className="text-orange-500" size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">Zones de livraison</p>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_ZONES.map((zone) => (
                  <span
                    key={zone}
                    className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-full"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Facebook size={16} />
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
            >
              <Instagram size={16} />
              Instagram
            </a>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Mail size={20} className="text-blue-700" />
              <h2 className="font-bold text-gray-900 text-lg">Envoyer un message</h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
