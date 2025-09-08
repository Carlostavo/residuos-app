import React from 'react'
import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import ToolbarTop from './ToolbarTop'
import { useEdit } from './EditContext'

export default function EditorShell({ blocks, setBlocks, pageId, onSave, onPreview, onHistory, selectedId, setSelectedId }){
  const { editMode } = useEdit()
  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }
  function addBlock(type){ const id = 'b'+Date.now(); const base = { id, type, value: type==='text'? '<p>Nuevo texto</p>': type==='image'? 'https://via.placeholder.com/400x200': type==='video'? 'https://www.youtube.com/embed/dQw4w9WgXcQ': 'Botón', x:20, y:20, width:320, zIndex: (Math.max(0, ...blocks.map(bb=> bb.zIndex||0)) + 1) }; setBlocks(prev=> [...prev, base]); setSelectedId(id) }
  function bringToFront(id){ const top = Math.max(0, ...blocks.map(b=> b.zIndex||0)); setBlocks(prev=> prev.map(b=> b.id===id? {...b, zIndex: top+1} : b)) }
  function sendToBack(id){ const min = Math.min(...blocks.map(b=> b.zIndex||0)); setBlocks(prev=> prev.map(b=> b.id===id? {...b, zIndex: min-1} : b)) }

  // sort by zIndex for rendering
  const ordered = [...blocks].sort((a,b)=> (a.zIndex||0) - (b.zIndex||0))

  return (
    <div>
      <ToolbarTop onSave={onSave} onPreview={onPreview} onHistory={onHistory} editMode={editMode} />
      <div className='flex'>
        <EditorSidebar blocks={blocks} setBlocks={setBlocks} pageId={pageId} />
        <div className='content-area app-shell'>
          <div className='mb-3 flex gap-2'>
            {editMode && <button onClick={()=> addBlock('text')} className='px-3 py-1 rounded border'>Añadir texto</button>}
            {editMode && <button onClick={()=> addBlock('image')} className='px-3 py-1 rounded border'>Añadir imagen</button>}
            {editMode && <button onClick={()=> addBlock('video')} className='px-3 py-1 rounded border'>Añadir video</button>}
            {editMode && <button onClick={()=> addBlock('button')} className='px-3 py-1 rounded border'>Añadir botón</button>}
            {editMode && <button onClick={()=> { if(selectedId) bringToFront(selectedId) }} className='px-3 py-1 rounded border'>Traer al frente</button>}
            {editMode && <button onClick={()=> { if(selectedId) sendToBack(selectedId) }} className='px-3 py-1 rounded border'>Enviar atrás</button>}
          </div>
          <div className='canvas-container card' style={{ backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)'}}>
            {ordered.map(b=> <CanvasBlock key={b.id} block={b} editMode={editMode} onChange={updateBlock} onUpdatePos={onUpdatePos} onSelect={setSelectedId} selected={selectedId===b.id} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
