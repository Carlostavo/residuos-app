'use client'
import { Rnd } from 'react-rnd'
import { useEditor } from './Editor/Context.jax'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.jax'

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

  const save = async (patch) => {
    const next = {...data, ...patch}
    setData(next)
    try {
      const { error } = await supabase.from('elements').upsert(next)
      if (error) console.error('Error saving:', error)
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta tarjeta?')) {
      try {
        const { error } = await supabase.from('elements').delete().eq('id', data.id)
        if (error) console.error('Error deleting:', error)
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
  }

  return (
    <Rnd
      size={{ width: data.maximized ? '100%' : data.width, height: data.maximized ? 400 : data.height }}
      position={{ x: data.x, y: data.y }}
      onDragStop={(e, d) => save({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        save({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position
        })
      }}
      enableResizing={editMode && !data.maximized}
      disableDragging={!editMode}
      minWidth={120}
      minHeight={80}
      style={{ zIndex: 10, position: 'absolute' }}
      bounds="parent"
    >
      <div className={'card ' + (editMode ? 'editing' : '')} style={{
        width: '100%', 
        height: '100%', 
        overflow: 'auto',
        border: editMode ? '2px dashed #2563eb' : '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: '1px solid #f1f5f9'
        }}>
          <strong>{data.title}</strong>
          {editMode && (
            <div style={{display: 'flex', gap: 8}}>
              <button 
                className='btn' 
                onClick={() => save({ maximized: !data.maximized })}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                {data.maximized ? '↗' : '↘'}
              </button>
              <button 
                className='btn' 
                onClick={handleDelete}
                style={{ fontSize: '12px', padding: '4px 8px', background: '#ef4444', color: 'white' }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div
          contentEditable={editMode}
          suppressContentEditableWarning={true}
          onBlur={(e) => save({ content: e.target.innerHTML })}
          dangerouslySetInnerHTML={{ __html: data.content }}
          style={{
            minHeight: 80,
            outline: 'none',
            padding: '8px'
          }}
        />
      </div>
    </Rnd>
  )
}
