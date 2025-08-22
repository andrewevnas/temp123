import { cookies } from 'next/headers'

export default function AdminLogin({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = searchParams?.next || '/admin/appointments'
  const error = searchParams?.error

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFAF7] p-6">
      <form action="/api/admin/login" method="POST" className="bg-white rounded-2xl shadow p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Admin login</h1>
        {error ? <p className="text-red-600 text-sm mb-2">Incorrect password.</p> : null}
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm mb-1">Password</label>
        <input name="password" type="password" className="w-full border rounded p-2 mb-4" placeholder="••••••••" required />
        <button className="w-full rounded-full bg-black text-white py-2">Sign in</button>
        <p className="text-xs text-gray-500 mt-4">For Emily only.</p>
      </form>
    </main>
  )
}
