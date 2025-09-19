// lib/supabaseClient.js - Mejorado
import { createClient } from '@supabase/supabase-js'

// Validar variables de entorno
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Crear cliente Supabase con configuración optimizada
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'pae-next-app'
    }
  }
})

// Helper function para manejo de errores
export const handleSupabaseError = (error, context) => {
  console.error(`Supabase Error in ${context}:`, error)
  throw new Error(error.message || `Error en ${context}`)
}
