// components/Layout.js
import { useState, useEffect } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import AuthModal from './AuthModal'
import { supabase } from '../lib/supabase'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('viewer')
  const [showAuth, setShowAuth] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    // Verificar sesión al cargar
    checkUser()
    
    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await checkRole(session.user.id)
        } else {
          setUser(null)
          setRole('viewer')
          setEditMode(false)
        }
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      await checkRole(user.id)
    }
  }

  const checkRole = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (data) {
      setRole(data.role)
    }
  }

  const handleLogin = () => {
    setShowAuth(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const toggleEditMode = () => {
    if (role === 'admin' || role === 'tecnico') {
      setEditMode(!editMode)
    }
  }

  return (
    <div className="layout">
      <Topbar 
        user={user} 
        role={role} 
        editMode={editMode}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onToggleEdit={toggleEditMode}
      />
      
      <main className="main-content">
        <Sidebar editMode={editMode} />
        <div className="content-area">
          {children}
        </div>
      </main>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLoginSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}
