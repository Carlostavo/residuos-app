import { useEffect, useRef, useState } from 'react';
export default function FloatingToolbar({ visible=true, onAdd=()=>{}, onAction=()=>{} }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({x:20,y:80});
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({x:0,y:0});
  const [tab, setTab] = useState('insert');
  const [minimized, setMinimized] = useState(false);

  useEffect(()=>{
    function onMove(e){
      if(!dragging) return;
      setPos(p=>({x: e.clientX - offset.x, y: e.clientY - offset.y}));
    }
    function onUp(){ setDragging(false); }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return ()=> { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  },[dragging, offset]);

  function startDrag(e){
    const rect = ref.current.getBoundingClientRect();
    setOffset({x: e.clientX - rect.left, y: e.clientY - rect.top});
    setDragging(true);
  }

  if(!visible) return null;
  return (
    <div ref={ref} className="floatingTool" style={{left:pos.x, top:pos.y, cursor: dragging ? 'grabbing' : 'grab'}}>
      <div className="header" onPointerDown={startDrag}>
        <div style={{fontWeight:800}}>Herramientas</div>
        <div style={{display:'flex',gap:6}}>
          <button className="small secondary" onClick={()=>setMinimized(m=>!m)}>{minimized ? '▲' : '▼'}</button>
        </div>
      </div>
      {!minimized && (
        <div>
          <div className="tabs">
            <button className="small" onClick={()=>setTab('insert')}>Insertar</button>
            <button className="small" onClick={()=>setTab('styles')}>Estilos</button>
            <button className="small" onClick={()=>setTab('actions')}>Acciones</button>
          </div>
          {tab==='insert' && (
            <div style={{display:'grid',gap:8}}>
              <button className="small" onClick={()=>onAdd('text')}>+ Texto</button>
              <button className="small" onClick={()=>onAdd('image')}>+ Imagen</button>
              <button className="small" onClick={()=>onAdd('video')}>+ Video</button>
              <button className="small" onClick={()=>onAdd('button')}>+ Botón</button>
            </div>
          )}
          {tab==='styles' && (
            <div style={{display:'grid',gap:8}}>
              <label className="info">Ajustes rápidos</label>
              <div style={{display:'flex',gap:6}}>
                <button className="small" onClick={()=>onAction('bold')}>Negrita</button>
                <button className="small" onClick={()=>onAction('italic')}>Cursiva</button>
                <button className="small" onClick={()=>onAction('center')}>Centrar</button>
              </div>
            </div>
          )}
          {tab==='actions' && (
            <div style={{display:'grid',gap:8}}>
              <button className="small" onClick={()=>onAction('undo')}>Deshacer</button>
              <button className="small" onClick={()=>onAction('redo')}>Rehacer</button>
              <button className="small" onClick={()=>onAction('save')}>Guardar</button>
              <button className="small" onClick={()=>onAction('clear')}>Limpiar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
