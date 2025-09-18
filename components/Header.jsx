'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'
import InlineEditor from './InlineEditor'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { session, role } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      setShowLoginModal(false)
      setEmail('')
      setPassword('')
      router.refresh()
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-40">
        <div className="brand flex items-center gap-2 text-green-700 font-bold">
          <i className="fa-solid fa-recycle"></i>
          <span>Gestión RS</span>
        </div>
        <nav className="flex gap-3 items-center">
          <Link href="/inicio">Inicio</Link>
          <Link href="/indicadores">Indicadores</Link>
          <Link href="/metas">Metas</Link>
          <Link href="/avances">Avances</Link>
          <Link href="/reportes">Reportes</Link>
          <Link href="/formularios">Formularios</Link>

          {session ? (
            <>
              {/* Mostrar botón Editar solo si es admin o tecnico */}
              {(role === 'admin' || role === 'tecnico') && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-full"
                >
                  <i className="fa-solid fa-pen-to-square mr-2"></i>Editar
                </button>
              )}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-full"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full"
            >
              Iniciar sesión
            </button>
          )}
        </nav>
      </header>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Iniciar sesión</h2>
              <button 
                onClick={() => {
                  setShowLoginModal(false)
                  setError(null)
                  setEmail('')
                  setPassword('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6">
              {error && <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">{error}</div>}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-70"
              >
                {loading ? 'Iniciando sesión...' : 'Entrar'}
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                ¿No tienes cuenta? Regístrate desde Supabase Auth o pide a un admin.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Editor Integrado */}
      <InlineEditor 
        isOpen={showEditor} 
        onClose={() => setShowEditor(false)} 
        currentPage={pathname} 
      />
    </>
  )
}
