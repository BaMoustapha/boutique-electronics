import api from './api'
import type { Order, OrderCreatePayload } from '@/types/order'

export const orderService = {
  create: async (payload: OrderCreatePayload): Promise<Order> => {
    const { data } = await api.post<Order>('/orders/', payload)
    return data
  },

  getByNumber: async (orderNumber: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${orderNumber}/`)
    return data
  },
}
