import { supabaseServer } from './supabase-server'
import { isAdmin } from './is-admin'

export async function requireAdmin() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) throw new Error('UNAUTHORIZED')
  return user
}
