import EditorSidebar from './EditorSidebar'
import CanvasBlock from './CanvasBlock'
import ToolbarTop from './ToolbarTop'
import { useEdit } from './EditContext'
export default function EditorShell({ blocks, setBlocks, onSave }){
  const { showSidebar, showGrid } = useEdit()
  function updatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }
  return (<div><ToolbarTop onSave={onSave} onPreview={()=>{}} onHistory={()=>{}} onUndo={()=>{}} onRedo={()=>{}} editMode={true} /><div className={showSidebar? 'canvas-offset':''}><div className={'canvas-area'}><div className={'canvas-inner ' + (showGrid? 'canvas-grid' : '')}>{blocks.map(b=> <CanvasBlock key={b.id} block={b} editMode={true} onUpdatePos={updatePos} />)}</div></div></div><EditorSidebar blocks={blocks} setBlocks={setBlocks} /></div>)
}
