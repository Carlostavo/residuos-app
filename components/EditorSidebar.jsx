import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar, selectedId, setSelectedId, setShowSidebar } = useEdit()
  const [tab, setTab] = useState('blocks')
  const [selected, setSelected] = useState(null)

  useEffect(()=>{ setSelected(blocks.find(b=>b.id===selectedId) || null) },[selectedId, blocks])

  function addBlock(type){ const id = 'b'+Date.now(); const base = { id, type, value: type==='text'? 'Escribe aquí...' : type==='image'? 'https://via.placeholder.com/400x200' : type==='video'? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : 'Botón', x:40, y:40, width:320, zIndex: (Math.max(0, ...blocks.map(bb=> bb.zIndex||0)) + 1), styles: {} }; setBlocks(prev=> [...prev, base]); setSelectedId(id); if(!showSidebar) setShowSidebar(true) }

  function updateSelected(field, val){ if(!selected) return; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b)) }
  function updateStyle(key, val){ if(!selected) return; const styles = {...(selected.styles||{}), [key]: val}; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b)) }
  function deleteBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)); setSelectedId(null) }

  async function uploadAndSet(file){ if(!file) return; const path = `images/${Date.now()}-${file.name}`; const { data, error } = await supabase.storage.from('images').upload(path, file); if(error) return alert(error.message); const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`; if(selectedId) updateSelected('value', publicUrl); else { const id='b'+Date.now(); setBlocks(prev=> [...prev, { id, type:'image', value: publicUrl, x:40, y:40, width:400, styles:{} }]); setSelectedId(id) } }

  return (
    <>
      {showSidebar && (
        <motion.aside initial={{ x: -360 }} animate={{ x: 0 }} exit={{ x: -360 }} className='editor-sidebar'>
          <div className='toolbar-top'>
            <div>
              <strong>Editor</strong>
              <div className='small'>Modo edición</div>
            </div>
            <div>
              <button onClick={()=> setShowSidebar(false)} className='px-2 py-1 rounded border'>Cerrar</button>
            </div>
          </div>

          <div className='mb-3'>
            <div className='flex gap-2 mb-2'>
              <button onClick={()=> addBlock('text')} className='px-3 py-1 rounded border'>Añadir texto</button>
              <button onClick={()=> addBlock('image')} className='px-3 py-1 rounded border'>Añadir imagen</button>
            </div>
            <div className='flex gap-2'>
              <button onClick={()=> addBlock('video')} className='px-3 py-1 rounded border'>Añadir video</button>
              <button onClick={()=> addBlock('button')} className='px-3 py-1 rounded border'>Añadir botón</button>
            </div>
          </div>

          <div className='mb-4'>
            <div className='font-semibold mb-2'>Bloques</div>
            <div className='space-y-2'>
              {blocks.map(b=> (
                <div key={b.id} className='block-card flex items-center justify-between'>
                  <div>
                    <div className='text-sm'>{b.type}</div>
                    <div className='small'>{b.id}</div>
                  </div>
                  <div className='flex gap-1'>
                    <button onClick={()=> setSelectedId(b.id)} className='px-2 py-1 text-sm'>Editar</button>
                    <button onClick={()=> deleteBlock(b.id)} className='px-2 py-1 text-sm text-red-600'>Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className='font-semibold mb-2'>Propiedades</div>
            {!selected && <div className='small'>Selecciona un bloque para editarlo</div>}
            {selected && (
              <div>
                <div className='mb-2'><strong>{selected.type}</strong></div>
                {selected.type==='text' && (
                  <>
                    <label className='small'>Texto</label>
                    <textarea defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>Fuente</label>
                    <select defaultValue={selected.styles?.fontFamily||'Inter'} onChange={e=> updateStyle('fontFamily', e.target.value)} className='w-full p-2 border rounded mb-2'>
                      <option value='Inter'>Inter</option>
                      <option value='Roboto'>Roboto</option>
                      <option value='Open Sans'>Open Sans</option>
                      <option value='Lato'>Lato</option>
                      <option value='Montserrat'>Montserrat</option>
                      <option value='Poppins'>Poppins</option>
                      <option value='Merriweather'>Merriweather</option>
                      <option value='Playfair Display'>Playfair Display</option>
                      <option value='Fira Mono'>Fira Mono</option>
                    </select>
                    <label className='small'>Tamaño (px)</label>
                    <input defaultValue={selected.styles?.fontSize?.replace('px','')||16} onBlur={e=> updateStyle('fontSize', e.target.value+'px')} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>Color</label>
                    <input type='color' defaultValue={selected.styles?.color||'#111827'} onBlur={e=> updateStyle('color', e.target.value)} className='w-full p-2 rounded mb-2' />
                    <label className='small'>Alineación</label>
                    <div className='flex gap-2 mb-2'>
                      <button onClick={()=> updateStyle('align','left')} className='px-2 py-1 rounded border'>Izq</button>
                      <button onClick={()=> updateStyle('align','center')} className='px-2 py-1 rounded border'>Centrar</button>
                      <button onClick={()=> updateStyle('align','right')} className='px-2 py-1 rounded border'>Der</button>
                    </div>
                  </>
                )}

                {selected.type==='image' && (
                  <>
                    <label className='small'>URL de la imagen</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>O subir desde tu dispositivo</label>
                    <input type='file' accept='image/*' onChange={e=> uploadAndSet(e.target.files[0])} className='w-full mb-2' />
                    <label className='small'>Width (px)</label>
                    <input defaultValue={selected.width||300} onBlur={e=> updateSelected('width', parseInt(e.target.value||300))} className='w-full p-2 border rounded mb-2' />
                  </>
                )}

                {selected.type==='video' && (
                  <>
                    <label className='small'>URL embed (YouTube/Vimeo)</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>Width (px)</label>
                    <input defaultValue={selected.width||480} onBlur={e=> updateSelected('width', parseInt(e.target.value||480))} className='w-full p-2 border rounded mb-2' />
                  </>
                )}

                {selected.type==='button' && (
                  <>
                    <label className='small'>Texto</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>Link destino</label>
                    <input defaultValue={selected.link||''} onBlur={e=> updateSelected('link', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='small'>Color</label>
                    <input type='color' defaultValue={selected.styles?.color||'#10b981'} onBlur={e=> updateStyle('color', e.target.value)} className='w-full p-2 rounded mb-2' />
                  </>
                )}

                <div className='mt-3'>
                  <label className='small'>X</label>
                  <input defaultValue={selected.x||0} onBlur={e=> updateSelected('x', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />
                  <label className='small'>Y</label>
                  <input defaultValue={selected.y||0} onBlur={e=> updateSelected('y', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />
                </div>

              </div>
            )}
          </div>

        </motion.aside>
      )}
    </>
  )

}
