import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { productService } from '@/services/productService'
import { formatPrice } from '@/utils/formatPrice'
import { ProductDetailClient } from './ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const product = await productService.getBySlug(slug)
    const price = formatPrice(product.price)
    const title = `${product.name} — ${price} | Dakar Sénégal`
    const description =
      `${product.name} disponible à Dakar. Prix : ${price}. ${product.description.slice(0, 100)}...`

    const images = product.primary_image
      ? [{ url: product.primary_image, width: 800, height: 800, alt: product.name }]
      : []

    return {
      title,
      description,
      openGraph: {
        title: `${product.name} — ${price}`,
        description,
        url: `${siteUrl}/produit/${slug}`,
        type: 'website',
        images,
        siteName: 'Boutique Electronics Sénégal',
        locale: 'fr_SN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} — ${price}`,
        description,
        images: product.primary_image ? [product.primary_image] : [],
      },
      alternates: { canonical: `${siteUrl}/produit/${slug}` },
      other: {
        'product:price:amount': String(product.price),
        'product:price:currency': 'XOF',
      },
    }
  } catch {
    return { title: 'Produit introuvable' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  try {
    const product = await productService.getBySlug(slug)
    return <ProductDetailClient product={product} />
  } catch {
    notFound()
  }
}
