import { toast } from 'sonner'

export const notify = {
  cartAdd: (productName: string) =>
    toast.success(`Ajouté au panier`, {
      description: productName,
      icon: '🛒',
    }),

  cartRemove: (productName: string) =>
    toast(`Retiré du panier`, {
      description: productName,
      icon: '🗑️',
    }),

  cartClear: () =>
    toast(`Panier vidé`, { icon: '🗑️' }),

  wishlistAdd: (productName: string) =>
    toast.success(`Ajouté aux favoris`, {
      description: productName,
      icon: '❤️',
    }),

  wishlistRemove: (productName: string) =>
    toast(`Retiré des favoris`, {
      description: productName,
      icon: '🤍',
    }),

  orderSuccess: (orderNumber: string) =>
    toast.success(`Commande confirmée !`, {
      description: `Numéro : ${orderNumber}`,
      duration: 5000,
      icon: '✅',
    }),

  orderError: () =>
    toast.error(`Erreur lors de la commande`, {
      description: 'Vérifiez vos informations et réessayez.',
    }),

  copyLink: () =>
    toast.success(`Lien copié !`, { icon: '🔗' }),
}
