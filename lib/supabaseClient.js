import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
  console.warn('Supabase env vars not configured.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function loadPage(name){
  const { data, error } = await supabase.from('paginas').select('contenido_json').eq('nombre', name).maybeSingle()
  if(error) throw error
  return data?.contenido_json ?? null
}

// Client-side save uses API route; direct upsert is also available if RLS/policies permit.
