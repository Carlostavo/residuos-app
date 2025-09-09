import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar, selectedId, setSelectedId, setShowSidebar } = useEdit()
  const [selected, setSelected] = useState(null)

  useEffect(()=>{ setSelected(blocks.find(b=>b.id===selectedId) || null) },[selectedId, blocks])
  useEffect(()=>{ function h(e){ const id = e.detail?.id; if(id) setSelectedId(id) } window.addEventListener('select-block', h); return ()=> window.removeEventListener('select-block', h) }, [])

  function addBlock(type){ const id = 'b'+Date.now(); const base = { id, type, value: type==='text'? '<p>Escribe aquí</p>' : type==='image'? 'https://via.placeholder.com/400x200' : type==='video'? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 'Botón', x:40, y:40, width:320, zIndex: (Math.max(0, ...blocks.map(bb=> bb.zIndex||0)) + 1), styles: {} }; setBlocks(prev=> [...prev, base]); setSelectedId(id); if(!showSidebar) setShowSidebar(true) }
  function updateSelected(field, val){ if(!selected) return; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b)) }
  function updateStyle(key, val){ if(!selected) return; const styles = {...(selected.styles||{}), [key]: val}; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b)) }
  function deleteBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)); setSelectedId(null) }

  async function uploadAndSet(file){ if(!file) return; const path = `images/${Date.now()}-${file.name}`; const { data, error } = await supabase.storage.from('images').upload(path, file); if(error) return alert(error.message); const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`; if(selectedId) updateSelected('value', publicUrl); else { const id='b'+Date.now(); setBlocks(prev=> [...prev, { id, type:'image', value: publicUrl, x:40, y:40, width:400, styles:{} }]); setSelectedId(id) } }

  if(!showSidebar) return null
  return (
    <motion.aside initial={{ x:-360 }} animate={{ x:0 }} className='editor-sidebar'>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div><strong>Editor</strong><div className='small'>Panel izquierdo</div></div>
        <div><button onClick={()=> setShowSidebar(false)}>Cerrar</button></div>
      </div>

      <div style={{marginBottom:12}}>
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button onClick={()=> addBlock('text')}>Texto</button>
          <button onClick={()=> addBlock('image')}>Imagen</button>
          <button onClick={()=> addBlock('video')}>Video</button>
          <button onClick={()=> addBlock('button')}>Botón</button>
        </div>
        <div className='small'>Lista de bloques</div>
        {blocks.map(b=> (
          <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,background:'#fafafa',borderRadius:6,marginTop:6}}>
            <div><div style={{fontSize:13}}>{b.type}</div><div className='small'>{b.id}</div></div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=> setSelectedId(b.id)}>Seleccionar</button>
              <button onClick={()=> deleteBlock(b.id)} style={{color:'#c0262e'}}>Borrar</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{fontWeight:600,marginBottom:8}}>Propiedades</div>
        {!selected && <div className='small'>Selecciona un bloque</div>}
        {selected && (
          <div>
            <div style={{marginBottom:8}}><strong>{selected.type}</strong></div>
            {selected.type==='text' && (
              <>
                <label className='small'>Contenido</label>
                <textarea defaultValue={selected.value.replace(/<[^>]+>/g,'')} onBlur={e=> updateSelected('value', `<p>${e.target.value.replace(/</g,'&lt;')}</p>`)} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
                <label className='small'>Color</label>
                <input type='color' defaultValue={selected.styles?.color||'#111827'} onChange={e=> updateStyle('color', e.target.value)} style={{width:'100%',height:40,marginBottom:8}} />
              </>
            )}
            {selected.type==='image' && (
              <>
                <label className='small'>URL</label>
                <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
                <label className='small'>O subir</label>
                <input type='file' accept='image/*' onChange={e=> uploadAndSet(e.target.files[0])} style={{width:'100%',marginBottom:8}} />
              </>
            )}
            {selected.type==='video' && (
              <>
                <label className='small'>URL YouTube/Vimeo</label>
                <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
                <div className='small'>Se convertirá automáticamente a embed.</div>
              </>
            )}
            {selected.type==='button' && (
              <>
                <label className='small'>Texto</label>
                <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
                <label className='small'>Link</label>
                <input defaultValue={selected.link||''} onBlur={e=> updateSelected('link', e.target.value)} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
                <label className='small'>Color</label>
                <input type='color' defaultValue={selected.styles?.color||'#10b981'} onChange={e=> updateStyle('color', e.target.value)} style={{width:'100%',height:40,marginBottom:8}} />
              </>
            )}

            <div style={{marginTop:8}}>
              <label className='small'>X</label>
              <input defaultValue={selected.x||0} onBlur={e=> updateSelected('x', parseInt(e.target.value||0))} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
              <label className='small'>Y</label>
              <input defaultValue={selected.y||0} onBlur={e=> updateSelected('y', parseInt(e.target.value||0))} style={{width:'100%',padding:8,borderRadius:6,marginBottom:8}} />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
