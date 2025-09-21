'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data?.session?.user ?? null)
      setLoading(false)
    })
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => { mounted = false; subscription?.unsubscribe() }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export function hasRole(user, roles = []) {
  if (!user) return false
  // Ajusta según dónde guardes role: aquí se busca en user_metadata.role
  const role = user?.user_metadata?.role || null
  return roles.includes(role)
}
