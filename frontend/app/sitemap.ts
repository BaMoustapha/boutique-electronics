import type { MetadataRoute } from 'next'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { brandService } from '@/services/brandService'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/promotions`,   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/nouveautes`,   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/catalogue/all`,lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/wishlist`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/panier`,       lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/contact`,      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/suivi`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Produits
  let productPages: MetadataRoute.Sitemap = []
  try {
    const { results, count } = await productService.getAll({ page_size: 1000 } as never)
    const allProducts = count > results.length
      ? (await productService.getAll({ page_size: count } as never)).results
      : results

    productPages = allProducts.map((p) => ({
      url: `${BASE}/produit/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly' as const,
      priority: p.is_featured ? 0.9 : 0.7,
    }))
  } catch { /* silencieux si l'API est indisponible */ }

  // Catégories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await categoryService.getAll()
    categoryPages = categories.flatMap((cat) => {
      const pages: MetadataRoute.Sitemap = [{
        url: `${BASE}/catalogue/${cat.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }]
      if (cat.children) {
        cat.children.forEach((child) => {
          pages.push({
            url: `${BASE}/catalogue/${child.slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          })
        })
      }
      return pages
    })
  } catch { /* silencieux */ }

  // Marques
  let brandPages: MetadataRoute.Sitemap = []
  try {
    const brands = await brandService.getAll()
    brandPages = brands.map((b) => ({
      url: `${BASE}/marques/${b.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch { /* silencieux */ }

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages]
}
