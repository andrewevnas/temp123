'use client'

import { useEffect, useState } from 'react'

type Service = { id: string; name: string; depositPence: number; durationMin: number }
type Slot = string

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [serviceId, setServiceId] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>('')

  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // tiny fetch for services (we’ll expose via a simple route below)
    fetch('/api/services')
      .then(r => r.json())
      .then(data => setServices(data.services))
  }, [])

  async function loadSlots() {
    if (!serviceId || !date) return
    const r = await fetch(`/api/availability?serviceId=${serviceId}&date=${date}`)
    const j = await r.json()
    setSlots(j.slots || [])
    setSelectedSlot('')
  }

   async function payDeposit() {
    if (!serviceId || !selectedSlot || !customerName || !email) return
    const r = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        startsAtISO: selectedSlot,
        customerName,
        email,
        phone,
        notes,
      }),
    })

    const text = await r.text()
    let j: any
    try { j = JSON.parse(text) } catch { j = { error: text || 'Invalid server response' } }

    if (r.ok && j.checkoutUrl) window.location.href = j.checkoutUrl
    else alert(j.error || 'Something went wrong')
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Book your appointment</h1>

      <label className="block mb-2">Service</label>
      <select
        className="w-full border rounded p-2 mb-4"
        value={serviceId}
        onChange={e => setServiceId(e.target.value)}
      >
        <option value="">Select a service</option>
        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <label className="block mb-2">Date</label>
      <input type="date" className="w-full border rounded p-2 mb-4"
        value={date} onChange={e => setDate(e.target.value)} />

      <button className="rounded-full px-4 py-2 border mb-6" onClick={loadSlots}>Check availability</button>

      {slots.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 font-medium">Available times</div>
          <div className="flex flex-wrap gap-2">
            {slots.map((iso) => (
              <button key={iso}
                className={`px-3 py-2 rounded border ${selectedSlot === iso ? 'bg-black text-white' : ''}`}
                onClick={() => setSelectedSlot(iso)}
              >
                {new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 mb-6">
        <input className="border rounded p-2" placeholder="Full name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
        <input className="border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded p-2" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea className="border rounded p-2" placeholder="Notes (party size, venue, ready-by time, preferences…)" value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>

      <button className="bg-black text-white rounded-full px-6 py-3" onClick={payDeposit}>
        Pay deposit & confirm
      </button>
    </main>
  )
}
