import { useEdit } from './EditContext'

export default function ToolbarTop({ onUndo, onRedo, onPreview }){
  const { editMode } = useEdit()
  if(!editMode) return null
  return (
    <div className="toolbar-fixed card" role="toolbar" aria-label="Editor toolbar">
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onUndo} className="btn-secondary">↩ Deshacer</button>
        <button onClick={onRedo} className="btn-secondary">↪ Rehacer</button>
        <button onClick={onPreview} className="btn-accent">👁 Vista previa</button>
      </div>
      <div className="small">Modo edición</div>
    </div>
  )
}
