import React from 'react'
import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import ToolbarTop from './ToolbarTop'
import { useEdit } from './EditContext'

export default function EditorShell({ blocks, setBlocks, pageId, onSave, onPreview, onHistory }){
  const { editMode, showSidebar } = useEdit()

  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }
  function onSelect(id){ /* selection handled in sidebar */ }

  const ordered = [...blocks].sort((a,b)=> (a.zIndex||0) - (b.zIndex||0))

  // When the sidebar is visible, shift the canvas and toolbar to the right so the sidebar doesn't cover content.
  const canvasStyle = showSidebar ? { left: 'calc(var(--panel-width) + 24px)', right: '24px' } : { left: 0, right: 0 }

  return (
    <div>
      <div style={{ height: 'calc(100vh - 120px)' }} className={showSidebar? 'canvas-offset' : ''}>
        <ToolbarTop onSave={onSave} onPreview={onPreview} onHistory={onHistory} onUndo={()=>{}} onRedo={()=>{}} editMode={editMode} />
        <div className="canvas-fullscreen" style={canvasStyle}>
          <div className="canvas-inner">
            {ordered.map(b=> (
              <CanvasBlock
                key={b.id}
                block={b}
                editMode={editMode}
                onChange={html=> updateBlock(b.id, html)}
                onUpdatePos={pos=> onUpdatePos(b.id, pos)}
                onSelect={()=> onSelect(b.id)}
                selected={false}
              />
            ))}
          </div>
        </div>
      </div>
      <EditorSidebar blocks={blocks} setBlocks={setBlocks} />
    </div>
  )
}
