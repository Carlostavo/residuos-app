import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from './EditContext'
import LoginModal from './LoginModal'

export default function Nav(){
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const { editMode, setEditMode, showSidebar, setShowSidebar, exitAndSave } = useEdit()

  useEffect(()=>{
    let mounted = true
    supabase.auth.getSession().then(({ data })=>{ const u = data.session?.user ?? null; if(mounted) setUser(u); if(u) fetchRole(u.id) })
    const sub = supabase.auth.onAuthStateChange((_e, session)=>{ const u = session?.user ?? null; setUser(u); if(u) fetchRole(u.id); else setRole(null) })
    return ()=> sub.subscription.unsubscribe()
  }, [])

  async function fetchRole(id){
    const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle()
    if(data?.role) setRole(data.role)
  }

  async function handleEditToggle(){
    if(!editMode){ // entering edit mode
      setEditMode(true); setShowSidebar(true)
    } else {
      // exiting: call exitAndSave which will save changes then disable edit mode
      try{
        await exitAndSave()
      }catch(e){ alert('Error guardando cambios: '+(e.message||e)) }
    }
  }

  async function signOut(){ await supabase.auth.signOut(); setShowLogin(false); setEditMode(false); setShowSidebar(false) }

  return (
    <header className="header-brand">
      <div className="app-shell flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href='/'><a className="text-white font-bold text-lg">Plataforma Residuos</a></Link>
          <nav className="flex gap-4 items-center text-white/90">
            <Link href='/'><a>Inicio</a></Link>
            <Link href='/indicadores'><a>Indicadores</a></Link>
            <Link href='/metas'><a>Metas</a></Link>
            <Link href='/avances'><a>Avances</a></Link>
            <Link href='/reportes'><a>Reportes</a></Link>
            <Link href='/formulario'><a>Formulario</a></Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {role==='admin' && <button onClick={handleEditToggle} className="px-3 py-1 rounded bg-white text-green-700">{editMode? 'Guardar y salir' : 'Editar'}</button>}
              <span className="text-white/90 text-sm">{user.email}</span>
              <button onClick={signOut} className="px-3 py-1 rounded bg-white text-red-600">Salir</button>
            </>
          ) : (
            <button onClick={()=>setShowLogin(true)} className="px-3 py-1 rounded bg-white text-green-700">Iniciar sesión</button>
          )}
        </div>
      </div>
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} />}
    </header>
  )
}
