import React from 'react'
export default function ToolbarTop({ onSave, onPreview, editMode }){
  return (
    <div className="toolbar-fixed card" role="toolbar" aria-label="Editor toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <button onClick={onSave} className="button-primary">Guardar</button>
        <button onClick={onPreview} className="px-3 py-1 rounded border">Vista previa</button>
        {editMode && <span className="small" style={{ marginLeft:12 }}>Modo edición activo</span>}
      </div>
      <div className="small">Editor profesional — arrastra y redimensiona elementos</div>
    </div>
  )
}