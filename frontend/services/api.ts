// frontend/services/api.ts
import axios from 'axios'

// Registered by authStore to keep in-memory state in sync after a token refresh.
// Avoids a circular import: api.ts doesn't import authStore.ts.
let _onTokenRefresh: ((token: string) => void) | undefined

export function setTokenRefreshCallback(fn: (token: string) => void): void {
  _onTokenRefresh = fn
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('auth-storage')
    if (raw) {
      const token = JSON.parse(raw)?.state?.accessToken as string | undefined
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// On 401: try refresh, retry original request, logout on failure
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const raw = localStorage.getItem('auth-storage')
        const state = raw ? JSON.parse(raw)?.state : null
        const refresh = state?.refreshToken as string | undefined
        if (!refresh) throw new Error('no refresh token')

        const res = await axios.post(
          `${api.defaults.baseURL}/token/refresh/`,
          { refresh }
        )
        const newAccess = res.data.access as string

        // Update both localStorage (for the request interceptor) and the
        // in-memory Zustand store (via callback) so they stay in sync.
        const stored = JSON.parse(raw!)
        stored.state.accessToken = newAccess
        localStorage.setItem('auth-storage', JSON.stringify(stored))
        _onTokenRefresh?.(newAccess)

        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch {
        localStorage.removeItem('auth-storage')
        if (typeof window !== 'undefined') {
          window.location.href = '/compte/connexion'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
