import React, { useEffect, useRef, useState } from 'react'
import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import { useEdit } from './EditContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorShell({ blocks: initialBlocks, setBlocks: setBlocksProp, pageId }){
  const { editMode, showSidebar } = useEdit()
  const [blocks, setBlocks] = useState(initialBlocks || [])
  const history = useRef([])
  const idx = useRef(-1)

  useEffect(()=>{ setBlocks(initialBlocks || []) },[initialBlocks])
  useEffect(()=>{ push(blocks) }, [])

  function push(state){ history.current = history.current.slice(0, idx.current+1); history.current.push(JSON.parse(JSON.stringify(state))); idx.current = history.current.length-1 }
  function applyState(s, record=false){ setBlocks(s); setBlocksProp(s); if(record) push(s) }

  function updateBlocks(newBlocks){ applyState(newBlocks, true) }
  function updateBlock(id, value){ const nb = blocks.map(b=> b.id===id? {...b, value} : b); updateBlocks(nb) }
  function onUpdatePos(id, pos){ const nb = blocks.map(b=> b.id===id? {...b, ...pos} : b); updateBlocks(nb) }

  function undo(){ if(idx.current>0){ idx.current--; const s = history.current[idx.current]; applyState(s,false) } }
  function redo(){ if(idx.current < history.current.length-1){ idx.current++; const s = history.current[idx.current]; applyState(s,false) } }

  async function save(){ // save to supabase
    const upsert = { slug:'home', content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return alert('Error al guardar: '+error.message)
    alert('Guardado')
  }

  function preview(){ window.location.href='/' }

  const ordered = [...blocks].sort((a,b)=> (a.zIndex||0) - (b.zIndex||0))

  return (
    <div>
      <div className='toolbar-fixed' style={{ left: showSidebar? 'var(--panel-width)' : 0 }}>
        <div style={{display:'flex',gap:8}}>
          <button onClick={save} className='button-primary'>Guardar</button>
          <button onClick={undo}>Deshacer</button>
          <button onClick={redo}>Rehacer</button>
          <button onClick={preview}>Vista previa</button>
        </div>
        <div className='small'>Editor profesional</div>
      </div>

      <div className={showSidebar? 'canvas-fullscreen editor-toggle-space' : 'canvas-fullscreen'} style={{ top:'calc(64px + var(--toolbar-height))' }}>
        <div className='canvas-inner'>
          {ordered.map(b=> <CanvasBlock key={b.id} block={b} editMode={editMode} onChange={updateBlock} onUpdatePos={onUpdatePos} onSelect={(id)=> window.dispatchEvent(new CustomEvent('select-block',{detail:{id}}))} selected={false} />)}
        </div>
      </div>

      <EditorSidebar blocks={blocks} setBlocks={(nb)=> updateBlocks(nb)} />
    </div>
  )
}
