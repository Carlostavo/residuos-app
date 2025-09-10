import CanvasBlock from './CanvasBlock'
import { useEffect, useState } from 'react'
export default function EditorShell({ blocks, setBlocks, updateBlock }){
  const [selectedId, setSelectedId] = useState(null)
  useEffect(()=>{ function onAdd(e){ const type = e.detail?.type || 'text'; const id='b'+Date.now(); const b = { id, type, value: type==='text'? 'Nuevo texto' : type==='image'? 'https://via.placeholder.com/600x360' : type==='video'? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 'Botón', x:60, y:60, width:360, styles:{} }; setBlocks(prev=> [...prev,b]) }
    function onSelect(e){ setSelectedId(e.detail) }
    function onClear(){ setSelectedId(null) }
    function onDelete(e){ const id=e.detail; setBlocks(prev=> prev.filter(b=> b.id!==id)) }
    window.addEventListener('editor:add', onAdd)
    window.addEventListener('editor:select', onSelect)
    window.addEventListener('editor:clearSelection', onClear)
    window.addEventListener('editor:delete', onDelete)
    return ()=>{ window.removeEventListener('editor:add', onAdd); window.removeEventListener('editor:select', onSelect); window.removeEventListener('editor:clearSelection', onClear); window.removeEventListener('editor:delete', onDelete) }
  },[setBlocks])
  function onUpdatePos(id, pos){ updateBlock(id, pos) }
  function onChange(id, val){ updateBlock(id, { value: val }) }
  useEffect(()=>{ window.dispatchEvent(new CustomEvent('editor:blocks',{ detail: blocks })) }, [blocks])
  return (<div style={{ height:'100%', position:'relative' }}>{blocks.map(b=> <CanvasBlock key={b.id} block={b} editMode={true} onChange={onChange} onUpdatePos={onUpdatePos} onSelect={(id)=> setSelectedId(id)} selected={selectedId===b.id} />)}</div>)
}
