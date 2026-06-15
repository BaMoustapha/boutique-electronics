// frontend/types/customer.ts
export interface Customer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  default_address: string
  default_zone: string
}

export interface RegisterPayload {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
}
