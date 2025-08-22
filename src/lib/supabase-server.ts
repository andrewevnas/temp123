// src/lib/supabase-server.ts
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export function supabaseServer() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !/^https?:\/\//i.test(SUPABASE_URL)) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing/invalid (must be a full https:// URL).')
  }
  if (!SUPABASE_ANON_KEY) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')

  // cookies() returns a Promise, so we need to await it
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      async get(name: string) {
        const cookieStore = await cookies();
        return cookieStore.get(name)?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        const cookieStore = await cookies();
        cookieStore.set(name, value, options);
      },
      async remove(name: string, options: CookieOptions) {
        const cookieStore = await cookies();
        cookieStore.set(name, '', { ...options, expires: new Date(0) });
      },
    },
  })
}
