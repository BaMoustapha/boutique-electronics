export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Boutique Electronics Sénégal'
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221776827294'
export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '+221 77 682 72 94'
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'bam616173@gmail.com'

export const DELIVERY_ZONES = [
  'Plateau', 'Médina', 'Mermoz', 'Sacré-Cœur', 'Almadies',
  'Pikine', 'Guédiawaye', 'Thiaroye', 'Parcelles Assainies',
  'Grand Dakar', 'Ouakam', 'Yoff',
]

export const OPENING_HOURS = {
  weekdays: 'Lun – Sam : 09h00 – 20h00',
  sunday: 'Dimanche : 10h00 – 18h00',
}

export const SHOP_ADDRESS = 'Dakar, Sénégal'

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
}

export const STATUS_LABELS: Record<string, string> = {
  in_stock: 'En stock',
  low_stock: 'Stock limité',
  out_of_stock: 'Rupture de stock',
  on_order: 'Sur commande',
}

export const ORDERING_OPTIONS = [
  { value: '-created_at', label: 'Plus récents' },
  { value: 'price', label: 'Prix croissant' },
  { value: '-price', label: 'Prix décroissant' },
  { value: '-views_count', label: 'Plus populaires' },
  { value: 'name', label: 'Nom A–Z' },
]
