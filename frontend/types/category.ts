export interface Category {
  id: number
  name: string
  slug: string
  parent: number | null
  children?: CategoryChild[]
  image: string | null
  icon: string
  description?: string
  order: number
  product_count?: number
}

export interface CategoryChild {
  id: number
  name: string
  slug: string
  icon: string
  image: string | null
  order: number
}
