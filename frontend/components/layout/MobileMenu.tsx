'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronRight, MessageCircle, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategories } from '@/hooks/useCategories'
import { SearchBar } from '@/components/ui/SearchBar'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '@/utils/constants'
import type { Category } from '@/types/category'

function MobileCategoryItem({ category, onClose }: { category: Category; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const hasChildren = category.children && category.children.length > 0

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={`/catalogue/${category.slug}`}
          onClick={onClose}
          className="flex-1 px-4 py-3 text-sm font-medium text-gray-800 hover:text-blue-700"
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="p-3 text-gray-500"
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50"
          >
            {category.children!.map((child) => (
              <Link
                key={child.id}
                href={`/catalogue/${child.slug}`}
                onClick={onClose}
                className="block pl-8 pr-4 py-2.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: categories = [] } = useCategories()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-blue-700 text-lg">Menu</span>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <SearchBar onClose={onClose} />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {categories.map((category) => (
                <MobileCategoryItem key={category.id} category={category} onClose={onClose} />
              ))}
              <Link href="/promotions" onClick={onClose} className="block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                🔥 Promotions
              </Link>
              <Link href="/nouveautes" onClick={onClose} className="block px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50">
                ✨ Nouveautés
              </Link>
              <Link href="/suivi" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                📦 Suivi de commande
              </Link>
              <Link href="/wishlist" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                ❤️ Ma wishlist
              </Link>
<Link href="/contact" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                📍 Contact
              </Link>
            </div>

            <div className="p-4 border-t border-gray-100 space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium justify-center"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 border border-blue-700 text-blue-700 rounded-xl text-sm font-medium justify-center"
              >
                <Phone size={16} /> {PHONE_NUMBER}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
