
import { useEffect, useState } from 'react';
import { getPageContent, savePageContent } from '../lib/supabaseClient';
const uid = ()=> Math.random().toString(36).slice(2,9);

const PRESET_CLASSES = [
  'text-xl font-semibold',
  'text-2xl font-bold',
  'prose',
  'rounded-lg shadow-md p-4',
  'border border-slate-200 p-3 rounded'
];
const ANIMATIONS = ['', 'animate-fadeInUp', 'animate-pop'];

export default function EditOverlay({ pageId, open, onClose }) {
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(!open) return;
    async function load(){
      const saved = await getPageContent(pageId);
      if(saved){ try{ setElements(JSON.parse(saved)); }catch(e){ setElements([]); } }
      else setElements([]);
    }
    load();
  },[pageId, open]);

  function add(type){
    const id = uid();
    const el = { id, type, html: type==='text' ? '<p>Nuevo texto</p>' : '', src:'', classes:'', animation:'' };
    setElements(e=>[...e, el]);
    setSelected(id);
  }
  function update(id, patch){ setElements(prev=> prev.map(it=> it.id===id ? {...it, ...patch} : it)); }
  function remove(id){ setElements(prev=> prev.filter(it=> it.id!==id)); }

  async function save(){
    setLoading(true);
    try{ await savePageContent(pageId, JSON.stringify(elements)); alert('Guardado'); }
    catch(err){ alert('Error: ' + err.message); }
    setLoading(false);
  }

  if(!open) return null;

  return (
    <div className="editor-overlay">
      <div className="editor-panel">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Editor — {pageId}</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={onClose}>Salir</button>
            <button className="px-3 py-1 bg-sky-500 text-white rounded" onClick={save} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="relative border rounded p-4 min-h-[400px]">
              {elements.map(el=> (
                <div key={el.id} className={"mb-4 " + (el.classes||'')} onClick={()=> setSelected(el.id)}>
                  {el.type==='text' && <div contentEditable={selected===el.id} suppressContentEditableWarning onInput={(e)=> update(el.id,{ html: e.currentTarget.innerHTML })} dangerouslySetInnerHTML={{__html: el.html}} className={el.animation||''} />}
                  {el.type==='image' && <img src={el.src || '/logo.png'} alt="" className="max-w-full rounded" />}
                  {el.type==='video' && <iframe src={el.src} className="w-full aspect-video" frameBorder="0" allowFullScreen />}
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs text-red-600" onClick={()=> remove(el.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="font-semibold">Insertar</h4>
              <div className="flex flex-col gap-2 mt-2">
                <button className="px-2 py-1 border rounded" onClick={()=> add('text')}>+ Texto</button>
                <button className="px-2 py-1 border rounded" onClick={()=> add('image')}>+ Imagen</button>
                <button className="px-2 py-1 border rounded" onClick={()=> add('video')}>+ Video</button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Clases predefinidas</h4>
              <div className="flex flex-col gap-2 mt-2">
                {PRESET_CLASSES.map(pc=> <button key={pc} className="px-2 py-1 border rounded text-sm text-left" onClick={()=> { if(!selected) return alert('Selecciona un elemento'); update(selected, { classes: pc }); }}>{pc}</button>)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Animaciones</h4>
              <div className="flex flex-col gap-2 mt-2">
                {ANIMATIONS.map(a=> <button key={a||'none'} className="px-2 py-1 border rounded text-sm text-left" onClick={()=> { if(!selected) return alert('Selecciona un elemento'); update(selected, { animation: a }); }}>{a || 'Ninguna'}</button>)}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Propiedades</h4>
              {selected ? (()=>{ const el = elements.find(x=>x.id===selected); if(!el) return <div>No seleccionado</div>;
                return (<div className="mt-2 space-y-2">
                  <label className="text-sm">URL (imagen/video)</label>
                  <input className="border px-2 py-1 w-full" value={el.src} onChange={(e)=> update(el.id, { src: e.target.value })} />
                  <label className="text-sm">Clases personalizadas</label>
                  <input className="border px-2 py-1 w-full" value={el.classes||''} onChange={(e)=> update(el.id, { classes: e.target.value })} />
                </div>);
              })() : <div className="text-sm text-slate-500">Selecciona un elemento para editar sus propiedades</div>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
