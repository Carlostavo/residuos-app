
import Header from '../components/Header';
import FloatingToolbar from '../components/FloatingToolbar';
import EditOverlay from '../components/EditOverlay';

export default function Page({ editable, setEditable }) {
  return (
    <div>
      <Header editable={editable} setEditable={setEditable} />
      <main className="container-max py-6">
        <section className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-2xl font-bold">Metas</h2>
          <p className="mt-2 text-slate-700">Define metas y su progreso.</p>
        </section>
      </main>
      <FloatingToolbar visible={editable} onAdd={(t)=> window.dispatchEvent(new CustomEvent('add-element',{detail:t}))} onStyle={(s)=> window.dispatchEvent(new CustomEvent('editor-style',{detail:s}))} />
      <EditOverlay pageId="metas" open={(typeof window !== 'undefined' && localStorage.getItem('pae_edit_mode')==='true')} onClose={()=>{ localStorage.setItem('pae_edit_mode','false'); setEditable(false); }} />
    </div>
  );
}
