import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import EditorPanel from '../components/EditorPanel';
import Navbar from '../components/Navbar';
import EditableElement from '../components/EditableElement';

export default function Home(){
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
    const sub = supabase.auth.onAuthStateChange((_ev, sess) => setSession(sess?.session || null));
    return () => sub.data?.subscription?.unsubscribe?.();
  }, []);

  async function fetchPage(){
    const { data, error } = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
    if(error){
      // Si no existe, crear una página base
      await supabase.from('pages').upsert({slug:'home', title:'Página principal'});
      const r = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
      setPage(r.data);
    } else {
      setPage(data);
    }
  }

  function onToggleEdit(){
    setEditing(v=>!v);
  }

  return (
    <div>
      <Navbar session={session} onToggleEdit={onToggleEdit} />
      <main className="container mt-4">
        <h1>{page?.title || 'Página pública'}</h1>
        <div id="canvas" style={{position:'relative', minHeight:400, border:'1px solid #ddd', padding:20}}>
          {page?.elements?.map(el => (
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
