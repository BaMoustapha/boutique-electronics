import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
      <Link href="/" className="hover:text-blue-700 transition">Accueil</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-gray-300" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-blue-700 transition">{item.label}</Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
