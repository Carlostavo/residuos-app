import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Nav() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const s = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    return () => s.subscription.unsubscribe()
  }, [])
  const signOut = async () => await supabase.auth.signOut()
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/"><a className="flex items-center text-green-700 font-bold">Indicadores Daule</a></Link>
            <div className="ml-6 flex items-center space-x-4">
              <Link href="/"><a className="text-gray-600 hover:text-gray-900">Inicio</a></Link>
              <Link href="/indicadores"><a className="text-gray-600 hover:text-gray-900">Indicadores</a></Link>
              <Link href="/metas"><a className="text-gray-600 hover:text-gray-900">Metas</a></Link>
              <Link href="/avances"><a className="text-gray-600 hover:text-gray-900">Avances</a></Link>
              <Link href="/reportes"><a className="text-gray-600 hover:text-gray-900">Reportes</a></Link>
              <Link href="/formulario"><a className="text-gray-600 hover:text-gray-900 font-semibold">Formulario</a></Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="mr-4 text-sm text-gray-700">{user.email}</span>
                <button onClick={signOut} className="px-3 py-1 bg-red-500 text-white rounded">Cerrar sesión</button>
              </>
            ) : (
              <Link href="/login"><a className="px-3 py-1 bg-green-600 text-white rounded">Iniciar sesión</a></Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
