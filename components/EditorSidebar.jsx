import React, { useEffect, useState } from 'react'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorSidebar({ blocks, setBlocks, onUndo, onRedo }){
  const { showSidebar, selectedId, setSelectedId, setShowSidebar, editMode } = useEdit()
  const [selected, setSelected] = useState(null)

  useEffect(()=> setSelected(blocks.find(b=> b.id===selectedId) || null), [selectedId, blocks])

  function addBlock(type){
    const id = 'b'+Date.now()
    const base = { id, type, value: type==='text' ? 'Escribe aquí...' : '', x:50, y:50, width:300, height: type==='image' ? 200 : 120, zIndex: (Math.max(0, ...blocks.map(bb=> bb.zIndex||0)) + 1), styles: {} }
    setBlocks([...blocks, base])
    setSelectedId(id)
    setShowSidebar(true)
  }

  function removeSelected(){
    if (!selected) return
    setBlocks(blocks.filter(b=> b.id !== selected.id))
    setSelectedId(null)
  }

  // simple property editor
  function updateSelected(changes){
    if (!selected) return
    setBlocks(blocks.map(b=> b.id===selected.id ? {...b, ...changes} : b))
  }

  if (!editMode) return null

  return (
    <aside className="editor-sidebar card" style={{ width:320 }} aria-label="Panel de edición">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h3 className="text-xl">Panel de edición</h3>
        <button onClick={()=> setShowSidebar(false)} className="px-2 py-1 rounded border">Cerrar</button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={()=> addBlock('text')} className="px-3 py-2 rounded border w-1/2">Añadir texto</button>
        <button onClick={()=> addBlock('image')} className="px-3 py-2 rounded border w-1/2">Imagen</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={()=> addBlock('video')} className="px-3 py-2 rounded border w-1/2">Video</button>
        <button onClick={()=> addBlock('button')} className="px-3 py-2 rounded border w-1/2">Botón</button>
      </div>

      <div style={{ borderTop:'1px solid rgba(0,0,0,0.06)', paddingTop:12, marginTop:8 }}>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <button onClick={onUndo} className="px-3 py-1 rounded border">Deshacer</button>
          <button onClick={onRedo} className="px-3 py-1 rounded border">Rehacer</button>
          <button onClick={removeSelected} className="px-3 py-1 rounded border">Eliminar</button>
        </div>
        {selected ? (
          <div>
            <label className="small">Contenido</label>
            <textarea value={selected.value} onChange={(e)=> updateSelected({ value: e.target.value })} style={{ width:'100%', minHeight:80 }} />
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <label className="small">Ancho</label>
              <input type="number" value={selected.width||0} onChange={(e)=> updateSelected({ width: parseInt(e.target.value||0) })} />
              <label className="small">Alto</label>
              <input type="number" value={selected.height||0} onChange={(e)=> updateSelected({ height: parseInt(e.target.value||0) })} />
            </div>
          </div>
        ) : (
          <div className="small">Selecciona un elemento del lienzo para editar sus propiedades.</div>
        )}
      </div>
    </aside>
  )
}