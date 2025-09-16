import { useEffect, useRef, useState } from 'react';
export default function EditorCanvas({ initialHtml, editable=true, onSave }) {
  const ref = useRef(null);
  const [html, setHtml] = useState(initialHtml || '');
  useEffect(()=>{
    if(ref.current) ref.current.innerHTML = html;
  },[html]);
  useEffect(()=>{
    function handler(){ if(ref.current) setHtml(ref.current.innerHTML); }
    const el = ref.current;
    el?.addEventListener('input', handler);
    return ()=> el?.removeEventListener('input', handler);
  },[]);
  return (
    <div>
      <div ref={ref} className="canvas" contentEditable={editable} suppressContentEditableWarning={true} style={{minHeight:320}}>
        {typeof initialHtml === 'string' ? null : initialHtml}
      </div>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className="btn" onClick={()=>onSave && onSave(html)}>Guardar en Supabase</button>
      </div>
    </div>
  );
}
