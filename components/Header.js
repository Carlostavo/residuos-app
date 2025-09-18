
import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

export default function Header({ editable, setEditable }) {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleSignOut(){
    try{ await signOut(); }
    catch(err){ console.error(err); alert('Error cerrando sesión'); }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-max flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black text-emerald-700">PAE</div>
          <nav className="hidden md:flex gap-4 text-slate-600">
            <Link href="/"><a className="hover:text-slate-900">Inicio</a></Link>
            <Link href="/indicadores"><a className="hover:text-slate-900">Indicadores</a></Link>
            <Link href="/metas"><a className="hover:text-slate-900">Metas</a></Link>
            <Link href="/avances"><a className="hover:text-slate-900">Avances</a></Link>
            <Link href="/reportes"><a className="hover:text-slate-900">Reportes</a></Link>
            <Link href="/formularios"><a className="hover:text-slate-900">Formularios</a></Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {(role==='admin' || role==='tecnico') && <button className="px-3 py-1 rounded-md bg-sky-500 text-white font-semibold" onClick={()=>{ setEditable(v=>!v); localStorage.setItem('pae_edit_mode', (!editable).toString()); }}>{editable ? 'Salir edición' : 'Editar'}</button>}
              <div className="font-semibold text-slate-700">{user.email}</div>
              <button className="px-3 py-1 border rounded-md" onClick={handleSignOut}>Cerrar sesión</button>
            </>
          ) : (
            <button className="px-3 py-1 bg-sky-500 text-white rounded-md" onClick={()=>setOpen(true)}>Iniciar sesión</button>
          )}
        </div>
      </div>
      <LoginModal open={open} onClose={()=>setOpen(false)} />
    </header>
);
}
