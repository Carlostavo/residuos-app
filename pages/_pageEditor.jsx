import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
import ToolbarTop from '../components/ToolbarTop'

export default function PageEditor({ slug='home', title='Página', defaultContent = [{ id:'b1', type:'text', value:'Bienvenido a la plataforma', x:40, y:40, width:360 }] }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const undoStack = useRef([]); const redoStack = useRef([])

  useEffect(()=>{ load() }, [])

  async function load(){
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if (data?.content) setBlocks(data.content)
    else setBlocks(defaultContent)
  }

  function push(s){ undoStack.current.push(JSON.parse(JSON.stringify(s))); if(undoStack.current.length>50) undoStack.current.shift(); redoStack.current=[] }
  function setBlocksWithHistory(next){ push(blocks); setBlocks(next) }

  async function save(){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if (error) return console.error('save error', error)
    alert('Guardado')
  }

  function preview(){ window.location.href = '/' }
  function history(){ window.location.href = '/historial/'+slug }
  function undo(){ if(undoStack.current.length===0) return; const prev = undoStack.current.pop(); redoStack.current.push(JSON.parse(JSON.stringify(blocks))); setBlocks(prev) }
  function redo(){ if(redoStack.current.length===0) return; const next = redoStack.current.pop(); undoStack.current.push(JSON.parse(JSON.stringify(blocks))); setBlocks(next) }

  return (
    <div>
      <ToolbarTop onSave={save} onPreview={preview} onHistory={history} onUndo={undo} onRedo={redo} editMode={editMode} />
      <div style={{ paddingTop: '64px' }}>
        <EditorShell blocks={blocks} setBlocks={setBlocksWithHistory} pageId={null} onSave={save} onPreview={preview} onHistory={history} />
      </div>
    </div>
  )
}
