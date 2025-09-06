import EditorPanel from '../components/EditorPanel';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function EditorRoute(){
  const [session, setSession] = useState(null);
  const [page, setPage] = useState(null);

  useEffect(()=>{
    async function init(){
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
      const r = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
      if(r.error){
        await supabase.from('pages').upsert({slug:'home', title:'Página principal'});
        const rr = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single();
        setPage(rr.data);
      } else setPage(r.data);
    }
    init();
  }, []);

  return (
    <div>
      <Navbar session={session} onToggleEdit={()=>{}} />
      <main className="container mt-4">
        <h2>Editor (ruta dedicada)</h2>
        {page && <EditorPanel page={page} refresh={async ()=>{ const r = await supabase.from('pages').select('*, elements(*)').eq('slug','home').single(); setPage(r.data); }} />}
      </main>
    </div>
  );
}
