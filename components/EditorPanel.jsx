import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';

export default function EditorPanel({ page, refresh }) {
  const [elements, setElements] = useState(page?.elements || []);
  const [type, setType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  useEffect(()=> setElements(page?.elements || []), [page]);

  async function addElement() {
    const newEl = { id: uuidv4(), type, x: 10, y: 10 };
    if(type === 'text') newEl.content = text;
    if(type === 'image' && file){
      const fileExt = file.name.split('.').pop();
      const filePath = `public/${Date.now()}_${uuidv4()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('public').upload(filePath, file);
      if(error) return alert('Error al subir: '+error.message);
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
      newEl.src = url; newEl.alt = file.name;
    }
    if(type === 'video') newEl.src = text;
    await supabase.from('elements').insert({ id: newEl.id, page_slug: page.slug, type: newEl.type, content: newEl.content||null, src: newEl.src||null, x: newEl.x, y: newEl.y });
    setText(''); setFile(null);
    if(refresh) await refresh();
  }

  async function updatePosition(elId, x, y) {
    await supabase.from('elements').update({x,y}).eq('id', elId);
    if(refresh) await refresh();
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5>Panel de edición</h5>
        <select className="form-select mb-2" value={type} onChange={e=>setType(e.target.value)}>
          <option value="text">Texto</option>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
        </select>
        {type === 'text' && <textarea className="form-control mb-2" value={text} onChange={e=>setText(e.target.value)} />}
        {type === 'image' && <input type="file" className="form-control mb-2" onChange={e=>setFile(e.target.files[0])} />}
        {type === 'video' && <input className="form-control mb-2" placeholder="URL embed" value={text} onChange={e=>setText(e.target.value)} />}
        <button className="btn btn-success" onClick={addElement}>Agregar</button>
        <hr/>
        <div style={{minHeight:200, border:'1px dashed #ccc', padding:10}}>
          {elements.map(el=>(
            <Draggable key={el.id} defaultPosition={{x: el.x||0, y: el.y||0}} onStop={(e,d)=> updatePosition(el.id,d.x,d.y)}>
              <div style={{padding:6, border:'1px solid #ddd', background:'#fff'}}>
                {el.type==='text' && <div dangerouslySetInnerHTML={{__html:el.content}} />}
                {el.type==='image' && <img src={el.src} style={{maxWidth:200}} />}
                {el.type==='video' && <div>{el.src}</div>}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
}
