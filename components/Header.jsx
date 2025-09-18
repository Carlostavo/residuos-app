'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  return (
    <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
      <div className="brand flex items-center gap-2 text-green-700 font-bold">
        <i className="fa-solid fa-recycle"></i>
        <span>Gestión RS</span>
      </div>
      <nav className="flex gap-3 items-center">
        <Link href="/inicio" className="px-3 py-2 rounded-md hover:bg-gray-100">Inicio</Link>
        <Link href="/indicadores" className="px-3 py-2 rounded-md hover:bg-gray-100">Indicadores</Link>
        <Link href="/metas" className="px-3 py-2 rounded-md hover:bg-gray-100">Metas</Link>
        <Link href="/avances" className="px-3 py-2 rounded-md hover:bg-gray-100">Avances</Link>
        <Link href="/reportes" className="px-3 py-2 rounded-md hover:bg-gray-100">Reportes</Link>
        <Link href="/formularios" className="px-3 py-2 rounded-md hover:bg-gray-100">Formularios</Link>
        <button onClick={() => router.push('/login')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full">Iniciar sesión</button>
      </nav>
    </header>
  )
}
