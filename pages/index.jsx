import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import EditorPanel from '../components/EditorPanel';
import EditableElement from '../components/EditableElement';

export default function Home() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(()=>{
    async function init(){
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
      fetchPage();
    }
    init();
  }, []);

  async function fetchPage(){
    const { data, error } = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
    if(error){
      await supabase.from('pages').upsert({slug:'home', title:'Inicio'});
      const r = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
      setPage(r.data);
    } else setPage(data);
  }

  return (
    <div>
      <Navbar session={session} setSession={setSession} onToggleEdit={()=>setEditing(v=>!v)} />
      <main className="container mt-4">
        <h1>Bienvenido, estás en la pantalla de Inicio</h1>
        <div id="canvas" style={{position:'relative', minHeight:400, border:'1px solid #ddd', padding:20}}>
          {page?.elements?.map(el=>(
            <div key={el.id} style={{position:'absolute', left:el.x||0, top:el.y||0}}>
              <EditableElement el={el} editing={editing} />
            </div>
          ))}
        </div>
        {editing && <EditorPanel page={page} refresh={fetchPage} />}
      </main>
    </div>
  );
}
