import Header from '../components/Header';
import EditorCanvas from '../components/EditorCanvas';
import { useState } from 'react';
export default function Home() {
  const [editable, setEditable] = useState(false);
  const defaultHtml = `<div class="hero"><h1>Sistema de Gestión de Residuos Sólidos</h1><p>Plataforma para monitorear indicadores y generar reportes.</p></div>`;
  return (
    <main>
      <Header onToggleEdit={()=>setEditable(e=>!e)} />
      <div className="container">
        <EditorCanvas initialHtml={defaultHtml} editable={editable} onSave={(html)=>{ alert('Aquí guardaría en Supabase (implementa lib/supabaseClient).\nContenido length: '+html.length); }} />
      </div>
    </main>
  );
}
