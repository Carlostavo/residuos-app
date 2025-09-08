import React from 'react'
export default function ToolbarTop({ onSave, onPreview, onHistory, editMode }){
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button onClick={onSave} className="button-primary">Guardar</button>
        <button onClick={onPreview} className="px-3 py-1 rounded border">Vista previa</button>
        {editMode && <button onClick={onHistory} className="px-3 py-1 rounded border">Historial</button>}
      </div>
      <div className="text-sm text-gray-600">Editor avanzado</div>
    </div>
  )
}
