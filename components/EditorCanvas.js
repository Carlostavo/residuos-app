import { useEffect, useRef, useState } from 'react';
import { savePageContent, getPageContent } from '../lib/supabaseClient';
const uid = ()=> Math.random().toString(36).slice(2,9);
export default function EditorCanvas({ editable=false, pageId='index', initialContent=null }) {
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const pointer = useRef({mode:null,id:null,startX:0,startY:0,orig:{}});

  useEffect(()=>{
    async function load(){
      if(initialContent){
        try{ const parsed = JSON.parse(initialContent); setElements(parsed); setHistory([JSON.stringify(parsed)]); return; }catch(e){}
      }
      try{
        const saved = await getPageContent(pageId);
        if(saved){
          const parsed = JSON.parse(saved);
          setElements(parsed);
          setHistory([JSON.stringify(parsed)]);
        } else {
          setElements([
            {id: uid(), type:'text', x:20,y:20,w:420,h:120, html:'<h2>Bienvenido al PAE</h2><p>Contenido público editable.</p>'}
          ]);
          setHistory([JSON.stringify([{id: uid(), type:'text', x:20,y:20,w:420,h:120, html:'<h2>Bienvenido al PAE</h2><p>Contenido público editable.</p>'}])]);
        }
      }catch(err){
        console.error('load content error', err);
      }
    }
    load();
  },[pageId, initialContent]);

  useEffect(()=>{ setHistory(h=>{ const cur = JSON.stringify(elements); if(h[h.length-1]===cur) return h; return [...h, cur].slice(-60); }); setFuture([]); },[elements]);

  function addElement(type){
    const id = uid();
    const el = { id, type, x:40, y:40, w:240, h:80, html: type==='text' ? '<p>Nuevo texto</p>' : (type==='button' ? 'Click' : ''), src: type==='image' ? '/example.png' : (type==='video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : '') };
    setElements(e=>[...e, el]);
    setSelected(id);
  }

  function startDrag(e, id, mode){
    e.stopPropagation();
    const p = pointer.current;
    p.mode = mode; p.id = id; p.startX = e.clientX; p.startY = e.clientY;
    const el = elements.find(x=>x.id===id); p.orig = {...el};
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
  }
  function onMove(e){
    const p = pointer.current;
    if(!p.mode) return;
    const dx = e.clientX - p.startX; const dy = e.clientY - p.startY;
    setElements(prev=> prev.map(it=>{ if(it.id !== p.id) return it; if(p.mode==='move') return {...it, x: p.orig.x + dx, y: p.orig.y + dy}; if(p.mode==='resize') return {...it, w: Math.max(40, p.orig.w + dx), h: Math.max(24, p.orig.h + dy)}; return it; }));
  }
  function onUp(){ pointer.current.mode = null; pointer.current.id = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }

  function updateHtml(id, html){ setElements(prev=> prev.map(it=> it.id===id ? {...it, html} : it)); }

  function undo(){ setHistory(h=>{ if(h.length<2) return h; const last = h[h.length-1]; const prev = h[h.length-2]; setElements(JSON.parse(prev)); setFuture(f=>[last,...f]); return h.slice(0,-1); }); }
  function redo(){ setFuture(f=>{ if(f.length===0) return f; const next = f[0]; setElements(JSON.parse(next)); setHistory(h=>[...h, next]); return f.slice(1); }); }
  function clearAll(){ setElements([]); setSelected(null); }
  async function save(){ try{ await savePageContent(pageId, JSON.stringify(elements)); alert('Guardado correctamente.'); }catch(err){ alert('Error guardando: ' + err.message); } }

  useEffect(()=>{ function handler(e){ const { action } = e.detail || {}; if(action==='undo') undo(); if(action==='redo') redo(); if(action==='save') save(); if(action==='clear') clearAll(); if(action==='bold'){ if(selected){ updateHtml(selected, '<b>' + (elements.find(x=>x.id===selected)?.html || '') + '</b>'); } } } window.addEventListener('editor-action', handler); window.addEventListener('add-element', (ev)=> addElement(ev.detail)); return ()=> window.removeEventListener('editor-action', handler); },[selected, elements]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontWeight:800}}>Editor</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn secondary" onClick={undo}>Deshacer</button>
          <button className="btn secondary" onClick={redo}>Rehacer</button>
          <button className="btn" onClick={save}>Guardar</button>
        </div>
      </div>
      <div className="canvas" style={{marginTop:12, position:'relative', flex:1}} onPointerDown={()=>setSelected(null)}>
        {elements.map(el=>{
          const sel = selected===el.id;
          return (
            <div key={el.id} className={'editorElement' + (sel ? ' selected' : '')} style={{left:el.x, top:el.y, width:el.w, height:el.h}} onPointerDown={(e)=>{ e.stopPropagation(); setSelected(el.id); startDrag(e, el.id, 'move'); }}>
              <div className="content" style={{width:'100%',height:'100%'}}>
                {el.type==='text' && <div contentEditable={editable && sel} suppressContentEditableWarning={true} onInput={(ev)=> updateHtml(el.id, ev.currentTarget.innerHTML)} dangerouslySetInnerHTML={{__html: el.html}} />}
                {el.type==='button' && <button style={{width:'100%',height:'100%'}} dangerouslySetInnerHTML={{__html: el.html}} />}
                {el.type==='image' && <img src={el.src} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                {el.type==='video' && <iframe src={el.src} style={{width:'100%',height:'100%'}} frameBorder="0" allowFullScreen />}
                {editable && <div className="handle" onPointerDown={(e)=>{ e.stopPropagation(); startDrag(e, el.id, 'resize'); }} />}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:10,display:'flex',gap:8}}>
        <button className="btn secondary small" onClick={()=>{ navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(elements)); alert('JSON copiado') }}>Copiar JSON</button>
      </div>
    </div>
  );
}
