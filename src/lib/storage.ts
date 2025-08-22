import { supabaseBrowser } from './supabase-browser'

export async function uploadImage(file: File) {
  const supabase = supabaseBrowser()
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `portfolio/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
  return { path, url: data.publicUrl }
}
