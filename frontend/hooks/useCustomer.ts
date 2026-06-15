'use client'

import { useQuery } from '@tanstack/react-query'
import { customerService } from '@/services/customerService'
import { useAuthStore } from '@/store/authStore'

export function useMyOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey:  ['my-orders'],
    queryFn:   customerService.getMyOrders,
    enabled:   isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}
