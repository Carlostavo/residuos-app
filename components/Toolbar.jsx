import React from 'react'
export default function Toolbar({ onExec, onImageUpload }){
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 flex gap-2 z-50">
      <button onClick={()=>onExec('bold')} className="toolbar-btn">B</button>
      <button onClick={()=>onExec('italic')} className="toolbar-btn">I</button>
      <button onClick={()=>onExec('underline')} className="toolbar-btn">U</button>
      <button onClick={()=>onExec('formatBlock','H2')} className="toolbar-btn">H2</button>
      <button onClick={()=>onExec('insertUnorderedList')} className="toolbar-btn">• List</button>
      <label className="toolbar-btn cursor-pointer">📷<input type='file' accept='image/*' onChange={onImageUpload} className='hidden' /></label>
    </div>
  )
}
