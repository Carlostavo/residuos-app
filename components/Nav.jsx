import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from './EditContext'
import LoginModal from './LoginModal'
export default function Nav(){
  const [user,setUser]=useState(null)
  const [role,setRole]=useState(null)
  const { editMode, setEditMode, showSidebar, setShowSidebar } = useEdit()
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{ setUser(data.session?.user ?? null); if(data.session?.user) fetchRole(data.session.user.id) }); const s = supabase.auth.onAuthStateChange((_e,session)=>{ setUser(session?.user ?? null); if(session?.user) fetchRole(session.user.id) }); return ()=> s.subscription.unsubscribe() },[])
  async function fetchRole(id){ const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle(); if(data?.role) setRole(data.role) }
  const signOut = async ()=> { await supabase.auth.signOut(); setShowSidebar(false); setEditMode(false) }
  function handleEdit(){ if(role!=='admin') return alert('Solo administradores'); setEditMode(v=>!v); setShowSidebar(s=>!s) }
  return (
    <header className='header-brand'>
      <div className='app-shell' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <Link href='/'><a style={{color:'white',fontWeight:700}}>Plataforma Residuos</a></Link>
          <nav style={{display:'flex',gap:12}}>
            <Link href='/'><a style={{color:'rgba(255,255,255,0.9)'}}>Inicio</a></Link>
            <Link href='/indicadores'><a style={{color:'rgba(255,255,255,0.9)'}}>Indicadores</a></Link>
            <Link href='/metas'><a style={{color:'rgba(255,255,255,0.9)'}}>Metas</a></Link>
            <Link href='/formulario'><a style={{color:'rgba(255,255,255,0.9)'}}>Formulario</a></Link>
          </nav>
        </div>
        <div>
          {user ? (
            <>
              {role==='admin' && <button onClick={handleEdit} style={{marginRight:8}}>{editMode? 'Salir edición':'Editar'}</button>}
              <span style={{color:'white',marginRight:8}}>{user.email}</span>
              <button onClick={signOut}>Salir</button>
            </>
          ) : (
            <button onClick={()=>alert('Abrir modal login')} style={{background:'white',color:'#10b981',padding:'6px 10px',borderRadius:6}}>Iniciar sesión</button>
          )}
        </div>
      </div>
    </header>
  )
}
