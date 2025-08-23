'use client'

export default function DeleteServiceButton({ id }: { id: string }) {
  async function onClick() {
    if (!confirm('Delete this service? Existing appointments remain but the service disappears from booking.')) {
      return
    }
    const res = await fetch(`/api/admin/services/${id}/delete`, { method: 'POST' })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      alert('Delete failed. ' + txt)
      return
    }
    // refresh the list
    window.location.reload()
  }

  return (
    <button type="button" className="text-red-600 underline" onClick={onClick}>
      Delete
    </button>
  )
}
