import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from './EditContext'
export default function Nav(){
  const [user,setUser]=useState(null)
  const [role,setRole]=useState(null)
  const { editMode, setEditMode } = useEdit()
  useEffect(()=>{
    let mounted=true
    supabase.auth.getSession().then(({data})=>{ const u = data.session?.user ?? null; if(mounted) setUser(u); if(u) fetchRole(u.id) })
    const s = supabase.auth.onAuthStateChange((_e,session)=>{ const u = session?.user ?? null; setUser(u); if(u) fetchRole(u.id); else setRole(null) })
    return ()=> s.subscription.unsubscribe()
  },[])
  async function fetchRole(id){ const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle(); if(data?.role) setRole(data.role) }
  const signOut = async ()=> await supabase.auth.signOut()
  return (
    <header className="header-brand py-3 mb-6">
      <div className="app-shell flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href='/'><a className="font-bold text-lg">Plataforma Residuos</a></Link>
          <nav className="flex gap-4 items-center text-white/90">
            <Link href='/'><a className="hover:underline">Inicio</a></Link>
            <Link href='/indicadores'><a className="hover:underline">Indicadores</a></Link>
            <Link href='/metas'><a className="hover:underline">Metas</a></Link>
            <Link href='/avances'><a className="hover:underline">Avances</a></Link>
            <Link href='/reportes'><a className="hover:underline">Reportes</a></Link>
            <Link href='/formulario'><a className="hover:underline">Formulario</a></Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {role==='admin' && <button onClick={()=>setEditMode(!editMode)} className="bg-white text-green-700 px-3 py-1 rounded">{editMode? 'Salir edición':'Editar'}</button>}
              <span className="text-white/90 text-sm">{user.email}</span>
              <button onClick={signOut} className="bg-white text-red-600 px-3 py-1 rounded">Salir</button>
            </>
          ) : (
            <Link href='/login'><a className="bg-white text-green-700 px-3 py-1 rounded">Iniciar sesión</a></Link>
          )}
        </div>
      </div>
    </header>
  )
}
