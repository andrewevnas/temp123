'use client'

export default function DeleteBlackoutButton({ id }: { id: string }) {
  async function onClick() {
    if (!confirm('Delete this blackout?')) return
    const res = await fetch(`/api/admin/availability/blackout/${id}`, { method: 'POST' })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      alert('Delete failed: ' + t)
      return
    }
    location.reload()
  }
  return (
    <button type="button" className="text-red-600 underline" onClick={onClick}>
      Delete
    </button>
  )
}
