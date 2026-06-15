'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Heart, Phone, MessageCircle, ShoppingCart, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from '@/components/ui/SearchBar'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { PHONE_NUMBER, WHATSAPP_NUMBER, SITE_NAME } from '@/utils/constants'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)
  const { count: wishlistCount } = useWishlist()
  const { totalItems: cartCount } = useCart()
  const { customer, isAuthenticated, logout } = useAuthStore()

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        {/* Top bar — ticker défilant */}
        <div className="bg-text-primary text-white text-[11px] py-1.5 hidden md:flex items-center overflow-hidden relative">
          {/* Ticker gauche */}
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-0">
              {[0, 1].map((i) => (
                <span key={i} className="flex items-center gap-6 pr-6">
                  <span className="flex items-center gap-1.5 text-white/70"><span className="text-[#E63946]">⚡</span> Livraison Dakar 24–48h</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/70">Paiement à la livraison</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/70">Garantie sur tous les produits</span>
                  <span className="text-white/30">·</span>
                  <span className="flex items-center gap-1.5 text-white/70"><span className="text-[#F59E0B]">🏷️</span> Jusqu'à -40% de réduction</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/70">Commandez via WhatsApp</span>
                  <span className="text-white/30">·</span>
                </span>
              ))}
            </div>
          </div>
          {/* Contacts fixes à droite */}
          <div className="shrink-0 flex items-center gap-4 pl-4 pr-4 border-l border-white/10">
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:text-white/80 transition-colors text-white/60">
              <Phone size={11} /> {PHONE_NUMBER}
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-whatsapp hover:text-green-400 transition-colors font-semibold">
              <MessageCircle size={11} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="lg:hidden p-2 rounded hover:bg-surface-alt text-text-secondary transition"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect width="36" height="36" rx="8" fill="#1A1A2E"/>
              <path d="M21 5L11 20h7.5L14 31l12-16h-7.5L21 5z" fill="#E63946"/>
              <circle cx="28" cy="9" r="2" fill="#F59E0B"/>
            </svg>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-text-primary leading-tight font-display tracking-tight">
                Boutique <span className="text-[#E63946]">Electronics</span>
              </p>
              <p className="text-[11px] text-text-muted leading-tight font-body">High-tech · Dakar, Sénégal</p>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded hover:bg-surface-alt text-text-secondary hover:text-[#E63946] transition"
              title="Favoris"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.25 h-4.25 bg-[#E63946] text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1 font-display">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/panier"
              className="relative p-2.5 rounded hover:bg-surface-alt text-text-secondary hover:text-text-primary transition"
              title="Panier"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.25 h-4.25 bg-[#E63946] text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1 font-display">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && customer ? (
              <div
                className="relative"
                tabIndex={-1}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setAuthMenuOpen(false)
                  }
                }}
              >
                <button
                  onClick={() => setAuthMenuOpen((v) => !v)}
                  className="flex items-center gap-1 p-1.5 rounded hover:bg-surface-alt transition"
                  aria-label="Mon compte"
                >
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-bold font-display uppercase">
                    {(customer.first_name[0] ?? '') + (customer.last_name[0] ?? '')}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-text-muted transition-transform ${authMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {authMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border-light">
                      <p className="text-[13px] font-semibold text-text-primary font-display truncate">
                        {customer.first_name} {customer.last_name}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">{customer.email}</p>
                    </div>
                    <Link
                      href="/compte/profil"
                      onClick={() => setAuthMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                    >
                      <Settings size={14} /> Mon profil
                    </Link>
                    <Link
                      href="/compte/commandes"
                      onClick={() => setAuthMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                    >
                      <ShoppingCart size={14} /> Mes commandes
                    </Link>
                    <div className="border-t border-border-light mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { logout(); setAuthMenuOpen(false) }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-alt w-full transition-colors"
                      >
                        <LogOut size={14} /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/compte/connexion"
                className="flex items-center gap-1.5 p-2.5 rounded hover:bg-surface-alt text-text-secondary hover:text-text-primary transition"
                title="Connexion"
              >
                <User size={20} />
                <span className="hidden md:inline text-[13px] font-display font-semibold">Connexion</span>
              </Link>
            )}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 ml-2 h-9 px-4 bg-whatsapp hover:bg-whatsapp-dark text-white text-sm font-semibold rounded-md transition-colors font-display"
            >
              <MessageCircle size={16} />
              Commander
            </a>
          </div>
        </div>

        {/* Search mobile */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>

        {/* Mega menu */}
        <div className="border-t border-border-light hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <MegaMenu />
          </div>
        </div>
      </header>

      {/* WhatsApp floating button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105"
        title="Commander sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
