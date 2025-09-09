import React from 'react'
import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import ToolbarTop from './ToolbarTop'
import { useEdit } from './EditContext'

export default function EditorShell({ blocks, setBlocks, pageId, onSave, onPreview, onHistory, selectedId, setSelectedId }){
  const { editMode, showSidebar } = useEdit()
  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }
  const ordered = [...blocks].sort((a,b)=> (a.zIndex||0) - (b.zIndex||0))

  return (
    <div>
      <ToolbarTop onSave={onSave} onPreview={onPreview} onHistory={onHistory} editMode={editMode} />
      <div style={{ height: 'calc(100vh - 88px)' }} className={showSidebar? 'editor-toggle-space': ''}>
        <div className='canvas-fullscreen'>
          <div className='canvas-inner'>
            {ordered.map(b=> <CanvasBlock key={b.id} block={b} editMode={editMode} onChange={updateBlock} onUpdatePos={onUpdatePos} onSelect={setSelectedId} selected={selectedId===b.id} />)}
          </div>
        </div>
      </div>
      <EditorSidebar blocks={blocks} setBlocks={setBlocks} />
    </div>
  )
}
