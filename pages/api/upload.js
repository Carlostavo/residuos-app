import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  // Ejemplo: generar una ruta segura / validar y devolver info para upload
  // En este ejemplo simple devolvemos OK. Puedes expandirlo para firmar uploads o validar.
  res.status(200).json({ ok: true });
}
