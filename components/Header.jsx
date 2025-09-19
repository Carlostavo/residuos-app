// components/Header.jsx - Mejorado
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { useState, useCallback } from 'react'
import LoginModal from './LoginModal'

export default function Header() {
  const pathname = usePathname()
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogout = useCallback(async () => {
    try {
      await signOut()
      // No es necesario recargar la página, el hook manejará el estado
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [signOut])

  const navItems = [
    { href: '/inicio', label: 'Inicio' },
    { href: '/indicadores', label: 'Indicadores' },
    { href: '/metas', label: 'Metas' },
    { href: '/avances', label: 'Avances' },
    { href: '/reportes', label: 'Reportes' },
    { href: '/formularios', label: 'Formularios' },
  ]

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-40">
        <div className="brand flex items-center gap-2 text-green-700 font-bold">
          <i className="fa-solid fa-recycle text-xl"></i>
          <span className="text-lg">Gestión RS</span>
        </div>
        
        <nav className="hidden md:flex gap-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded-full transition-colors ${
                pathname === item.href
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {loading ? (
            <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full animate-pulse">
              Cargando...
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-700">
                Hola, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* Modal de Login */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
