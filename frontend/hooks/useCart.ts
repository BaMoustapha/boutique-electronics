import { useCartStore } from '@/store/cartStore'
import { notify } from '@/utils/toasts'
import type { Product } from '@/types/product'

export function useCart() {
  const { items, addItem: storeAdd, removeItem: storeRemove, updateQuantity, isInCart, getQuantity, clear: storeClear } =
    useCartStore()

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const addItem = (product: Product, quantity = 1) => {
    storeAdd(product, quantity)
    notify.cartAdd(product.name)
  }

  const removeItem = (product: Product) => {
    storeRemove(product.id)
    notify.cartRemove(product.name)
  }

  const clear = () => {
    storeClear()
    notify.cartClear()
  }

  const toggle = (product: Product) => {
    if (isInCart(product.id)) {
      removeItem(product)
    } else {
      addItem(product)
    }
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    isInCart,
    getQuantity,
    toggle,
    clear,
    totalItems,
    totalPrice,
  }
}
