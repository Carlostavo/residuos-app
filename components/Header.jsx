'use client'
import Link from 'next/link'
import { useAuth, hasRole } from '../lib/useAuth'
import { useEditor } from './EditorContext'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const { editMode, toggleEditMode } = useEditor()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header style={{background:'white', padding:12, boxShadow:'0 6px 18px rgba(2,6,23,0.06)', position: 'sticky', top: 0, zIndex: 50}}>
      <div className='container' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <Link href="/" style={{fontWeight:700, fontSize:18, textDecoration: 'none'}}>Residuos App</Link>
          {(!loading && hasRole(user, ['admin','tecnico'])) && (
            <nav style={{display: 'flex', gap: 12}}>
              <Link href='/metas' style={{textDecoration: 'none'}}>Metas</Link>
              <Link href='/avances' style={{textDecoration: 'none'}}>Avances</Link>
              <Link href='/reportes' style={{textDecoration: 'none'}}>Reportes</Link>
            </nav>
          )}
        </div>

        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          {!loading && hasRole(user, ['admin','tecnico']) && (
            <button className={'btn ' + (editMode ? 'btn-primary' : '')} onClick={toggleEditMode}>
              {editMode ? 'Salir edición' : 'Editar'}
            </button>
          )}
          
          {!loading ? (
            user ? (
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <span>Hola, {user.email}</span>
                <button className='btn' onClick={handleSignOut}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link href="/login" className='btn'>
                Iniciar sesión
              </Link>
            )
          ) : (
            <span>Cargando...</span>
          )}
        </div>
      </div>
    </header>
  )
}
