import React from 'react'
import Link from 'next/link'
import { useAuth } from '../lib/auth'

export default function Topbar() {
  const { user, role } = useAuth()
  const canEdit = role === 'admin' || role === 'tecnico'

  return (
    <header className="topbar">
      <div className="brand">♻️ Gestión RS</div>
      <nav>
        <Link href="/"><a>Inicio</a></Link>
        <Link href="/indicadores"><a>Indicadores</a></Link>
        <Link href="/reportes"><a>Reportes</a></Link>
        <Link href="/formularios"><a>Formularios</a></Link>
        <Link href="/metas"><a>Metas</a></Link>
        <Link href="/avances"><a>Avances</a></Link>
        {/* Editor link only for roles with edit permission */}
        {canEdit && <Link href="/editor"><a>Editor</a></Link>}
      </nav>
      <div className="user-area">
        {user ? (
          <>
            <span className="whoami">{user.email}</span>
            <span className="role-badge">{role}</span>
          </>
        ) : (
          <a href="#" onClick={(e)=>{e.preventDefault(); alert('Usa el modal de autenticación (no implementado aquí).')}}>Iniciar sesión</a>
        )}
      </div>
    </header>
  )
}
