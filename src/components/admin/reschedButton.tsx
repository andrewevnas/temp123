'use client'

export default function ReschedButton({ id }: { id: string }) {
  async function onClick() {
    const iso = prompt('New start time (YYYY-MM-DDTHH:mm)')
    if (!iso) return
    const res = await fetch(`/api/admin/appointments/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startsAtISO: iso }),
    })
    if (!res.ok) {
      const t = await res.text()
      alert('Reschedule failed: ' + t)
      return
    }
    location.reload()
  }

  return (
    <button className="underline" onClick={onClick}>
      Reschedule
    </button>
  )
}
