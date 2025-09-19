'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchRole(session.user.id)
      } else {
        setRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchRole = async (user_id) => {
    try {
      let { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user_id)
        .single()

      if (!error && data) {
        setRole(data.role)
      } else {
        setRole(null)
      }
    } catch (error) {
      console.error('Error fetching role:', error)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  return { session, role, loading }
}
