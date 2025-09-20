// lib/useAuth.js - Mejorado
'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const fetchRole = useCallback(async (user_id) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user_id)
        .single()

      if (error) {
        console.error('Error fetching role:', error)
        setRole(null)
        return null
      }

      setRole(data?.role || null)
      return data?.role
    } catch (error) {
      console.error('Exception fetching role:', error)
      setRole(null)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Obtener sesión actual
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchRole(currentSession.user.id)
        }
        
        setLoading(false)
      } catch (err) {
        if (mounted) {
          console.error('Exception in auth initialization:', err)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          await fetchRole(newSession.user.id)
        } else {
          setRole(null)
        }
        
        if (event === 'SIGNED_OUT') {
          setRole(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchRole])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [])

  return { 
    session, 
    role, 
    user,
    loading, 
    signOut,
    isAuthenticated: !!session,
    isAdmin: role === 'admin' 
  }
}
