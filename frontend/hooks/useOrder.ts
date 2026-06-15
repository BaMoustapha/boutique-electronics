import { useMutation, useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import type { OrderCreatePayload } from '@/types/order'

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: OrderCreatePayload) => orderService.create(payload),
  })
}

export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => orderService.getByNumber(orderNumber),
    enabled: !!orderNumber,
  })
}
