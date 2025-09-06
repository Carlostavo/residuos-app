// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están definidas.')
}

// Cliente público para el lado del cliente (Navegador)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Opcional: Para el lado del servidor/Middleware si usas auth-helpers (más profesional)
// Revisa la documentación de Supabase Auth Helpers para la configuración de Next.js.
// Por simplicidad en este ejemplo, nos enfocaremos en el cliente público.