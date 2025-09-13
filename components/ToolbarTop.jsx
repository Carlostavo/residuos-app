import React from 'react'
export default function ToolbarTop({ onSave, onPreview, onHistory, onUndo, onRedo, editMode }){
  return (
    <div className="toolbar-fixed card" role="toolbar" aria-label="Editor toolbar">
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onSave} className="button-primary">Guardar</button>
        <button onClick={onUndo} className="px-3 py-1 rounded border">Deshacer</button>
        <button onClick={onRedo} className="px-3 py-1 rounded border">Rehacer</button>
        <button onClick={onPreview} className="px-3 py-1 rounded border">Vista previa</button>
        {editMode && <button onClick={onHistory} className="px-3 py-1 rounded border">Historial</button>}
      </div>
      <div className="small">Editor avanzado</div>
    </div>
  )
}
