import React from 'react'
export default function ToolbarTop({ onSave, onUndo, onRedo, onPreview, onExit }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md flex items-center gap-4 px-6 z-50">
      <button onClick={onSave} className="btn-primary">💾 Guardar</button>
      <button onClick={onUndo} className="btn-secondary">↩ Deshacer</button>
      <button onClick={onRedo} className="btn-secondary">↪ Rehacer</button>
      <button onClick={onPreview} className="btn-accent">👁 Vista previa</button>
      <button onClick={onExit} className="btn-danger">⏻ Salir</button>
    </div>
  )
}
