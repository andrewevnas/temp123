'use client'

import { useEffect, useState } from 'react'
import { useBooking } from '@/hooks/useBooking'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { BookingFormData } from '@/types/booking'

export default function BookingWidget() {
  const {
    services,
    slots,
    loading,
    error,
    loadServices,
    loadSlots,
    createCheckout,
    getFieldError,
    clearError
  } = useBooking()

  const [serviceId, setServiceId] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleLoadSlots = async () => {
    if (!serviceId || !date) return
    await loadSlots(serviceId, date)
    setSelectedSlot('')
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    clearError()

    const formData: BookingFormData = {
      serviceId,
      startsAtISO: selectedSlot,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    }

    const result = await createCheckout(formData)
    
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl
    } else {
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find(s => s.id === serviceId)
  const canSubmit = serviceId && selectedSlot && customerName.trim() && email.trim() && !isSubmitting

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="h1 mb-2">Book your appointment</h1>
        <p className="subtle">Select your service and preferred time to get started</p>
      </div>

      {error && (
        <div className="error-message mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="field-label">Service *</label>
          <select
            className={`input ${getFieldError('serviceId') ? 'form-error' : ''}`}
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a service</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} • {s.durationMin}min • £{(s.depositPence / 100).toFixed(2)} deposit
              </option>
            ))}
          </select>
          {getFieldError('serviceId') && (
            <p className="text-red-600 text-sm mt-1">{getFieldError('serviceId')}</p>
          )}
        </div>

        {/* Date Selection */}
        <div>
          <label className="field-label">Date *</label>
          <input 
            type="date" 
            className="input"
            value={date} 
            onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Check Availability Button */}
        <button 
          className={`btn btn-ghost ${loading ? 'btn-loading' : ''}`}
          onClick={handleLoadSlots}
          disabled={!serviceId || !date || loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Loading times...
            </>
          ) : (
            'Check availability'
          )}
        </button>

        {/* Available Times */}
        {slots.length > 0 && (
          <div>
            <label className="field-label">Available times *</label>
            <div className="flex flex-wrap gap-2">
              {slots.map((iso) => (
                <button 
                  key={iso}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedSlot === iso 
                      ? 'bg-ink text-white border-ink' 
                      : 'border-ink/15 hover:border-ink/35'
                  }`}
                  onClick={() => setSelectedSlot(iso)}
                >
                  {new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
            {getFieldError('startsAtISO') && (
              <p className="text-red-600 text-sm mt-1">{getFieldError('startsAtISO')}</p>
            )}
          </div>
        )}

        {slots.length === 0 && date && serviceId && !loading && (
          <div className="text-ink/60 text-sm">
            No available times for this date. Please try another date.
          </div>
        )}

        {/* Customer Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Your details</h3>
          
          <div>
            <label className="field-label">Full name *</label>
            <input 
              className={`input ${getFieldError('customerName') ? 'form-error' : ''}`}
              placeholder="Enter your full name" 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)}
            />
            {getFieldError('customerName') && (
              <p className="text-red-600 text-sm mt-1">{getFieldError('customerName')}</p>
            )}
          </div>

          <div>
            <label className="field-label">Email *</label>
            <input 
              type="email"
              className={`input ${getFieldError('email') ? 'form-error' : ''}`}
              placeholder="your@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
            {getFieldError('email') && (
              <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="field-label">Phone (optional)</label>
            <input 
              type="tel"
              className="input"
              placeholder="Your phone number" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Additional notes</label>
            <textarea 
              className="textarea"
              rows={3}
              placeholder="Party size, venue, ready-by time, special requests, etc."
              value={notes} 
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Summary & Submit */}
        {selectedService && selectedSlot && (
          <div className="card p-6 bg-blush/50">
            <h3 className="font-medium mb-3">Booking summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & time:</span>
                <span className="font-medium">
                  {new Date(selectedSlot).toLocaleDateString()} at{' '}
                  {new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{selectedService.durationMin} minutes</span>
              </div>
              <div className="rule my-3"></div>
              <div className="flex justify-between font-medium">
                <span>Deposit required:</span>
                <span>£{(selectedService.depositPence / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <button 
          className={`btn btn-primary w-full ${isSubmitting ? 'btn-loading' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            'Pay deposit & confirm booking'
          )}
        </button>

        <p className="text-xs text-ink/60 text-center">
          You'll be redirected to Stripe to securely pay your deposit. 
          Remaining balance due on appointment day.
        </p>
      </div>
    </main>
  )
}
