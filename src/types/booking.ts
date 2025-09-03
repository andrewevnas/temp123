export interface Service {
  id: string
  name: string
  slug: string
  durationMin: number
  basePricePence: number
  depositPence: number
  description?: string
  active: boolean
}

export interface BookingFormData {
  serviceId: string
  startsAtISO: string
  customerName: string
  email: string
  phone?: string
  notes?: string
  partySize?: number
  venue?: string
  readyByTime?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface CheckoutResponse {
  checkoutUrl?: string
  error?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: ValidationError[]
}