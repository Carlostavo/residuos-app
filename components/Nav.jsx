import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from './EditContext'

export default function Nav(){
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const { editMode, setEditMode } = useEdit()

  useEffect(()=>{
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      if(mounted) setUser(u)
      if(u) fetchRole(u.id)
    })
    const s = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if(u) fetchRole(u.id)
      else setRole(null)
    })
    return ()=>{ mounted=false; s.subscription.unsubscribe() }
  },[])

  async function fetchRole(id){
    const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle()
    if(data?.role) setRole(data.role)
  }

  const signOut = async ()=> await supabase.auth.signOut()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/"><a className="text-green-700 font-bold">Plataforma Residuos</a></Link>
            <Link href="/indicadores"><a className="text-gray-600">Indicadores</a></Link>
            <Link href="/metas"><a className="text-gray-600">Metas</a></Link>
            <Link href="/avances"><a className="text-gray-600">Avances</a></Link>
            <Link href="/reportes"><a className="text-gray-600">Reportes</a></Link>
            <Link href="/formulario"><a className="text-gray-600">Formulario</a></Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {role === 'admin' && (
                  <button onClick={()=>setEditMode(!editMode)} className="px-3 py-1 bg-blue-600 text-white rounded">{editMode? 'Salir edición' : 'Editar página'}</button>
                )}
                <span className="text-sm">{user.email}</span>
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
