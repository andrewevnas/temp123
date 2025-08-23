'use client'

import { useEffect, useMemo, useState } from 'react'

type Props = {
  appointmentId: string
  serviceId: string
  currentStartISO: string
}

type SlotsResponse = { slots: string[] }

export default function RescheduleModal({ appointmentId, serviceId, currentStartISO }: Props) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(() => currentStartISO.slice(0, 10)) // YYYY-MM-DD
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSlots = async () => {
    if (!serviceId || !date) return
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)
      if (!r.ok) throw new Error(await r.text())
      const j = (await r.json()) as SlotsResponse
      setSlots(j.slots || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load slots')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) void loadSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, date, serviceId])

  async function chooseSlot(startsAtISO: string) {
    try {
      setLoading(true)
      setError(null)
      const r = await fetch(`/api/admin/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startsAtISO }),
      })
      if (!r.ok) throw new Error(await r.text())
      // success → reload the page to reflect new time
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reschedule failed')
    } finally {
      setLoading(false)
    }
  }

  const currentDay = useMemo(() => currentStartISO.slice(0, 10), [currentStartISO])

  return (
    <>
      <button className="underline" onClick={() => setOpen(true)}>Reschedule</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Reschedule appointment</h2>
              <button className="text-gray-500" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded p-2"
              />
              <button onClick={loadSlots} className="border rounded px-3 py-2">Refresh</button>
            </div>

            {loading && <div className="text-sm text-gray-600 mb-2">Loading…</div>}
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {slots.length === 0 && !loading && (
                <div className="col-span-3 text-sm text-gray-500">No slots for this date.</div>
              )}
              {slots.map((iso) => {
                const label = new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const isCurrent = iso === currentStartISO
                return (
                  <button
                    key={iso}
                    className={`border rounded px-3 py-2 text-sm ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    disabled={isCurrent || loading}
                    onClick={() => chooseSlot(iso)}
                    title={new Date(iso).toLocaleString()}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 text-right">
              <button className="border rounded px-3 py-2" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
