// components/Header.jsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'
import { useEdit } from '../contexts/EditContext'

export default function Header() {
  const pathname = usePathname()
  const { session, role, loading } = useAuth()
  const { isEditing, setIsEditing } = useEdit()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
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
      window.location.reload()
    }
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-40">
        <div className="brand flex items-center gap-2 text-green-700 font-bold">
          <i className="fa-solid fa-recycle"></i>
          <span>Gestión RS</span>
        </div>
        <nav className="flex gap-3 items-center">
          <Link 
            href="/inicio" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/inicio' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Inicio
          </Link>
          <Link 
            href="/indicadores" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/indicadores' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Indicadores
          </Link>
          <Link 
            href="/metas" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/metas' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Metas
          </Link>
          <Link 
            href="/avances" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/avances' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Avances
          </Link>
          <Link 
            href="/reportes" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/reportes' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reportes
          </Link>
          <Link 
            href="/formularios" 
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === '/formularios' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Formularios
          </Link>

          {session && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                isEditing 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className={`fa-solid ${isEditing ? 'fa-floppy-disk' : 'fa-pen'} mr-2`}></i>
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
          )}

          {loading ? (
            <div className="ml-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-full animate-pulse">
              Cargando...
            </div>
          ) : session ? (
            <div className="flex items-center gap-4 ml-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Hola, {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
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
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6">
              {error && (
                <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded border border-red-200">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i>
                  {error}
                </div>
              )}
              
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loginLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-70 transition-colors flex items-center justify-center"
              >
                {loginLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>
                    Entrar
                  </>
                )}
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                ¿No tienes cuenta? Regístrate desde Supabase Auth o pide a un admin.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Indicador de modo edición */}
      {isEditing && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg z-30">
          <i className="fa-solid fa-pen mr-2"></i>
          Modo edición activado
        </div>
      )}
    </>
  )
}
