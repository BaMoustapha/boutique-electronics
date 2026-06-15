'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types/category'

function CategoryDropdown({ category }: { category: Category }) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }
  const leave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150)
  }

  const hasChildren = category.children && category.children.length > 0

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={`/catalogue/${category.slug}`}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
      >
        {category.name}
        {hasChildren && <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
      </Link>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {category.children!.map((child) => (
              <Link
                key={child.id}
                href={`/catalogue/${child.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition"
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

export function MegaMenu() {
  const { data: categories = [] } = useCategories()

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {categories.map((category) => (
        <CategoryDropdown key={category.id} category={category} />
      ))}
      <Link
        href="/promotions"
        className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition whitespace-nowrap"
      >
        🔥 Promotions
      </Link>
      <Link
        href="/nouveautes"
        className="px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition whitespace-nowrap"
      >
        ✨ Nouveautés
      </Link>
    </nav>
  )
}
