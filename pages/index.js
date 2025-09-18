
import Header from '../components/Header';
import FloatingToolbar from '../components/FloatingToolbar';
import EditOverlay from '../components/EditOverlay';
import { useState } from 'react';

export default function Home({ editable, setEditable }) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div>
      <Header editable={editable} setEditable={setEditable} />
      <main className="container-max py-6">
        <section className="hero-card">
          <h1 className="text-3xl font-extrabold">Sistema de Gestión de Residuos Sólidos</h1>
          <p className="mt-2 text-slate-700">Plataforma para monitorear indicadores y gestionar metas y reportes.</p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <a href="/indicadores" className="card"> <h3>Indicadores</h3><p>Visualiza KPIs clave.</p></a>
              <a href="/metas" className="card"> <h3>Metas</h3><p>Define y sigue metas.</p></a>
              <a href="/avances" className="card"> <h3>Avances</h3><p>Seguimiento de proyectos.</p></a>
              <a href="/reportes" className="card"> <h3>Reportes</h3><p>Genera reportes descargables.</p></a>
              <a href="/formularios" className="card"> <h3>Formularios</h3><p>Accede a formularios disponibles.</p></a>
            </div>
          </div>
          <aside className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold">Acciones</h3>
            <div className="mt-3">
              <button className="px-3 py-1 border rounded" onClick={()=>{ setEditable(true); localStorage.setItem('pae_edit_mode','true'); setOpenEdit(true); }}>Abrir editor</button>
            </div>
          </aside>
        </div>
      </main>

      <FloatingToolbar visible={editable} onAdd={(t)=> window.dispatchEvent(new CustomEvent('add-element',{detail:t}))} onStyle={(s)=> window.dispatchEvent(new CustomEvent('editor-style',{detail:s}))} />
      <EditOverlay pageId="index" open={openEdit || (typeof window !== 'undefined' and localStorage.getItem('pae_edit_mode')==='true')} onClose={()=>{ setEditable(false); localStorage.setItem('pae_edit_mode','false'); setOpenEdit(false); }} />
    </div>
  );
}
