import React from 'react'

export default function Toolbar({ onExec, onImageUpload }){
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 flex gap-2 z-50">
      <button onClick={()=>onExec('bold')} className="px-2 font-bold">B</button>
      <button onClick={()=>onExec('italic')} className="px-2 italic">I</button>
      <button onClick={()=>onExec('underline')} className="px-2 underline">U</button>
      <button onClick={()=>onExec('insertOrderedList')} className="px-2">1.</button>
      <button onClick={()=>onExec('insertUnorderedList')} className="px-2">•</button>
      <button onClick={()=>{
        const url = prompt('URL del enlace:')
        if(url) onExec('createLink', url)
      }} className="px-2">🔗</button>
      <label className="px-2 border rounded cursor-pointer">
        📷
        <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
      </label>
    </div>
  )
}
