import React from 'react'
import { useEdit } from './EditContext'
export default function ToolbarTop({ onSave, onPreview, onHistory, onUndo, onRedo, editMode }){
  const { showSidebar, setShowSidebar, showGrid, setShowGrid } = useEdit()
  return (
    <div className='toolbar card'>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onSave} className='button-primary'>Guardar</button>
        <button onClick={onUndo} className='px-3 py-1 rounded border'>Deshacer</button>
        <button onClick={onRedo} className='px-3 py-1 rounded border'>Rehacer</button>
        <button onClick={onPreview} className='px-3 py-1 rounded border'>Vista previa</button>
        <button onClick={()=> setShowSidebar(s=>!s)} className='px-3 py-1 rounded border'>{showSidebar ? 'Ocultar panel' : 'Abrir panel'}</button>
        <button onClick={()=> setShowGrid(g=>!g)} className='px-3 py-1 rounded border'>{showGrid ? 'Ocultar grid' : 'Mostrar grid'}</button>
      </div>
      <div className='small'>Editor profesional</div>
    </div>
  )
}
