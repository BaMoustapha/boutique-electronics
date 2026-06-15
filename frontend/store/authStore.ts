// frontend/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api, { setTokenRefreshCallback } from '@/services/api'
import { customerService } from '@/services/customerService'
import type { Customer, RegisterPayload } from '@/types/customer'

interface AuthStore {
  customer: Customer | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<Omit<Customer, 'id' | 'email'>>) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer:        null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post<{ access: string; refresh: string }>(
          '/token/', { email, password }
        )
        set({ accessToken: res.data.access, refreshToken: res.data.refresh })
        const customer = await customerService.getMe()
        set({ customer, isAuthenticated: true })
        // link orders in background — don't block login on this
        customerService.linkOrders().catch(() => {})
      },

      register: async (data) => {
        await customerService.register(data)
        await get().login(data.email, data.password)
      },

      logout: () => set({
        customer:        null,
        accessToken:     null,
        refreshToken:    null,
        isAuthenticated: false,
      }),

      updateProfile: async (data) => {
        const customer = await customerService.updateMe(data)
        set({ customer })
      },
    }),
    { name: 'auth-storage' }
  )
)

// Keep api.ts in sync when it refreshes a token (avoids circular import)
setTokenRefreshCallback((token: string) => useAuthStore.setState({ accessToken: token }))
