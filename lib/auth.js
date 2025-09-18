import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext({ user: null, role: 'viewer' })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('viewer')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user && mounted) {
          setUser(data.user)
          // fetch role
          const { data: r, error } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle()
          if(!error && r?.role) setRole(r.role)
        }
      } catch (e) {
        console.error('auth init', e)
      }
    })()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if(u){
        try{
          const { data: r } = await supabase.from('user_roles').select('role').eq('user_id', u.id).maybeSingle()
          setRole(r?.role ?? 'viewer')
        }catch(e){
          setRole('viewer')
        }
      } else {
        setRole('viewer')
      }
    })

    return () => {
      try { listener.subscription.unsubscribe() } catch(e){}
      mounted = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){ return useContext(AuthContext) }
