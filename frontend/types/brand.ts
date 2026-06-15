export interface Brand {
  id: number
  name: string
  slug: string
  logo: string | null
  is_featured: boolean
  description?: string
  product_count?: number
}
