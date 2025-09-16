import { useEffect, useRef, useState } from 'react';
import { supabase, savePageContent } from '../lib/supabaseClient';

// Utility to generate IDs
const uid = ()=> Math.random().toString(36).slice(2,9);

export default function EditorCanvas({ editable=false, initialElements=[], pageId='home' }) {
  const [elements, setElements] = useState(initialElements);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const canvasRef = useRef(null);
  const pointerState = useRef({mode:null, id:null, startX:0, startY:0, orig:{}});

  useEffect(()=>{ // push initial to history
    setHistory([JSON.stringify(initialElements)]);
  },[]);

  useEffect(()=>{ // save to history on elements change
    setHistory(h=> {
      const cur = JSON.stringify(elements);
      if(h[h.length-1] === cur) return h;
      return [...h, cur].slice(-50);
    });
    setFuture([]);
  },[elements]);

  function addElement(type){
    const id = uid();
    const el = {
      id, type, x:20, y:20, w:200, h:60, html: type==='text' ? 'Texto editable' : (type==='button' ? 'Click' : ''),
      src: type==='image' ? '/example.png' : (type==='video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : '')
    };
    setElements(e=>[...e, el]);
    setSelectedId(id);
  }

  function startPointer(e, id, mode){
    e.preventDefault();
    const p = pointerState.current;
    p.mode = mode;
    p.id = id;
    p.startX = e.clientX ?? (e.touches && e.touches[0].clientX);
    p.startY = e.clientY ?? (e.touches && e.touches[0].clientY);
    const el = elements.find(x=>x.id===id);
    p.orig = {...el};
    window.addEventListener('pointermove', movePointer);
    window.addEventListener('pointerup', endPointer);
  }

  function movePointer(e){
    const p = pointerState.current;
    if(!p.mode) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    setElements(prev=> prev.map(it=>{
      if(it.id !== p.id) return it;
      if(p.mode === 'move'){
        return {...it, x: p.orig.x + dx, y: p.orig.y + dy};
      } else if(p.mode === 'resize'){
        return {...it, w: Math.max(32, p.orig.w + dx), h: Math.max(24, p.orig.h + dy)};
      }
      return it;
    }));
  }

  function endPointer(){
    pointerState.current.mode = null;
    pointerState.current.id = null;
    window.removeEventListener('pointermove', movePointer);
    window.removeEventListener('pointerup', endPointer);
  }

  function selectElement(id){ setSelectedId(id); }

  function updateHtml(id, html){
    setElements(prev=> prev.map(it=> it.id===id ? {...it, html} : it));
  }

  function undo(){
    setHistory(h=>{
      if(h.length<2) return h;
      const last = h[h.length-1];
      const prev = h[h.length-2];
      setElements(JSON.parse(prev));
      setFuture(f=>[last,...f]);
      return h.slice(0,-1);
    });
  }
  function redo(){
    setFuture(f=>{
      if(f.length===0) return f;
      const next = f[0];
      setElements(JSON.parse(next));
      setHistory(h=>[...h, next]);
      return f.slice(1);
    });
  }
  function clearAll(){ setElements([]); setSelectedId(null); }

  async function save(){
    const html = renderToHtml();
    try{
      await savePageContent(pageId, html);
      alert('Guardado en Supabase (ver tabla pages).');
    }catch(err){
      alert('Error guardando: ' + err.message);
    }
  }

  function renderToHtml(){
    // Very simple serializer: wrap elements into absolute positioned divs
    const wrapper = elements.map(it=>{
      if(it.type==='text' || it.type==='button'){
        const tag = it.type==='button' ? 'button' : 'div';
        const content = it.html || '';
        return `<${tag} style="position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px">${content}</${tag}>`;
      } else if(it.type==='image'){
        return `<img src="${it.src}" style="position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px" />`;
      } else if(it.type==='video'){
        return `<iframe src="${it.src}" style="position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}" frameborder="0" allowfullscreen></iframe>`;
      }
      return '';
    }).join('\n');
    return `<div style="position:relative;width:100%;height:800px">${wrapper}</div>`;
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{display:'flex',gap:8}}>
        <div style={{flex:1}}><strong>Editor</strong></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn secondary" onClick={undo}>Deshacer</button>
          <button className="btn secondary" onClick={redo}>Rehacer</button>
          <button className="btn" onClick={save}>Guardar</button>
        </div>
      </div>
      <div className="canvas" ref={canvasRef} style={{marginTop:12, position:'relative', flex:1}}>
        {elements.map(el=>{
          const isSel = selectedId===el.id;
          return (
            <div key={el.id}
              className={'editorElement' + (isSel ? ' selected' : '')}
              style={{left:el.x, top:el.y, width:el.w, height:el.h}}
              onPointerDown={(e)=>{ e.stopPropagation(); selectElement(el.id); startPointer(e, el.id, 'move'); }}
            >
              {el.type==='text' && 
                <div contentEditable={editable && isSel} suppressContentEditableWarning={true}
                  onInput={(ev)=> updateHtml(el.id, ev.currentTarget.innerHTML)}
                  style={{width:'100%',height:'100%',padding:8,overflow:'auto'}}
                  dangerouslySetInnerHTML={{__html: el.html}}
                />
              }
              {el.type==='button' &&
                <button style={{width:'100%',height:'100%'}}>{el.html}</button>
              }
              {el.type==='image' && <img src={el.src} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
              {el.type==='video' && <iframe src={el.src} style={{width:'100%',height:'100%'}} frameBorder="0" allowFullScreen />}
              {editable && <div className="handle" onPointerDown={(e)=>{ e.stopPropagation(); startPointer(e, el.id, 'resize'); }} />}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:10,display:'flex',gap:8}}>
        <button className="btn secondary small" onClick={()=>{ navigator.clipboard && navigator.clipboard.writeText(renderToHtml()); alert('HTML copiado al portapapeles') }}>Copiar HTML</button>
        <button className="btn secondary small" onClick={()=>{ alert('Vista pública no implementada en demo'); }}>Ver público</button>
      </div>
    </div>
  );
}
