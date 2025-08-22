'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const params = useSearchParams()

  const next = params.get('redirect') || '/admin'
  const site =
  typeof window !== 'undefined'
    ? window.location.origin                 // ✅ always correct on whatever domain the user is on
    : (process.env.NEXT_PUBLIC_SITE_URL || '') // SSR fallback
    
  async function sendMagic() {
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) alert(error.message)
    else setSent(true)
  }

  const error = params.get('error')

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin login</h1>

      {error === 'unauthorized' && (
        <div className="mb-3 text-sm text-red-600">
          This email isn’t authorized for admin.
        </div>
      )}
      {error === 'link' && (
        <div className="mb-3 text-sm text-red-600">
          Login link invalid or expired. Try again.
        </div>
      )}

      {sent ? (
        <p>Check your email for a sign-in link.</p>
      ) : (
        <>
          <input
            className="border rounded w-full p-2 mb-3"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <button
            className="bg-black text-white rounded px-4 py-2"
            onClick={sendMagic}
          >
            Send magic link
          </button>
        </>
      )}
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="max-w-md mx-auto p-6">Loading…</main>}>
      <LoginForm />
    </Suspense>
  )
}
