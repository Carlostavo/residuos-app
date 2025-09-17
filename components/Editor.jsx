import React, { useEffect, useRef, useState } from 'react'
import { loadFromSupabase, saveToSupabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/auth'

export default function Editor({ pageName='home' }) {
  const ref = useRef(null)
  const { role } = useAuth()
  const canEdit = role === 'admin' || role === 'tecnico'
  const [editing, setEditing] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const html = await loadFromSupabase(pageName)
        if(html && mounted && ref.current){
          ref.current.innerHTML = html
        } else if(mounted && ref.current && !html){
          ref.current.innerHTML = `<section class="default-card"><h2>${pageName}</h2><p>Contenido inicial. Edita con enlaces para imágenes/videos.</p></section>`
        }
      }catch(e){
        console.error('load', e)
      } finally { if(mounted) setLoaded(true) }
    })()
    return ()=>{ mounted=false }
  },[pageName])

  async function handleSave(){
    if(!ref.current) return
    try{
      await saveToSupabase(pageName, ref.current.innerHTML)
      alert('Guardado en Supabase')
    }catch(e){
      alert('Error guardando: '+ (e.message||e))
    }
  }

  return (
    <div className="editor-wrap">
      <div className="editor-controls">
        {/* show edit toggle only for authorized roles */}
        {canEdit ? (
          <>
            <button onClick={()=>setEditing(v=>!v)}>{editing ? 'Salir edición' : 'Editar'}</button>
            <button onClick={handleSave}>Guardar</button>
            <span>{loaded ? 'Contenido cargado' : 'Cargando...'}</span>
          </>
        ) : (
          <div className="no-perm">No tienes permisos de edición.</div>
        )}
      </div>
      <div
        ref={ref}
        className={`editor-canvas ${editing ? 'editing' : ''}`}
        contentEditable={editing && canEdit}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}
