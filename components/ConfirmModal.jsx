
import React from 'react'
export default function ConfirmModal({ open, title='Confirmar', message, onCancel, onConfirm }){
  if (!open) return null
  return (
    <div style={{ position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3000 }}>
      <div style={{ background:'#fff', padding:18, borderRadius:8, maxWidth:420, width:'90%' }} role="dialog" aria-modal="true">
        <h3 style={{ marginTop:0 }}>{title}</h3>
        <p>{message}</p>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
          <button onClick={onCancel} className="px-3 py-1 rounded border">Cancelar</button>
          <button onClick={onConfirm} className="button-primary px-3 py-1 rounded">Confirmar</button>
        </div>
      </div>
    </div>
  )
}
