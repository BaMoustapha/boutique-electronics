export interface OrderItemInput {
  product_id: number
  quantity: number
}

export interface OrderCreatePayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_zone: string
  delivery_address: string
  note?: string
  items: OrderItemInput[]
}

export interface OrderItemRead {
  id: number
  product_id: number
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_zone: string
  delivery_address: string
  note: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  total_amount: number
  items: OrderItemRead[]
  created_at: string
}
