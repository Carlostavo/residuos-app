import React, { useEffect, useState } from 'react'
import { useEdit } from './EditContext'

export default function EditorSidebar({ blocks, setBlocks, pageId }){
  const { editMode, selectedId, setSelectedId } = useEdit()
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    const s = blocks.find(b=>b.id===selectedId)
    setSelected(s||null)
  },[selectedId, blocks])

  function updateSelected(field, val){
    if(!selected) return
    setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, [field]: val} : b))
  }

  function updateStyle(key, val){
    if(!selected) return
    const styles = {...(selected.styles||{}), [key]: val}
    setBlocks(prev=> prev.map(b=> b.id===selected.id? {...b, styles} : b))
  }

  async function deleteBlock(id){ setBlocks(prev=> prev.filter(b=> b.id!==id)) }

  return (
    <aside className="sidebar fixed left-6 top-36 bg-white card p-4">
      <h3 className="font-semibold mb-3">Elementos</h3>
      <div className="space-y-2 max-h-[60vh] overflow-auto mb-3">
        {blocks.map(b=> (
          <div key={b.id} className={`p-2 rounded border ${b.id===selectedId? 'bg-green-50':''}`}>
            <div className="flex justify-between items-center">
              <div><strong>{b.type}</strong> <div className="text-xs text-gray-500">{b.id}</div></div>
              <div className="flex gap-1">
                <button onClick={()=>setSelectedId(b.id)} className="px-2 py-1 text-sm">Editar</button>
                <button onClick={()=>deleteBlock(b.id)} className="px-2 py-1 text-sm text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div>
          <h4 className="font-semibold mb-2">Propiedades</h4>
          <label className="block text-xs text-gray-600">Tipo</label>
          <div className="mb-2">{selected.type}</div>

          <label className="block text-xs text-gray-600">Contenido</label>
          {selected.type==='text' ? (
            <textarea defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
          ) : selected.type==='image' ? (
            <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
          ) : selected.type==='video' ? (
            <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
          ) : selected.type==='button' ? (
            <input defaultValue={selected.value} onBlur={e=> updateSelected('value', e.target.value)} className='w-full p-2 border rounded mb-2' />
          ) : null}

          <label className="block text-xs text-gray-600">X</label>
          <input type='number' defaultValue={selected.x||0} onBlur={e=> updateSelected('x', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />
          <label className="block text-xs text-gray-600">Y</label>
          <input type='number' defaultValue={selected.y||0} onBlur={e=> updateSelected('y', parseInt(e.target.value||0))} className='w-full p-2 border rounded mb-2' />
          <label className="block text-xs text-gray-600">Width</label>
          <input type='number' defaultValue={selected.width||300} onBlur={e=> updateSelected('width', parseInt(e.target.value||300))} className='w-full p-2 border rounded mb-2' />

          <h5 className='font-semibold mt-3'>Estilos</h5>
          <label className='text-xs text-gray-600'>Font size</label>
          <input className='w-full p-2 border rounded mb-2' defaultValue={selected.styles?.fontSize||'16px'} onBlur={e=> updateStyle('fontSize', e.target.value)} />
          <label className='text-xs text-gray-600'>Color</label>
          <input className='w-full p-2 border rounded mb-2' defaultValue={selected.styles?.color||'#111827'} onBlur={e=> updateStyle('color', e.target.value)} />
        </div>
      )}
    </aside>
  )
}
