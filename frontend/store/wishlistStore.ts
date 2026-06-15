import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }))
        }
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) }))
      },

      isInWishlist: (productId) => get().items.some((p) => p.id === productId),

      clear: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
)
