import { supabase } from '../../lib/supabaseClient'
export default async function handler(req, res){
  // On the client, call supabase.auth.getSession() to get access_token properly.
  // This endpoint is just a placeholder and returns 400.
  res.status(400).send('Use client-side supabase.auth.getSession() to obtain token')
}
