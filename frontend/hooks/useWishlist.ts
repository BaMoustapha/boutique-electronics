import { useWishlistStore } from '@/store/wishlistStore'
import { notify } from '@/utils/toasts'
import type { Product } from '@/types/product'

export function useWishlist() {
  const { items, addItem, removeItem, isInWishlist, clear } = useWishlistStore()

  const toggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id)
      notify.wishlistRemove(product.name)
    } else {
      addItem(product)
      notify.wishlistAdd(product.name)
    }
  }

  return { items, toggle, removeItem, isInWishlist, clear, count: items.length }
}
