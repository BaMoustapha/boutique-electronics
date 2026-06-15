import Link from 'next/link'
import { Phone, MessageCircle, MapPin, Clock, Mail, Facebook, Instagram } from 'lucide-react'
import { PHONE_NUMBER, WHATSAPP_NUMBER, CONTACT_EMAIL, OPENING_HOURS, SHOP_ADDRESS, SOCIAL_LINKS, SITE_NAME } from '@/utils/constants'

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export function Footer() {
  const waHelpLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, j'ai besoin d'aide pour commander un produit.")}`

  return (
    <footer className="bg-text-primary text-white/60">
      {/* Pre-footer WhatsApp CTA — high-intent conversion strip */}
      <div className="bg-[#E63946]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-display font-bold text-[17px] leading-tight">
              Besoin d'aide pour commander ?
            </p>
            <p className="text-white/80 text-sm font-body mt-0.5">
              Notre équipe répond en moins de 5 minutes sur WhatsApp
            </p>
          </div>
          <a
            href={waHelpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 h-10 px-5 bg-white text-[#E63946] font-display font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            {WA_ICON}
            Contacter sur WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect width="36" height="36" rx="8" fill="#2a2a45"/>
                <path d="M21 5L11 20h7.5L14 31l12-16h-7.5L21 5z" fill="#E63946"/>
                <circle cx="28" cy="9" r="2" fill="#F59E0B"/>
              </svg>
              <div>
                <p className="font-bold text-white leading-tight font-display text-sm">
                  Boutique <span className="text-[#E63946]">Electronics</span>
                </p>
                <p className="text-[11px] text-white/50 font-body">High-tech · Dakar, Sénégal</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 font-body">
              Votre spécialiste en électronique et électroménager à Dakar. Commandez via WhatsApp, livraison rapide.
            </p>
            <div className="flex gap-2 mt-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                <Facebook size={15} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors">
                <Instagram size={15} />
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 hover:bg-whatsapp flex items-center justify-center text-white transition-colors">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Catalogue */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-[11px] uppercase tracking-[0.1em]">Catalogue</h3>
            <ul className="space-y-2.5 text-sm font-body">
              {[
                { href: '/catalogue/smartphones', label: 'Smartphones' },
                { href: '/catalogue/informatique', label: 'Ordinateurs & Tablettes' },
                { href: '/catalogue/televiseurs', label: 'Téléviseurs' },
                { href: '/catalogue/electromenager', label: 'Électroménager' },
                { href: '/catalogue/audio-video', label: 'Audio & Vidéo' },
                { href: '/promotions', label: '🔥 Promotions' },
                { href: '/nouveautes', label: '✨ Nouveautés' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marques */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-[11px] uppercase tracking-[0.1em]">Marques</h3>
            <ul className="space-y-2.5 text-sm font-body">
              {['Samsung', 'Apple', 'Huawei', 'Xiaomi', 'LG', 'Hisense', 'HP', 'Lenovo'].map((brand) => (
                <li key={brand}>
                  <Link href={`/marques/${brand.toLowerCase()}`} className="hover:text-white transition-colors">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-[11px] uppercase tracking-[0.1em]">Contact</h3>
            <ul className="space-y-3 text-sm font-body">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-[#E63946] shrink-0" />
                <span>{SHOP_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-white/40 shrink-0" />
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{PHONE_NUMBER}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-whatsapp shrink-0" />
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-white/40 shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 text-white/40 shrink-0" />
                <div>
                  <p>{OPENING_HOURS.weekdays}</p>
                  <p>{OPENING_HOURS.sunday}</p>
                </div>
              </li>
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center mt-5 h-9 px-4 bg-[#E63946] hover:bg-primary-dark text-white text-sm font-display font-semibold rounded-md transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-4 text-center text-[11px] text-white/30 font-body">
        © {new Date().getFullYear()} {SITE_NAME} — Tous droits réservés · Dakar, Sénégal
      </div>
    </footer>
  )
}
