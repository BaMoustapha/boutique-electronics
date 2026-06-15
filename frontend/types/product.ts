import type { CategoryChild } from './category'
import type { Brand } from './brand'

export interface ProductImage {
  id: number
  image: string
  alt_text: string
  is_primary: boolean
  order: number
}

export interface Product {
  id: number
  name: string
  slug: string
  category: CategoryChild
  brand: Brand | null
  price: number
  old_price: number | null
  discount_percent: number
  is_on_sale: boolean
  description: string
  specifications: Record<string, string>
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order'
  stock_quantity: number | null
  is_featured: boolean
  is_new: boolean
  images: ProductImage[]
  primary_image: string | null
  views_count: number
  created_at: string
  updated_at: string
}
