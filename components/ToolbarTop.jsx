import React from 'react'
export default function ToolbarTop({ onSave, onPreview, onHistory, editMode }){
  return (
    <div className='app-shell toolbar-top'>
      <div>
        <button onClick={onSave} className='button-primary mr-2'>Guardar</button>
        <button onClick={onPreview} className='px-3 py-1 rounded border mr-2'>Vista previa</button>
        {editMode && <button onClick={onHistory} className='px-3 py-1 rounded border'>Historial</button>}
      </div>
      <div className='small'>Editor avanzado • Modo edición</div>
    </div>
  )
}
