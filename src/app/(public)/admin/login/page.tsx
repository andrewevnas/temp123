'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const params = useSearchParams()

  const next = params.get('redirect') || '/admin'
  const error = params.get('error')

  async function sendMagic() {
    // ✅ compute the redirect using the domain the user is on
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || '')

    const redirectTo = new URL('/auth/callback', origin)
    redirectTo.searchParams.set('next', next)

    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo.toString() },
    })
    if (error) alert(error.message)
    else setSent(true)
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin login</h1>

      {error === 'unauthorized' && (
        <div className="mb-3 text-sm text-red-600">This email isn’t authorized for admin.</div>
      )}
      {error === 'link' && (
        <div className="mb-3 text-sm text-red-600">Login link invalid or expired. Try again.</div>
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
          <button className="bg-black text-white rounded px-4 py-2" onClick={sendMagic}>
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
