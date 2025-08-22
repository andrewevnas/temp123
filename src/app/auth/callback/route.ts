import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { isAdmin } from '@/lib/is-admin'

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const next = url.searchParams.get('next') || '/admin'
  const code = url.searchParams.get('code')
  const token_hash = url.searchParams.get('token_hash')
  const type = (url.searchParams.get('type') || 'magiclink') as
    | 'magiclink' | 'recovery' | 'invite' | 'signup' | 'email_change'

  // Prepare the redirect response we’ll return
  const successRedirect = () => NextResponse.redirect(new URL(next, req.url))
  const backToLogin = (reason: string) => {
    const to = new URL('/admin/login', req.url)
    to.searchParams.set('error', reason)
    return NextResponse.redirect(to)
  }

  // Build a Supabase server client that reads cookies from the request
  // and WRITES them onto the response we return.
  const buildClientOn = (res: NextResponse) =>
    createServerClient(URL_, ANON, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options, expires: new Date(0) })
        },
      },
    })

  // We’ll decide success vs error first, then attach cookies to THAT response.
  let res = successRedirect()
  try {
    const supabase = buildClientOn(res)

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    } else if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (error) throw error
    } else {
      // No auth params – just bounce to login
      return backToLogin('missing_params')
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      await supabase.auth.signOut()
      res = backToLogin('unauthorized')
      return res
    }

    // success: cookies already written to `res` by the client’s cookie adapter
    return res
  } catch {
    res = backToLogin('link')
    return res
  }
}
