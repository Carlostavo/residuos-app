'use client'
import { Rnd } from 'react-rnd'
import { useEditor } from './EditorContext'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EditableCard({ card }) {
  const { editMode } = useEditor()
  const [data, setData] = useState({
    id: card.id,
    title: card.title || 'Sin título',
    content: card.content || '<p>Editar contenido...</p>',
    x: card.x || 20,
    y: card.y || 20,
    width: card.width || 320,
    height: card.height || 160,
    maximized: card.maximized || false
  })
  const contentRef = useRef(null)

  const save = async (patch) => {
    const next = {...data, ...patch}
    setData(next)
    try {
      await supabase.from('elements').upsert(next)
    } catch (err) {
      console.error('save error', err)
    }
  }

  return (
    <Rnd
      size={{ width: data.maximized ? '100%' : data.width, height: data.maximized ? 400 : data.height }}
      position={{ x: data.x, y: data.y }}
      onDragStop={(e, d) => save({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        save({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position })
      }}
      enableResizing={editMode}
      disableDragging={!editMode}
      minWidth={120}
      minHeight={80}
      style={{ zIndex: 10 }}
    >
      <div className={'card ' + (editMode ? 'editing' : '')} style={{width:'100%', height:'100%', overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <strong>{data.title}</strong>
          {editMode && (
            <div style={{display:'flex', gap:8}}>
              <button className='btn' onClick={()=>save({ maximized: !data.maximized })}>{data.maximized ? 'Minimizar' : 'Maximizar'}</button>
              <button className='btn' onClick={async ()=>{ await supabase.from('elements').delete().eq('id', data.id); }}>Eliminar</button>
            </div>
          )}
        </div>
        <div
          ref={contentRef}
          contentEditable={editMode}
          suppressContentEditableWarning={true}
          onBlur={(e)=>save({ content: e.target.innerHTML })}
          dangerouslySetInnerHTML={{ __html: data.content }}
          style={{minHeight:80}}
        />
      </div>
    </Rnd>
  )
}
