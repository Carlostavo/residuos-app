'use client'
import Link from 'next/link'
import { useAuth, hasRole } from '../lib/useAuth'
import { useEditor } from './EditorContext'

export default function Header() {
  const { user, loading } = useAuth()
  const { editMode, toggleEditMode } = useEditor()

  return (
    <header style={{background:'white', padding:12, boxShadow:'0 6px 18px rgba(2,6,23,0.06)'}}>
      <div className='container' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <Link href="/"><a style={{fontWeight:700, fontSize:18}}>Residuos App</a></Link>
          {(!loading && hasRole(user, ['admin','tecnico'])) && <nav><Link href='/metas'><a style={{marginLeft:12}}>Metas</a></Link> <Link href='/avances'><a style={{marginLeft:12}}>Avances</a></Link> <Link href='/reportes'><a style={{marginLeft:12}}>Reportes</a></Link></nav>}
        </div>

        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          {!loading && hasRole(user, ['admin','tecnico']) && (
            <button className={'btn ' + (editMode ? 'btn-primary' : '')} onClick={toggleEditMode}>
              {editMode ? 'Salir edición' : 'Editar'}
            </button>
          )}
          {/* Login / Logout placeholders */}
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}

function AuthButtons() {
  // Simple placeholder UI - replace with your auth flow
  return (
    <div style={{display:'flex', gap:8}}>
      <a className='btn' href='#' onClick={(e)=>{e.preventDefault(); alert('Implementa Supabase auth en lib/useAuth.js')}}>Iniciar</a>
    </div>
  )
}
