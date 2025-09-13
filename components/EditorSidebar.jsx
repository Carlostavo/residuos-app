import React, { useEffect, useState } from 'react'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar, selectedId, setSelectedId, setShowSidebar } = useEdit()
  const [tab, setTab] = useState('bloques')
  const [selected, setSelected] = useState(null)

  useEffect(()=> setSelected(blocks.find(b=> b.id===selectedId) || null), [selectedId, blocks])

  function addBlock(type){
    const id = 'b'+Date.now()
    const base = { id, type, value: type==='text'? 'Nuevo texto' : type==='image'? 'https://via.placeholder.com/400x200' : type==='video'? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 'Botón', x:40, y:40, width: 360, height: null, zIndex: Math.max(0, ...blocks.map(b=> b.zIndex||0)) + 1, styles:{} }
    setBlocks(prev=> [...prev, base])
    setSelectedId(id)
  }

  function updateSelected(field, val){ if(!selected) return; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b)) }
  function updateStyle(key, val){ if(!selected) return; const styles = {...(selected.styles||{}), [key]: val}; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b)) }
  async function uploadImage(file){ if(!file) return; const path = `images/${Date.now()}-${file.name}`; const { data, error } = await supabase.storage.from('images').upload(path, file); if(error) return alert(error.message); const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`; if(selectedId) updateSelected('value', publicUrl); else { const id='b'+Date.now(); setBlocks(prev=> [...prev, { id, type:'image', value: publicUrl, x:40, y:40, width:400, styles:{} }]); setSelectedId(id) } }

  function removeBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)); setSelectedId(null) }

  if(!showSidebar) return null
  return (
    <aside className="fixed left-0 top-14 h-[calc(100%-3.5rem)] w-80 bg-white shadow-xl border-r z-40 flex flex-col">
      <div className="flex border-b">
        <button className={`flex-1 py-2 ${tab==='bloques'? 'border-b-2 border-blue-600 font-bold': ''}`} onClick={()=> setTab('bloques')}>Bloques</button>
        <button className={`flex-1 py-2 ${tab==='propiedades'? 'border-b-2 border-blue-600 font-bold': ''}`} onClick={()=> setTab('propiedades')}>Propiedades</button>
        <button className={`flex-1 py-2 ${tab==='estilos'? 'border-b-2 border-blue-600 font-bold': ''}`} onClick={()=> setTab('estilos')}>Estilos</button>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        {tab==='bloques' && (
          <div>
            <div className="mb-3"><button onClick={()=> addBlock('text')} className="btn-secondary mr-2">Añadir texto</button><button onClick={()=> addBlock('image')} className="btn-secondary mr-2">Añadir imagen</button></div>
            <div className="mb-3"><button onClick={()=> addBlock('video')} className="btn-secondary mr-2">Añadir video</button><button onClick={()=> addBlock('button')} className="btn-secondary">Añadir botón</button></div>
            <div>
              <strong>Bloques en página</strong>
              {blocks.map(b=> (
                <div key={b.id} className="mt-2 p-2 bg-gray-50 rounded flex justify-between items-center">
                  <div><div className="font-semibold text-sm">{b.type}</div><div className="text-xs text-gray-500">{b.id}</div></div>
                  <div className="flex gap-2">
                    <button onClick={()=> setSelectedId(b.id)} className="text-sm">Editar</button>
                    <button onClick={()=> removeBlock(b.id)} className="text-sm text-red-600">Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='propiedades' && (
          <div>
            {!selected && <div className="text-sm text-gray-500">Selecciona un bloque para ver propiedades</div>}
            {selected && (
              <div>
                <div className="mb-2 font-semibold">{selected.type} propiedades</div>
                {selected.type==='text' && (
                  <>
                    <label className="text-sm">Texto</label>
                    <textarea defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <label className="text-sm">Tamaño (px)</label>
                    <input defaultValue={selected.styles?.fontSize?.replace('px','')||16} onBlur={e=> updateStyle('fontSize', e.target.value+'px')} className="w-full p-2 border rounded mb-2" />
                    <label className="text-sm">Color</label>
                    <input type="color" defaultValue={selected.styles?.color||'#111827'} onChange={e=> updateStyle('color', e.target.value)} className="w-full mb-2" />
                  </>
                )}

                {selected.type==='image' && (
                  <>
                    <label className="text-sm">URL de imagen</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <label className="text-sm">Subir desde dispositivo</label>
                    <input type="file" accept="image/*" onChange={e=> uploadImage(e.target.files[0])} className="w-full mb-2" />
                  </>
                )}

                {selected.type==='video' && (
                  <>
                    <label className="text-sm">Link (YouTube/Vimeo)</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className="w-full p-2 border rounded mb-2" />
                  </>
                )}

                {selected.type==='button' && (
                  <>
                    <label className="text-sm">Texto</label>
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <label className="text-sm">Link</label>
                    <input defaultValue={selected.link||''} onBlur={e=> updateSelected('link', e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <label className="text-sm">Color</label>
                    <input type="color" defaultValue={selected.styles?.color||'#10b981'} onChange={e=> updateStyle('color', e.target.value)} className="w-full mb-2" />
                  </>
                )}

                <div className="mt-3">
                  <label className="text-sm">X</label>
                  <input defaultValue={selected.x||0} onBlur={e=> updateSelected('x', parseInt(e.target.value||0))} className="w-full p-2 border rounded mb-2" />
                  <label className="text-sm">Y</label>
                  <input defaultValue={selected.y||0} onBlur={e=> updateSelected('y', parseInt(e.target.value||0))} className="w-full p-2 border rounded mb-2" />
                </div>

              </div>
            )}
          </div>
        )}

        {tab==='estilos' && (
          <div>
            <div className="text-sm text-gray-500">Ajustes globales</div>
            <div className="mt-2">Tema: <select className="ml-2 p-1 border rounded"><option>Claro</option><option>Oscuro</option></select></div>
          </div>
        )}

      </div>
    </aside>
  )
}
