'use client'

import { useState, useCallback } from 'react'
import type { Service, BookingFormData, CheckoutResponse, ValidationError } from '@/types/booking'

export function useBooking() {
  const [services, setServices] = useState<Service[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/services', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Failed to load services: ${response.status}`)
      }
      
      const data = await response.json()
      setServices(data.services || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load services'
      setError(message)
      console.error('Error loading services:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSlots = useCallback(async (serviceId: string, date: string) => {
    if (!serviceId || !date) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/availability?serviceId=${serviceId}&date=${date}`)
      if (!response.ok) {
        throw new Error('Failed to load available times')
      }
      
      const data = await response.json()
      setSlots(data.slots || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load available times'
      setError(message)
      console.error('Error loading slots:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const validateForm = useCallback((formData: BookingFormData): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!formData.serviceId) {
      errors.push({ field: 'serviceId', message: 'Please select a service' })
    }
    if (!formData.startsAtISO) {
      errors.push({ field: 'startsAtISO', message: 'Please select a time slot' })
    }
    if (!formData.customerName.trim()) {
      errors.push({ field: 'customerName', message: 'Full name is required' })
    }
    if (!formData.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }

    return errors
  }, [])

  const createCheckout = useCallback(async (formData: BookingFormData): Promise<CheckoutResponse> => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors([])

      // Validate form
      const errors = validateForm(formData)
      if (errors.length > 0) {
        setValidationErrors(errors)
        return { error: 'Please fix the form errors' }
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const text = await response.text()
      let result: CheckoutResponse
      
      try {
        result = JSON.parse(text)
      } catch {
        result = { error: text || 'Invalid server response' }
      }

      if (!response.ok) {
        setError(result.error || 'Something went wrong')
        return result
      }

      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
      return { error: message }
    } finally {
      setLoading(false)
    }
  }, [validateForm])

  const getFieldError = useCallback((fieldName: string) => {
    return validationErrors.find(err => err.field === fieldName)?.message
  }, [validationErrors])

  return {
    services,
    slots,
    loading,
    error,
    validationErrors,
    loadServices,
    loadSlots,
    createCheckout,
    getFieldError,
    clearError: () => setError(null)
  }
}