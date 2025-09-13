import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
import ToolbarTop from '../components/ToolbarTop'

export default function PageEditor({ slug='home', defaultContent=[{ id:'b1', type:'text', value:'Bienvenido', x:40, y:40, width:360 }] }){
  const { registerOnExit } = useEdit()
  const [blocks, setBlocks] = useState([])
  const undo = useRef([])
  const redo = useRef([])

  useEffect(()=>{ load(); }, [])

  async function load(){
    const { data } = await supabase.from('pages').select('content').eq('slug', slug).maybeSingle()
    if(data?.content) setBlocks(data.content)
    else setBlocks(defaultContent)
    // register exit handler
    registerOnExit(saveAndExit)
  }

  function pushHistory(snapshot){ undo.current.push(JSON.parse(JSON.stringify(snapshot))); if(undo.current.length>50) undo.current.shift(); redo.current = [] }
  function setBlocksWithHistory(next){ pushHistory(blocks); setBlocks(next) }

  async function saveAndExit(){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) throw error
    return data
  }

  function undoAction(){ if(undo.current.length===0) return; const prev = undo.current.pop(); redo.current.push(JSON.parse(JSON.stringify(blocks))); setBlocks(prev) }
  function redoAction(){ if(redo.current.length===0) return; const next = redo.current.pop(); undo.current.push(JSON.parse(JSON.stringify(blocks))); setBlocks(next) }

  function updateBlock(id, val){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...val} : b)) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }

  return (
    <div>
      <ToolbarTop onUndo={undoAction} onRedo={redoAction} onPreview={()=>{}} />
      <EditorShell blocks={blocks} setBlocks={setBlocksWithHistory} onSave={()=>saveAndExit()} onPreview={()=>{}} onHistory={()=>{}} />
    </div>
  )
}
