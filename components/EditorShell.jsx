import React from 'react'
import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import ToolbarTop from './ToolbarTop'
import { useEdit } from './EditContext'

export default function EditorShell({ blocks, setBlocks, pageId, onSave, onPreview, onHistory }){
  const { editMode, showSidebar } = useEdit()

  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }
  function onSelect(id){ /* leave selection to sidebar */ }

  const ordered = [...blocks].sort((a,b)=> (a.zIndex||0) - (b.zIndex||0))

  return (
    <div>
      <ToolbarTop onSave={onSave} onPreview={onPreview} onHistory={onHistory} onUndo={()=>{}} onRedo={()=>{}} editMode={editMode} />
      <div style={{ height: 'calc(100vh - 120px)' }} className={showSidebar? 'canvas-offset' : ''}>
        <div className="canvas-fullscreen">
          <div className="canvas-inner">
            {ordered.map(b=> <CanvasBlock key={b.id} block={b} editMode={editMode} onChange={updateBlock} onUpdatePos={onUpdatePos} onSelect={onSelect} selected={false} />)}
          </div>
        </div>
      </div>
      <EditorSidebar blocks={blocks} setBlocks={setBlocks} />
    </div>
  )
}
