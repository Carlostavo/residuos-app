
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEdit } from './EditContext'

export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar, selectedId, setSelectedId } = useEdit()
  const [tab, setTab] = useState('properties')
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    setSelected(blocks.find(b=>b.id===selectedId) || null)
  },[selectedId, blocks])

  function updateSelected(field, val){ if(!selected) return; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b)) }
  function updateStyle(key, val){ if(!selected) return; const styles = {...(selected.styles||{}), [key]: val}; setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b)) }
  function deleteBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)); setSelectedId(null) }

  return (
    <>
      {showSidebar && (
        <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className='editor-sidebar'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-semibold'>Editor</h3>
            <div className='flex gap-2'>
              <button onClick={()=> setTab('properties')} className={`px-2 py-1 rounded ${tab==='properties'? 'bg-green-50':''}`}>Propiedades</button>
              <button onClick={()=> setTab('blocks')} className={`px-2 py-1 rounded ${tab==='blocks'? 'bg-green-50':''}`}>Bloques</button>
            </div>
          </div>

          {tab==='blocks' && (
            <div className='space-y-2'>
              {blocks.map(b=> (
                <div key={b.id} className='p-2 border rounded flex justify-between items-center'>
                  <div>
                    <div className='text-sm font-medium'>{b.type}</div>
                    <div className='text-xs text-gray-500'>{b.id}</div>
                  </div>
                  <div className='flex gap-1'>
                    <button onClick={()=> setSelectedId(b.id)} className='px-2 py-1 text-sm'>Seleccionar</button>
                    <button onClick={()=> deleteBlock(b.id)} className='px-2 py-1 text-sm text-red-600'>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='properties' && (
            <div>
              {!selected && <div className='text-sm text-gray-500'>Selecciona un bloque para editar sus propiedades.</div>}
              {selected && (
                <div>
                  <h4 className='font-semibold mb-2'>Propiedades: {selected.type}</h4>
                  <label className='block text-xs text-gray-600'>Contenido</label>
                  {selected.type==='text' ? (
                    <textarea defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                  ) : selected.type==='image' ? (
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                  ) : selected.type==='video' ? (
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                  ) : selected.type==='button' ? (
                    <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
                  ) : null}

                  <label className='block text-xs text-gray-600'>Posición X</label>
                  <input type='number' defaultValue={selected.x||0} onBlur={e=> updateSelected('x', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />
                  <label className='block text-xs text-gray-600'>Posición Y</label>
                  <input type='number' defaultValue={selected.y||0} onBlur={e=> updateSelected('y', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />

                  <label className='block text-xs text-gray-600'>Width</label>
                  <input type='number' defaultValue={selected.width||300} onBlur={e=> updateSelected('width', parseInt(e.target.value||300))} className='w-full p-2 border rounded mb-2' />

                  <div className='mt-3'>
                    <h5 className='font-semibold'>Estilos</h5>
                    <label className='text-xs text-gray-600'>Fuente</label>
                    <select defaultValue={selected.styles?.fontFamily||'Inter'} onChange={e=> updateStyle('fontFamily', e.target.value)} className='w-full p-2 border rounded mb-2'>
                      <option>Inter</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                    </select>
                    <label className='text-xs text-gray-600'>Tamaño (px)</label>
                    <input defaultValue={parseInt(selected.styles?.fontSize||16)} onBlur={e=> updateStyle('fontSize', e.target.value+'px')} className='w-full p-2 border rounded mb-2' />
                    <label className='text-xs text-gray-600'>Color</label>
                    <input defaultValue={selected.styles?.color||'#111827'} onBlur={e=> updateStyle('color', e.target.value)} className='w-full p-2 border rounded mb-2' />
                    <label className='text-xs text-gray-600'>Alineación</label>
                    <div className='flex gap-2 mb-2'>
                      <button onClick={()=> updateStyle('align','left')} className='px-2 py-1 rounded border'>Izq</button>
                      <button onClick={()=> updateStyle('align','center')} className='px-2 py-1 rounded border'>Centro</button>
                      <button onClick={()=> updateStyle('align','right')} className='px-2 py-1 rounded border'>Der</button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </motion.aside>
      )}
    </>
  )
}
