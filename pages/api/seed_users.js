// Serverless API route to seed users and profiles using SUPABASE_SERVICE_ROLE_KEY
import { createClient } from '@supabase/supabase-js'
export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production' && !req.headers['x-admin-secret']) {
    return res.status(401).json({ error: 'Missing admin secret in production' })
  }
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!serviceRole) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabase = createClient(url, serviceRole)
  try {
    // Example users to create - change as needed
    const users = [
      { email: 'admin@local.test', password: 'Admin123!', full_name: 'Admin Usuario', role: 'admin' },
      { email: 'tecnico@local.test', password: 'Tec12345!', full_name: 'Tecnico Usuario', role: 'tecnico' },
      { email: 'viewer@local.test', password: 'View12345!', full_name: 'Visualizador Usuario', role: 'visualizador' },
    ]
    const created = []
    for(const u of users){
      // create auth user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      })
      if(userError) {
        // If user exists, try to find by email
        const { data: existing } = await supabase.from('profiles').select('id').eq('email', u.email).limit(1).maybeSingle()
        if(existing && existing.id) {
          created.push({ email: u.email, id: existing.id, note: 'already existed' })
          continue
        }
        // otherwise continue
      }
      const userId = userData?.user?.id
      if(userId){
        // insert profile
        await supabase.from('profiles').upsert({ id: userId, full_name: u.full_name, role: u.role })
        created.push({ email: u.email, id: userId })
      }
    }
    return res.status(200).json({ ok: true, created })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: String(err) })
  }
}
