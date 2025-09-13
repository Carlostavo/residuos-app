import React, { useEffect, useState } from 'react'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar, selectedId, setSelectedId, setShowSidebar } = useEdit()
  const [selected, setSelected] = useState(null)

  useEffect(()=> setSelected(blocks.find(b=> b.id===selectedId) || null), [selectedId, blocks])

  function addBlock(type){
    const id = 'b'+Date.now()
    const base = { id, type, value: type==='text' ? 'Escribe aquí...' : type==='image' ? 'https://via.placeholder.com/400x200' : type==='video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : 'Botón', x:40, y:40, width:320, zIndex: (Math.max(0, ...blocks.map(bb=> bb.zIndex||0)) + 1), styles: {} }
    setBlocks(prev=> [...prev, base])
    setSelectedId(id)
    setShowSidebar(true)
  }

  function updateSelected(field, val){ if(!selected) return; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b)) }
  function updateStyle(k,v){ if(!selected) return; const styles = {...(selected.styles||{}), [k]: v}; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b)) }
  async function upload(file){
    if(!file) return
    const path = `images/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('images').upload(path, file)
    if(error) return alert(error.message)
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`
    if(selectedId) updateSelected('value', publicUrl)
    else {
      const id = 'b'+Date.now()
      setBlocks(prev=> [...prev, { id, type:'image', value: publicUrl, x:40, y:40, width:400, styles:{} }])
      setSelectedId(id)
    }
  }

  function deleteBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)); setSelectedId(null) }

  if(!showSidebar) return null

  return (
    <aside className="editor-sidebar" aria-label="Editor sidebar">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div><strong>Editor</strong><div className="small">Modo edición</div></div>
        <div><button onClick={()=> setShowSidebar(false)}>Cerrar</button></div>
      </div>
      <div style={{ marginTop:12 }}>
        <div style={{ marginBottom:8 }}>
          <button onClick={()=> addBlock('text')}>Añadir texto</button>
          <button onClick={()=> addBlock('image')}>Añadir imagen</button>
          <button onClick={()=> addBlock('video')}>Añadir video</button>
          <button onClick={()=> addBlock('button')}>Añadir botón</button>
        </div>
        <div style={{ marginTop:12 }}>
          <strong>Bloques</strong>
          {blocks.map(b=> (
            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:8, background:'#fafafa', borderRadius:6, marginTop:6 }}>
              <div><div style={{ fontSize:13 }}>{b.type}</div><div style={{ fontSize:11, color:'#64748b' }}>{b.id}</div></div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=> setSelectedId(b.id)}>Editar</button>
                <button onClick={()=> deleteBlock(b.id)} style={{ color:'red' }}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12 }}>
          <strong>Propiedades</strong>
          {!selected && <div style={{ fontSize:12, color:'#64748b' }}>Selecciona un bloque</div>}
          {selected && (
            <div>
              <div style={{ marginTop:8 }}><strong>{selected.type}</strong></div>
              {selected.type === 'text' && (
                <div>
                  <label className="small">Texto</label>
                  <textarea defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{ width:'100%', padding:8 }} />
                  <label className="small">Fuente</label>
                  <select defaultValue={selected.styles?.fontFamily||'Inter'} onChange={e=> updateStyle('fontFamily', e.target.value)} style={{ width:'100%', padding:8 }}>
                    <option>Inter</option><option>Roboto</option><option>Poppins</option>
                  </select>
                  <label className="small">Color</label>
                  <input type="color" defaultValue={selected.styles?.color||'#111827'} onChange={e=> updateStyle('color', e.target.value)} />
                </div>
              )}
              {selected.type === 'image' && (
                <div>
                  <label className="small">URL</label>
                  <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{ width:'100%', padding:8 }} />
                  <label className="small">Subir</label>
                  <input type="file" accept="image/*" onChange={e=> upload(e.target.files[0])} />
                </div>
              )}
              {selected.type === 'video' && (
                <div>
                  <label className="small">Link (YouTube/Vimeo)</label>
                  <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{ width:'100%', padding:8 }} />
                </div>
              )}
              {selected.type === 'button' && (
                <div>
                  <label className="small">Texto</label>
                  <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{ width:'100%', padding:8 }} />
                  <label className="small">Link</label>
                  <input defaultValue={selected.link||''} onBlur={e=> updateSelected('link', e.target.value)} style={{ width:'100%', padding:8 }} />
                  <label className="small">Color</label>
                  <input type="color" defaultValue={selected.styles?.color||'#10b981'} onChange={e=> updateStyle('color', e.target.value)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
