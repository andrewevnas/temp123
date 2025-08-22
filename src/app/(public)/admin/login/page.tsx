'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const params = useSearchParams()
  const next = params.get('redirect') || '/admin'
  const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin


  async function sendMagic() {
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}` }
    })
    if (error) alert(error.message); else setSent(true)
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin login</h1>
      {sent ? (
        <p>Check your email for a sign-in link.</p>
      ) : (
        <>
          <input className="border rounded w-full p-2 mb-3"
                 placeholder="you@example.com"
                 value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="bg-black text-white rounded px-4 py-2" onClick={sendMagic}>
            Send magic link
          </button>
        </>
      )}
    </main>
  )
}
