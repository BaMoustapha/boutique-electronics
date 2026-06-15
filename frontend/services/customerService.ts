// frontend/services/customerService.ts
import api from './api'
import type { Customer, RegisterPayload } from '@/types/customer'
import type { Order } from '@/types/order'
import type { PaginatedResponse } from '@/types/api'

export const customerService = {
  register: (data: RegisterPayload) =>
    api.post<Customer>('/customers/register/', data).then(r => r.data),

  getMe: () =>
    api.get<Customer>('/customers/me/').then(r => r.data),

  updateMe: (data: Partial<Omit<Customer, 'id' | 'email'>>) =>
    api.patch<Customer>('/customers/me/', data).then(r => r.data),

  getMyOrders: () =>
    api.get<PaginatedResponse<Order>>('/customers/me/orders/').then(r => r.data.results),

  linkOrders: () =>
    api.post<{ linked: number }>('/customers/link-orders/').then(r => r.data),
}
