import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE)

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end('Method not allowed')
  const auth = req.headers.authorization
  if(!auth) return res.status(401).send('No auth token')
  const token = auth.split(' ')[1]
  // verify token with client anon (decode user)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if(error || !user) return res.status(401).send('Invalid token')
  // check role
  const { data: roleRow } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  const role = roleRow?.role
  if(!(role === 'admin' || role === 'tecnico')) return res.status(403).send('Insufficient role')
  const payload = req.body
  if(!payload?.nombre) return res.status(400).send('Missing name')
  try{
    const { error } = await supabaseAdmin.from('paginas').upsert([{
      nombre: payload.nombre,
      contenido_json: payload.contenido_json,
      actualizado: new Date().toISOString(),
      actualizado_por: user.id
    }], { onConflict: ['nombre'] })
    if(error) throw error
    return res.status(200).send('ok')
  }catch(e){
    console.error(e)
    return res.status(500).send('save error')
  }
}
