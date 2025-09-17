import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export async function loadFromSupabase(pageName){
  try{
    const { data, error } = await supabase.from('paginas').select('contenido_html').eq('nombre', pageName).maybeSingle()
    if(error) throw error
    return data?.contenido_html ?? null
  }catch(e){
    console.error('loadFromSupabase', e)
    throw e
  }
}
export async function saveToSupabase(pageName, htmlContent){
  try{
    const user = (await supabase.auth.getUser()).data?.user
    const payload = { nombre: pageName, contenido_html: htmlContent, actualizado: new Date().toISOString(), actualizado_por: user?.id ?? null }
    const { error } = await supabase.from('paginas').upsert([payload], { onConflict: ['nombre'] })
    if(error) throw error
  }catch(e){
    console.error('saveToSupabase', e)
    throw e
  }
}
