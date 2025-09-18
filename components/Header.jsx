'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const router = useRouter()
  const { session, role } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
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
                onClick={() => alert('Entraste en modo edición ✍')}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-full"
              >
                Editar
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
            onClick={() => router.push('/login')}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  )
}
