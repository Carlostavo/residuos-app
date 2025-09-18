'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) fetchRole(session.user.id)
      setLoading(false)
    })

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) fetchRole(session.user.id)
      else setRole(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchRole = async (user_id) => {
    let { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user_id)
      .single()
    if (!error) setRole(data.role)
  }

  return { session, loading, role }
}
