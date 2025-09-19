// lib/useAuth.js - Actualizado
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
      // Primero intenta obtener el rol desde la tabla user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user_id)
        .single()

      if (error) {
        console.error('Error fetching role from user_roles:', error)
        
        // Si no existe en user_roles, verifica si es el primer usuario (admin por defecto)
        const { count, error: countError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          
        if (countError) {
          console.error('Error counting user_roles:', countError)
          setRole(null)
          return null
        }
        
        // Si no hay usuarios en user_roles, este es el primer usuario (admin por defecto)
        if (count === 0) {
          // Insertar este usuario como admin
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert([{ user_id: user_id, role: 'admin' }])
            
          if (insertError) {
            console.error('Error creating admin role:', insertError)
            setRole(null)
            return null
          }
          
          setRole('admin')
          return 'admin'
        }
        
        setRole(null)
        return null
      }

      setRole(data?.role || null)
      return data?.role
    } catch (err) {
      console.error('Exception fetching role:', err)
      setRole(null)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

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
