'use client'
import { useState } from 'react'
import { uploadImage } from '@/lib/storage'

export default function Looks() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Bridal')
  const [files, setFiles] = useState<FileList | null>(null)

  async function createLook() {
    if (!title || !files?.length) return
    const uploads = await Promise.all([...files].map(uploadImage))
    const res = await fetch('/api/admin/looks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, images: uploads.map(u => u.url) })
    })
    if (res.ok) location.reload(); else alert('Failed to create')
  }

  return (
    <main className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">New Look</h1>
      <input className="border rounded p-2 w-full mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <select className="border rounded p-2 w-full mb-2" value={category} onChange={e=>setCategory(e.target.value)}>
        {['Bridal','Bridal Party','Formal','Editorial','Before & After'].map(c=> <option key={c}>{c}</option>)}
      </select>
      <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} className="mb-3" />
      <button className="bg-black text-white rounded px-4 py-2" onClick={createLook}>Create</button>
    </main>
  )
}
